# Generated by Django 2.1.5 on 2019-04-27 17:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cajas', '0011_auto_20190424_1136'),
    ]

    operations = [
        migrations.AddField(
            model_name='conceptooperacioncaja',
            name='en_cierre_de_caja',
            field=models.BooleanField(default=False),
        ),
    ]