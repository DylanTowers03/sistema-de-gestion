from .models import Cliente
from .serializers import ClienteSerializer
from Apps.autenticacion.permissions import IsInRole
from rest_framework.views import APIView
from rest_framework.response import Response

class ClienteViewSet(APIView):
    permission_classes = [IsInRole]
    required_roles = ["Admin", "Moderador", "Usuario"]

    def post(self, request):
        serializer = ClienteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request, pk=None):
        if pk is not None:
            try:
                cliente = Cliente.objects.get(pk=pk)
            except Cliente.DoesNotExist:
                return Response({'error': 'Cliente no encontrado'}, status=404)
            serializer = ClienteSerializer(cliente)
            return Response(serializer.data)

        clientes = Cliente.objects.all()
        serializer = ClienteSerializer(clientes, many=True)
        return Response(serializer.data)

    def patch(self, request, pk=None):
        try:
            cliente = Cliente.objects.get(pk=pk)
        except Cliente.DoesNotExist:
            return Response({'error': 'Cliente no encontrado'}, status=404)

        serializer = ClienteSerializer(cliente, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk=None):
        user_rol = request.user.roles.all().values_list('nombreRol', flat=True)

        if 'Admin' not in user_rol:
            return Response({'error': 'No tienes permiso para eliminar clientes'}, status=403)

        try:
            cliente = Cliente.objects.get(pk=pk)
        except Cliente.DoesNotExist:
            return Response({'error': 'Cliente no encontrado'}, status=404)

        cliente.delete()
        return Response(status=204)

