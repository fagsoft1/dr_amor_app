# Generated by Django 2.2.7 on 2019-11-20 11:37

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contabilidad_comprobantes', '0001_initial'),
        ('contabilidad_diario', '0001_initial'),
        ('empresas', '0001_initial'),
        ('contabilidad_cuentas', '0001_initial'),
        ('terceros', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AsientoContable',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('nro_comprobante', models.BigIntegerField(null=True)),
                ('concepto', models.CharField(max_length=300)),
                ('fecha', models.DateTimeField()),
                ('consolidada', models.BooleanField(default=False)),
                ('nota', models.CharField(max_length=1000, null=True)),
                ('diario_contable', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='asientos_contables', to='contabilidad_diario.DiarioContable')),
                ('empresa', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='asientos_contables', to='empresas.Empresa')),
                ('tercero', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='asientos_contables', to='terceros.Tercero')),
                ('tipo_comprobante_bancario_empresa', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='apuntes_contables', to='contabilidad_comprobantes.TipoComprobanteContableEmpresa')),
            ],
            options={
                'permissions': [['list_asientocontable', 'Puede listar Asientos Contables']],
            },
        ),
        migrations.CreateModel(
            name='ApunteContable',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('debito', models.DecimalField(decimal_places=2, default=0, max_digits=12)),
                ('credito', models.DecimalField(decimal_places=2, default=0, max_digits=12)),
                ('apunte_contable_cierre', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='asientos_contables_cerrados', to='contabilidad_movimientos.ApunteContable')),
                ('asiento_contable', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='apuntes_contables', to='contabilidad_movimientos.AsientoContable')),
                ('cuenta_contable', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='apuntes_contables', to='contabilidad_cuentas.CuentaContable')),
                ('tercero', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='apuntes_contables', to='terceros.Tercero')),
            ],
            options={
                'permissions': [['list_apuntecontable', 'Puede listar Apuntes Contables']],
            },
        ),
    ]
