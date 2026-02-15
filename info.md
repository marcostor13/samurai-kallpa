# SAMURAI KALLPA: PLATAFORMA DE ALTO RENDIMIENTO (MASTER PLAN)

## 1. Visión y Filosofía
**Proyecto:** Plataforma de gestión de crecimiento y "Futuros Imposibles" para el **Equipo Samurai Kallpa (Grupo 23 de Perú)**.
**Concepto Visual:** "Cyber-Andean Antigravity". Una fusión entre el Bushido Japonés, el Misticismo Andino y una estética futurista flotante.

> **Filosofía del Equipo:** "Somos fuerza y disciplina, con la determinación de un Samurai para transformar e impactar vidas."

---

## 2. Design System & UX/UI Guidelines
**Versión:** 1.0 | **Estilo:** Sharp, High-Contrast, Floating.

### 2.1. Paleta de Colores (Theme Configuration)
El diseño prioriza el **Dark Mode**. Nunca usar negro puro (#000), usar `Samurai Ink`.

| Nombre Variable | Hex | Uso UI |
| :--- | :--- | :--- |
| **Kallpa Gold** | `#FFD700` | **Brand Core.** Botones primarios (CTA), Textos clave, Iconos activos. |
| **Samurai Ink** | `#0A0A0A` | **Fondo Global.** Base de la aplicación. |
| **Obsidian Gray** | `#1A1A1A` | **Superficies.** Tarjetas (Cards), Modales, Sidebars, Inputs. |
| **Andean Fire** | `#FF4500` | **Accent.** Hover states, Bordes brillantes (Glow), Notificaciones, Gradientes. |
| **Inca Teal** | `#008B8B` | **Secondary.** Enlaces, Decoración sutil, Elementos informativos. |
| **Mountain Green**| `#228B22` | **Success.** Mensajes de éxito, Estados "Online", Progreso completado. |
| **Titanium White**| `#F5F5F5` | **Texto Principal.** Títulos (Headings). |
| **Ash Grey** | `#B0B0B0` | **Texto Secundario.** Párrafos, descripciones. |

### 2.2. Tipografía
* **Títulos (Headings):** `Cinzel` o `Trajan Pro`.
    * *Estilo:* Serifas afiladas, estructura clásica.
    * *Uso:* Mayúsculas (UPPERCASE) o Capitalize. Pesos 700/900.
* **Cuerpo (Body):** `Montserrat`.
    * *Estilo:* Geométrica, moderna, legible.
    * *Uso:* Interfaz general. Pesos 400/500/600.

### 2.3. Elementos Gráficos & UI Kit
* **Botones (Katana Cut):** Rectangulares con un corte diagonal en la esquina superior derecha (chamfered edge) o bordes rectos (radius 2px). NUNCA redondeados suaves.
* **Tarjetas (Antigravity):** Fondo `Obsidian Gray`, borde sutil `Charcoal` (#333). Al hacer Hover: elevación (`translateY`) + borde brillante (`Andean Fire` o `Gold`).
* **Texturas:** Patrón de "Chakana" con opacidad 5% sobre fondo.
* **Efectos:** Glassmorphism oscuro (`backdrop-blur`) en la navegación y modales.

### 2.4. Configuración Técnica (Tailwind CSS)
Copia esta configuración exacta en `tailwind.config.mjs`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        kallpa: {
          gold: '#FFD700',
          fire: '#FF4500',
          teal: '#008B8B',
          dark: '#0A0A0A',
          surface: '#1A1A1A',
          text: '#F5F5F5',
          muted: '#B0B0B0'
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        display: ['Cinzel', 'serif'],
      },
      boxShadow: {
        'fire-glow': '0 0 20px rgba(255, 69, 0, 0.5)',
        'gold-glow': '0 0 15px rgba(255, 215, 0, 0.4)',
      },
      backgroundImage: {
        'chakana-pattern': "url('/assets/chakana-pattern.png')", // Crear asset SVG/PNG
      }
    }
  },
  plugins: [],
}
## 3. Stack Tecnológico
- **Frontend:** Astro (Performance & Routing) + React (Componentes Interactivos) + TailwindCSS.
- **Backend:** NestJS (API REST).
- **Base de Datos:** MongoDB (Mongoose ORM).
- **Auth:** JWT (JSON Web Tokens).
- **Storage:** Cloudinary o S3 (para evidencias multimedia).
- **Testing:** Jest (Backend) & Vitest (Frontend).

## 4. Arquitectura Backend: "Agents & Skills"
El sistema backend NO usa la nomenclatura estándar (Controller/Service). Se organiza conceptualmente en Agentes que poseen Habilidades (Skills).

### Estructura de Directorios Sugerida
- `/src/agents` (Módulos y Controladores)
- `/src/skills` (Servicios / Lógica de Negocio)

### Definición de Agentes
#### AuthAgent (El Guardián)
- **Skill:** `gatekeeper` (Validar credenciales, Login).
- **Skill:** `tokenForge` (Generar y verificar JWT).
- **Skill:** `shield` (Guardias de autenticación para rutas protegidas).

#### SamuraiAgent (Gestor de Usuarios)
- **Skill:** `identityManager` (Registro, Ver perfil, Editar Bio/Avatar).
- **Skill:** `dashboardOracle` (Agregar data agregada para el dashboard personal).

#### FutureAgent (Gestor de Metas)
- **Skill:** `visionArchitect` (Crear un nuevo "Futuro Imposible").
- **Skill:** `evidenceCollector` (Subir fotos/videos/texto a una meta específica).
- **Skill:** `progressTracker` (Actualizar % de avance y recalcular el estado).

#### TribeAgent (Gestor Comunitario)
- **Skill:** `chronicleKeeper` (Publicar recursos compartidos para el equipo).
- **Skill:** `feedBroadcaster` (Listar recursos y miembros para la vista pública).

## 5. Modelado de Datos (MongoDB Schemas)

### User (Collection: `samurais`)
```typescript
{
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Hashed
  fullName: { type: String, required: true },
  role: { type: String, enum: ['WARRIOR', 'SENSEI'], default: 'WARRIOR' },
  bio: String,
  avatarUrl: String,
  joinedAt: { type: Date, default: Date.now }
}
```

### ImpossibleFuture (Collection: `futures`)
```typescript
{
  samuraiId: { type: Schema.Types.ObjectId, ref: 'Samurai', required: true },
  title: { type: String, required: true },
  description: String,
  progressPercentage: { type: Number, min: 0, max: 100, default: 0 },
  status: { type: String, enum: ['IN_PROGRESS', 'ACHIEVED', 'FAILED'], default: 'IN_PROGRESS' },
  evidences: [{
    type: { type: String, enum: ['IMAGE', 'VIDEO', 'TEXT'] },
    url: String, // URL del archivo multimedia
    content: String, // Texto de la evidencia
    uploadedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
}
```

### TribeResource (Collection: `resources`)
```typescript
{
  title: String,
  type: { type: String, enum: ['DOCUMENT', 'MEDIA', 'ANNOUNCEMENT'] },
  url: String,
  content: String,
  authorId: { type: Schema.Types.ObjectId, ref: 'Samurai' },
  createdAt: { type: Date, default: Date.now }
}
```

## 6. Estructura de Páginas Frontend (Astro)

### A. Landing Page (`/`) - Pública
- **Hero Section:** Título "SAMURAI KALLPA" animado. Fondo oscuro con partículas doradas.
- **Filosofía:** Card flotante con efecto Glass mostrando: "Somos fuerza y disciplina...".
- **El Equipo:** Grid de los integrantes (Nombre + Foto).
- **Acceso:** Botón "Ingresar al Dojo" (Login).

### B. Dashboard Personal (`/dashboard`) - Privada (JWT)
- **Header:** Saludo al usuario + Botón Logout.
- **Resumen de Poder:** Gráfico circular (Radial Chart) mostrando el promedio total de avance de todos sus Futuros Imposibles.
- **Gestión de Futuros:**
    - Botón "Declarar Futuro" (Crear nuevo).
    - Lista de tarjetas expandibles.
    - **Vista Expandida:** Permite ver evidencias anteriores, subir nuevas (drag & drop) y slider para actualizar el %.

### C. Recursos de la Tribu (`/tribu`) - Privada/Pública (Configurable)
- **Muro:** Layout tipo Masonry (Ladrillos) con recursos.
- **Cada recurso:** es una tarjeta con estilo Cyber-Andean.

## 7. Quality Assurance (Bushido Code)
> "Una katana sin afilar no sirve para la batalla."

El código debe ser robusto y confiable. Se requieren pruebas unitarias obligatorias.

### Backend (NestJS + Jest)
- **Scope:**
    - **Skills (Services):** 100% de cobertura lógica. Mockear repositorios de Mongoose.
    - **Agents (Controllers):** Verificar rutas, códigos de estado HTTP y validación de DTOs.
- **Naming:** Los archivos de test deben seguir el patrón `nombre.skill.spec.ts` o `nombre.agent.spec.ts`.

### Frontend (Astro/React + Vitest)
- **Scope:**
    - Componentes complejos de lógica (ej. Cálculo de porcentajes en el Dashboard).
    - Hooks personalizados de autenticación.
    - **Snapshot Testing:** Verificar que los componentes visuales clave (Cards, Botones) mantengan la estética Antigravity.

## 8. Instrucciones para la IA (Developer Prompt)
Copia y pega esto para iniciar el desarrollo:

> "Actúa como un Senior Full Stack Developer experto en Astro, NestJS y MongoDB.
> Tu misión es construir la plataforma 'Samurai Kallpa' siguiendo estrictamente el plan maestro adjunto.
>
> **Directrices de Implementación:**
>
> 1. **Estética (Non-negotiable):** Debes implementar el Design System 'Cyber-Andean' detallado en la sección 2. Usa la configuración de Tailwind provista. Los componentes deben sentirse 'afilados' (sharp edges) y 'flotantes' (antigravity/glassmorphism).
> 2. **Arquitectura Backend:** Implementa NestJS usando el patrón Agents & Skills en lugar de Controller/Service estándar.
>     - *Ejemplo:* AuthAgent (Controller) usa AuthSkill (Provider).
> 3. **Calidad (Testing):** Escribe pruebas unitarias (Jest) para cada 'Skill' crítica antes de finalizar la tarea. El código sin pruebas no será aceptado.
> 4. **Funcionalidad:**
>     - Autenticación JWT robusta.
>     - CRUD completo de 'Futuros Imposibles' con subida de evidencias.
>     - Cálculo automático del promedio de avance en el Dashboard.
> 5. **Base de Datos:** Configura los esquemas de Mongoose tal como se definen en la sección 5.
>
> Empieza creando la estructura del proyecto NestJS, configurando Jest para la arquitectura Agents/Skills, y creando el AuthAgent."