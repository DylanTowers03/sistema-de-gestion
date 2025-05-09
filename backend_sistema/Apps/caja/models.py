from django.db import models
from Apps.negocios.models import TblNegocio

# Create your models here.
class Caja(models.Model):
    negocio = models.ForeignKey(TblNegocio, on_delete=models.CASCADE)
    fechaApertura = models.DateField()
    fechaCierre = models.DateField(null=True, blank=True)
    montoApertura = models.DecimalField(max_digits=10, decimal_places=2)
    montoCierre = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    observaciones = models.TextField(null=True, blank=True)