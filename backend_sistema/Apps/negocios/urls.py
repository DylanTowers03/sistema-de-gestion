from django.urls import path
from .views import (
    TipoNegocioViewSet,
    TblNegocioViewSet,
)

urlpatterns = [
    path('api/tipo-negocio/', TipoNegocioViewSet.as_view()),
    path('api/tipo-negocio/<int:pk>/', TipoNegocioViewSet.as_view()),

    path('api/negocios/', TblNegocioViewSet.as_view()),
    path('api/negocios/<int:pk>/', TblNegocioViewSet.as_view()),

]
