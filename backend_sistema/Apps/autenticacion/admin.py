from django.contrib import admin
from .models import *

admin.site.register(Usuario)
admin.site.register(Rol)
admin.site.register(Recurso)
admin.site.register(RecursoHasRol)
