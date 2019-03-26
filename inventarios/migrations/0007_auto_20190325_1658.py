# Generated by Django 2.1.5 on 2019-03-25 21:58

from django.db import migrations
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('inventarios', '0006_auto_20190323_1412'),
    ]

    operations = [
        migrations.AddField(
            model_name='trasladoinventario',
            name='created',
            field=model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created'),
        ),
        migrations.AddField(
            model_name='trasladoinventario',
            name='modified',
            field=model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified'),
        ),
    ]
