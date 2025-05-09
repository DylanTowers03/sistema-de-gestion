from django.contrib import admin
from .models import Usuario, Rol, Recurso, UsuarioHasRol, RecursoHasRol

admin.site.register(Usuario)
admin.site.register(Rol)
admin.site.register(Recurso)
admin.site.register(UsuarioHasRol)
admin.site.register(RecursoHasRol)
