from django.urls import path
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet, RolViewSet, RecursoViewSet,
    UsuarioHasRolViewSet, RecursoHasViewSet, RegisterView,CustomTokenObtainPairView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'roles', RolViewSet)
router.register(r'recursos', RecursoViewSet)
router.register(r'usuario-rol', UsuarioHasRolViewSet)
router.register(r'rol-recurso', RecursoHasViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/usuarios/', UsuarioViewSet.as_view(), name='usuarios'),
]
 