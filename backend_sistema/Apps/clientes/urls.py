from .views import ClienteViewSet
from django.urls import path

urlpatterns = [
    path('api/clientes/', ClienteViewSet.as_view()),
    path('api/clientes/<int:pk>/', ClienteViewSet.as_view()),
]
