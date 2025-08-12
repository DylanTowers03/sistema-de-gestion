from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Proveedor, ProveedorProducto
from .serializers import ProveedorSerializer, ProveedorProductoSerializer
from Apps.autenticacion.permissions import IsInRole
from Apps.productos.models import Producto
from Apps.negocios.models import TblNegocio
from Apps.empleados.models import Empleado

def getNegocioId(user):
        #if is propietario
        if user.roles.filter(nombreRol='Admin').exists():
            negocio = TblNegocio.objects.get(propietario=user.id)
            return negocio.id

        if user.roles.filter(nombreRol='Usuario').exists():
            empleado = Empleado.objects.get(empleado=user.id)            
            return empleado.negocio.id

        return None



class ProveedorViewSet(APIView):
    permission_classes = [IsInRole]
    required_roles = ["Admin", "Moderador","Usuario"]


    
    def post(self, request):
        negocio_id = getNegocioId(request.user)
        request.data['negocio'] = negocio_id

        serializer = ProveedorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request, pk=None):
        negocio_id = getNegocioId(request.user)


        if pk is not None:
            try:
                proveedor = Proveedor.objects.get(pk=pk, negocio=negocio_id)
            except Proveedor.DoesNotExist:
                return Response({'error': 'Proveedor no encontrado'}, status=404)
            serializer = ProveedorSerializer(proveedor)
            return Response(serializer.data)

        proveedores = Proveedor.objects.filter(negocio=negocio_id)
        serializer = ProveedorSerializer(proveedores, many=True)
        return Response(serializer.data)

    def patch(self, request, pk=None):
        negocio_id = getNegocioId(request.user)

        try:
            proveedor = Proveedor.objects.get(pk=pk, negocio=negocio_id)
        except Proveedor.DoesNotExist:
            return Response({'error': 'Proveedor no encontrado'}, status=404)

        serializer = ProveedorSerializer(proveedor, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk=None):
        negocio_id = getNegocioId(request.user)


        user_rol = request.user.roles.all().values_list('nombreRol', flat=True)

        if 'Admin' not in user_rol:
            return Response({'error': 'No tienes permiso para eliminar proveedores'}, status=403)

        try:
            proveedor = Proveedor.objects.get(pk=pk, negocio=negocio_id)
        except Proveedor.DoesNotExist:
            return Response({'error': 'Proveedor no encontrado'}, status=404)

        proveedor.delete()
        return Response(status=204)


class ProveedorProductoViewSet(APIView):
    permission_classes = [IsInRole]
    required_roles = ["Admin","Usuario"]

    def post(self, request):
        negocio_id = getNegocioId(request.user)
        request.data['negocio'] = negocio_id


        data = request.data.copy()

        proveedor_id = data.get('proveedor')
        productos_ids = data.get('producto', [])  # Esto es una lista de IDs

        if not proveedor_id or not productos_ids:
            return Response({'error': 'Debe incluir proveedor y producto(s).'}, status=400)

        created_relations = []

        for producto_id in productos_ids:
            serializer = ProveedorProductoSerializer(data={
                'negocio': negocio_id,
                'proveedor': proveedor_id,
                'producto': producto_id
            })
            if serializer.is_valid():
                serializer.save()
                created_relations.append(serializer.data)
            else:
                return Response(serializer.errors, status=400)

        return Response(created_relations, status=201)


    def get(self, request, pk=None):
        negocio_id = getNegocioId(request.user)

        if pk is not None:
            try:
                relacion = ProveedorProducto.objects.get(pk=pk, negocio=negocio_id)
            except ProveedorProducto.DoesNotExist:
                return Response({'error': 'Relación proveedor-producto no encontrada'}, status=404)
            serializer = ProveedorProductoSerializer(relacion)
            return Response(serializer.data)

        relaciones = ProveedorProducto.objects.filter(negocio=negocio_id)
        serializer = ProveedorProductoSerializer(relaciones, many=True)
        return Response(serializer.data)

    def patch(self, request, pk=None):
        negocio_id = getNegocioId(request.user)

        try:
            relacion = ProveedorProducto.objects.get(pk=pk, negocio=negocio_id)
        except ProveedorProducto.DoesNotExist:
            return Response({'error': 'Relación proveedor-producto no encontrada'}, status=404)

        serializer = ProveedorProductoSerializer(relacion, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk=None):
        negocio_id = getNegocioId(request.user)

        user_rol = request.user.roles.all().values_list('nombreRol', flat=True)

        if 'Admin' not in user_rol:
            
            return Response({'error': 'No tienes permiso para eliminar relaciones'}, status=403)

        try:
            relacion = ProveedorProducto.objects.get(pk=pk, negocio=negocio_id)
        except ProveedorProducto.DoesNotExist:
            return Response({'error': 'Relación proveedor-producto no encontrada'}, status=404)

        relacion.delete()
        return Response(status=204)