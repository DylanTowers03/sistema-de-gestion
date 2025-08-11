from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse

from rest_framework import viewsets
from .models import Producto,TipoProducto, CategoriaProducto
from .serializers import (
    ProductoSerializer,TipoProductoSerializer, CategoriaProductoSerializer
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from  Apps.autenticacion.permissions import IsInRole
from Apps.autenticacion.models import Rol
from django.utils.crypto import get_random_string
from Apps.productos.models import Factura, DetalleFactura
from Apps.clientes.models import Cliente
from Apps.negocios.models import TblNegocio
class CrearFacturaSimulada(APIView):
    permission_classes = [IsInRole]
    required_roles = ["Admin", "Moderador", "Usuario"]
    
    def get(self, request):
        #this method return all the facturas with their details
        facturas = Factura.objects.all()
        response_data = []
        for factura in facturas:
            detalles = factura.detalles.all()
            detalles_data = [
                {
                    "producto": detalle.producto.nombreProducto,
                    "cantidad": detalle.cantidad,
                    "subtotal": str(detalle.subtotal)
                } for detalle in detalles
            ]
            response_data.append({
                "id": factura.id,
                "cliente": factura.cliente.nombreCliente,
                "fecha": factura.fecha,
                "consecutivo": factura.consecutivo,
                "total": str(factura.total),
                "estado": factura.estado,
                "detalles": detalles_data
            })
        return Response(response_data)
    
    def post(self, request):
        data = request.data
        cliente_id = data['clienteId']
        items = data['productos']  # [{producto_id, cantidad}]

        cliente = Cliente.objects.get(id=cliente_id)
        consecutivo = f"SIM-{get_random_string(8)}"

        factura = Factura.objects.create(cliente=cliente, consecutivo=consecutivo)

        total = 0
        for item in items:
            producto = Producto.objects.get(id=item['productoId'])
            cantidad = item['cantidad']
            subtotal = producto.precioVenta * cantidad
            total += subtotal

            DetalleFactura.objects.create(
                factura=factura,
                producto=producto,
                cantidad=cantidad,
                subtotal=subtotal
            )

        factura.total = total
        factura.save()

        return Response({
            "mensaje": "Factura simulada creada",
            "consecutivo": factura.consecutivo,
            "total": str(factura.total),
            "factura": {
                "id": factura.id,
                "cliente": cliente.nombreCliente,
                "fecha": factura.fecha,
                "consecutivo": factura.consecutivo,
                "total": str(factura.total),
                "estado": factura.estado,
                "detalles": [
                    {
                        "producto": detalle.producto.nombreProducto,
                        "cantidad": detalle.cantidad,
                        "subtotal": str(detalle.subtotal)
                    } for detalle in factura.detalles.all()
                ]
            }    
        })

class ProductoViewSet(APIView):
    permission_classes = [IsInRole]

    required_roles = ["Admin", "Moderador", "Usuario"]

    def post(self, request):
        data = request.data.copy()  
        user = request.user
        try:
            if data.get('categoria'):
                categoria = get_object_or_404(CategoriaProducto, nombreCategoria=data['categoria'])
                data['categoria'] = categoria.pk

            if data.get('tipo'):
                tipo = get_object_or_404(TipoProducto, nombreTipoProducto=data['tipo'])
                data['tipo'] = tipo.pk

        except Exception as e:
            return Response({"error": str(e)}, status=400)

        serializer = ProductoSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)
    
    def get(self, request, pk=None):
        if pk is not None:
            try:
                producto = Producto.objects.get(pk=pk)
            except Producto.DoesNotExist:
                return Response({'error': 'Producto no encontrado'}, status=404)

            return Response(serializer.data)
        
        productos = Producto.objects.all()
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data)



    def patch(self, request, pk=None):
        user_rol = request.user.roles.all().values_list('nombreRol', flat=True)
        data = request.data.copy()  


        if 'Admin' not in user_rol and 'Moderador' not in user_rol and 'Usuario' not in user_rol:
            return Response({'error': 'No tienes permiso para editar productos'}, status=403)


        try:
            if data.get('category'):
                categoria = get_object_or_404(CategoriaProducto, nombreCategoria=data['category'])
                data['categoria'] = categoria.pk

            if data.get('type'):
                tipo = get_object_or_404(TipoProducto, nombreTipoProducto=data['type'])
                data['tipo'] = tipo.pk

        except Exception as e:
            return Response({"error": str(e)}, status=400)

        try:
            producto = Producto.objects.get(pk=pk)
        except Producto.DoesNotExist:
            return Response({'error': 'Producto no encontrado'}, status=404)

        serializer = ProductoSerializer(producto, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)
    
    def delete(self, request, pk=None):

        user_rol = request.user.roles.all().values_list('nombreRol', flat=True)

        if 'Admin' not in user_rol:
            return Response({'error': 'No tienes permiso para eliminar productos'}, status=403)

        try:
            producto = Producto.objects.get(pk=pk)
        except Producto.DoesNotExist:
            return Response({'error': 'Producto no encontrado'}, status=404)

        producto.delete()
        return Response(status=204)

class TipoProductoViewSet(APIView):
    permission_classes = [IsInRole]

    required_roles = ["Admin", "Moderador", "Usuario"]

    def post(self, request):
        serializer = TipoProductoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

    def patch(self, request, pk=None):
        try:
            tipo_producto = TipoProducto.objects.get(pk=pk)
        except TipoProducto.DoesNotExist:
            return Response({'error': 'Tipo de producto no encontrado'}, status=404)

        serializer = TipoProductoSerializer(tipo_producto, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, pk=None):
        try:
            tipo_producto = TipoProducto.objects.get(pk=pk)
        except TipoProducto.DoesNotExist:
            return Response({'error': 'Tipo de producto no encontrado'}, status=404)

        tipo_producto.delete()
        return Response(status=204)
    
    def get(self, request, pk=None):
        if pk is not None:
            try:
                tipo_producto = TipoProducto.objects.get(pk=pk)
            except TipoProducto.DoesNotExist:
                return Response({'error': 'Tipo de producto no encontrado'}, status=404)

            serializer = TipoProductoSerializer(tipo_producto)
            return Response(serializer.data)
        
        tipos_productos = TipoProducto.objects.all()
        serializer = TipoProductoSerializer(tipos_productos, many=True)
        return Response(serializer.data)

class CategoriaProductoViewSet(APIView):
    permission_classes = [IsInRole]

    required_roles = ["Admin", "Moderador", "Usuario"]

    def post(self, request):
        serializer = CategoriaProductoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

    def patch(self, request, pk=None):
        try:
            categoria_producto = CategoriaProducto.objects.get(pk=pk)
        except CategoriaProducto.DoesNotExist:
            return Response({'error': 'Categoria de producto no encontrada'}, status=404)

        serializer = CategoriaProductoSerializer(categoria_producto, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, pk=None):
        try:
            categoria_producto = CategoriaProducto.objects.get(pk=pk)
        except CategoriaProducto.DoesNotExist:
            return Response({'error': 'Categoria de producto no encontrada'}, status=404)

        categoria_producto.delete()
        return Response(status=204)

    def get(self, request, pk=None):
        if pk is not None:
            try:
                categoria_producto = CategoriaProducto.objects.get(pk=pk)
            except CategoriaProducto.DoesNotExist:
                return Response({'error': 'Categoria de producto no encontrada'}, status=404)

            serializer = CategoriaProductoSerializer(categoria_producto)
            return Response(serializer.data)
        
        categorias_productos = CategoriaProducto.objects.all()
        serializer = CategoriaProductoSerializer(categorias_productos, many=True)
        return Response(serializer.data)
    
