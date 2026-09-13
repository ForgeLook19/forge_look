# Forge_Look MVC

Landing page estática organizada con el patrón MVC usando JavaScript vanilla.

## Estructura

- `index.html`: acceso de compatibilidad que redirige a la landing.
- `forge_look_landing_page.html`: punto de entrada y contenedores de la interfaz.
- `src/models/app-model.js`: estado y datos de negocio.
- `src/views/app-view.js`: renderizado HTML; no registra eventos ni modifica el estado.
- `src/controllers/app-controller.js`: eventos y acciones del usuario; coordina Modelo y Vista.
- `src/styles/app.css`: estilos CSS propios.

## Flujo MVC

1. El controlador inicia la página y solicita a la vista renderizar sus secciones.
2. La vista lee los datos del modelo y construye el HTML de cada contenedor.
3. Las interacciones (menú, carrusel y formulario) actualizan el modelo mediante el controlador y se vuelve a renderizar solo la parte necesaria.

## Comprobaciones realizadas

- Ejecuta `npm test` para validar el renderizado MVC, el selector de soluciones y la conservación segura del borrador.
- Ejecuta `npm run build` después de instalar dependencias. Genera el CSS de Tailwind y copia Font Awesome e Inter como recursos locales.
- Tras compilar, Tailwind, Font Awesome y la tipografía Inter funcionan sin conexión. WhatsApp seguirá necesitando conectividad y un número válido, porque abre un servicio externo.

## Desarrollo

Requiere Node.js. Ejecuta:

```bash
npm run dev
```

Después abre `http://localhost:3001/forge_look_landing_page.html`.

No abras `forge_look_landing_page.html` directamente con doble clic (`file:///...`):
la aplicación usa módulos de JavaScript y el navegador los bloquea fuera de un
servidor HTTP.

## Despliegue estático

Ejecuta `npm run build:dist`. La carpeta `dist/` contiene únicamente `index.html`,
`forge_look_landing_page.html` y `src/` con los recursos ya compilados. Sube el
contenido de esa carpeta a Supabase Storage y sírvelo mediante HTTP(S); no abras
el HTML directamente con el protocolo `file://`, porque los módulos ES requieren
un servidor web.

Los scripts `build:assets` y `build:dist` ahora son multiplataforma (Node.js,
`scripts/*.mjs`) para poder compilar tanto en Windows como en Linux/macOS y en
GitHub Actions. Las versiones antiguas en PowerShell siguen disponibles como
`build:assets:windows` y `build:dist:windows` por si las prefieres en Windows.

## Publicar en GitHub

```bash
git init
git add .
git commit -m "Primer commit: landing Forge_Look"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

Crea antes el repositorio vacío en GitHub (sin README ni .gitignore, para
evitar conflictos) y reemplaza la URL del `remote` por la tuya.

## Subir a Supabase

### 1. Hosting del sitio estático (Supabase Storage) — listo ahora

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En **Project Settings → API** copia la `URL` del proyecto y la
   `service_role key` (secreta, nunca la publiques).
3. Localmente, exporta esas variables y sube `dist/`:
   ```bash
   npm run build:dist
   SUPABASE_URL=https://tu-proyecto.supabase.co \
   SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key \
   SUPABASE_BUCKET=forge-look-site \
   npm run deploy:supabase
   ```
   El script crea el bucket (público) si no existe y sube todos los
   archivos de `dist/` conservando la estructura de carpetas.
4. **Despliegue automático:** en GitHub, ve a `Settings → Secrets and
   variables → Actions` y crea los secrets `SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY` y `SUPABASE_BUCKET`. Cada `git push` a
   `main` compilará y desplegará solo con el workflow
   `.github/workflows/deploy-supabase.yml`.

### 2. Backend real (próxima actualización) — ya preparado, aún no conectado

Para cuando quieras guardar en una base de datos las ideas que la gente
escribe en el formulario "¿Tienes una idea...?":

- `supabase/migrations/0001_create_leads_table.sql` crea la tabla `leads`
  con Row Level Security (solo permite `insert` público, no lectura).
  Aplícala desde el SQL Editor de Supabase o con la Supabase CLI
  (`supabase db push`).
- `src/config/supabase-config.example.js` → cópialo como
  `supabase-config.js` (ya está en `.gitignore`) con tu `url` y `anonKey`
  públicas.
- `src/services/supabase-client.js` ya tiene la función `saveLead()`
  lista para usar; solo falta llamarla desde
  `src/controllers/app-controller.js` en `sendIdeaToWhatsApp()` cuando
  decidas activar esta funcionalidad.
