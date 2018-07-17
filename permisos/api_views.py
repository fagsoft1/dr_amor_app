from django.contrib.auth.models import User, Permission, Group
from django.db.models import Q

from rest_framework import viewsets, permissions
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response

from .api_serializers import PermissionSerializer, GroupSerializer


class PermissionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Permission.objects.select_related('plus', 'content_type').all()
    serializer_class = PermissionSerializer

    @list_route(methods=['get'])
    def mis_permisos(self, request):
        if request.user.is_superuser:
            permissions_list = Permission.objects.all()
            serializer = self.get_serializer(permissions_list, many=True)
            return Response(serializer.data)
        permissions_list = self.queryset.filter(
            Q(user=request.user) |
            Q(group__user=request.user)
        ).distinct()
        serializer = self.get_serializer(permissions_list, many=True)
        return Response(serializer.data)

    @list_route(methods=['get'])
    def permiso_x_usuario(self, request):
        user_id = int(request.GET.get('user_id'))
        user = User.objects.get(id=user_id)
        permissions_list = self.queryset.filter(
            Q(user=user) |
            Q(group__user=user)
        ).distinct()
        serializer = self.get_serializer(permissions_list, many=True)
        return Response(serializer.data)

    @list_route(methods=['get'])
    def permisos_activos(self, request):
        permissions_list = self.queryset.filter(
            plus__activo=True
        ).distinct()
        serializer = self.get_serializer(permissions_list, many=True)
        return Response(serializer.data)


class GroupViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    @detail_route(methods=['post'])
    def adicionar_permiso(self, request, pk=None):
        grupo = self.get_object()
        id_permiso = int(request.POST.get('id_permiso'))
        permiso = Permission.objects.get(id=id_permiso)
        tiene_permiso = grupo.permissions.filter(id=id_permiso).exists()
        if not tiene_permiso:
            grupo.permissions.add(permiso)
        else:
            grupo.permissions.remove(permiso)

        serializer = self.get_serializer(grupo)
        return Response(serializer.data)

    @list_route(methods=['get'])
    def validar_nombre(self, request) -> Response:
        qs = self.get_queryset()
        validacion_reponse = {}
        name = self.request.GET.get('name', None)
        if name and qs.filter(name=name).exists():
            validacion_reponse.update({'name': 'Ya exite'})
        return Response(validacion_reponse)
