from channels.binding.websockets import WebsocketBinding
from rest_framework import serializers

from .models import (
    Bodega,
    MovimientoInventario,
    MovimientoInventarioDetalle,
    MovimientoInventarioDocumento,
    TrasladoInventario,
    TrasladoInventarioDetalle
)


class BodegaSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):  # pragma: no cover
        return instance.nombre

    class Meta:
        model = Bodega
        fields = [
            'url',
            'id',
            'nombre',
            'to_string',
            'es_principal',
        ]


class MovimientoInventarioDetalleSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    movimiento_detalle = serializers.CharField(source='movimiento.detalle', read_only=True)
    movimiento_fecha = serializers.CharField(source='movimiento.fecha', read_only=True)
    movimiento_proveedor_nombre = serializers.CharField(source='movimiento.proveedor.nombre', read_only=True)
    bodega = serializers.IntegerField(source='movimiento.bodega_id', read_only=True)
    producto_categoria_nombre = serializers.CharField(source='producto.categoria_dos.categoria.nombre', read_only=True)
    producto_categoria_dos_nombre = serializers.CharField(source='producto.categoria_dos.nombre', read_only=True)
    producto_precio_venta = serializers.DecimalField(source='producto.precio_venta', read_only=True, decimal_places=2,
                                                     max_digits=12)

    class Meta:
        model = MovimientoInventarioDetalle
        fields = [
            'url',
            'id',
            'modified',
            'movimiento',
            'bodega',
            'movimiento_detalle',
            'movimiento_proveedor_nombre',
            'producto',
            'producto_nombre',
            'producto_precio_venta',
            'movimiento_fecha',
            'costo_unitario',
            'entra_cantidad',
            'entra_costo',
            'sale_cantidad',
            'sale_costo',
            'saldo_cantidad',
            'saldo_costo',
            'es_ultimo_saldo',
            'producto_categoria_nombre',
            'producto_categoria_dos_nombre',
        ]

    def create(self, validated_data):
        movimiento = validated_data.pop('movimiento')
        producto = validated_data.pop('producto')
        instance = None
        if movimiento.tipo == 'E':
            entra_cantidad = validated_data.pop('entra_cantidad')
            entra_costo = validated_data.pop('entra_costo')
            from inventarios.services import movimiento_inventario_detalle_entrada_add_item
            instance = movimiento_inventario_detalle_entrada_add_item(
                movimiento_id=movimiento.id,
                cantidad=entra_cantidad,
                costo_total=entra_costo,
                producto_id=producto.id
            )
        if movimiento.tipo == 'S':
            entra_cantidad = validated_data.pop('sale_cantidad')
            from inventarios.services import movimiento_inventario_detalle_salida_add_item
            instance = movimiento_inventario_detalle_salida_add_item(
                movimiento_id=movimiento.id,
                cantidad=entra_cantidad,
                producto_id=producto.id
            )
        return instance


class MovimientoInventarioDetalleBinding(WebsocketBinding):
    model = MovimientoInventarioDetalle
    stream = "movimientos_inventarios_detalles"
    fields = ["id", ]

    def serialize_data(self, instance):
        serializado = MovimientoInventarioDetalleSerializer(instance, context={'request': None})
        return serializado.data

    @classmethod
    def group_names(cls, *args, **kwargs):
        return ["binding.pos_servicios"]

    def has_permission(self, user, action, pk):
        return True


class MovimientoInventarioDocumentoSerializer(serializers.ModelSerializer):
    imagen_documento_url = serializers.SerializerMethodField()
    imagen_documento_thumbnail_url = serializers.SerializerMethodField()
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):  # pragma: no cover
        return instance.id

    def get_imagen_documento_url(self, obj):  # pragma: no cover
        if obj.imagen_documento:
            return obj.imagen_documento.url
        return None

    def get_imagen_documento_thumbnail_url(self, obj):  # pragma: no cover
        if obj.imagen_documento_thumbnail:
            return obj.imagen_documento_thumbnail.url
        return None

    class Meta:
        model = MovimientoInventarioDocumento
        fields = [
            'id',
            'movimiento',
            'to_string',
            'imagen_documento_url',
            'imagen_documento_thumbnail_url',
        ]


class MovimientoInventarioSerializer(serializers.ModelSerializer):
    creado_por = serializers.HiddenField(default=serializers.CurrentUserDefault())
    proveedor_nombre = serializers.CharField(source='proveedor.nombre', read_only=True)
    bodega_nombre = serializers.CharField(source='bodega.nombre', read_only=True)
    fecha = serializers.DateTimeField(format="%Y-%m-%d", input_formats=['%Y-%m-%d', 'iso-8601'])
    entra_costo = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    entra_cantidad = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    sale_cantidad = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    sale_costo = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    documentos = MovimientoInventarioDocumentoSerializer(many=True, read_only=True)

    class Meta:
        model = MovimientoInventario
        fields = [
            'url',
            'id',
            'fecha',
            'proveedor',
            'proveedor_nombre',
            'creado_por',
            'documentos',
            'bodega',
            'bodega_nombre',
            'detalle',
            'tipo',
            'motivo',
            'cargado',
            'entra_costo',
            'entra_cantidad',
            'sale_costo',
            'sale_cantidad',
            'observacion',
        ]

    def create(self, validated_data):
        motivo = validated_data.pop('motivo', None)
        bodega = validated_data.pop('bodega', None)
        fecha = validated_data.pop('fecha', None)
        usuario = validated_data.pop('creado_por', None)
        proveedor = validated_data.pop('proveedor', None)
        observacion = validated_data.pop('observacion', None)
        if motivo == 'compra':
            from inventarios.services import movimiento_inventario_compra_crear
            instancia = movimiento_inventario_compra_crear(
                proveedor_id=proveedor.id,
                fecha=fecha,
                usuario_id=usuario.id,
                bodega_destino_id=bodega.id,
            )
            return instancia
        if motivo == 'saldo_inicial':
            from inventarios.services import movimiento_inventario_saldo_inicial_crear
            instancia = movimiento_inventario_saldo_inicial_crear(
                fecha=fecha,
                usuario_id=usuario.id,
                bodega_destino_id=bodega.id,
            )
            return instancia
        if motivo == 'entrada_ajuste':
            from inventarios.services import movimiento_inventario_entrada_ajuste_crear
            instancia = movimiento_inventario_entrada_ajuste_crear(
                usuario_id=usuario.id,
                bodega_destino_id=bodega.id,
                detalle=observacion
            )
            return instancia
        if motivo == 'salida_ajuste':
            from inventarios.services import movimiento_inventario_salida_ajuste_crear
            instancia = movimiento_inventario_salida_ajuste_crear(
                usuario_id=usuario.id,
                bodega_origen_id=bodega.id,
                detalle=observacion
            )
            return instancia
        raise serializers.ValidationError({'_error': 'No se ha definido creación para tipo de motivo %s' % motivo})


class TrasladoInventarioSerializer(serializers.ModelSerializer):
    creado_por = serializers.HiddenField(default=serializers.CurrentUserDefault())
    bodega_origen_nombre = serializers.CharField(source='bodega_origen.nombre', read_only=True)
    bodega_destino_nombre = serializers.CharField(source='bodega_destino.nombre', read_only=True)
    estado_display = serializers.SerializerMethodField()
    creado_por_username = serializers.SerializerMethodField()

    def get_estado_display(self, obj):  # pragma: no cover
        return obj.get_estado_display()

    def get_creado_por_username(self, obj):  # pragma: no cover
        if obj.creado_por:
            return obj.creado_por.username
        return None

    class Meta:
        model = TrasladoInventario
        fields = [
            'url',
            'id',
            'bodega_origen',
            'created',
            'creado_por_username',
            'bodega_origen_nombre',
            'bodega_destino',
            'creado_por',
            'recibido_por',
            'bodega_destino_nombre',
            'movimiento_origen',
            'movimiento_destino',
            'estado',
            'estado_display',
            'trasladado',
        ]
        extra_kwargs = {
            'movimiento_origen': {'read_only': True},
            'movimiento_destino': {'read_only': True},

        }

    def create(self, validated_data):
        from .services import traslado_inventario_crear
        bodega_origen = validated_data.pop('bodega_origen', None)
        bodega_destino = validated_data.pop('bodega_destino', None)
        creado_por = validated_data.pop('creado_por', None)
        traslado = traslado_inventario_crear(
            bodega_destino_id=bodega_destino.id,
            bodega_origen_id=bodega_origen.id,
            usuario_crea_id=creado_por.id
        )
        return traslado


class TrasladoInventarioDetalleSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    cantidad_origen = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    cantidad_destino = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    def create(self, validated_data):
        from .services import traslado_inventario_adicionar_item
        traslado = validated_data.pop('traslado', None)
        producto = validated_data.pop('producto', None)
        cantidad = validated_data.pop('cantidad', None)
        detalle_traslado_inventario = traslado_inventario_adicionar_item(
            traslado_inventario_id=traslado.id,
            producto_id=producto.id,
            cantidad=cantidad,
        )
        return detalle_traslado_inventario

    def update(self, instance, validated_data):
        from .services import traslado_inventario_adicionar_item
        cantidad = validated_data.pop('cantidad', None)
        detalle_traslado_inventario = traslado_inventario_adicionar_item(
            traslado_inventario_id=instance.traslado.id,
            producto_id=instance.producto.id,
            cantidad=cantidad,
            traslado_item_id=instance.id
        )
        return detalle_traslado_inventario

    class Meta:
        model = TrasladoInventarioDetalle
        fields = [
            'url',
            'id',
            'traslado',
            'producto',
            'producto_nombre',
            'cantidad',
            'cantidad_realmente_trasladada',
            'cantidad_origen',
            'cantidad_destino',
        ]
