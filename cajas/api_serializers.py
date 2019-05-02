from rest_framework import serializers

from .models import (
    BilleteMoneda,
    ArqueoCaja,
    ConceptoOperacionCaja,
    OperacionCaja
)


class OperacionCajaSerializer(serializers.ModelSerializer):
    usuario_cajero_username = serializers.CharField(
        source='punto_venta_turno.usuario.username',
        read_only=True
    )
    tipo_operacion = serializers.CharField(source='concepto.tipo', read_only=True)
    cuenta_liquidada = serializers.NullBooleanField(read_only=True, source='cuenta.liquidada', default=None)
    cuenta_usuario = serializers.IntegerField(source='cuenta.propietario.id', read_only=True, allow_null=True)
    usuario_pv = serializers.HiddenField(default=serializers.CurrentUserDefault())
    reporte_independiente = serializers.BooleanField(
        source='concepto.reporte_independiente',
        read_only=True
    )

    class Meta:
        model = OperacionCaja
        fields = (
            'id',
            'created',
            'tercero',
            'usuario_pv',
            'cuenta',
            'tipo_cuenta',
            'usuario_cajero_username',
            'cuenta_liquidada',
            'cuenta_usuario',
            'concepto',
            'reporte_independiente',
            'grupo_operaciones',
            'descripcion',
            'tipo_operacion',
            'observacion',
            'valor',
        )

    def create(self, validated_data):
        from .services import operacion_caja_crear
        concepto = validated_data.get('concepto', None)
        valor = validated_data.get('valor', None)
        tercero = validated_data.get('tercero', None)
        observacion = validated_data.get('observacion', None)
        usuario_pv = validated_data.get('usuario_pv')

        operacion_caja = operacion_caja_crear(
            concepto_id=concepto.id,
            usuario_pdv_id=usuario_pv.id,
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
            'tipo_cuenta',
            'reporte_independiente',
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
    class Meta:
        model = ArqueoCaja
        fields = (
            'id',
            'punto_venta_turno',
            'valor_pago_efectivo_a_entregar',
            'valor_pago_tarjeta_a_entregar',
            'nro_voucher_a_entregar',
            'dolares_tasa',
            'valor_dolares_entregados',
            'valor_tarjeta_entregados',
            'nro_voucher_entregados',
            'observacion',
            'created',
        )
