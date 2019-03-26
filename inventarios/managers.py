from django.db import models
from django.db.models import Q, ExpressionWrapper, Sum, DecimalField, Subquery, OuterRef


# region MovimientoInventario Managers
class MovimientoInventarioQuerySet(models.QuerySet):
    def cargados(self):
        return self.filter(cargado=True)

    def sin_cargar(self):
        return self.filter(cargado=False)


class MovimientoInventarioManager(models.Manager):
    def get_queryset(self):
        return MovimientoInventarioQuerySet(self.model, using=self._db).select_related(
            'proveedor',
            'bodega'
        ).prefetch_related(
            'documentos'
        ).annotate(
            entra_costo=ExpressionWrapper(
                Sum('detalles__entra_costo'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            entra_cantidad=ExpressionWrapper(
                Sum('detalles__entra_cantidad'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            sale_cantidad=ExpressionWrapper(
                Sum('detalles__sale_cantidad'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            sale_costo=ExpressionWrapper(
                Sum('detalles__sale_costo'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
        ).all()


class MovimientoInventarioComprasManager(MovimientoInventarioManager):

    def get_queryset(self):
        return super().get_queryset().filter(motivo='compra')

    def cargados(self):
        return self.get_queryset().cargados()

    def sin_cargar(self):
        return self.get_queryset().sin_cargar()


class MovimientoInventarioSaldosInicialesManager(MovimientoInventarioManager):
    def get_queryset(self):
        return super().get_queryset().filter(motivo='saldo_inicial')

    def cargados(self):
        return self.get_queryset().cargados()

    def sin_cargar(self):
        return self.get_queryset().sin_cargar()


class MovimientoInventarioAjustesManager(MovimientoInventarioManager):
    def get_queryset(self):
        return super().get_queryset().filter(
            Q(motivo='ajuste_ingreso') |
            Q(motivo='ajuste_salida')
        )

    def cargados(self):
        return self.get_queryset().cargados()

    def sin_cargar(self):
        return self.get_queryset().sin_cargar()


# endregion


# region TrasladoInventarioDetalle Managers
class TrasladoInventarioDetalleManager(models.Manager):
    def get_queryset(self):
        from inventarios.models import MovimientoInventarioDetalle
        producto_bodega_origen = MovimientoInventarioDetalle.objects.filter(
            movimiento__bodega_id=OuterRef('traslado__bodega_origen_id'),
            producto_id=OuterRef('producto_id'),
            es_ultimo_saldo=True,
        )
        producto_bodega_destino = MovimientoInventarioDetalle.objects.filter(
            movimiento__bodega_id=OuterRef('traslado__bodega_destino_id'),
            producto_id=OuterRef('producto_id'),
            es_ultimo_saldo=True,
        )
        return super().get_queryset().select_related(
            'producto',
        ).annotate(
            cantidad_origen=Subquery(producto_bodega_origen.values('saldo_cantidad')),
            cantidad_destino=Subquery(producto_bodega_destino.values('saldo_cantidad')),
        ).all()
# endregion
