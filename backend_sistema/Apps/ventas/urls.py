from django.urls import path
from django.urls import include
from rest_framework.routers import DefaultRouter
from .views import (
    VentaViewSet, PagoViewSet
)

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'ventas', VentaViewSet)
router.register(r'pago', PagoViewSet)

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
]
