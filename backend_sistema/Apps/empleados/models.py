from django.db import models
from Apps.autenticacion.models import Usuario
from Apps.negocios.models import TblNegocio
# Create your models here.
class Empleado(models.Model):
    user = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    negocio = models.ForeignKey(TblNegocio, on_delete=models.CASCADE,related_name='empleados')
    salario = models.DecimalField(max_digits=10, decimal_places=2)