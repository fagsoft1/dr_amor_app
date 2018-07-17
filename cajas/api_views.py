from django.db.models import OuterRef, ExpressionWrapper, Subquery, Sum, F, DecimalField, Case, When, Value
from django.db.models.functions import Coalesce
from rest_framework import viewsets, permissions

from .api_serializers import BilleteMonedaSerializer, ArqueoCajaSerializer
from .models import (
    BilleteMoneda,
    ArqueoCaja,
    EfectivoEntregaDenominacion,
    BaseDisponibleDenominacion,
    MovimientoDineroPDV
)


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
                    When(tipo='I', then=Coalesce(F('valor_tarjeta'), 0)),
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
