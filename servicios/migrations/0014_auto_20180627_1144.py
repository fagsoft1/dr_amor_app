# Generated by Django 2.0.2 on 2018-06-27 16:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('servicios', '0013_auto_20180627_1139'),
    ]

    operations = [
        migrations.RenameField(
            model_name='servicio',
            old_name='observacion',
            new_name='observacion_anulacion',
        ),
    ]