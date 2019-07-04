# Generated by Django 2.2.3 on 2019-07-04 04:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('permisos', '0004_auto_20190703_2251'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='menuadminpermission',
            options={'managed': False, 'permissions': (('menu_admin_empresas', 'Menu Admin Empresas'), ('menu_admin_habitaciones', 'Menu Admin Habitaciones'), ('menu_admin_productos', 'Menu Admin Productos'), ('menu_admin_puntos_ventas', 'Menu Admin Puntos Ventas'), ('menu_admin_parqueadero', 'Menu Admin Parqueadero'), ('menu_admin_permisos', 'Menu Admin Permisos'), ('menu_admin_permisos_grupos', 'Menu Admin Grupos Permisos'), ('menu_admin_terceros_usuarios', 'Menu Admin Terceros Usuarios'), ('menu_admin_terceros_acompanantes', 'Menu Admin Terceros Acompanantes'), ('menu_admin_terceros_colaboradores', 'Menu Admin Terceros Colaboradores'), ('menu_admin_terceros_proveedores', 'Menu Admin Terceros Proveedores'), ('menu_admin_bodegas', 'Menu Admin Bodegas'), ('menu_admin_bodegas_kardex', 'Menu Admin Bodegas Kardex'), ('menu_admin_bodegas_kardex_traslados', 'Menu Admin Bodegas Kardex Traslados'), ('menu_admin_cajas_billetes_monedas', 'Menu Admin Cajas Billetes Monedas'), ('menu_admin_cajas_conceptos_operaciones_cajas', 'Menu Admin Cajas Conceptos Operaciones'))},
        ),
    ]
