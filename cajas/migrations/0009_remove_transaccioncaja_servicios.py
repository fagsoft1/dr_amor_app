# Generated by Django 2.1.5 on 2019-03-26 18:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cajas', '0008_operacioncaja_transacciones_caja'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='transaccioncaja',
            name='servicios',
        ),
    ]
