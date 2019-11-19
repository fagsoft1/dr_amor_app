# Generated by Django 2.2.7 on 2019-11-19 03:11

import configuracion_aplicacion.models
from django.db import migrations, models
import imagekit.models.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='DatoGeneral',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('logo', imagekit.models.fields.ProcessedImageField(blank=True, null=True, upload_to=configuracion_aplicacion.models.DatoGeneral.imagen_logo_upload_to)),
            ],
        ),
    ]
