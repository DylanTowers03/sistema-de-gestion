from django.urls import path
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmpleadoView


urlpatterns = [
  path('api/empleados/', EmpleadoView.as_view(), name='empleados'),
  
]