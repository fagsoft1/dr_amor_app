# Generated by Django 2.2.7 on 2019-11-20 11:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('empresas', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='TipoComprobanteContable',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('codigo_comprobante', models.CharField(max_length=4, unique=True)),
                ('descripcion', models.CharField(max_length=200)),
                ('titulo_comprobante', models.CharField(max_length=200)),
                ('texto_uno', models.TextField(null=True)),
                ('texto_dos', models.TextField(null=True)),
                ('texto_tres', models.TextField(null=True)),
            ],
            options={
                'permissions': [['list_tipocomprobantecontable', 'Puede listar Tipos Comprobantes Contables']],
            },
        ),
        migrations.CreateModel(
            name='TipoComprobanteContableEmpresa',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('activo', models.BooleanField(default=True)),
                ('consecutivo_actual', models.BigIntegerField(default=0)),
                ('numero_autorizacion', models.CharField(max_length=100, null=True)),
                ('fecha_autorizacion', models.DateField(null=True)),
                ('rango_inferior_numeracion', models.BigIntegerField(default=0)),
                ('rango_superior_numeracion', models.BigIntegerField(default=0)),
                ('tiene_vigencia', models.BooleanField(default=False)),
                ('fecha_inicial_vigencia', models.DateField(null=True)),
                ('fecha_final_vigencia', models.DateField(null=True)),
                ('pais_emision', models.CharField(blank=True, max_length=100, null=True)),
                ('ciudad_emision', models.CharField(blank=True, max_length=100, null=True)),
                ('direccion_emision', models.CharField(blank=True, max_length=100, null=True)),
                ('telefono_emision', models.CharField(blank=True, max_length=100, null=True)),
                ('empresa', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='tipos_comprobantes_empresas', to='empresas.Empresa')),
                ('tipo_comprobante', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='tipos_comprobantes_empresas', to='contabilidad_comprobantes.TipoComprobanteContable')),
            ],
            options={
                'permissions': [['list_tipocomprobantecontableempresa', 'Puede listar Tipos Comprobantes Contables Empresas']],
            },
        ),
        migrations.AddField(
            model_name='tipocomprobantecontable',
            name='comprobantes_empresas',
            field=models.ManyToManyField(related_name='tipos_comprobantes', through='contabilidad_comprobantes.TipoComprobanteContableEmpresa', to='empresas.Empresa'),
        ),
    ]
