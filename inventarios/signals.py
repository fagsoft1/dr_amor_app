from django.db.models.signals import pre_delete, post_init, post_save
from django.dispatch import receiver

from .models import MovimientoInventarioDocumento


@receiver(pre_delete, sender=MovimientoInventarioDocumento)
def imagen_documento_pre_delete(sender, instance, **kwargs):
    instance.imagen_documento.delete(False)


@receiver(post_init, sender=MovimientoInventarioDocumento)
def backup_imagen_documento_path(sender, instance, **kwargs):
    instance._current_imagen_documento = instance.imagen_documento


@receiver(post_save, sender=MovimientoInventarioDocumento)
def delete_imagen_documento(sender, instance, **kwargs):
    if hasattr(instance, '_current_imagen_documento'):
        if instance._current_imagen_documento != instance.imagen_documento:
            instance._current_imagen_documento.delete(save=False)
