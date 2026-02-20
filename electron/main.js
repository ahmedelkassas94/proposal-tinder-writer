const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let mainWindow;
let nextServer;

const isDev = process.env.NODE_ENV === "development";
const PORT = 3456; // Use a unique port to avoid conflicts

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: "Proposal & Tinder Writer",
    icon: path.join(__dirname, "icon.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Wait for the server to be ready, then load
  const checkServer = () => {
    const http = require("http");
    http
      .get(`http://127.0.0.1:${PORT}`, () => {
        mainWindow.loadURL(`http://127.0.0.1:${PORT}`);
      })
      .on("error", () => {
        setTimeout(checkServer, 500);
      });
  };

  mainWindow.loadFile(path.join(__dirname, "loading.html"));
  checkServer();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function startNextServer() {
  const serverPath = isDev
    ? path.join(__dirname, "..")
    : path.join(process.resourcesPath, "app");

  const env = {
    ...process.env,
    PORT: PORT.toString(),
    NODE_ENV: "production"
  };

  // In production, use the standalone server
  if (!isDev) {
    const serverJs = path.join(serverPath, ".next", "standalone", "server.js");
    nextServer = spawn(process.execPath, [serverJs], {
      cwd: serverPath,
      env,
      stdio: "pipe"
    });
  } else {
    // In dev, run next start
    const npm = process.platform === "win32" ? "npm.cmd" : "npm";
    nextServer = spawn(npm, ["run", "start", "--", "-p", PORT.toString()], {
      cwd: serverPath,
      env,
      stdio: "pipe",
      shell: true
    });
  }

  nextServer.stdout?.on("data", (data) => {
    console.log(`[Next.js] ${data}`);
  });

  nextServer.stderr?.on("data", (data) => {
    console.error(`[Next.js] ${data}`);
  });

  nextServer.on("error", (err) => {
    console.error("Failed to start Next.js server:", err);
  });
}

app.whenReady().then(() => {
  startNextServer();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (nextServer) {
    nextServer.kill();
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (nextServer) {
    nextServer.kill();
  }
});
