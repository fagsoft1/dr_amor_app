from rest_framework import serializers

from reversion.models import Version, Revision


class RevisionSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Revision
        fields = [
            'id',
            'username',
            'date_created',
            'comment',
            'user'
        ]
        read_only_fields = fields


class HistoricoSerializer(serializers.ModelSerializer):
    revision = RevisionSerializer(many=False, read_only=True)

    class Meta:
        model = Version
        fields = [
            'id',
            'revision',
            'object_id',
            'content_type',
            'serialized_data',
            'object_repr',
        ]
        read_only_fields = fields
