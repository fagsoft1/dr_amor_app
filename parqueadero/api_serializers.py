from rest_framework import serializers
from .models import (
    TipoVehiculo,
    ModalidadFraccionTiempo,
    ModalidadFraccionTiempoDetalle,
    Vehiculo,
    RegistroEntradaParqueo
)


class RegistroEntradaParqueoSerializer(serializers.ModelSerializer):
    vehiculo_placa = serializers.CharField(source='vehiculo.placa', read_only=True)
    placa = serializers.CharField(write_only=True)
    tipo_vehiculo_nombre = serializers.CharField(source='vehiculo.tipo_vehiculo.nombre', read_only=True)
    tipo_vehiculo = serializers.PrimaryKeyRelatedField(source='vehiculo.tipo_vehiculo', read_only=True)

    def create(self, validated_data):
        from .services import registro_entrada_parqueo_crear
        punto_venta_turno = validated_data.get('punto_venta_turno')
        modalidad_fraccion_tiempo = validated_data.get('modalidad_fraccion_tiempo')
        placa = validated_data.get('placa', None)
        registro = registro_entrada_parqueo_crear(
            punto_venta_turno_id=punto_venta_turno.id,
            modalidad_fraccion_tiempo_id=modalidad_fraccion_tiempo.id,
            placa=placa
        )
        return registro

    class Meta:
        model = RegistroEntradaParqueo
        fields = [
            'url',
            'id',
            'created',
            'vehiculo',
            'punto_venta_turno',
            'hora_ingreso',
            'hora_salida',
            'vehiculo_placa',
            'valor_parqueadero',
            'valor_iva_parqueadero',
            'valor_impuesto_unico',
            'modalidad_fraccion_tiempo',
            'placa',
            'detalle',
            'tipo_vehiculo',
            'tipo_vehiculo_nombre',
        ]


class TipoVehiculoSerializer(serializers.ModelSerializer):
    empresa_nombre = serializers.CharField(source='empresa.nombre', read_only=True)
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):  # pragma: no cover
        return instance.nombre

    class Meta:
        model = TipoVehiculo
        fields = [
            'url',
            'id',
            'to_string',
            'nombre',
            'empresa',
            'valor_impuesto_unico',
            'porcentaje_iva',
            'tiene_placa',
            'empresa_nombre'
        ]


class ModalidadFraccionTiempoSerializer(serializers.ModelSerializer):
    tipo_vehiculo_nombre = serializers.CharField(source='tipo_vehiculo.nombre', read_only=True)
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):  # pragma: no cover
        return instance.nombre

    class Meta:
        model = ModalidadFraccionTiempo
        fields = [
            'url',
            'id',
            'to_string',
            'nombre',
            'tipo_vehiculo',
            'tipo_vehiculo_nombre',
        ]


class ModalidadFraccionTiempoDetalleSerializer(serializers.ModelSerializer):
    modalidad_fraccion_tiempo_nombre = serializers.CharField(source='modalidad_fraccion_tiempo.nombre', read_only=True)
    tipo_vehiculo_nombre = serializers.CharField(
        source='modalidad_fraccion_tiempo.tipo_vehiculo.nombre',
        read_only=True
    )
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):  # pragma: no cover
        return '%s para %s' % (instance.minutos, instance.modalidad_fraccion_tiempo.nombre)

    def create(self, validated_data):
        from .services import modalida_fraccion_tiempo_detalle_crear_actualizar
        minutos = validated_data.get('minutos')
        valor = validated_data.get('valor')
        modalidad_fraccion_tiempo = validated_data.get('modalidad_fraccion_tiempo')

        instancia = modalida_fraccion_tiempo_detalle_crear_actualizar(
            minutos=minutos,
            modalidad_fraccion_tiempo_id=modalidad_fraccion_tiempo.id,
            valor=valor
        )
        return instancia

    def update(self, instance, validated_data):
        from .services import modalida_fraccion_tiempo_detalle_crear_actualizar
        minutos = validated_data.get('minutos')
        valor = validated_data.get('valor')
        modalidad_fraccion_tiempo = validated_data.get('modalidad_fraccion_tiempo')
        instancia = modalida_fraccion_tiempo_detalle_crear_actualizar(
            minutos=minutos,
            modalidad_fraccion_tiempo_id=modalidad_fraccion_tiempo.id,
            valor=valor,
            modalidad_fraccion_tiempo_detalle_id=instance.id
        )
        return instancia

    class Meta:
        model = ModalidadFraccionTiempoDetalle
        fields = [
            'url',
            'id',
            'to_string',
            'minutos',
            'valor',
            'modalidad_fraccion_tiempo',
            'modalidad_fraccion_tiempo_nombre',
            'tipo_vehiculo_nombre',
        ]


class VehiculoSerializer(serializers.ModelSerializer):
    tipo_vehiculo_nombre = serializers.CharField(
        source='tipo_vehiculo.nombre',
        read_only=True
    )
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):  # pragma: no cover
        return '%s %s' % (instance.tipo_vehiculo.nombre, instance.placa)

    class Meta:
        model = Vehiculo
        fields = [
            'url',
            'id',
            'to_string',
            'placa',
            'tipo_vehiculo',
            'tipo_vehiculo_nombre',
        ]
