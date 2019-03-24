from django.db import models
from django.db.models import Q, ExpressionWrapper, Sum, DecimalField


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


# region MovimientoInventarioDetalle Managers

# endregion
