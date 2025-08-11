from django.shortcuts import render
from Apps.autenticacion.models import Usuario,UsuarioHasRol,Rol
from Apps.negocios.models import TblNegocio
from rest_framework.permissions import IsAuthenticated
from Apps.autenticacion.permissions import IsInRole
from rest_framework.views import APIView
from .models import Empleado
from rest_framework.response import Response
from .serializers import EmpleadosSerializer
class EmpleadoView(APIView):
  permission_classes = [IsAuthenticated, IsInRole]
  required_roles = ["Admin"]
  def post (self, request):
    data = request.data.copy()
    print(data)
    user = Usuario.objects.create_user(
      correo=data["user"]["correo"],
      nombre=data["user"]["nombre"],
      password=data["user"]["password"]
    )

    data["user"] = user.id
   #assing default role for this user
    default_role = Rol.objects.get_or_create(nombreRol='Usuario')
    UsuarioHasRol.objects.create(usuario=user, rol=default_role[0])

    serializer = EmpleadosSerializer(data=data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

  def get(self, request):
      negocio = TblNegocio.objects.get(propietario=request.user.id)
      empleados = Empleado.objects.filter(negocio=negocio)

      empleados_data = []
      for emp in empleados:
          empleados_data.append({
              "correo": emp.user.correo,
              "nombre": emp.user.nombre,
              "password": "",  # Nunca deberías devolver la contraseña real
              "negocio": emp.negocio.id,
              "salario": emp.salario
          })

      return Response({"empleados": empleados_data}) 
  