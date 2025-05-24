from rest_framework import serializers
from .models import *

class proveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = '__all__'

class provedorProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProveedorProducto
        fields = '__all__'