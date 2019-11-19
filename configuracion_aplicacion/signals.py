from django.db.models.signals import pre_delete, post_init, post_save
from django.dispatch import receiver

from .models import DatoGeneral


@receiver(pre_delete, sender=DatoGeneral)
def logo_pre_delete(sender, instance, **kwargs):
    instance.logo.delete(False)


@receiver(post_init, sender=DatoGeneral)
def backup_logo_path(sender, instance, **kwargs):
    instance._current_logo = instance.logo


@receiver(post_save, sender=DatoGeneral)
def delete_logo(sender, instance, **kwargs):
    if hasattr(instance, '_current_logo'):
        if instance._current_logo != instance.logo:
            instance._current_logo.delete(save=False)
