from django.contrib.auth.models import User
from django.db import models
from model_utils.models import TimeStampedModel


class RegistroIngreso(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='regitros_ingresos')
    fecha_fin = models.DateTimeField(null=True, blank=True)
