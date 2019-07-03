from django.db import models
from django.contrib.auth.models import Permission


class PermissionPlus(models.Model):
    permiso = models.OneToOneField(Permission, related_name='plus', null=True, blank=True, on_delete=models.PROTECT)
    nombre = models.CharField(null=True, blank=True, max_length=200)
    activo = models.BooleanField(default=False)


class AditionalDefaultPermission(models.Model):
    class Meta:
        managed = False
        permissions = (
            ('list_user', 'Can list user'),
            ('list_permission', 'Can list permission'),
            ('list_group', 'Can list group'),
            ('change_user_permission', 'Can change user permission'),
            ('make_user_superuser', 'Can make user superuser'),
            ('make_user_staff', 'Can make user staff'),
            ('make_user_active', 'Can make user active'),
        )
