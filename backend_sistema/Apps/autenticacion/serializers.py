from rest_framework import serializers
from .models import Usuario, Rol, Recurso, RecursoHasRol
from django.contrib.auth.hashers import make_password

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            'id', 'nombre', 'apellido', 'correo', 'telefono', 'password',
            'fecha_creacion', 'fecha_modificacion', 'rol'
        ]

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)

class RolesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

class RecursosSerializer(serializers.ModelSerializer):
    roles_permitidos = serializers.StringRelatedField(
        many=True,
        slug_field='nombreRol',
        queryset=Rol.objects.all()
    )
    class Meta:
        model = Recurso
        fields = '__all__'

class RecursosHasRolSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecursoHasRol
        fields = '__all__'