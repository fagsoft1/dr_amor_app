from django.contrib.auth.models import User, Permission, Group
from django.db.models import Q

from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from dr_amor_app.custom_permissions import DjangoModelPermissionsFull
from .api_serializers import PermissionSerializer, GroupSerializer


class PermissionViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = Permission.objects.select_related('plus', 'content_type').all()
    serializer_class = PermissionSerializer

    @action(detail=False, methods=['get'])
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

    @action(detail=False, methods=['get'])
    def por_grupo(self, request):
        grupo_id = int(self.request.GET.get('grupo_id'))
        grupo = Group.objects.get(id=grupo_id)
        permissions_list = grupo.permissions.all()
        serializer = self.get_serializer(permissions_list, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def permiso_x_usuario(self, request):
        user_id = int(request.GET.get('user_id'))
        user = User.objects.get(id=user_id)
        permissions_list = self.queryset.filter(
            Q(user=user) |
            Q(group__user=user)
        ).distinct()
        serializer = self.get_serializer(permissions_list, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def permisos_activos(self, request):
        permissions_list = self.queryset.filter(
            plus__activo=True
        ).distinct()
        serializer = self.get_serializer(permissions_list, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def tengo_permisos(self, request):
        listado_split = request.GET.get('listado_permisos').split(',')[0:-1]
        if request.user.is_superuser:
            permissions_list = self.queryset.all().filter(codename__in=listado_split)
            serializer = self.get_serializer(permissions_list, many=True)
            return Response(serializer.data)
        permissions_list = self.queryset.filter(
            Q(codename__in=listado_split) &
            (
                    Q(user=request.user) |
                    Q(group__user=request.user)
            )
        ).distinct()
        serializer = self.get_serializer(permissions_list, many=True)
        return Response(serializer.data)


class GroupViewSet(viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissionsFull]
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    @action(detail=True, methods=['post'])
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

    @action(detail=False, methods=['get'])
    def validar_nombre(self, request) -> Response:
        qs = self.get_queryset()
        validacion_reponse = {}
        name = self.request.GET.get('name', None)
        if name and qs.filter(name=name).exists():
            validacion_reponse.update({'name': 'Ya exite'})
        return Response(validacion_reponse)
