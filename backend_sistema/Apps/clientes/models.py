from django.db import models
from Apps.negocios.models import TblNegocio
# Create your models here.
class Cliente(models.Model):
    negocio = models.ForeignKey(TblNegocio, on_delete=models.CASCADE ,related_name='clientes',default=None)
    nombreCliente = models.CharField(max_length=100)
    apellidoCliente = models.CharField(max_length=100)
    correo = models.CharField(max_length=100)
    telefono = models.CharField(max_length=100)
    direccion = models.TextField()