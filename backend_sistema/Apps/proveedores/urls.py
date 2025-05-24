from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'proveedores', ProveedorViewSet)
router.register(r'proveedor-productos', ProveedorProductoViewSet)


urlpatterns = [
    path('', include(router.urls)),
]