from django.db import models

# Create your models here.
class Rol(models.Model):
    nombreRol = models.CharField(max_length=100)

class Recurso(models.Model):
    nombreRecurso = models.CharField(max_length=100)

class Usuario(models.Model):
    nombre = models.CharField(max_length=200)
    apellido = models.CharField(max_length=200)
    correo = models.CharField(max_length=255)
    telefono = models.CharField(max_length=20)
    password = models.CharField(max_length=255)
    roles = models.ManyToManyField(Rol, through='UsuarioHasRol')

class UsuarioHasRol(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE)

class RecursoHasRol(models.Model):
    recurso = models.ForeignKey(Recurso, on_delete=models.CASCADE)
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE)
