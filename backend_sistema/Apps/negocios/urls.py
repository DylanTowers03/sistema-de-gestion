from django.urls import path
from .views import (
    TipoNegocioViewSet,
    TblNegocioViewSet,
    UsuarioNegocioViewSet
)

urlpatterns = [
    path('api/tipo-negocio/', TipoNegocioViewSet.as_view()),
    path('api/tipo-negocio/<int:pk>/', TipoNegocioViewSet.as_view()),

    path('api/', TblNegocioViewSet.as_view()),
    path('api/<int:pk>/', TblNegocioViewSet.as_view()),

    path('api/usuario-negocio/', UsuarioNegocioViewSet.as_view()),
    path('api/usuario-negocio/<int:pk>/', UsuarioNegocioViewSet.as_view()),
]
