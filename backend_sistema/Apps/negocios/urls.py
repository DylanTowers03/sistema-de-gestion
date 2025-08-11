from django.urls import path
from .views import (
    TipoNegocioViewSet,
    TblNegocioViewSet,
TblNegocioSuperAdminViewSet
)

urlpatterns = [
    path('api/tipo-negocio/', TipoNegocioViewSet.as_view()),
    path('api/tipo-negocio/<int:pk>/', TipoNegocioViewSet.as_view()),

    path('api/negocios/', TblNegocioViewSet.as_view()),
    path('api/negocios/<int:pk>/', TblNegocioViewSet.as_view()),

    path("api/negocios-super-admin/", TblNegocioSuperAdminViewSet.as_view()),
    path("api/negocios-super-admin/<int:pk>/", TblNegocioSuperAdminViewSet.as_view()),

]
