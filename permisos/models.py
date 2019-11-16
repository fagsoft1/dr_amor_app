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


class MenuAdminPermission(models.Model):
    class Meta:
        managed = False
        permissions = (
            ('menu_admin_empresas', 'Menu Admin Empresas'),
            ('menu_admin_habitaciones', 'Menu Admin Habitaciones'),
            ('menu_admin_productos', 'Menu Admin Productos'),
            ('menu_admin_puntos_ventas', 'Menu Admin Puntos Ventas'),
            ('menu_admin_parqueadero', 'Menu Admin Parqueadero'),
            ('menu_admin_permisos', 'Menu Admin Permisos'),
            ('menu_admin_permisos_grupos', 'Menu Admin Grupos Permisos'),
            ('menu_admin_terceros_usuarios', 'Menu Admin Terceros Usuarios'),
            ('menu_admin_terceros_acompanantes', 'Menu Admin Terceros Acompanantes'),
            ('menu_admin_terceros_colaboradores', 'Menu Admin Terceros Colaboradores'),
            ('menu_admin_terceros_proveedores', 'Menu Admin Terceros Proveedores'),
            ('menu_admin_bodegas', 'Menu Admin Bodegas'),
            ('menu_admin_bodegas_kardex', 'Menu Admin Bodegas Kardex'),
            ('menu_admin_bodegas_kardex_traslados', 'Menu Admin Bodegas Kardex Traslados'),
            ('menu_admin_cajas_billetes_monedas', 'Menu Admin Cajas Billetes Monedas'),
            ('menu_admin_cajas_conceptos_operaciones_cajas', 'Menu Admin Cajas Conceptos Operaciones'),
        )


class ModuloPermission(models.Model):
    class Meta:
        managed = False
        permissions = (
            ('modulo_admin', 'Modulo Administracion'),
            ('modulo_mi_cuenta', 'Modulo Mi Cuenta'),
            ('modulo_acceso', 'Modulo Acceso'),
            ('modulo_consultas', 'Modulo Consultas'),
        )
