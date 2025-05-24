from django.contrib import admin

# Register your models here.
from .models import Venta, Pago

admin.site.register(Venta)
admin.site.register(Pago)
