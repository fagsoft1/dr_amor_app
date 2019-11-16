# Generated by Django 2.2.7 on 2019-11-13 03:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('contabilidad_diario', '0005_auto_20190714_1349'),
        ('contabilidad_metodos_pago', '0003_remove_metodopago_diario_contable'),
    ]

    operations = [
        migrations.AddField(
            model_name='metodopago',
            name='diario_contable',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to='contabilidad_diario.DiarioContable'),
            preserve_default=False,
        ),
    ]