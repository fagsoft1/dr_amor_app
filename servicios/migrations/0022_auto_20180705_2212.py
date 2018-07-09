# Generated by Django 2.0.2 on 2018-07-06 03:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('servicios', '0021_auto_20180705_2138'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='bitacoraservicio',
            name='habitacion',
        ),
        migrations.RemoveField(
            model_name='bitacoraservicio',
            name='habitacion_anterior',
        ),
        migrations.RemoveField(
            model_name='bitacoraservicio',
            name='habitacion_nueva',
        ),
        migrations.AddField(
            model_name='bitacoraservicio',
            name='habitacion_anterior_nombre',
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
        migrations.AddField(
            model_name='bitacoraservicio',
            name='habitacion_nombre',
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
        migrations.AddField(
            model_name='bitacoraservicio',
            name='habitacion_nueva_nombre',
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
    ]
