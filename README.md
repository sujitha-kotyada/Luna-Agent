# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

---

## Luna Agent

Luna Agent is a chat-based AI assistant built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, and a local Node.js agent server.

### What it does

- Provides a compact chat interface with a home screen and a conversation view.
- Supports history sessions with view, delete, and restore actions.
- Includes sidebar panels for History, Files, Search, and Settings.
- Persists chats and settings in `localStorage`.
- Uses a local agent server for Gemini/LangChain-powered responses.

### Project structure

- `src/` - client application code
- `agent-server/` - local Express server used by the chat agent
- `public/` - static assets

### Scripts

- `npm run dev` - starts both the agent server and Vite client
- `npm run client` - starts only the frontend
- `npm run agent` - starts only the local agent server
- `npm run build` - type-checks and builds the client for production
- `npm run lint` - runs ESLint across the workspace
- `npm run preview` - previews the production build locally

### Setup

1. Install dependencies with `npm install`.
2. Create or update your environment file with the required API key.
3. Run `npm run dev` to start the app.

### Environment variables

- `VITE_GEMINI_API_KEY` - required by the client for Gemini access.

### Notes

- The file explorer in the current build is browser-based and works with files you select in the app.
- If you want OS-level desktop folder browsing, the app will need a native bridge or desktop wrapper.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
