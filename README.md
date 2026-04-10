# FPC AI Predict - Plataforma de Análisis e IA

**FPC AI Predict** es una aplicación Full-Stack diseñada para centralizar el análisis, estadísticas y predicciones del Fútbol Profesional Colombiano. Utiliza Inteligencia Artificial para pronosticar resultados y APIs en tiempo real para mantener la actualidad deportiva.

## Características Principales
- **🤖 Predicción con IA:** Modelo de *Random Forest* entrenado para predecir victorias, empates o derrotas, ademas, Pandas encargado de hacer el tratamiento correcto a los datos.
- **📰 Breaking News:** Integración con GNews API para noticias automáticas del FPC.
- **🗺️ Geolocalización:** Mapas interactivos de estadios usando Leaflet (Dark Mode).
- **🎨 Interfaz Premium:** Diseño moderno basado en *Glassmorphism* con Tailwind CSS.
- **🔍 Buscador Global:** Filtros avanzados por equipos y jugadores conectados a DB.

## Tecnologías Usadas
- **Frontend:** React.js, Tailwind CSS, Axios, React-Leaflet.
- **Backend:** Django, Django REST Framework (DRF).
- **IA:** Scikit-learn (Random Forest), Pandas.
- **API Externa:** GNews API.

## Instalación
1. Clonar el repositorio.
2. **Backend:** Instalar dependencias (`pip install -r requirements.txt`) y correr `python manage.py runserver`.
3. **Frontend:** Instalar dependencias (`npm install`) y correr `npm start`.

---
Desarrollado por **Brandon Felipe Rincón Páez** - Desarrollador de software.