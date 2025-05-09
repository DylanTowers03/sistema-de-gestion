from rest_framework import serializers
from .models import Usuario, Rol, Recurso, UsuarioHasRol, RecursoHasRol

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class RolesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

class RecursosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recurso
        fields = '__all__'

class UsuarioHasRolSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsuarioHasRol
        fields = '__all__'

class RecursosHasRolSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecursoHasRol
        fields = '__all__'