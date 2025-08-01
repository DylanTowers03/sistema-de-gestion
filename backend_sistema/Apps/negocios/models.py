from django.db import models

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
    nombreNegocio = models.CharField(max_length=100)
    direccion = models.TextField()
    telefono = models.CharField(max_length=20)
    correo = models.CharField(max_length=255)
    fechaCreacion = models.DateField()
    tipoNegocio = models.ForeignKey(TipoNegocio, on_delete=models.SET_NULL, null=True)


class UsuarioNegocio(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    negocio = models.ForeignKey(TblNegocio, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('usuario', 'negocio')
        db_table = 'tbl_negocio_has_Usuario'