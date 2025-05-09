from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets
from .models import Usuario, Rol, Recurso, UsuarioHasRol, RecursoHasRol


# Create your views here.

from .serializers import (
    UsuarioSerializer, RolesSerializer, RecursosSerializer,
    UsuarioHasRolSerializer, RecursosHasRolSerializer
)

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolesSerializer

class RecursoViewSet(viewsets.ModelViewSet):
    queryset = Recurso.objects.all()
    serializer_class = RecursosSerializer

class UsuarioHasRolViewSet(viewsets.ModelViewSet):
    queryset = UsuarioHasRol.objects.all()
    serializer_class = UsuarioHasRolSerializer

class RecursoHasViewSet(viewsets.ModelViewSet):
    queryset = RecursoHasRol.objects.all()
    serializer_class = RecursosHasRolSerializer
