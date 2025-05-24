from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets
from .models import Proveedor, ProveedorProducto
from .serializers import ProveedorSerializer, ProveedorProductoSerializer

# Create your views here.


class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer

class ProveedorProductoViewSet(viewsets.ModelViewSet):
    queryset = ProveedorProducto.objects.all()
    serializer_class = ProveedorProductoSerializer

