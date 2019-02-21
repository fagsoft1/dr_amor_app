# Generated by Django 2.1.5 on 2019-02-18 23:41

from django.db import migrations
import imagekit.models.fields
import terceros.models


class Migration(migrations.Migration):

    dependencies = [
        ('terceros', '0002_tercero_imagen_perfil'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tercero',
            name='imagen_perfil',
            field=imagekit.models.fields.ProcessedImageField(blank=True, null=True, upload_to=terceros.models.Tercero.imagen_perfil_upload_to),
        ),
    ]