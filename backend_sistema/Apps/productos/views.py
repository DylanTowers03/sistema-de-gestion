from django.shortcuts import render
from django.http import HttpResponse

from rest_framework import viewsets
from .models import Producto,TipoProducto, CategoriaProducto
from .serializers import (
    ProductoSerializer,TipoProductoSerializer, CategoriaProductoSerializer
)

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

class TipoProductoViewSet(viewsets.ModelViewSet):
    queryset = TipoProducto.objects.all()
    serializer_class = TipoProductoSerializer

class CategoriaProductoViewSet(viewsets.ModelViewSet):
    queryset = CategoriaProducto.objects.all()
    serializer_class = CategoriaProductoSerializer
