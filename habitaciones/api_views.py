from rest_framework import viewsets, serializers
from .api_serializers import HabitacionSerializer, TipoHabitacionSerializer
from .models import Habitacion, TipoHabitacion


class TipoHabitacionViewSet(viewsets.ModelViewSet):
    queryset = TipoHabitacion.objects.all()
    serializer_class = TipoHabitacionSerializer
    #
    # def perform_destroy(self, instance):
    #     if not instance.mis_habitaciones.exists():
    #         super().perform_destroy(instance)
    #     else:
    #         content = {'error': ['No se puede eliminar, hay habitaciones con este tipo']}
    #         raise serializers.ValidationError(content)


class HabitacionViewSet(viewsets.ModelViewSet):
    queryset = Habitacion.objects.select_related('empresa', 'tipo').all()
    serializer_class = HabitacionSerializer
