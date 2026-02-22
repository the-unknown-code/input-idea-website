# Studio Freight Nuxt 4 Boilerplate

## Features

- ⚡️ [Nuxt 4](https://nuxt.com/) minimal setup
- 🎨 [Lenis](https://lenis.darkroom.engineering/) smooth scrolling integration
- ⏱ [Tempus](https://github.com/darkroomengineering/tempus) for performant requestAnimationFrame handling
- 📝 [Storyblok](https://www.storyblok.com/) headless CMS integration (optional)
- 🔧 Preconfigured project structure for rapid development
- 🚀 Ready for production build & deployment

Look at the [Nuxt documentation](https://nuxt.com/docs/4.x/getting-started/introduction) to learn more.

## ⚙️ App Configuration

This boilerplate includes a centralized [`app.config.ts`](./app.config.ts) file at the root of the project.  
You can use it to **control global app behavior** without editing multiple files.

### Available Options

- **General**

  - `title`: Project title
  - `ssr`: Enable/disable server-side rendering
  - `link.prefetch`: Configure Nuxt’s link prefetching strategy (`visibility` by default)

- **Storyblok (Headless CMS)**

  - `enabled`: Toggle Storyblok integration
  - `settings`: Load global settings before mount
  - `forceDraft`: Always load draft content
  - `apiOptions.region`: Configure API region (`us`, `eu`, …)

- **Three.js Integration**

  - `enabled`: Toggle WebGL renderer
  - `options`: Control renderer options (`alpha`, `antialias`, `stencil`, `depth`, `powerPreference`, …)

- **Fonts**

  - `defaults.weights`: Set available font weights
  - `families`: Configure font families and providers (Google, local, etc.)
  - `assets.prefix`: Optional asset prefix for font files

- **Design System**
  - `colors`: Base colors with automatically generated shades
  - `themes`: Predefined `light` and `dark` themes
  - `breakpoints`: Responsive layout breakpoints
  - `grid`: Grid system (`columns`, `gap`, `margin`)
  - `spacers`: Global spacing scale

✅ This makes it easy to **toggle CMS, rendering, fonts, theming, and layouts** from one place.  
You can extend this file to add your own global config values.

## 🌍 Available Environment Variables
```bash
#env
STORYBLOK_KEY=
STORYBLOK_PREVIEW_KEY=
STORYBLOK_FORCE_DRAFT=
SITE_PASSWORD=
SHOW_DEBUG=
MARKER_ID_PROJECT=
```

- **STORYBLOK_KEY**: The public API key for Storyblok content delivery. Required if Storyblok integration is enabled. Obtained from your Storyblok account settings.

- **STORYBLOK_PREVIEW_KEY**: The preview API key for accessing draft content in Storyblok. Used for preview functionality. Obtained from your Storyblok account settings.

- **STORYBLOK_FORCE_DRAFT**: If set to `true`, Storyblok will always load draft versions of content instead of published versions. Useful for development. If not included or set to `false`, published content will be loaded.

- **SHOW_DEBUG**: If set to `true`, the debug panel will render on the site. If not included or set to `false`, it won't render on the site.

- **SITE_PASSWORD**: If set, enables basic authentication on the entire site. Users will be prompted for this password before accessing any pages. If not included, the site is publicly accessible.

- **MARKER_ID_PROJECT**: Optional project identifier for Marker integration. Used for tracking and analytics purposes.

## Setup

Make sure to install dependencies:

```bash
# pnpm
pnpm install

# yarn
yarn install
```
