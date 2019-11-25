# Generated by Django 2.2.7 on 2019-11-24 22:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cajas', '0006_auto_20191124_1059'),
    ]

    operations = [
        migrations.AlterField(
            model_name='conceptooperacioncaja',
            name='puntos_de_venta',
            field=models.ManyToManyField(related_name='conceptos_operaciones_caja', through='cajas.ConceptoOperacionCajaPuntoVenta', to='puntos_venta.PuntoVenta'),
        ),
        migrations.AlterField(
            model_name='conceptooperacioncajapuntoventa',
            name='punto_venta',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='conceptos_operaciones_caja_punto_venta', to='puntos_venta.PuntoVenta'),
        ),
    ]
