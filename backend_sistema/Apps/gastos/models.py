from django.db import models
from Apps.negocios.models import TblNegocio

# Create your models here.
class Gasto(models.Model):
    negocio = models.ForeignKey(TblNegocio, on_delete=models.CASCADE)
    descripcion = models.CharField(max_length=255)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateField()