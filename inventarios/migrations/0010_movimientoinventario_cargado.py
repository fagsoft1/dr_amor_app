# Generated by Django 2.0.2 on 2018-03-23 18:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventarios', '0009_auto_20180319_2243'),
    ]

    operations = [
        migrations.AddField(
            model_name='movimientoinventario',
            name='cargado',
            field=models.BooleanField(default=False),
        ),
    ]
