from rest_framework import viewsets, permissions
from .api_serializers import EmpresaSerializer
from .models import Empresa


class EmpresaViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Empresa.objects.all()
    serializer_class = EmpresaSerializer

    # def perform_destroy(self, instance):
    #     if not instance.mis_productos.exists() and not instance.mis_habitaciones.exists():
    #         super().perform_destroy(instance)
    #     else:
    #         content = {'error': ['No se puede eliminar']}
    #         raise serializers.ValidationError(content)
