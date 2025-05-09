from django.db import models

# Create your models here.
class Cliente(models.Model):
    nombreCliente = models.CharField(max_length=100)
    apellidoCliente = models.CharField(max_length=100)
    correo = models.CharField(max_length=100)
    telefono = models.CharField(max_length=100)
    direccion = models.TextField()