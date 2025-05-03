from django.db import models
from Apps.negocios.models import TblNegocio
#from Apps.autenticacion.models import Usuario

# Create your models here.
class Venta(models.Model):
    negocio = models.ForeignKey(TblNegocio, on_delete=models.CASCADE)
    #usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    fechaVenta = models.DateField()
    totalVenta = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=20)

class Pago(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE)
    fechaPago = models.DateField()
    montoPago = models.DecimalField(max_digits=10, decimal_places=2)
    metodoPago = models.CharField(max_length=50)