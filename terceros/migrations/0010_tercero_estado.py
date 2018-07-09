# Generated by Django 2.0.2 on 2018-06-10 21:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('terceros', '0009_tercero_pin'),
    ]

    operations = [
        migrations.AddField(
            model_name='tercero',
            name='estado',
            field=models.PositiveIntegerField(choices=[(0, 'Disponible'), (1, 'Ocupado')], default=0),
        ),
    ]