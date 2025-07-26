# 📋 Prueba técnica - CRUD gestor de tareas

Aplicación web completa para crear, leer, actualizar y eliminar tareas con prioridad, estado y fecha de vencimiento.

---

## 🚀 Tecnologías utilizadas
- **Node.js + Express** → backend REST API
- **Sequelize** → ORM para conectarse a base de datos
- **MySQL** → base de datos relacional
- **HTML + Tailwind CSS + JavaScript** → frontend moderno y responsive

---

## 📦 Estructura del proyecto

/public → Frontend (index.html, main.js)
/src
/config → Configuración de Sequelize
/models → Modelo Task
/controllers → Controladores (CRUD)
/routes → Endpoints de API
server.js → Punto de entrada de la aplicación
README.md → Documentación
.env → Variables de entorno


---

## ✅ Funcionalidades principales
- Crear, listar, editar y eliminar tareas
- Campos: título (único, máx 150), descripción (opcional, máx 1000), prioridad, estado y fecha de vencimiento
- Filtros por prioridad y estado (persisten con localStorage)
- Estadísticas dinámicas (pendientes, en progreso, completadas)
- Visualización de urgencia cuando una tarea está por vencer (<2 días)
- Responsive (funciona en escritorio y móvil)

---

## ⚙️ Instalación y configuración

### 1️⃣ Clonar el proyecto
```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo

2️⃣ Instalar dependencias
npm install


3️⃣ Crear base de datos en MySQL
Por defecto, busca una base llamada prueba (puedes cambiarla).
Ejecuta en tu cliente MySQL / Workbench:
CREATE DATABASE prueba;

4️⃣ Configurar variables de entorno
Crea un archivo .env en la raíz:

DB_HOST=localhost
DB_NAME=prueba_db
DB_USER=tu_usuario_mysql
DB_PASS=tu_contraseña_mysql
DB_DIALECT=mysql
PORT=4000


🏁 Iniciar la aplicación
npm run dev

La API se iniciará en:
http://localhost:4000
Abre public/index.html en tu navegador para ver el frontend.

🧪 Prueba funcional de la app 📸

✅ Creación de tarea
✅ Edición de tarea
✅ Eliminación
✅ Filtros por estado y prioridad
✅ Estadísticas actualizadas

![demo](./screenshots/demo.png)


🌱 Ramas
main: versión estable

develop: rama de desarrollo donde se agregaron los campos task_id, origin_framework y user_email.

