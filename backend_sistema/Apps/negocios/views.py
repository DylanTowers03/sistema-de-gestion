from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from Apps.negocios.models import TipoNegocio, TblNegocio, UsuarioNegocio
from Apps.negocios.serializers import TipoNegocioSerializer, TblNegocioSerializer, UsuarioNegocioSerializer
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
    required_roles = ["Admin", "Moderador", "Usuario"]

    def post(self, request):
        data = request.data.copy()

        # Convertir tipoNegocio a PK si se recibe como nombre
        if data.get('tipoNegocio') and not data['tipoNegocio'].isdigit():
            tipo = TipoNegocio.objects.filter(nombreTipoNegocio=data['tipoNegocio']).first()
            if tipo:
                data['tipoNegocio'] = tipo.pk
        #fechaCreacion is equal to now
        data['fechaCreacion'] = timezone.now().date()
        serializer = TblNegocioSerializer(data=data)

        #its convenient create a register in usuario negocio after create a negocio

        if serializer.is_valid():
            serializer.save()
            if request.user.is_authenticated:
                usuario = request.user
                negocio = TblNegocio.objects.get(pk=serializer.data['id'])
                UsuarioNegocio.objects.create(usuario=usuario, negocio=negocio)
            else:
                return Response({'error': 'Usuario no especificado'}, status=400)
            # Return the created negocio
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request, pk=None):
        if pk is not None:
            negocio = TblNegocio.objects.filter(pk=pk).first()
            if not negocio:
                return Response({'error': 'Negocio no encontrado'}, status=404)
            serializer = TblNegocioSerializer(negocio)
            return Response(serializer.data)

        negocios = TblNegocio.objects.all()
        serializer = TblNegocioSerializer(negocios, many=True)
        return Response(serializer.data)

    def patch(self, request, pk=None):
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
            UsuarioNegocio.objects.filter(usuario=usuario, negocio=negocio).delete()
        else:
            return Response({'error': 'Usuario no especificado'}, status=400)
        negocio.delete()
        return Response(status=204)

class UsuarioNegocioViewSet(APIView):
    permission_classes = [IsInRole]
    required_roles = ["Admin", "Moderador", "Usuario"]

    def post(self, request):
        serializer = UsuarioNegocioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def get(self, request, pk=None):
        print("pk", pk)
        if pk is not None:
            rel = UsuarioNegocio.objects.filter(usuario=pk).first()
            if not rel:
                return Response([])

            negocios_pk = TblNegocio.objects.filter(usuarionegocio__usuario=pk).values_list('pk', flat=True)

            serializer = TblNegocioSerializer(TblNegocio.objects.filter(pk__in=negocios_pk), many=True)
            
            print("serializer", serializer.data)
            return Response(serializer.data)
        #if pk is None return error
        return Response({'error': 'pk is None'}, status=400)

    def patch(self, request, pk=None):
        
        rel = UsuarioNegocio.objects.filter(pk=pk).first()
        if not rel:
            return Response({'error': 'Relación usuario-negocio no encontrada'}, status=404)

        serializer = UsuarioNegocioSerializer(rel, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk=None):
        if 'Admin' not in request.user.roles.values_list('nombreRol', flat=True):
            return Response({'error': 'No tienes permiso para eliminar relaciones'}, status=403)

        rel = UsuarioNegocio.objects.filter(pk=pk).first()
        if not rel:
            return Response({'error': 'Relación usuario-negocio no encontrada'}, status=404)

        rel.delete()
        return Response(status=204)
