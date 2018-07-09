# Generated by Django 2.0.2 on 2018-04-01 17:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('inventarios', '0025_movimientoinventario_observacion'),
    ]

    operations = [
        migrations.CreateModel(
            name='PuntoVenta',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=120)),
                ('es_tienda', models.BooleanField(default=False)),
                ('es_servicios', models.BooleanField(default=False)),
                ('bodega', models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, related_name='punto_venta', to='inventarios.Bodega')),
            ],
        ),
    ]