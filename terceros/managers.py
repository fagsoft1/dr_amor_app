from django.db import models
from django.db.models import Q, Sum, OuterRef, Subquery, DecimalField, ExpressionWrapper, F
from django.db.models.functions import Coalesce


class TerceroQuerySet(models.QuerySet):
    def presentes(self):
        return self.filter(presente=True)

    def ausentes(self):
        return self.filter(presente=False)

    def activos(self):
        return self.filter(usuario__is_active=True)


class AcompanantesManager(models.Manager):
    def get_queryset(self):
        return TerceroQuerySet(self.model, using=self._db).select_related('usuario', 'categoria_modelo').filter(
            es_acompanante=True
        )

    def presentes(self):
        return self.get_queryset().presentes()

    def ausentes(self):
        return self.get_queryset().ausentes()


class InternosManager(models.Manager):
    def get_queryset(self):
        return TerceroQuerySet(self.model, using=self._db).select_related('usuario', 'categoria_modelo').filter(
            Q(es_acompanante=True) |
            Q(es_colaborador=True)
        )

    def presentes(self):
        return self.get_queryset().presentes()

    def ausentes(self):
        return self.get_queryset().ausentes()


class ColaboradoresManager(models.Manager):
    def get_queryset(self):
        return TerceroQuerySet(self.model, using=self._db).select_related(
            'usuario'
        ).filter(es_colaborador=True)

    def presentes(self):
        return self.get_queryset().presentes()

    def ausentes(self):
        return self.get_queryset().ausentes()


class ProveedoresManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(es_proveedor=True)


class CuentaQuerySet(models.QuerySet):
    def liquidada(self):
        return self.filter(liquidada=True)

    def sin_liquidar(self):
        return self.filter(liquidada=False)


class CuentaMeseroManager(models.Manager):
    def get_queryset(self):
        return CuentaQuerySet(self.model, using=self._db).filter(
            tipo=2,
            propietario__tercero__es_colaborador=True
        ).annotate(
            valor_ventas_productos=Sum('compras_productos__productos__precio_total')
        )

    def liquidada(self):
        return self.get_queryset().liquidada()

    def sin_liquidar(self):
        return self.get_queryset().sin_liquidar()


class CuentaAcompananteManager(models.Manager):
    def get_queryset(self):
        from servicios.models import Servicio
        from cajas.models import OperacionCaja

        ingresos_por_operaciones_caja = OperacionCaja.objects.values('cuenta__id').filter(
            valor__gt=0,
            cuenta__id=OuterRef('id')
        ).annotate(
            valor=Coalesce(
                Sum('valor'), 0
            )
        )

        egresos_por_operaciones_caja = OperacionCaja.objects.values('cuenta__id').filter(
            valor__lt=0,
            cuenta__id=OuterRef('id')
        ).annotate(
            valor=Coalesce(
                Sum('valor') * -1, 0
            )
        )

        servicios = Servicio.objects.values('cuenta__id').filter(
            cuenta__id=OuterRef('id'),
            estado=2
        ).annotate(
            valor_servicios=Coalesce(Sum('valor_servicio'), 0),
            valor_comisiones=Coalesce(Sum('comision'), 0),
        )

        return CuentaQuerySet(self.model, using=self._db).filter(
            tipo=1,
            propietario__tercero__es_acompanante=True
        ).annotate(
            ingreso_por_servicios=Coalesce(
                ExpressionWrapper(
                    Subquery(servicios.values('valor_servicios')),
                    output_field=DecimalField(max_digits=2)
                ),
                0
            ),
            ingreso_por_comisiones_habitacion=Coalesce(
                ExpressionWrapper(
                    Subquery(servicios.values('valor_comisiones')),
                    output_field=DecimalField(max_digits=2)
                ),
                0
            ),
            ingresos_por_operaciones_caja=Coalesce(
                ExpressionWrapper(
                    Subquery(ingresos_por_operaciones_caja.values('valor')),
                    output_field=DecimalField(max_digits=2)
                ),
                0
            ),
            egreso_por_compras_productos=Coalesce(
                Sum('compras_productos__productos__precio_total'),
                0
            ),
            egresos_por_operaciones_caja=Coalesce(
                ExpressionWrapper(
                    Subquery(egresos_por_operaciones_caja.values('valor')),
                    output_field=DecimalField(max_digits=2)
                ),
                0
            )
        ).annotate(
            total_egresos=F('egreso_por_compras_productos') + F('egresos_por_operaciones_caja'),
            total_ingresos=F('ingreso_por_servicios') + F('ingreso_por_comisiones_habitacion') + F(
                'ingresos_por_operaciones_caja')
        )

    def liquidada(self):
        return self.get_queryset().liquidada()

    def sin_liquidar(self):
        return self.get_queryset().sin_liquidar()


class CuentaColaboradorManager(models.Manager):
    def get_queryset(self):
        from cajas.models import OperacionCaja

        ingresos_por_operaciones_caja = OperacionCaja.objects.values('cuenta__id').filter(
            valor__gt=0,
            cuenta__id=OuterRef('id')
        ).annotate(
            valor=Coalesce(
                Sum('valor'), 0
            )
        )

        egresos_por_operaciones_caja = OperacionCaja.objects.values('cuenta__id').filter(
            valor__lt=0,
            cuenta__id=OuterRef('id')
        ).annotate(
            valor=Coalesce(
                Sum('valor') * -1, 0
            )
        )

        return CuentaQuerySet(self.model, using=self._db).filter(
            tipo=1,
            propietario__tercero__es_colaborador=True
        ).annotate(
            ingresos_por_operaciones_caja=Coalesce(
                ExpressionWrapper(
                    Subquery(ingresos_por_operaciones_caja.values('valor')),
                    output_field=DecimalField(max_digits=2)
                ),
                0
            ),
            egreso_por_compras_productos=Coalesce(
                Sum('compras_productos__productos__precio_total'),
                0
            ),
            egresos_por_operaciones_caja=Coalesce(
                ExpressionWrapper(
                    Subquery(egresos_por_operaciones_caja.values('valor')),
                    output_field=DecimalField(max_digits=2)
                ),
                0
            )
        ).annotate(
            total_egresos=F('egreso_por_compras_productos') + F('egresos_por_operaciones_caja'),
            total_ingresos=F('ingresos_por_operaciones_caja')
        )

    def liquidada(self):
        return self.get_queryset().liquidada()

    def sin_liquidar(self):
        return self.get_queryset().sin_liquidar()