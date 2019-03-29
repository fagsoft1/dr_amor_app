# Generated by Django 2.1.5 on 2019-03-29 20:41

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('cajas', '0001_initial'),
        ('empresas', '0001_initial'),
        ('puntos_venta', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ModalidadFraccionTiempo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=120)),
            ],
            options={
                'permissions': [['list_modalidadfracciontiempo', 'Puede listar modalidades fracciones tiempos']],
            },
        ),
        migrations.CreateModel(
            name='ModalidadFraccionTiempoDetalle',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('minutos', models.PositiveIntegerField()),
                ('valor', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('modalidad_fraccion_tiempo', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='fracciones', to='parqueadero.ModalidadFraccionTiempo')),
            ],
            options={
                'permissions': [['list_modalidadfracciontiempodetalle', 'Puede listar modalidades fracciones tiempos detalles']],
            },
        ),
        migrations.CreateModel(
            name='RegistroEntradaParqueo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('codigo_qr', models.CharField(max_length=300, null=True)),
                ('hora_ingreso', models.DateTimeField(null=True)),
                ('hora_salida', models.DateTimeField(null=True)),
                ('valor_parqueadero', models.DecimalField(decimal_places=2, max_digits=12, null=True)),
                ('valor_iva_parqueadero', models.DecimalField(decimal_places=2, max_digits=12, null=True)),
                ('valor_impuesto_unico', models.DecimalField(decimal_places=2, max_digits=12, null=True)),
                ('detalle', models.CharField(max_length=500)),
                ('modalidad_fraccion_tiempo', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='registros_de_parqueo', to='parqueadero.ModalidadFraccionTiempo')),
                ('punto_venta_turno', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='puntos_venta.PuntoVentaTurno')),
                ('transacciones_caja', models.ManyToManyField(related_name='parqueaderos', to='cajas.TransaccionCaja')),
            ],
            options={
                'permissions': [['list_registroentradaparqueo', 'Puede listar registros de parqueo']],
            },
        ),
        migrations.CreateModel(
            name='TipoVehiculo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=120, unique=True)),
                ('porcentaje_iva', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('valor_impuesto_unico', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('tiene_placa', models.BooleanField(default=False)),
                ('empresa', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='empresas.Empresa')),
            ],
            options={
                'permissions': [['list_tipovehiculo', 'Puede listar tipos vehiculos']],
            },
        ),
        migrations.CreateModel(
            name='Vehiculo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('placa', models.CharField(max_length=10, null=True)),
                ('tipo_vehiculo', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='parqueadero.TipoVehiculo')),
            ],
            options={
                'permissions': [['list_vehiculo', 'Puede listar vehiculos']],
            },
        ),
        migrations.AddField(
            model_name='registroentradaparqueo',
            name='vehiculo',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='registros_de_parqueo', to='parqueadero.Vehiculo'),
        ),
        migrations.AddField(
            model_name='modalidadfracciontiempo',
            name='tipo_vehiculo',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='parqueadero.TipoVehiculo'),
        ),
        migrations.AlterUniqueTogether(
            name='modalidadfracciontiempodetalle',
            unique_together={('modalidad_fraccion_tiempo', 'minutos')},
        ),
    ]
