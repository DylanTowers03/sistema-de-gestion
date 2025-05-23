# Generated by Django 5.2 on 2025-05-06 17:04

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('negocios', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Gasto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('descripcion', models.CharField(max_length=255)),
                ('monto', models.DecimalField(decimal_places=2, max_digits=10)),
                ('fecha', models.DateField()),
                ('negocio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='negocios.tblnegocio')),
            ],
        ),
    ]
