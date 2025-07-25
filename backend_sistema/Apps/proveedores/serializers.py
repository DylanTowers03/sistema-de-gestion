from rest_framework import serializers
from .models import Proveedor, ProveedorProducto


class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = '__all__'

class ProveedorProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProveedorProducto
        fields = '__all__'