from django.urls import path
from .views import ProveedorViewSet,ProveedorProductoViewSet
urlpatterns = [
    path('api/proveedores/', ProveedorViewSet.as_view()),
    path('api/proveedores/<int:pk>/', ProveedorViewSet.as_view()),
    path('api/proveedor-productos/', ProveedorProductoViewSet.as_view()),
    path('api/proveedor-productos/<int:pk>/', ProveedorProductoViewSet.as_view()),
    
]
