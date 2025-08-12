from django.db import models

from Apps.productos.models import Producto
from Apps.negocios.models import TblNegocio
# Create your models here.
class Proveedor(models.Model):
    negocio = models.ForeignKey(TblNegocio, on_delete=models.CASCADE ,related_name='proveedores',default=None)
    nombre = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20)
    correo = models.CharField(max_length=100)
    direccion = models.TextField()
    tipoProveedor = models.CharField(max_length=100)

class ProveedorProducto(models.Model):
    negocio = models.ForeignKey(TblNegocio, on_delete=models.CASCADE,default= None,related_name='proveedor_productos')
    proveedor = models.ForeignKey(Proveedor, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('proveedor', 'producto')