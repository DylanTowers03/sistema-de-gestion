import bcrypt
from rest_framework import serializers
from .models import Usuario, Rol, Recurso, UsuarioHasRol, RecursoHasRol
from Apps.negocios.models import TblNegocio
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from Apps.negocios.models import TblNegocio
from Apps.empleados.models import Empleado
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
   @classmethod
   def get_token(cls, user):
        token = super().get_token(user)

        # Añadir datos personalizados al payload
        token['nombre'] = user.nombre
        token["id"] = user.id  # Assuming 'id' is the primary key of the user
        token['correo'] = user.correo
        token['roles'] = [rol.nombreRol for rol in user.roles.all()]

        # Negocio al que pertenece el usuario
        
        #verificar si es un propietario o un empleado los propietarios tienen
        #rol de Admin y los empleados tienen rol de Usuario
        negocio = None

        isPropietario = user.roles.filter(nombreRol='Admin').exists()

        isSuperAdmin = user.roles.filter(nombreRol='SuperAdmin').exists()
        print("sadSDSDFNKSFNKSJDFNSDN")


        if isSuperAdmin:
            negocio = 0
            token['negocio'] = negocio
            print(token['negocio'])
            return token        
        else:

            if isPropietario:
                negocio = TblNegocio.objects.filter(propietario=user).first()
            else:
                e = Empleado.objects.filter(user=user).first()
                negocio = TblNegocio.objects.filter(pk=e.negocio_id).first()


        if negocio:
            token['negocio'] = negocio.id    


        return token


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
        default_role = Rol.objects.get_or_create(nombreRol='Admin')
        UsuarioHasRol.objects.create(usuario=user, rol=default_role[0])

        TblNegocio.objects.create(propietario=user,
                                  nombreNegocio="None",
                                  direccion="None",
                                  telefono="None",
                                  correo="None",
                                  )        

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