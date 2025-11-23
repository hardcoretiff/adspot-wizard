Developer setup (Windows - cmd.exe)

1. Open a `cmd.exe` prompt and change into the project folder:

```
cd "c:\\Users\\tiffa\\ADSPOT onboarding app\\adspot-onboarding"
```

2. Install dependencies:

```
npm install
```

3. Run frontend dev server (Vite):

```
npm run dev
```

4. Run backend (Node):

```
npm run backend:start
```

5. Open the app in your browser:

http://localhost:5173

Notes:

- Use the VS Code `Run Task` menu to run the tasks defined in `.vscode/tasks.json`.
- If you prefer to debug the backend from VS Code, open the Run view and start `Debug Backend (Node)`.
