# Generated by Django 2.0.2 on 2018-03-24 15:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventarios', '0021_trasladoinventario_trasladado'),
    ]

    operations = [
        migrations.AddField(
            model_name='trasladoinventariodetalle',
            name='costo',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
        ),
    ]
