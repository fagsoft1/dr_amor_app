from django.db.models.signals import pre_delete, post_init, post_save
from django.dispatch import receiver

from .models import Tercero


@receiver(pre_delete, sender=Tercero)
def imagen_perfil_pre_delete(sender, instance, **kwargs):
    instance.imagen_perfil.delete(False)


@receiver(post_init, sender=Tercero)
def backup_imagen_perfil_path(sender, instance, **kwargs):
    instance._current_imagen_perfil = instance.imagen_perfil


@receiver(post_save, sender=Tercero)
def delete_firma(sender, instance, **kwargs):
    if hasattr(instance, '_current_imagen_perfil'):
        if instance._current_imagen_perfil != instance.imagen_perfil:
            instance._current_imagen_perfil.delete(save=False)
