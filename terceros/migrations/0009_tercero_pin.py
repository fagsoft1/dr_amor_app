# Generated by Django 2.0.2 on 2018-06-07 05:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('terceros', '0008_tercero_presente'),
    ]

    operations = [
        migrations.AddField(
            model_name='tercero',
            name='pin',
            field=models.CharField(max_length=128, null=True),
        ),
    ]