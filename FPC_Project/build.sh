#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

# Crea el superusuario usando las variables de entorno de Render
if [ "$CREATE_SUPERUSER" ]; then
  python manage.py createsuperuser --no-input || true
fi

# Carga los datos si el archivo existe
if [ -f iniciales.json ]; then
  python manage.py loaddata iniciales.json
fi