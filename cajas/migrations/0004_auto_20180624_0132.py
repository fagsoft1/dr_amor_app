# Generated by Django 2.0.2 on 2018-06-24 06:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cajas', '0003_auto_20180624_0132'),
    ]

    operations = [
        migrations.RenameField(
            model_name='movimientodineroservicio',
            old_name='nro_autorizacio',
            new_name='nro_autorizacion',
        ),
    ]
