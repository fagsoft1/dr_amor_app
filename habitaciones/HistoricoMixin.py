import reversion
from rest_framework.decorators import action
from rest_framework.response import Response
from reversion.models import Version

from historico.api_serializers import HistoricoSerializer


class HistoricoViewSetMixin(object):
    @action(detail=True, methods=['post'])
    def historico(self, request, pk=None):
        versions = Version.objects.select_related('revision', 'revision__user').get_for_object(self.get_object())
        historico = HistoricoSerializer(versions, many=True)
        return Response(historico.data)

    @action(detail=True, methods=['post'])
    def restaurar(self, request, pk=None):
        id_a_restaurar = request.POST.get('id_a_restaurar')
        version = Version.objects.get(pk=id_a_restaurar)
        with reversion.create_revision():
            version.revision.revert()
            reversion.set_user(request.user)
            reversion.set_comment("Restauró a version id %s" % id_a_restaurar)
        object = self.get_object()
        serializer = self.get_serializer(object)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        with reversion.create_revision():
            response = super().create(request, *args, **kwargs)
            reversion.set_user(request.user)
            reversion.set_comment("Crea")
        return response

    def update(self, request, *args, **kwargs):
        with reversion.create_revision():
            count = Version.objects.select_related('revision', 'revision__user').get_for_object(
                self.get_object()).count()
            response = super().update(request, *args, **kwargs)
            reversion.set_user(request.user)
            reversion.set_comment("Actualiza version %s" % count)
        return response
