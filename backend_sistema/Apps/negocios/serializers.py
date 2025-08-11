from rest_framework import serializers
from .models import TipoNegocio, TblNegocio
from Apps.autenticacion.models import Usuario

class TipoNegocioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoNegocio
        fields = '__all__'

class TblNegocioSerializer(serializers.ModelSerializer):
    tipoNegocio = serializers.PrimaryKeyRelatedField(queryset=TipoNegocio.objects.all())  # Escritura con ID
    tipoNegocioDetalle = TipoNegocioSerializer(source='tipoNegocio', read_only=True)      # Lectura completa

    class Meta:
        model = TblNegocio
        fields = '__all__'

