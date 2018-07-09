# Generated by Django 2.0.2 on 2018-06-24 02:42

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('servicios', '0009_auto_20180617_2350'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='MovimientoDineroServicio',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('concepto', models.CharField(max_length=200)),
                ('valor_efectivo', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('valor_tarjeta', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('franquicia', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('creado_por', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
                ('servicio', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='servicios.Servicio')),
                ('venta_servicios', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='servicios.VentaServicio')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]