from rest_framework import serializers
from .models import TipoNegocio, TblNegocio, UsuarioNegocio
from Apps.autenticacion.models import Usuario

class TipoNegocioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoNegocio
        fields = '__all__'

class TblNegocioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TblNegocio
        fields = '__all__'

class UsuarioNegocioSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsuarioNegocio
        fields = '__all__'