# Wishlist Dock Widget

An embeddable wishlist widget built as a Web Component. Users can organize items into collections called "stacks".

## Quick Start

```html
<script src="https://your-domain.com/wishlist-dock.js"></script>
<wishlist-dock theme="light"></wishlist-dock>
```

## Features

- Floating dock that expands into a panel
- Create, edit, delete stacks and cards
- Swipe through cards (Tinder-style)
- Drag & drop cards between stacks
- Light/dark theme support
- Shadow DOM for style isolation

## Build

```bash
npm install
npm run build:widget    # Output: dist/wishlist-dock.js
```

## HTML Attributes

| Attribute  | Values                                                   | Default           | Description    |
| ---------- | -------------------------------------------------------- | ----------------- | -------------- |
| `theme`    | `"light"` \| `"dark"`                                    | `"light"`         | Color theme    |
| `position` | `"bottom-center"` \| `"bottom-left"` \| `"bottom-right"` | `"bottom-center"` | Dock position  |
| `open`     | boolean                                                  | -                 | Start expanded |

## JavaScript API

```javascript
const widget = document.querySelector("wishlist-dock");

// Properties
widget.theme = "dark";
widget.open = true;

// Methods
widget.openDock();
widget.closeDock();
widget.toggle();
widget.getStacks();
await widget.addCard({ name, description, coverUrl, stackId });
```

## Events

```javascript
widget.addEventListener("dock-ready", () => console.log("Ready"));
widget.addEventListener("theme-changed", (e) => console.log(e.detail.theme));
```

## Project Structure

```
src/
├── components/         # React components (Dock, Cards, Dialogs)
├── store/              # Redux Toolkit + RTK Query
├── web-component/      # Web Component wrapper
│   ├── WishlistDockElement.ts   # Custom Element class
│   ├── WishlistDockRoot.tsx     # React bridge
│   ├── types.ts                 # Type definitions
│   └── styles.ts                # Swiper CSS for Shadow DOM
└── theme/              # MUI theme config
```

## Tech Stack

- React 19 + TypeScript
- Redux Toolkit + RTK Query
- Material UI + Emotion
- Swiper (card deck)
- Vite (build)
