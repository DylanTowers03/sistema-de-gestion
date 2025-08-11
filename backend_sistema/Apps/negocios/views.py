from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from Apps.autenticacion.models import Usuario
from Apps.negocios.models import TipoNegocio, TblNegocio 
from Apps.negocios.serializers import TipoNegocioSerializer, TblNegocioSerializer 
from Apps.autenticacion.permissions import IsInRole
from django.utils import timezone
class TipoNegocioViewSet(APIView):
    permission_classes = [IsInRole]
    required_roles = ["Admin", "Moderador", "Usuario"]

    def post(self, request):
        serializer = TipoNegocioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request, pk=None):
        if pk is not None:
            tipo = TipoNegocio.objects.filter(pk=pk).first()
            if not tipo:
                return Response({'error': 'Tipo de negocio no encontrado'}, status=404)
            serializer = TipoNegocioSerializer(tipo)
            return Response(serializer.data)

        tipos = TipoNegocio.objects.all()
        serializer = TipoNegocioSerializer(tipos, many=True)
        return Response(serializer.data)

    def patch(self, request, pk=None):
        tipo = TipoNegocio.objects.filter(pk=pk).first()
        if not tipo:
            return Response({'error': 'Tipo de negocio no encontrado'}, status=404)

        serializer = TipoNegocioSerializer(tipo, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk=None):
        if 'Admin' not in request.user.roles.values_list('nombreRol', flat=True):
            return Response({'error': 'No tienes permiso para eliminar tipos de negocio'}, status=403)

        tipo = TipoNegocio.objects.filter(pk=pk).first()
        if not tipo:
            return Response({'error': 'Tipo de negocio no encontrado'}, status=404)

        tipo.delete()
        return Response(status=204)

class TblNegocioViewSet(APIView):
    permission_classes = [IsInRole]
    required_roles = ["Admin","SuperAdmin"]

    def get(self, request, pk=None):
        print("ENNNNNNNNNNNNNNNNNTROOOOOOOOOOOO")
        propietario_id = request.user.id

        negocio = TblNegocio.objects.get(
            propietario=propietario_id
        )
        serializer = TblNegocioSerializer(negocio)
        return Response(serializer.data)


    def patch(self, request,pk=None):
        # Solo el propietario puede modificar el negocio
        if 'Admin' not in request.user.roles.values_list('nombreRol', flat=True):
            return Response({'error': 'No tienes permiso para modificar este negocio'}, status=403)
        
        #ver todas las llaves de el objeto usuario



        negocio = TblNegocio.objects.filter(pk=pk).first()

        if not negocio:
            return Response({'error': 'Negocio no encontrado'}, status=404)

        data = request.data.copy()
        if data.get('tipoNegocio') and not data['tipoNegocio'].isdigit():
            tipo = TipoNegocio.objects.filter(nombreTipoNegocio=data['tipoNegocio']).first()
            if tipo:
                data['tipoNegocio'] = tipo.pk

        serializer = TblNegocioSerializer(negocio, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk=None):
        if 'Usuario' not in request.user.roles.values_list('nombreRol', flat=True):
            return Response({'error': 'No tienes permiso para eliminar negocios'}, status=403)

        negocio = TblNegocio.objects.filter(pk=pk).first()
        if not negocio:
            return Response({'error': 'Negocio no encontrado'}, status=404)

       
        # Return a success response
        if request.user.is_authenticated:
            usuario = request.user
        else:
            return Response({'error': 'Usuario no especificado'}, status=400)
        negocio.delete()
        return Response(status=204)

