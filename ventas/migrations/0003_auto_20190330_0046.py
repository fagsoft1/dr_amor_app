# Generated by Django 2.1.5 on 2019-03-30 05:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ventas', '0002_auto_20190330_0045'),
    ]

    operations = [
        migrations.RenameField(
            model_name='ventaproductodetalle',
            old_name='cuenta',
            new_name='cuenta_comision',
        ),
    ]
