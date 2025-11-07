# 🗳️ Visualización de Datos Electorales – Frontend

Interfaz web desarrollada para el **Tribunal Electoral de Panamá**, que permite visualizar de forma interactiva la evolución de los resultados electorales a lo largo de la historia democrática del país.  

---

## 🧠 Descripción general

El frontend muestra tres vistas principales:

1. **Landing Page**  
   Explica la historia de Panamá desde la vuelta a la democracia y el rol del Tribunal Electoral.

2. **Vista de Datos Electorales (Core)**  
   Permite explorar resultados del **Ejecutivo** o **Legislativo** por año, con tres tipos de gráficos:
   - Barras
   - Pie Chart
   - Hemiciclo
   - Mapa de Panamá por provincia

3. **Página de Contacto**  
   Información institucional y formulario básico.

---

## 📁 Estructura del proyecto

/frontend
├── src/
│ ├── components/ # Componentes reutilizables
│ ├── pages/ # Rutas principales
│ │ ├── index.tsx # Landing
│ │ ├── datos.tsx # Vista principal de datos
│ │ └── contacto.tsx # Página de contacto
│ ├── data/ # Datos locales (mock)
│ ├── hooks/ # Custom hooks
│ ├── styles/ # Tailwind y estilos globales
│ └── utils/ # Funciones auxiliares
├── public/ # Archivos estáticos (mapas, logos)
├── package.json
└── README.md


---

## ⚙️ Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar entorno de desarrollo
npm run dev

# Abrir en el navegador
http://localhost:3000


