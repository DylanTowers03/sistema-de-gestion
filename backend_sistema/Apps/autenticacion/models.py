from django.db import models

# Create your models here.
class Rol(models.Model):
    ROLES_CHOICES = [
        ('SIMPLE', 'SIMPLE'),
        ('ADMINISTRADOR', 'ADMINISTRADOR'),
        ('MODERADOR', 'MODERADOR'),
    ]
    nombreRol = models.CharField(max_length=20, choices=ROLES_CHOICES, unique=True)

    def save(self, *args, **kwargs):
        self.nombreRol = self.nombreRol.upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombreRol
    


class Usuario(models.Model):
    nombre = models.CharField(max_length=200)
    apellido = models.CharField(max_length=200)
    correo = models.CharField(max_length=255)
    telefono = models.CharField(max_length=20)
    password = models.CharField(max_length=255)
    rol = models.ForeignKey(Rol, on_delete=models.SET_NULL, null=True, blank=True, related_name='usuarios')

    def __str__(self):
        return f'{self.nombre} {self.apellido}'


class Recurso(models.Model):
    nombreRecurso = models.CharField(max_length=100)
    propietario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='recursos', null=True, blank=True)


    def __str__(self):
        return self.nombreRecurso
    
class RecursoHasRol(models.Model):
    recurso = models.ForeignKey(Recurso, on_delete=models.CASCADE, related_name='roles')
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE, related_name='recursos')

    class Meta:
        unique_together = ('recurso', 'rol')

    def __str__(self):
        return f'{self.recurso.nombreRecurso} - {self.rol.nombreRol}'