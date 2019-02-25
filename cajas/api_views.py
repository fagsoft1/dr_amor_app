from io import BytesIO

from django.core.mail import EmailMultiAlternatives
from django.db.models import OuterRef, ExpressionWrapper, Subquery, Sum, F, DecimalField, Case, When, Value
from django.db.models.functions import Coalesce
from django.http import HttpResponse
from django.template.loader import get_template, render_to_string
from rest_framework import viewsets, permissions, serializers
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response
from weasyprint import CSS, HTML

from dr_amor_app import settings
from .api_serializers import (
    BilleteMonedaSerializer,
    ArqueoCajaSerializer,
    ConceptoOperacionCajaSerializer,
    OperacionCajaSerializer
)
from .models import (
    BilleteMoneda,
    OperacionCaja,
    ConceptoOperacionCaja,
    ArqueoCaja,
    EfectivoEntregaDenominacion,
    BaseDisponibleDenominacion,
    MovimientoDineroPDV,
)


class OperacionCajaViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = OperacionCaja.objects.all()
    serializer_class = OperacionCajaSerializer

    def perform_create(self, serializer):
        operacion = serializer.save()
        tipo_dos_movimiento = 'OPE_CAJ_ING'
        if operacion.tercero and (operacion.tercero.es_acompanante or operacion.tercero.es_colaborador):
            operacion.cuenta = operacion.tercero.cuenta_abierta
            if operacion.concepto.tipo == 'E':
                operacion.valor *= -1
                tipo_dos_movimiento = 'OPE_CAJ_EGR'
            operacion.save()
        movimiento = MovimientoDineroPDV.objects.create(
            tipo=operacion.concepto.tipo,
            tipo_dos=tipo_dos_movimiento,
            punto_venta_id=operacion.punto_venta_id,
            concepto=operacion.descripcion,
            creado_por=self.request.user,
            valor_tarjeta=0,
            valor_efectivo=operacion.valor,
            nro_autorizacion=None,
            franquicia=None
        )
        operacion.movimiento_dinero = movimiento
        operacion.save()

    @list_route(methods=['get'])
    def consultar_por_tercero_cuenta_abierta(self, request):
        tercero_id = request.GET.get('tercero_id', None)
        qs = self.queryset.filter(
            cuenta__propietario__tercero=tercero_id,
            cuenta__liquidada=False,
            cuenta__tipo=1
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class ConceptoOperacionCajaViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = ConceptoOperacionCaja.objects.all()
    serializer_class = ConceptoOperacionCajaSerializer


class BilleteMonedaViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = BilleteMoneda.objects.all()
    serializer_class = BilleteMonedaSerializer


class ArqueoCajaViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = ArqueoCaja.objects.select_related(
        'usuario',
        'usuario__tercero',
        'punto_venta'
    ).all()
    serializer_class = ArqueoCajaSerializer

    def get_queryset(self):
        mo_dinero = MovimientoDineroPDV.objects.values(
            'arqueo_caja_id'
        ).annotate(
            mo_nro_pagos_tarjetas=Sum(
                Case(
                    When(
                        valor_tarjeta__gt=0,
                        then=Value(1)
                    ),
                    default=Value(0),
                    output_field=DecimalField(max_digits=10, decimal_places=2)
                )
            ),
            total_ingreso_efectivo=Sum(
                Case(
                    When(tipo='I', then=Coalesce(F('valor_efectivo'), 0)),
                    default=Value(0),
                    output_field=DecimalField(max_digits=10, decimal_places=2)
                )
            ),
            total_egreso_efectivo=Coalesce(
                Sum(
                    Case(
                        When(tipo='E', then=Coalesce(F('valor_efectivo'), 0)),
                        default=Value(0),
                        output_field=DecimalField(max_digits=10, decimal_places=2)
                    )
                ), 0
            ),
            total_ingreso_tarjeta=Sum(
                Case(
                    When(
                        tipo='I',
                        then=Coalesce(F('valor_tarjeta'), 0)),
                    default=Value(0),
                    output_field=DecimalField(max_digits=10, decimal_places=2)
                )
            ),
            total=Sum(Coalesce(F('valor_tarjeta'), 0) + Coalesce(F('valor_efectivo'), 0)),
        ).filter(
            arqueo_caja_id=OuterRef('id')
        )

        efectivo = EfectivoEntregaDenominacion.objects.values(
            'arqueo_caja_id'
        ).annotate(
            total=ExpressionWrapper(
                Sum(F('valor') * F('cantidad')),
                output_field=DecimalField(max_digits=10, decimal_places=2)
            )
        ).filter(
            arqueo_caja_id=OuterRef('id')
        )
        base = BaseDisponibleDenominacion.objects.values(
            'arqueo_caja_id'
        ).annotate(
            total=ExpressionWrapper(
                Sum(F('valor') * F('cantidad')),
                output_field=DecimalField(max_digits=10, decimal_places=2)
            )
        ).filter(
            arqueo_caja_id=OuterRef('id')
        )

        qs = self.queryset.annotate(
            valor_entrega_dolares=ExpressionWrapper(
                Sum(F('dolares') * F('dolares_tasa')),
                output_field=DecimalField(max_digits=10, decimal_places=2)
            ),
            valor_entrega_efectivo=Subquery(efectivo.values('total')),
            valor_entrega_base_dia_siguiente=Subquery(base.values('total')),
            valor_entrega_total=ExpressionWrapper(
                (
                        Subquery(efectivo.values('total')) +
                        Subquery(base.values('total')) +
                        Sum(Coalesce(F('dolares') * F('dolares_tasa'), 0)) +
                        Sum(Coalesce('valor_tarjeta', 0))
                ),
                output_field=DecimalField(max_digits=10, decimal_places=2)
            ),

            valor_mo_egresos_efectivo=Subquery(mo_dinero.values('total_egreso_efectivo')),
            valor_mo_ingreso_efectivo=Subquery(mo_dinero.values('total_ingreso_efectivo')),
            valor_mo_ingreso_tarjeta=Subquery(mo_dinero.values('total_ingreso_tarjeta')),
            valor_mo_total=Subquery(mo_dinero.values('total')),
            mo_nro_pagos_tarjetas=Subquery(mo_dinero.values('mo_nro_pagos_tarjetas')),
            cuadre=ExpressionWrapper(
                (
                        Subquery(efectivo.values('total')) +
                        Subquery(base.values('total')) +
                        Sum(Coalesce(F('dolares') * F('dolares_tasa'), 0)) +
                        Sum(Coalesce('valor_tarjeta', 0)) -
                        Subquery(mo_dinero.values('total'))
                ),
                output_field=DecimalField(max_digits=10, decimal_places=2)
            ),

        ).all()
        return qs

    @detail_route(methods=['post'])
    def imprimir_entrega(self, request, pk=None):
        arqueo = self.get_object()

        entrega = EfectivoEntregaDenominacion.objects.filter(
            arqueo_caja=arqueo,
            cantidad__gt=0
        ).annotate(
            total=ExpressionWrapper(
                F('valor') * F('cantidad'),
                output_field=DecimalField(max_digits=10, decimal_places=2)
            )
        )

        base = BaseDisponibleDenominacion.objects.filter(
            arqueo_caja=arqueo,
            cantidad__gt=0
        ).annotate(
            total=ExpressionWrapper(
                F('valor') * F('cantidad'),
                output_field=DecimalField(max_digits=10, decimal_places=2)
            )
        )

        context = {
            'entrega': entrega.all(),
            'base': base.all(),
            'arqueo': arqueo
        }

        html_get_template = get_template('reportes/cajas/entrega_cierre_pdf.html').render(context)
        html = HTML(
            string=html_get_template,
            base_url=request.build_absolute_uri()
        )

        width = '80mm'
        height = '30cm'
        size = 'size: %s %s' % (width, height)
        margin = 'margin: 0.8cm 0.8cm 0.8cm 0.8cm'

        css_string = '@page {text-align: justify; font-family: Arial;font-size: 0.6rem;%s;%s}' % (size, margin)
        main_doc = html.render(stylesheets=[CSS(string=css_string)])

        output = BytesIO()
        main_doc.write_pdf(
            target=output
        )
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="somefilename.pdf"'
        response['Content-Transfer-Encoding'] = 'binary'
        response.write(output.getvalue())
        output.close()
        return response

    def generar_pdf_arqueo(self, request):
        arqueo = self.get_queryset().get(id=self.get_object().id)
        context = {
            'arqueo': arqueo
        }
        html_get_template = get_template('reportes/cajas/arqueo_pdf.html').render(context)
        html = HTML(
            string=html_get_template,
            base_url=request.build_absolute_uri()
        )
        main_doc = html.render(stylesheets=[CSS('static/css/reportes_carta.css')])
        return main_doc

    @detail_route(methods=['post'])
    def imprimir_arqueo(self, request, pk=None):
        output = BytesIO()
        main_doc = self.generar_pdf_arqueo(request)
        main_doc.write_pdf(
            target=output
        )
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="somefilename.pdf"'
        response['Content-Transfer-Encoding'] = 'binary'
        response.write(output.getvalue())
        output.close()
        return response

    @detail_route(methods=['post'])
    def enviar_arqueo_email(self, request, pk=None):
        arqueo = self.get_object()
        main_doc = self.generar_pdf_arqueo(request)
        text_content = render_to_string('email/cajas/arqueo_caja_envio_correo.html', {})
        output = BytesIO()
        main_doc.write_pdf(
            target=output
        )

        msg = EmailMultiAlternatives(
            'Arqueo de Caja de %s' % arqueo.usuario.username,
            text_content,
            bcc=['fabiogarciasanchez+dramor@gmail.com'],
            from_email='Clínica Dr. Amor <%s>' % 'webmaster@clinicadramor.com',
            to=['fabiogarciasanchez+dramor@gmail.com']
        )
        msg.attach_alternative(text_content, "text/html")
        msg.attach('Arqueo de caja %s' % arqueo.usuario.username, output.getvalue(), 'application/pdf')
        try:
            msg.send()
        except Exception as e:
            raise serializers.ValidationError(
                'Se há presentado un error al intentar enviar el correo, envío fallido: %s' % e)
        return Response({'resultado': 'ok'})
