# Generated by Django 2.2.7 on 2019-11-13 19:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('contabilidad_movimientos', '0005_asientocontable_apunte_contable_cierre'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='asientocontable',
            name='apunte_contable_cierre',
        ),
        migrations.AddField(
            model_name='apuntecontable',
            name='apunte_contable_cierre',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='contabilidad_movimientos.ApunteContable'),
        ),
    ]