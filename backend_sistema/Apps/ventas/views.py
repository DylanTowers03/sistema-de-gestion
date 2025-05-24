from django.shortcuts import render

from django.http import JsonResponse
from rest_framework import viewsets
from .models import Venta, Pago
from .serializers import VentaSerializer, PagoSerializer
# Create your views here.

class VentaViewSet(viewsets.ModelViewSet):
    queryset = Venta.objects.all()
    serializer_class = VentaSerializer

class PagoViewSet(viewsets.ModelViewSet):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer
