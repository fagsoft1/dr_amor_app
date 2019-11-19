from rest_framework import serializers

from .models import MetodoPago


class MetodoPagoSerializer(serializers.ModelSerializer):
    cuenta_bancaria_descripcion = serializers.SerializerMethodField()
    cuenta_metodo_pago_descripcion = serializers.CharField(
        source='cuenta_metodo_pago.descripcion',
        read_only=True
    )
    cuenta_metodo_pago_devolucion_descripcion = serializers.CharField(
        source='cuenta_metodo_pago_devolucion.descripcion',
        read_only=True
    )
    cuenta_metodo_pago_codigo = serializers.CharField(
        source='cuenta_metodo_pago.codigo',
        read_only=True
    )
    cuenta_metodo_pago_devolucion_codigo = serializers.CharField(
        source='cuenta_metodo_pago_devolucion.codigo',
        read_only=True
    )
    diario_contable_nombre = serializers.CharField(source='diario_contable.nombre', read_only=True)
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, obj):
        return obj.nombre

    def get_cuenta_bancaria_descripcion(self, obj):
        if obj.cuenta_bancaria:
            return '%s - %s (%s)' % (
                obj.cuenta_bancaria.banco.nombre, obj.cuenta_bancaria.nro_cuenta, obj.cuenta_bancaria.titular_cuenta)
        return ''

    def create(self, validated_data):
        from .services import metodo_pago_crear_actualizar
        nombre = validated_data.get('nombre')
        tipo = validated_data.get('tipo')
        cuenta_bancaria = validated_data.get('cuenta_bancaria')
        diario_contable = validated_data.get('diario_contable')
        cuenta_metodo_pago = validated_data.get('cuenta_metodo_pago')
        cuenta_metodo_pago_devolucion = validated_data.get('cuenta_metodo_pago_devolucion')
        metodo_pago = metodo_pago_crear_actualizar(
            nombre=nombre,
            tipo=tipo,
            diario_contable_id=diario_contable.id if diario_contable is not None else None,
            cuenta_bancaria_id=cuenta_bancaria.id if cuenta_bancaria is not None else None,
            cuenta_metodo_pago_id=cuenta_metodo_pago.id if cuenta_metodo_pago is not None else None,
            cuenta_metodo_pago_devolucion_id=cuenta_metodo_pago_devolucion.id if cuenta_metodo_pago_devolucion is not None else None
        )
        return metodo_pago

    def update(self, instance, validated_data):
        from .services import metodo_pago_crear_actualizar
        nombre = validated_data.get('nombre')
        tipo = validated_data.get('tipo')
        cuenta_bancaria = validated_data.get('cuenta_bancaria')
        diario_contable = validated_data.get('diario_contable')
        cuenta_metodo_pago = validated_data.get('cuenta_metodo_pago')
        cuenta_metodo_pago_devolucion = validated_data.get('cuenta_metodo_pago_devolucion')
        metodo_pago = metodo_pago_crear_actualizar(
            nombre=nombre,
            tipo=tipo,
            diario_contable_id=diario_contable.id if diario_contable is not None else None,
            cuenta_bancaria_id=cuenta_bancaria.id if cuenta_bancaria is not None else None,
            cuenta_metodo_pago_id=cuenta_metodo_pago.id if cuenta_metodo_pago is not None else None,
            cuenta_metodo_pago_devolucion_id=cuenta_metodo_pago_devolucion.id if cuenta_metodo_pago_devolucion is not None else None,
            metodo_pago_id=instance.id
        )
        return metodo_pago

    class Meta:
        model = MetodoPago
        fields = [
            'url',
            'id',
            'diario_contable',
            'get_tipo_display',
            'diario_contable_nombre',
            'cuenta_metodo_pago_devolucion_codigo',
            'cuenta_metodo_pago_codigo',
            'cuenta_bancaria_descripcion',
            'activo',
            'nombre',
            'to_string',
            'tipo',
            'cuenta_bancaria',
            'cuenta_metodo_pago_descripcion',
            'cuenta_metodo_pago_devolucion_descripcion',
            'cuenta_metodo_pago',
            'cuenta_metodo_pago_devolucion',
        ]
        read_only_fields = ['get_tipo_display']
