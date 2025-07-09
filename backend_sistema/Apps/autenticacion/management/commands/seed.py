from django.core.management.base import BaseCommand
from Apps.autenticacion.models import ( Rol )

class Command(BaseCommand):
    help = 'Seed the database with initial roles'

    def handle(self, *args, **kwargs):
        roles = [
            {'nombreRol': 'Admin'},
            {'nombreRol': 'Moderador'},
            {'nombreRol': 'Usuario'},
        ]

        for role in roles:
            Rol.objects.get_or_create(**role)

        self.stdout.write(self.style.SUCCESS('Roles seeded successfully'))