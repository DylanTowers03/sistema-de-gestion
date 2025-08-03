from django.urls import path

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductoViewSet,
    TipoProductoViewSet, CategoriaProductoViewSet,
    CrearFacturaSimulada
)

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('api/factura/', CrearFacturaSimulada.as_view(), name='crear-factura-simulada'),
    path('api/producto/', ProductoViewSet.as_view(), name='producto-list-create'),
    path('api/producto/<int:pk>/', ProductoViewSet.as_view(), name='producto-list-detail'),
    path('api/tipo-producto/', TipoProductoViewSet.as_view(), name='tipo-producto-list-create'),
    path('api/tipo-producto/<int:pk>/', TipoProductoViewSet.as_view(), name='tipo-producto-detail'),
    path('api/categoria-producto/', CategoriaProductoViewSet.as_view(), name='categoria-producto-list-create'),
    path('api/categoria-producto/<int:pk>/', CategoriaProductoViewSet.as_view(), name='categoria-producto-detail'),
]
