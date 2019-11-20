# Generated by Django 2.2.7 on 2019-11-20 11:37

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Banco',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('nit', models.CharField(max_length=20, unique=True)),
                ('nombre', models.CharField(max_length=200, unique=True)),
            ],
            options={
                'permissions': [['list_banco', 'Puede listar Bancos']],
            },
        ),
        migrations.CreateModel(
            name='CuentaBancariaBanco',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('nro_cuenta', models.CharField(max_length=200)),
                ('titular_cuenta', models.CharField(max_length=200)),
                ('banco', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='cuentas_bancarias', to='contabilidad_bancos.Banco')),
            ],
            options={
                'permissions': [['list_cuentabancariabanco', 'Puede listar Cuentas Bancarias']],
                'unique_together': {('banco', 'nro_cuenta')},
            },
        ),
    ]
