import bcrypt
from rest_framework import serializers
from .models import Usuario, Rol, Recurso, UsuarioHasRol, RecursoHasRol

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    nombre = serializers.CharField(max_length=200)
    correo = serializers.EmailField()

    class Meta:
        model = Usuario
        fields = ['nombre', 'correo', 'password']

    def create(self, validated_data):
        print(validated_data)
        user = Usuario.objects.create_user(
            correo=validated_data['correo'],
            nombre=validated_data['nombre'],
            password=validated_data['password']
        )

        #assing default role for this user
        default_role = Rol.objects.get_or_create(nombreRol='Usuario')
        UsuarioHasRol.objects.create(usuario=user, rol=default_role[0])

        return user




class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

    def create(self, validated_data):
        password = validated_data.get('password')
        if password:
            hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            validated_data['password'] = hashed.decode('utf-8')
        return super().create(validated_data)

    def update(self, instance, validated_data):
        password = validated_data.get('password')
        if password and password != instance.password:
            hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            validated_data['password'] = hashed.decode('utf-8')
        return super().update(instance, validated_data)


class UsuarioHasRolSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsuarioHasRol
        fields = '__all__'

class RolesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

class RecursosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recurso
        fields = '__all__'

class RecursosHasRolSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecursoHasRol
        fields = '__all__'