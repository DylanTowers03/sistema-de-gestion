from rest_framework import serializers
from .models import Empleado


class EmpleadosSerializer(serializers.ModelSerializer):
  class Meta:
    model = Empleado
    fields = '__all__'