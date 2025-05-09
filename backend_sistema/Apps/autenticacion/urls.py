from django.urls import path
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet, RolViewSet, RecursoViewSet,
    UsuarioHasRolViewSet, RecursoHasViewSet
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'roles', RolViewSet)
router.register(r'recursos', RecursoViewSet)
router.register(r'usuario-rol', UsuarioHasRolViewSet)
router.register(r'rol-recurso', RecursoHasViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
