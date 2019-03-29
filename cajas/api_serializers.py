from rest_framework import serializers

from .models import (
    BilleteMoneda,
    ArqueoCaja,
    ConceptoOperacionCaja,
    OperacionCaja
)


class OperacionCajaSerializer(serializers.ModelSerializer):
    tipo_operacion = serializers.CharField(source='concepto.tipo', read_only=True)
    cuenta_liquidada = serializers.NullBooleanField(read_only=True, source='cuenta.liquidada')
    cuenta_usuario = serializers.PrimaryKeyRelatedField(source='cuenta.propietario', read_only=True, allow_null=True)
    usuario_pv = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = OperacionCaja
        fields = (
            'id',
            'tercero',
            'usuario_pv',
            'cuenta',
            'cuenta_liquidada',
            'cuenta_usuario',
            'concepto',
            'grupo_operaciones',
            'descripcion',
            'tipo_operacion',
            'observacion',
            'valor',
        )

    def create(self, validated_data):
        from .services import operacion_caja_crear
        concepto = validated_data.get('concepto', None)
        descripcion = validated_data.get('descripcion', None)
        valor = validated_data.get('valor', None)
        tercero = validated_data.get('tercero', None)
        observacion = validated_data.get('observacion', None)
        usuario_pv = validated_data.get('usuario_pv')

        operacion_caja = operacion_caja_crear(
            concepto_id=concepto.id,
            usuario_pdv_id=usuario_pv.id,
            descripcion=descripcion,
            valor=valor,
            tercero_id=tercero.id if tercero else None,
            observacion=observacion
        )
        return operacion_caja


class ConceptoOperacionCajaSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()
    tipo_display = serializers.SerializerMethodField()
    grupo_display = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return '%s de %s' % (instance.get_tipo_display(), instance.descripcion)

    def get_tipo_display(self, instance):
        return instance.get_tipo_display()

    def get_grupo_display(self, instance):
        return instance.get_grupo_display()

    class Meta:
        model = ConceptoOperacionCaja
        fields = (
            'id',
            'tipo',
            'tipo_display',
            'grupo',
            'grupo_display',
            'descripcion',
            'to_string',
        )


class BilleteMonedaSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return '%s de %s' % (instance.get_tipo_display(), instance.valor)

    class Meta:
        model = BilleteMoneda
        fields = (
            'id',
            'tipo',
            'valor',
            'activo',
            'to_string',
        )


class ArqueoCajaSerializer(serializers.ModelSerializer):
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)
    punto_venta_nombre = serializers.CharField(source='punto_venta.nombre', read_only=True)
    tercero_nombre = serializers.CharField(source='usuario.tercero.full_name_proxy', read_only=True)
    valor_entrega_base_dia_siguiente = serializers.DecimalField(decimal_places=2, max_digits=10, read_only=True)
    valor_entrega_efectivo = serializers.DecimalField(decimal_places=2, max_digits=10, read_only=True)
    valor_entrega_dolares = serializers.DecimalField(decimal_places=2, max_digits=10, read_only=True)
    valor_entrega_total = serializers.DecimalField(decimal_places=2, max_digits=10, read_only=True)
    valor_mo_egresos_efectivo = serializers.DecimalField(decimal_places=2, max_digits=10, read_only=True)
    valor_mo_ingreso_efectivo = serializers.DecimalField(decimal_places=2, max_digits=10, read_only=True)
    valor_mo_ingreso_tarjeta = serializers.DecimalField(decimal_places=2, max_digits=10, read_only=True)
    valor_mo_total = serializers.DecimalField(decimal_places=2, max_digits=10, read_only=True)
    cuadre = serializers.DecimalField(decimal_places=2, max_digits=10, read_only=True)

    class Meta:
        model = ArqueoCaja
        fields = (
            'id',
            'usuario',
            'usuario_username',
            'tercero_nombre',
            'created',
            'punto_venta',
            'punto_venta_nombre',
            'dolares',
            'dolares_tasa',
            'nro_voucher',
            'valor_entrega_total',
            'valor_entrega_base_dia_siguiente',
            'valor_tarjeta',
            'valor_entrega_efectivo',
            'valor_entrega_dolares',
            'valor_mo_egresos_efectivo',
            'valor_mo_ingreso_efectivo',
            'valor_mo_ingreso_tarjeta',
            'valor_mo_total',
            'cuadre',
        )
