from rest_framework import serializers
from django.utils.timezone import now

from .models import Servicio


class ServicioSerializer(serializers.ModelSerializer):
    usuario_cajero_username = serializers.CharField(
        source='punto_venta_turno.usuario.username',
        read_only=True
    )
    acompanante = serializers.PrimaryKeyRelatedField(source='cuenta.propietario.tercero.id', read_only=True)
    empresa_nombre = serializers.CharField(source='empresa.nombre', read_only=True)
    acompanante_nombre = serializers.CharField(source='cuenta.propietario.tercero.full_name_proxy', read_only=True)
    habitacion_nombre = serializers.CharField(source='habitacion.nombre', read_only=True)
    habitacion = serializers.PrimaryKeyRelatedField(source='habitacion.id', read_only=True)
    categoria_id = serializers.PrimaryKeyRelatedField(source='cuenta.propietario.tercero.categoria_modelo.id',
                                                      read_only=True)
    termino = serializers.SerializerMethodField()
    en_espera = serializers.SerializerMethodField()
    cuenta_liquidada = serializers.NullBooleanField(read_only=True, source='cuenta.liquidada')
    cuenta_usuario = serializers.PrimaryKeyRelatedField(source='cuenta.propietario', read_only=True, allow_null=True)
    cuenta_tipo = serializers.IntegerField(source='cuenta.tipo', read_only=True, allow_null=True)
    tiempo_nombre = serializers.SerializerMethodField()
    anulado = serializers.SerializerMethodField()
    estado_nombre = serializers.SerializerMethodField()

    def get_estado_nombre(self, obj):  # pragma: no cover
        return obj.get_estado_display()

    def get_termino(self, obj):  # pragma: no cover
        if obj.estado == 1:
            return now() > obj.hora_final
        else:
            return False

    def get_en_espera(self, obj):  # pragma: no cover
        if obj.estado == 1:
            return obj.hora_inicio > now()
        else:
            return False

    def get_tiempo_nombre(self, obj):  # pragma: no cover
        tiempo = '%s min.' % obj.tiempo_minutos
        if obj.tiempo_minutos > 59:
            tiempo = '%s hora' % int(int(obj.tiempo_minutos) / 60)
        return tiempo

    def get_anulado(self, obj):  # pragma: no cover
        return obj.estado == 4

    class Meta:
        model = Servicio
        fields = (
            'id',
            'servicio_siguiente',
            'anulado',
            'cuenta',
            'estado_nombre',
            'cuenta_liquidada',
            'cuenta_usuario',
            'cuenta_tipo',
            'empresa',
            'empresa_nombre',
            'habitacion_nombre',
            'usuario_cajero_username',
            'habitacion',
            'estado',
            'hora_inicio',
            'hora_final',
            'hora_final_real',
            'hora_anulacion',
            'tiempo_minutos',
            'tiempo_nombre',
            'termino',
            'en_espera',
            'categoria',
            'categoria_id',
            'acompanante',
            'acompanante_nombre',
            'valor_servicio',
            'valor_habitacion',
            'impuestos',
            'valor_total',
            'observacion_anulacion',
        )
        extra_kwargs = {
            'valor_total': {'read_only': True},
        }
