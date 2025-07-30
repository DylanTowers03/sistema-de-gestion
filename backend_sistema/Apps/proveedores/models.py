from django.db import models

from Apps.productos.models import Producto

# Create your models here.
class Proveedor(models.Model):
    nombre = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20)
    correo = models.CharField(max_length=100)
    direccion = models.TextField()
    tipoProveedor = models.CharField(max_length=100)

class ProveedorProducto(models.Model):
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('proveedor', 'producto')