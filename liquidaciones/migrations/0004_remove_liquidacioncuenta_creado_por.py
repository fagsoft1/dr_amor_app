# Generated by Django 2.1.5 on 2019-03-30 06:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('liquidaciones', '0003_liquidacioncuenta_saldo_anterior'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='liquidacioncuenta',
            name='creado_por',
        ),
    ]