from django.db import models

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class Rol(models.Model):
    nombreRol = models.CharField(max_length=100)

    def __str__(self):
        return self.nombreRol

class Recurso(models.Model):
    nombreRecurso = models.CharField(max_length=100)

    def __str__(self):
        return self.nombreRecurso

class UsuarioManager(BaseUserManager):
    def create_user(self, correo, password=None, **extra_fields):
        if not correo:
            raise ValueError('El correo debe ser obligatorio')
        correo = self.normalize_email(correo)
        user = self.model(correo=correo, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, correo, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(correo, password, **extra_fields)

class Usuario(AbstractBaseUser, PermissionsMixin):
    nombre = models.CharField(max_length=200)
    apellido = models.CharField(max_length=200)
    correo = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    last_login = models.DateTimeField(blank=True, null=True) 
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    roles = models.ManyToManyField('Rol', through='UsuarioHasRol')

    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = ['nombre', 'apellido']

    objects = UsuarioManager()

    def __str__(self):
        return f"{self.nombre} {self.apellido} ({self.correo})"
class UsuarioHasRol(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.usuario} - {self.rol}"

class RecursoHasRol(models.Model):
    recurso = models.ForeignKey(Recurso, on_delete=models.CASCADE)
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.recurso} - {self.rol}"
