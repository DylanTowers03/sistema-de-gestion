from .models import Cliente
from .serializers import ClienteSerializer
from Apps.autenticacion.permissions import IsInRole
from rest_framework.views import APIView
from rest_framework.response import Response
from Apps.negocios.models import TblNegocio
from Apps.empleados.models import Empleado
class ClienteViewSet(APIView):
    permission_classes = [IsInRole]
    required_roles = ["Admin", "Moderador", "Usuario"]

    
    def getNegocioId(self, user):
        #if is propietario
        if user.roles.filter(nombreRol='Admin').exists():
            negocio = TblNegocio.objects.get(propietario=user.id)
            return negocio.id

        if user.roles.filter(nombreRol='Usuario').exists():
            empleado = Empleado.objects.get(empleado=user.id)            
            return empleado.negocio.id

        return None    
    
    def post(self, request):
        negocio_id = self.getNegocioId(request.user)
        request.data['negocio'] = negocio_id

        serializer = ClienteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request, pk=None):
        negocio_id = self.getNegocioId(request.user)

        if pk is not None:
            try:
                cliente = Cliente.objects.get(pk=pk, negocio=negocio_id)
            except Cliente.DoesNotExist:
                return Response({'error': 'Cliente no encontrado'}, status=404)
            serializer = ClienteSerializer(cliente)
            return Response(serializer.data)

        clientes = Cliente.objects.filter(negocio=negocio_id)
        serializer = ClienteSerializer(clientes, many=True)
        return Response(serializer.data)

    def patch(self, request, pk=None):
        negocio_id = self.getNegocioId(request.user)


        try:
            cliente = Cliente.objects.get(pk=pk, negocio=negocio_id)
        except Cliente.DoesNotExist:
            return Response({'error': 'Cliente no encontrado'}, status=404)

        serializer = ClienteSerializer(cliente, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk=None):
        negocio_id = self.getNegocioId(request.user)


        user_rol = request.user.roles.all().values_list('nombreRol', flat=True)

        if 'Admin' not in user_rol:
            return Response({'error': 'No tienes permiso para eliminar clientes'}, status=403)

        try:
            cliente = Cliente.objects.get(pk=pk, negocio=negocio_id)
        except Cliente.DoesNotExist:
            return Response({'error': 'Cliente no encontrado'}, status=404)

        cliente.delete()
        return Response(status=204)

