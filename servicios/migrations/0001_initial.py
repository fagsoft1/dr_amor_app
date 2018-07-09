# Generated by Django 2.0.2 on 2018-06-10 22:37

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('terceros', '0011_cuenta'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('empresas', '0002_auto_20180319_0140'),
        ('habitaciones', '0002_auto_20180319_0224'),
    ]

    operations = [
        migrations.CreateModel(
            name='Servicio',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('estado', models.IntegerField(choices=[(0, 'Inicio'), (1, 'En Servicio'), (2, 'Terminado'), (3, 'Anulado')], default=0)),
                ('hora_inicio', models.DateTimeField(blank=True, null=True)),
                ('hora_final', models.DateTimeField(blank=True, null=True)),
                ('tiempo_minutos', models.PositiveIntegerField(default=0)),
                ('categoria', models.CharField(blank=True, max_length=120, null=True)),
                ('valor_servicio', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('valor_habitacion', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('valor_iva_habitacion', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('valor_total', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('cuenta', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='servicios', to='terceros.Cuenta')),
                ('empresa', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='servicios', to='empresas.Empresa')),
                ('habitacion', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='servicios', to='habitaciones.Habitacion')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='VentaServicio',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('valor_servicios', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('valor_habitaciones', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('valor_iva_habitaciones', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('valor_total', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='servicios_registrados', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
