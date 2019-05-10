# Generated by Django 2.2 on 2019-05-10 05:23

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contabilidad_diario', '0001_initial'),
        ('empresas', '0002_comprobante'),
        ('contabilidad_cuentas', '0003_auto_20190509_0052'),
        ('terceros', '0005_auto_20190502_0121'),
    ]

    operations = [
        migrations.CreateModel(
            name='AsientoContable',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('concepto', models.CharField(max_length=300)),
                ('fecha', models.DateTimeField()),
                ('consolidada', models.BooleanField(default=False)),
                ('nota', models.CharField(max_length=1000)),
                ('diario_contable', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='asientos_contables', to='contabilidad_diario.DiarioContable')),
                ('empresa', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='asientos_contables', to='empresas.Empresa')),
                ('tercero', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='asientos_contables', to='terceros.Tercero')),
            ],
            options={
                'abstract': False,
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
                ('asiento_contable', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='apuntes_contables', to='contabilidad_movimientos.AsientoContable')),
                ('cuenta_contable', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='apuntes_contables', to='contabilidad_cuentas.CuentaContable')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
