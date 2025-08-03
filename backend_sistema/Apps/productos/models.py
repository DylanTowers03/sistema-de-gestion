from django.db import models
from Apps.ventas.models import Venta
from Apps.clientes.models import Cliente

class CategoriaProducto(models.Model):
    nombreCategoria = models.CharField(max_length=100)

    def __str__(self):
        return self.nombreCategoria

class TipoProducto(models.Model):
    nombreTipoProducto = models.CharField(max_length=100)
 
    def __str__(self):
        return self.nombreTipoProducto

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

    def __str__(self):
        return self.nombreProducto

class VentaProducto(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precioVentaUnitario = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.producto} x {self.cantidad} (Venta #{self.venta.id})"

class Factura(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    fecha = models.DateTimeField(auto_now_add=True)
    consecutivo = models.CharField(max_length=20, unique=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    estado = models.CharField(max_length=20, default='simulada')  # solo simulado

class DetalleFactura(models.Model):
    factura = models.ForeignKey(Factura, related_name='detalles', on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT)
    cantidad = models.PositiveIntegerField()
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)