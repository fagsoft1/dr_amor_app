# Generated by Django 2.1.5 on 2019-03-31 16:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('liquidaciones', '0007_auto_20190331_1104'),
    ]

    operations = [
        migrations.RenameField(
            model_name='liquidacioncuenta',
            old_name='transferencia',
            new_name='tarjeta_o_transferencia',
        ),
    ]
