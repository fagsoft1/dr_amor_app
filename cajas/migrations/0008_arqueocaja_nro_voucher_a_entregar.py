# Generated by Django 2.1.5 on 2019-04-20 19:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cajas', '0007_auto_20190407_1522'),
    ]

    operations = [
        migrations.AddField(
            model_name='arqueocaja',
            name='nro_voucher_a_entregar',
            field=models.PositiveIntegerField(default=0),
        ),
    ]