# Generated by Django 5.1.1 on 2024-12-12 20:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('students', '0004_alter_student_department'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='department',
            field=models.ForeignKey(default=2, on_delete=django.db.models.deletion.CASCADE, to='students.department'),
            preserve_default=False,
        ),
    ]
