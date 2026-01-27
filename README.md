# Wishlist Dock Widget

A wishlist widget that can be embedded on any page as a Web Component. Built with React but ships as a single JS file with full Shadow DOM isolation.

## Features

- Floating dock with minimized/expanded states
- Organize items into "stacks" (collections)
- Tinder-style card swiping
- Drag & drop cards between stacks
- Light/dark theme
- Works on mobile and desktop

## Usage

Drop the script on any page:

```html
<script src="wishlist-dock.js"></script>
<wishlist-dock theme="light"></wishlist-dock>
```

### Attributes

| Attribute  | Default           | Description                                          |
| ---------- | ----------------- | ---------------------------------------------------- |
| `theme`    | `"light"`         | `"light"` or `"dark"`                                |
| `position` | `"bottom-center"` | `"bottom-center"`, `"bottom-left"`, `"bottom-right"` |
| `open`     | -                 | Add to start expanded                                |

### JavaScript API

```javascript
const widget = document.querySelector("wishlist-dock");

widget.theme = "dark";
widget.open = true;

widget.openDock();
widget.closeDock();
widget.toggle();
widget.getStacks();

await widget.addCard({
  name: "My Item",
  description: "Optional",
  coverUrl: "https://example.com/image.jpg",
  stackId: "optional",
});
```

### Events

```javascript
widget.addEventListener("dock-ready", () => {
  // Widget ready
});

widget.addEventListener("theme-changed", (e) => {
  console.log(e.detail.theme);
});
```

## Development

```bash
npm install
npm run dev           # Dev server
npm run build:widget  # Build widget → dist/wishlist-dock.js
npm run build         # Build standard app
```

## How it Works

The tricky part is making React + MUI work inside Shadow DOM. Here's the approach:

**Shadow DOM Structure**

```
<wishlist-dock>
  #shadow-root
    ├── <style> (Swiper CSS)
    ├── #wishlist-dock-styles (Emotion injects here)
    └── #wishlist-dock-app (React mounts here)
```

**Key challenges solved:**

1. **Emotion + Shadow DOM** — MUI uses Emotion for CSS-in-JS. By default it injects into `<head>`, but that's outside Shadow DOM. Solution: create a custom Emotion cache pointing to a container inside Shadow DOM.

2. **MUI Portals** — Dialogs, Menus, and Poppers render via portals to `document.body` by default. That breaks Shadow DOM isolation. Solution: override default container in theme config to point inside Shadow DOM.

3. **CssBaseline** — MUI's `CssBaseline` targets `body` which doesn't exist in Shadow DOM. Solution: use `ScopedCssBaseline` which wraps content instead.

4. **Swiper CSS** — Can't use `import 'swiper/css'` because it injects to `<head>`. Solution: inline the CSS as a string and inject it directly into Shadow DOM.

**Simplified code flow:**

```tsx
// WishlistDockElement.ts - Custom Element
connectedCallback() {
  this.shadow = this.attachShadow({ mode: 'open' });

  // Inject Swiper CSS directly
  const style = document.createElement('style');
  style.textContent = SWIPER_CSS;
  this.shadow.appendChild(style);

  // Container for Emotion styles
  this.styleContainer = document.createElement('div');
  this.shadow.appendChild(this.styleContainer);

  // Container for React app
  this.appContainer = document.createElement('div');
  this.shadow.appendChild(this.appContainer);

  // Mount React
  createRoot(this.appContainer).render(
    <WishlistDockRoot
      styleContainer={this.styleContainer}
      appContainer={this.appContainer}
      ...
    />
  );
}

// WishlistDockRoot.tsx - React bridge
const emotionCache = createCache({
  key: 'wishlist-dock',
  container: styleContainer,  // Emotion writes CSS here
});

const muiTheme = {
  ...baseTheme,
  components: {
    // Force portals inside Shadow DOM
    MuiDialog: { defaultProps: { container: appContainer } },
    MuiMenu: { defaultProps: { container: appContainer } },
    MuiPopover: { defaultProps: { container: appContainer } },
  },
};

<CacheProvider value={emotionCache}>
  <ThemeProvider theme={muiTheme}>
    <ScopedCssBaseline>
      <Dock />
    </ScopedCssBaseline>
  </ThemeProvider>
</CacheProvider>
```

## Project Structure

```
src/
├── components/          # UI components
│   ├── Cards/          # Card display, drag & drop
│   ├── CardSwiper/     # Swiper-based deck
│   ├── Dialogs/        # Create/edit modals
│   ├── Dock/           # Main dock
│   └── FullScreen/     # Expanded view
├── store/              # Redux + RTK Query
├── theme/              # MUI theme
└── web-component/      # Web Component wrapper
    ├── WishlistDockElement.ts  # Custom Element
    ├── WishlistDockRoot.tsx    # React bridge
    └── styles.ts               # Inlined CSS
```

## Tech Stack

- React 19, TypeScript
- Redux Toolkit + RTK Query
- MUI + Emotion
- Swiper.js
- Vite

## License

MIT
