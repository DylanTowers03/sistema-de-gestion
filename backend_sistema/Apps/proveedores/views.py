from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Proveedor, ProveedorProducto
from .serializers import ProveedorSerializer, ProveedorProductoSerializer
from Apps.autenticacion.permissions import IsInRole

class ProveedorViewSet(APIView):
    permission_classes = [IsInRole]
    required_roles = ["Admin", "Moderador"]

    def post(self, request):
        serializer = ProveedorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request, pk=None):
        if pk is not None:
            try:
                proveedor = Proveedor.objects.get(pk=pk)
            except Proveedor.DoesNotExist:
                return Response({'error': 'Proveedor no encontrado'}, status=404)
            serializer = ProveedorSerializer(proveedor)
            return Response(serializer.data)

        proveedores = Proveedor.objects.all()
        serializer = ProveedorSerializer(proveedores, many=True)
        return Response(serializer.data)

    def patch(self, request, pk=None):
        try:
            proveedor = Proveedor.objects.get(pk=pk)
        except Proveedor.DoesNotExist:
            return Response({'error': 'Proveedor no encontrado'}, status=404)

        serializer = ProveedorSerializer(proveedor, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk=None):
        user_rol = request.user.roles.all().values_list('nombreRol', flat=True)

        if 'Admin' not in user_rol:
            return Response({'error': 'No tienes permiso para eliminar proveedores'}, status=403)

        try:
            proveedor = Proveedor.objects.get(pk=pk)
        except Proveedor.DoesNotExist:
            return Response({'error': 'Proveedor no encontrado'}, status=404)

        proveedor.delete()
        return Response(status=204)


class ProveedorProductoViewSet(APIView):
    permission_classes = [IsInRole]
    required_roles = ["Admin" ]

    def post(self, request):
        serializer = ProveedorProductoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request, pk=None):
        if pk is not None:
            try:
                relacion = ProveedorProducto.objects.get(pk=pk)
            except ProveedorProducto.DoesNotExist:
                return Response({'error': 'Relación proveedor-producto no encontrada'}, status=404)
            serializer = ProveedorProductoSerializer(relacion)
            return Response(serializer.data)

        relaciones = ProveedorProducto.objects.all()
        serializer = ProveedorProductoSerializer(relaciones, many=True)
        return Response(serializer.data)

    def patch(self, request, pk=None):
        try:
            relacion = ProveedorProducto.objects.get(pk=pk)
        except ProveedorProducto.DoesNotExist:
            return Response({'error': 'Relación proveedor-producto no encontrada'}, status=404)

        serializer = ProveedorProductoSerializer(relacion, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk=None):
        user_rol = request.user.roles.all().values_list('nombreRol', flat=True)

        if 'Admin' not in user_rol:
            
            return Response({'error': 'No tienes permiso para eliminar relaciones'}, status=403)

        try:
            relacion = ProveedorProducto.objects.get(pk=pk)
        except ProveedorProducto.DoesNotExist:
            return Response({'error': 'Relación proveedor-producto no encontrada'}, status=404)

        relacion.delete()
        return Response(status=204)