# Generated by Django 2.0.2 on 2018-07-05 22:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('servicios', '0016_auto_20180705_1708'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='servicio',
            name='valor_total',
        ),
    ]
