# Generated by Django 2.1.5 on 2019-03-30 06:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cajas', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaccioncaja',
            name='nro_vauchers',
            field=models.PositiveIntegerField(default=0),
        ),
    ]