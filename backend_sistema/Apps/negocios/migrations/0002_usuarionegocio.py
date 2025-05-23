# Generated by Django 5.2 on 2025-05-06 17:04

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('autenticacion', '0001_initial'),
        ('negocios', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='UsuarioNegocio',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('negocio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='negocios.tblnegocio')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='autenticacion.usuario')),
            ],
            options={
                'db_table': 'tbl_negocio_has_Usuario',
            },
        ),
    ]
