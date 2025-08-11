from django.core.management.base import BaseCommand
from Apps.autenticacion.models import ( Rol )
from Apps.autenticacion.models import Usuario,UsuarioHasRol
class Command(BaseCommand):
    help = 'Seed the database with initial roles'

    def handle(self, *args, **kwargs):
        roles = [
            {'nombreRol': 'SuperAdmin'},
            {'nombreRol': 'Admin'},
            {'nombreRol': 'Moderador'},
            {'nombreRol': 'Usuario'},
        ]

        for role in roles:
            Rol.objects.get_or_create(**role)

        #create the superadmin user

        super_admin_user = Usuario.objects.create_user(
            correo='SuperAdmin2@localhost.com',
            nombre='SuperAdmin',
            apellido='SuperAdmin',
            password='12345678',
            is_superuser=True,
            is_staff=True,
        )

        SuperAdminRol = Rol.objects.get_or_create(nombreRol='SuperAdmin')[0]


        UsuarioHasRol.objects.create(
            usuario=super_admin_user,
            rol=SuperAdminRol
        )

        self.stdout.write(self.style.SUCCESS('Roles seeded successfully'))