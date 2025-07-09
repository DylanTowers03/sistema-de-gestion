from rest_framework.permissions import BasePermission

class IsInRole(BasePermission):

    def has_permission(self, request, view):
        required_roles = getattr(view, 'required_roles', [])
        if not request.user or not request.user.is_authenticated:
            return False
        user_roles = request.user.roles.values_list('nombreRol', flat=True)
        # Verificamos si el usuario tiene alguno de los roles requeridos
        return any(role in user_roles for role in required_roles)
