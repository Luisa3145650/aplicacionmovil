# Dashboard de Tareas Colaborativas (Offline-First)

Aplicación móvil construida en React Native diseñada para la gestión de tareas con soporte completo para funcionamiento sin conexión (Offline-First). 

## Arquitectura de la Aplicación

La aplicación sigue una **Clean Architecture** estructurada en módulos (`core`, `features`, `shared`) para garantizar la mantenibilidad y escalabilidad del código.

### Offline-First con WatermelonDB
El corazón de la aplicación es **WatermelonDB**. Esta base de datos local SQLite está optimizada para React Native mediante un enfoque reactivo.
1. **Lectura Exclusiva**: La UI nunca lee directamente de la API. Todo componente de UI (usando el HOC `@withObservables`) se suscribe a la base de datos local.
2. **Sincronización**: Cuando la app inicia, o cuando el usuario hace un Pull-to-Refresh, el módulo de sincronización envía los cambios pendientes hacia la API y luego reconcilia los datos de la API hacia la base de datos local mediante operaciones en lote (`batch`), garantizando un alto rendimiento.

### Gestor de Estado Global
Se utiliza **Zustand** para mantener un estado de la UI ligero y predecible (filtros de tareas y estado general de la UI).

### Módulos Nativos (Requisito Senior)
Se integró un módulo nativo `AvatarView` implementado en **Swift** (iOS) y **Kotlin** (Android). Este componente recibe un `name` desde JavaScript, calcula un color dinámico usando operaciones Hash y extrae las iniciales para renderizar la vista de forma 100% nativa.

---

## Instrucciones de Instalación

1. **Clonar el repositorio y entrar al directorio:**
   ```bash
   git clone <repo-url>
   cd Aplicacionmovil
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   # o si usas yarn
   yarn install
   ```

3. **Configuración Nativa (WatermelonDB & AvatarView)**
   Para iOS, instala los pods:
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Ejecutar la aplicación:**
   **Para Android:**
   ```bash
   npx react-native run-android
   ```
   **Para iOS:**
   ```bash
   npx react-native run-ios
   ```

---

## Pruebas Unitarias
El proyecto cuenta con pruebas unitarias implementadas en **Jest** para la lógica central de negocio (Sincronización).
Para correr las pruebas:
```bash
npm run test
```
Las pruebas validan que los cambios encolados localmente se envíen al servidor y que los nuevos registros se ingresen adecuadamente vía un WatermelonDB `batch`.

---

## Uso de IA
- Herramienta: Claude (Anthropic)
- Tareas asistidas: generación de modelos WatermelonDB, lógica de sync, 
  estructura del store Zustand, bridge del componente nativo
- Supervisión humana: revisión de tipos TypeScript, ajuste de la lógica 
  offline-first, integración entre capas, corrección de errores de decoradores
