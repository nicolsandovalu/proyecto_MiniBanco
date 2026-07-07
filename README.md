# NamiBank - Prototipo de Banca Digital SPA

Proyecto desarrollado con React 18, Vite y Firebase (Auth y Firestore). 
Implementa arquitectura reactiva, suscripciones en tiempo real (`onSnapshot`) y transaccionalidad atómica (`runTransaction`).

## 🚀 Instalación y Ejecución Local

1. Clonar el repositorio.
2. Instalar las dependencias ejecutando: `npm install`
3. Crear un archivo llamado `.env` en la raíz del proyecto (basado en el `.env.example` o contactando al desarrollador por las credenciales).
4. Levantar el servidor de desarrollo: `npm run dev`

## 👥 Usuarios de Prueba para el Profesor
Se han creado cuentas preconfiguradas con saldo para evaluar las transferencias sin necesidad de registrarse:

* **Usuario 1:** `nicol@namibank.cl` / Contraseña: `prueba123`
* **Usuario 2:** `evaluador@namibank.cl` / Contraseña: `prueba123`

## 📊 Modelo de Datos (Firestore)

El proyecto utiliza bases de datos NoSQL con las siguientes colecciones:

* `users/{uid}`: `{ nombre: string, email: string, saldo: number }`
* `movimientos/{id}`: `{ emisorUid: string, emisorNombre: string, emisorEmail: string, receptorUid: string, receptorNombre: string, receptorEmail: string, monto: number, fecha: timestamp_ISO, participantes: array[uid] }`

## 🤖 Declaración de Uso de IA

Se utilizó inteligencia artificial (Gemini) principalmente como un par programador ("Rubber Duck Debugging"). Le pedí ayuda para estructurar de manera óptima la lógica de `runTransaction` (para asegurar la atomicidad de las transferencias en el backend) y para generar una paleta de colores CSS que simulara la identidad de un banco real sin usar `!important`. Tuve que corregir y ajustar manualmente la gestión de estados y las validaciones de los componentes para asegurarme de que el `App.jsx` orquestara correctamente los montajes y desmontajes.