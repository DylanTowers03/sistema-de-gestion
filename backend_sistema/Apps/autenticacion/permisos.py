# autenticacion/permisos.py
from rest_framework.permissions import BasePermission, SAFE_METHODS

# acá definimos los permisos personalizados para la autenticación
# y autorización de los usuarios en el sistema
class PermisoPorRol(BasePermission):
    def has_object_permission(self, request, view, obj):
        usuario = request.user
        if not usuario or not usuario.is_authenticated:
            return False

        rol = usuario.rol.nombre if usuario.rol else None

        if request.method in SAFE_METHODS:
            return rol in [r.nombre for r in obj.roles_permitidos.all()]

        if request.method in ['PUT', 'PATCH']:
            return rol in [r.nombre for r in obj.roles_permitidos.all()] and rol in ['MODERADOR', 'ADMIN']

        if request.method == 'DELETE':
            return rol in [r.nombre for r in obj.roles_permitidos.all()] and rol == 'ADMIN'

        return False
