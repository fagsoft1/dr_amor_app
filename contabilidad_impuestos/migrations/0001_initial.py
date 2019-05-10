# Generated by Django 2.2 on 2019-05-10 05:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contabilidad_cuentas', '0003_auto_20190509_0052'),
    ]

    operations = [
        migrations.CreateModel(
            name='ImpuestoGrupo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=120, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Impuesto',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=120, unique=True)),
                ('ambito', models.CharField(choices=[('Compras', 'Compras'), ('Ventas', 'Ventas'), ('Ajustes', 'Ajustes'), ('Ninguno', 'Ninguno')], max_length=120)),
                ('tipo_calculo_impuesto', models.CharField(choices=[('Fijo', 'Fijo'), ('Porcentaje sobre precio', 'Porcentaje sobre el precio'), ('Porcentaje sobre precio impuestos incluidos', 'Porcentaje sobre el precio con impuestos incluidos')], max_length=150)),
                ('importe', models.DecimalField(decimal_places=3, default=0, max_digits=12)),
                ('cuenta_impuesto', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='impuestos', to='contabilidad_cuentas.CuentaContable')),
                ('cuenta_impuesto_notas_credito', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='impuestos_notas_credito', to='contabilidad_cuentas.CuentaContable')),
            ],
        ),
    ]