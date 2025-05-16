from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password
from rest_framework.authtoken.models import Token
from django.http import HttpResponse
from rest_framework import viewsets
from .models import *
from .serializers import (
    UsuarioSerializer, RolesSerializer, RecursosSerializer,
    UsuarioHasRolSerializer, RecursosHasRolSerializer
)


# Create your views here.


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


def inicio(request):
    return render(request, 'inicio.html')

def registro(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        apellido = request.POST.get('apellido')
        correo = request.POST.get('correo')
        telefono = request.POST.get('telefono')
        password = request.POST.get('password')
        try:
            usuario = Usuario.objects.create(
                nombre=nombre,
                apellido=apellido,
                correo=correo,
                telefono=telefono,
    
                password=make_password(password)
            )
            return render(request, 'inicio.html', {'usuario': usuario})
        except Exception as e:
            return render(request, 'registro.html', {'error': str(e)})
    return render(request, 'registro.html')

def login(request):
    if request.method == 'POST':
        correo = request.POST.get('correo')
        password = request.POST.get('password')
        try:
            usuario = Usuario.objects.get(correo=correo, password=make_password(password))
            return render(request, 'inicio.html', {'usuario': usuario})
        except Usuario.DoesNotExist:
            return render(request, 'autenticacion/login.html', {'error': 'Usuario o contraseña incorrectos'})
    return render(request, 'login.html')

def logout(request):
    return render(request, 'logout.html')