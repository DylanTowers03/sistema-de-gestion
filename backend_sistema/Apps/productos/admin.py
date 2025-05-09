from django.contrib import admin
from .models import Producto, TipoProducto, CategoriaProducto

admin.site.register(Producto)
admin.site.register(TipoProducto)
admin.site.register(CategoriaProducto)
