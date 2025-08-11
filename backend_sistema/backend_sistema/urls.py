"""
URL configuration for backend_sistema project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('ventas/', include('Apps.ventas.urls')),
    path('productos/', include('Apps.productos.urls')),
    path('proveedores/', include('Apps.proveedores.urls')),
    path('negocios/', include('Apps.negocios.urls')),
    path('autenticacion/', include('Apps.autenticacion.urls')),
    path('clientes/', include('Apps.clientes.urls')),   
    path('empleados/', include('Apps.empleados.urls')),

]
