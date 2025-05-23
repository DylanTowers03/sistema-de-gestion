# Generated by Django 5.2 on 2025-05-02 23:28

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Recurso',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombreRecurso', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Rol',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombreRol', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Usuario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=200)),
                ('apellido', models.CharField(max_length=200)),
                ('correo', models.CharField(max_length=255)),
                ('telefono', models.CharField(max_length=20)),
                ('password', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='RecursoHasRol',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('recurso', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='autenticacion.recurso')),
                ('rol', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='autenticacion.rol')),
            ],
        ),
        migrations.CreateModel(
            name='UsuarioHasRol',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rol', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='autenticacion.rol')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='autenticacion.usuario')),
            ],
        ),
        migrations.AddField(
            model_name='usuario',
            name='roles',
            field=models.ManyToManyField(through='autenticacion.UsuarioHasRol', to='autenticacion.rol'),
        ),
    ]
