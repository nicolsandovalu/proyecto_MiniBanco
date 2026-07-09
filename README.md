# NamiBank - Prototipo de Banca Digital

Proyecto desarrollado con React 18, Vite y Firebase (Auth y Firestore). 
Implementa arquitectura reactiva, suscripciones en tiempo real (`onSnapshot`) y transaccionalidad atómica (`runTransaction`).


## 🚀 Instalación y ejecución local

1. Clonar el repositorio.
2. Instalar las dependencias ejecutando: `npm install`
3. Crear un archivo llamado `.env` en la raíz del proyecto (basado en el `.env.example`), e ingresar la API Key que entrega la consola de Firebase.
4. Levantar el servidor de desarrollo: `npm run dev`
5. Para obtener tus credenciales, ve a la Consola de Firebase:

* Selecciona tu proyecto.
* Haz clic en el ícono de engranaje (Configuración del proyecto) en la parte superior izquierda.
* Desplázate hasta la sección "Tus apps" y selecciona tu aplicación web (si no tienes una, crea una haciendo clic en el ícono de </>).
* En la sección "Configuración del SDK y configuración", selecciona la opción Firebase SDK snippet -> Configuración.
* Copia los valores de apiKey, authDomain, projectId, storageBucket, messagingSenderId y appId.
* Pega estos valores en tu archivo `.env` siguiendo el formato de `.env.example`

## 👥 Usuarios de prueba
Se han creado cuentas preconfiguradas con saldo para evaluar las transferencias sin necesidad de registrarse:

* **Usuario 1:** `nicol@namibank.cl` / Contraseña: `prueba123`
* **Usuario 2:** `evaluador@namibank.cl` / Contraseña: `prueba123`

## 📊 Modelo de datos (Firestore)

El proyecto utiliza bases de datos NoSQL con las siguientes colecciones:

* `users/{uid}`: `{ nombre: string, email: string, saldo: number }`
* `movimientos/{id}`: `{ emisorUid: string, emisorNombre: string, emisorEmail: string, receptorUid: string, receptorNombre: string, receptorEmail: string, monto: number, fecha: timestamp_ISO, participantes: array[uid] }`

## 🤖 Declaración de uso de IA

Se utilizó inteligencia artificial (Gemini) principalmente como un par programador ("Rubber Duck Debugging"). Le pedí ayuda para estructurar de manera óptima la lógica de `runTransaction` (para asegurar la atomicidad de las transferencias en el backend) y para generar una paleta de colores CSS que simulara la identidad de un banco real sin usar `!important`. Tuve que corregir y ajustar manualmente la gestión de estados y las validaciones de los componentes para asegurarme de que el `App.jsx` orquestara correctamente los montajes y desmontajes.
