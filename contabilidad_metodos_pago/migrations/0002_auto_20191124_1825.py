# Generated by Django 2.2.7 on 2019-11-24 23:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('puntos_venta', '0001_initial'),
        ('contabilidad_metodos_pago', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='MetodoPagoPuntoVenta',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('activo', models.BooleanField(default=True)),
                ('metodo_pago', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='metodos_pagos_punto_venta', to='contabilidad_metodos_pago.MetodoPago')),
                ('punto_venta', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='metodos_pagos_punto_venta', to='puntos_venta.PuntoVenta')),
            ],
        ),
        migrations.AddField(
            model_name='metodopago',
            name='puntos_de_venta',
            field=models.ManyToManyField(related_name='metodos_pago', through='contabilidad_metodos_pago.MetodoPagoPuntoVenta', to='puntos_venta.PuntoVenta'),
        ),
    ]
