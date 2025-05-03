from django.db import models
from Apps.ventas.models import Venta

# Create your models here.
class CategoriaProducto(models.Model):
    nombreCategoria = models.CharField(max_length=100)

class TipoProducto(models.Model):
    nombreTipoProducto = models.CharField(max_length=100)

class Producto(models.Model):
    nombreProducto = models.CharField(max_length=100)
    descripcion = models.TextField()
    stockActual = models.IntegerField()
    stockMin = models.IntegerField()
    stockMax = models.IntegerField()
    unidadMedida = models.CharField(max_length=50)
    precioVenta = models.DecimalField(max_digits=10, decimal_places=2)
    categoria = models.ForeignKey(CategoriaProducto, on_delete=models.SET_NULL, null=True)
    tipo = models.ForeignKey(TipoProducto, on_delete=models.SET_NULL, null=True)

class VentaProducto(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precioVentaUnitario = models.DecimalField(max_digits=10, decimal_places=2)