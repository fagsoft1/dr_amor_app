# Generated by Django 2.0.2 on 2018-07-08 00:00

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('puntos_venta', '0003_auto_20180403_0329'),
    ]

    operations = [
        migrations.AddField(
            model_name='puntoventa',
            name='usuarios',
            field=models.ManyToManyField(related_name='mis_puntos_venta', to=settings.AUTH_USER_MODEL),
        ),
    ]
