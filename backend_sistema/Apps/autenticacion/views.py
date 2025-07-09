from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets
from .models import Usuario, Rol, Recurso, UsuarioHasRol, RecursoHasRol
from rest_framework.permissions import IsAuthenticated
from .permissions import IsInRole

# Create your views here.

from .serializers import (
    UsuarioSerializer, RolesSerializer, RecursosSerializer,
    UsuarioHasRolSerializer, RecursosHasRolSerializer
)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer,CustomTokenObtainPairSerializer
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'Usuario registrado'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UsuarioViewSet(APIView):
    permission_classes = [IsAuthenticated, IsInRole]

    roles = Rol.objects.filter(nombreRol__in=['Admin', 'Moderador'])
    required_roles = [role.nombreRol for role in roles]

    def get(self, request):
        return Response({"mensaje": "Solo usuarios con rol Admin o Moderador pueden ver esto"})

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
