const { app, BrowserWindow, dialog, utilityProcess } = require('electron');
const fs = require('node:fs');
const path = require('node:path');

const API_PORT = 4000;
let backendProcess;
let mainWindow;

function backendDirectory() {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'backend')
    : path.resolve(__dirname, '..', 'backend');
}

async function waitForBackend() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${API_PORT}/health`);
      if (response.ok) return;
    } catch {
      // The local API may need a moment to initialize SQLite.
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error('The local MWU API did not start within 30 seconds.');
}

function startBackend() {
  const root = backendDirectory();
  const entryPoint = path.join(root, 'dist', 'app.js');
  const databasePath = path.join(app.getPath('userData'), 'MWU', 'data', 'mwu.db');
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });

  backendProcess = utilityProcess.fork(entryPoint, [], {
    cwd: root,
    serviceName: 'MWU local API',
    env: { ...process.env, PORT: String(API_PORT), DB_PATH: databasePath },
  });

  backendProcess.on('error', (error) => {
    console.error('Failed to start the MWU API process:', error);
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 900,
    minHeight: 650,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (app.isPackaged) {
    await mainWindow.loadFile(path.join(app.getAppPath(), 'frontend', 'dist', 'index.html'));
  } else {
    await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173');
  }
}

app.whenReady().then(async () => {
  startBackend();
  try {
    await waitForBackend();
    await createWindow();
  } catch (error) {
    dialog.showErrorBox('MWU Desktop could not start', error.message);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (backendProcess) backendProcess.kill();
});
