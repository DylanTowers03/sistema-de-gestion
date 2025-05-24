from rest_framework import serializers
from .models import *

class VentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venta
        fields = '__all__'
        #fields = ['id', 'negocio', 'usuario', 'fechaVenta', 'totalVenta', 'estado']
        #exclude = ['usuario']
        #read_only_fields = ['usuario']


class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = '__all__'
        #fields = ['id', 'venta', 'fechaPago', 'montoPago', 'metodoPago']
        #read_only_fields = ['venta']

