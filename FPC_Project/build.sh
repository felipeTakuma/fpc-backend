#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

# CREACIÓN FORZADA DE SUPERUSUARIO (Directo en el script)
python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='admin_takuma').exists() or User.objects.create_superuser('admin_takuma', 'paezrinconfelipe@gmail.com', 'takumafpc')"

# CARGA DE DATOS (Asegurando la ruta)
python manage.py loaddata iniciales.json