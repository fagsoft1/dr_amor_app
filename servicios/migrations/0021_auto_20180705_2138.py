# Generated by Django 2.0.2 on 2018-07-06 02:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('servicios', '0020_bitacoraservicio_tiempo_minutos_recorridos'),
    ]

    operations = [
        migrations.AddField(
            model_name='bitacoraservicio',
            name='observacion',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='bitacoraservicio',
            name='concepto',
            field=models.CharField(max_length=200),
        ),
    ]
