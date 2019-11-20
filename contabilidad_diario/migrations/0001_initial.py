# Generated by Django 2.2.7 on 2019-11-20 11:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contabilidad_bancos', '0001_initial'),
        ('contabilidad_cuentas', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='DiarioContable',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=300)),
                ('codigo', models.CharField(max_length=10)),
                ('tipo', models.CharField(choices=[('Venta', 'Venta'), ('Compra', 'Compra'), ('Efectivo', 'Efectivo'), ('Banco', 'Banco'), ('General', 'General')], default='General', max_length=120)),
                ('banco', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='diarios_contables', to='contabilidad_bancos.Banco')),
                ('cuenta_bancaria', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='diarios_contables', to='contabilidad_bancos.CuentaBancariaBanco')),
                ('cuenta_credito_defecto', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='diarios_contables_credito', to='contabilidad_cuentas.CuentaContable')),
                ('cuenta_debito_defecto', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='diarios_contables_debito', to='contabilidad_cuentas.CuentaContable')),
            ],
            options={
                'permissions': [['list_diariocontable', 'Puede listar Diarios Contables']],
            },
        ),
    ]
