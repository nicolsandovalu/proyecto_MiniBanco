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

# 🏦 NamiBank - Evaluación 3 (testing y cobertura)

NamiBank es una aplicación bancaria interactiva desarrollada con React. En esta fase del proyecto, se ha implementado una arquitectura orientada a la testeabilidad, integrando una suite completa de pruebas unitarias y de componentes.

## 🛠️ Stack tecnológico de testing
* **Runner:** Vitest (nativo de Vite)
* **Entorno:** JSDOM
* **Librerías:** `@testing-library/react` y `@testing-library/user-event`
* **Cobertura:** `@vitest/coverage-v8`

---

## 🚀 Instrucciones de ejecución

Para evaluar la suite de pruebas localmente, asegúrate de haber instalado las dependencias primero (`npm install`).

1. **Ejecutar la suite de pruebas (Modo Interactivo):**
   ``` bash
   npm test
   ```
Generar el reporte de Cobertura de Código:

``` bash
npm run coverage
```

## 📊 Reporte de cobertura (Code Coverage)
La suite de pruebas consta de 21 tests en total, abarcando lógica pura, renderizado de componentes y flujos de usuario aislados de Firebase. El proyecto supera exitosamente el 70% de cobertura mínima requerida en todas sus métricas críticas:

 % Coverage report from v8
-------------------------|---------|----------|---------|---------|
File                     | % Stmts | % Branch | % Funcs | % Lines |
-------------------------|---------|----------|---------|---------|
All files                |   81.81 |    84.53 |      80 |   82.56 |
 components              |   88.76 |    90.14 |   90.47 |   91.35 |
  Auth.jsx               |   91.42 |    86.95 |      80 |   93.54 |
  TransactionHistory.jsx |   92.85 |    94.44 |     100 |     100 |
  TransferForm.jsx       |   80.76 |    83.33 |     100 |   80.76 |
 context                 |   14.28 |        0 |       0 |   14.28 |
  BankContext.jsx        |   14.28 |        0 |       0 |   14.28 |
 utils                   |     100 |      100 |     100 |     100 |
  validations.js         |     100 |      100 |     100 |     100 |
-------------------------|---------|----------|---------|---------|
(Nota: El archivo BankContext.jsx mantiene intencionalmente un bajo porcentaje de cobertura debido a que las buenas prácticas de testing de componentes exigen aislar (mockear) el estado global para probar los componentes unitariamente).

## 🏗️ Refactorización para testeabilidad
Para cumplir con los principios de código limpio y facilitar las pruebas unitarias, se realizaron las siguientes refactorizaciones:

Extracción de Lógica Pura (RT2): Se extrajo todo el bloque de validaciones condicionales que vivía originalmente dentro del componente TransferForm.jsx hacia un archivo de funciones puras (src/utils/validations.js).

Beneficio: Esto permitió aislar la lógica de negocio de la UI, permitiendo una validación exhaustiva de los casos borde (montos negativos, validación de regex para correos, cero, decimales) utilizando parametrización de pruebas (it.each) sin necesidad de renderizar React ni invocar servicios.

## 🤖 Declaración de uso de IA en el desarrollo
Durante la configuración y desarrollo de la suite de testing, se utilizó Inteligencia Artificial (Gemini) como copiloto y asistente de configuración, aplicando pensamiento crítico para su integración final:

¿Qué le pedí a la IA? Soporte para estructurar la configuración base en vite.config.js (habilitar jsdom) y la sintaxis correcta para la implementación de los Mocks (vi.mock y vi.spyOn). Esto fue vital para aislar la base de datos de Firebase y evitar el error crítico de Invalid Hook Call al testear los componentes que consumían el Contexto de React.

¿Qué tuve que corregir manualmente? Durante el desarrollo del test de lógica pura, la IA sugirió inicialmente una validación de campos vacíos basada en la coerción de tipos de JavaScript (if (!amount)). Al ejecutar el test para validar el monto de $0, este falló inesperadamente arrojando el mensaje de "campos vacíos". Analizando el error, deduje que JavaScript evaluaba el número 0 como un valor falsy, provocando un falso positivo. Descarté la sugerencia original y refactoricé la validación manualmente usando comprobación estricta (if (amount === "" || amount === undefined)), logrando así que el comportamiento esperado fuera exacto y el test pasara en verde (100% de cobertura en ramas).