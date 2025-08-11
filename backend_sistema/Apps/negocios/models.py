from django.db import models
from Apps.autenticacion.models import Usuario
from Apps.autenticacion.models import Usuario

class TipoNegocio(models.Model):
    nombreTipoNegocio = models.CharField(max_length=100)
    descripcion = models.TextField()

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "tipo negocio"
        verbose_name_plural = "tipo negocios"

class TblNegocio(models.Model):
    propietario = models.OneToOneField(Usuario, on_delete=models.SET_NULL, related_name='negocio_propietario', null=True) 
    nombreNegocio = models.CharField(max_length=100)
    direccion = models.TextField()
    telefono = models.CharField(max_length=20)
    correo = models.CharField(max_length=255)
    fechaCreacion = models.DateField(auto_now_add=True)
    tipoNegocio = models.ForeignKey(TipoNegocio, on_delete=models.SET_NULL, null=True)


        