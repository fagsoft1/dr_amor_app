# Generated by Django 2.0.2 on 2018-08-07 16:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cajas', '0003_auto_20180801_2003'),
    ]

    operations = [
        migrations.AlterField(
            model_name='billetemoneda',
            name='activo',
            field=models.BooleanField(default=False),
        ),
    ]