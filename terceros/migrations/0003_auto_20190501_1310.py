# Generated by Django 2.2 on 2019-05-01 18:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('terceros', '0002_auto_20190331_1043'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cuenta',
            name='saldo_anterior',
        ),
        migrations.RemoveField(
            model_name='cuenta',
            name='saldo_pasa',
        ),
        migrations.RemoveField(
            model_name='cuenta',
            name='valor_pagado',
        ),
    ]