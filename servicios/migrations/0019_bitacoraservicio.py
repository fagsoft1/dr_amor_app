# Generated by Django 2.0.2 on 2018-07-06 01:47

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('habitaciones', '0007_remove_habitacion_tiempo_final_servicio'),
        ('servicios', '0018_remove_ventaservicio_venta_servicio_inicial'),
    ]

    operations = [
        migrations.CreateModel(
            name='BitacoraServicio',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('tiempo_contratado_anterior', models.PositiveIntegerField(blank=True, null=True)),
                ('tiempo_contratado_nuevo', models.PositiveIntegerField(blank=True, null=True)),
                ('tiempo_contratado', models.PositiveIntegerField(blank=True, null=True)),
                ('hora_evento', models.DateTimeField(blank=True, null=True)),
                ('concepto', models.TextField()),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='bitacoras_servicios', to=settings.AUTH_USER_MODEL)),
                ('habitacion', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='bitacoras_servicio', to='habitaciones.Habitacion')),
                ('habitacion_anterior', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='servicio_asignados_a_otra_habitacion', to='habitaciones.Habitacion')),
                ('habitacion_nueva', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='servicio_asignados_desde_otra_habitacion', to='habitaciones.Habitacion')),
                ('servicio', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='bitacoras_servicio', to='servicios.Servicio')),
                ('venta_servicio', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='bitacoras_servicio', to='servicios.VentaServicio')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]