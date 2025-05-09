from django.urls import path

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductoViewSet,
    TipoProductoViewSet, CategoriaProductoViewSet
)

router = DefaultRouter()
router.register(r'', ProductoViewSet)
router.register(r'tipo-producto', TipoProductoViewSet)
router.register(r'categoria-producto', CategoriaProductoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
