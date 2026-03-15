const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

app.whenReady().then(() => {

  // ── Fenêtre principale (barre de lancement) ──
  const main = new BrowserWindow({
    width: 340,
    height: 90,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  main.loadFile(path.join(__dirname, 'main.html'))
  main.setAlwaysOnTop(true, 'screen-saver')

  // ── Créer un nouveau timer ──
  ipcMain.on('new-timer', () => {
    const w = new BrowserWindow({
      width: 320,
      height: 450,
      alwaysOnTop: true,
      frame: false,
      resizable: true,
      backgroundColor: '#ffffff',
      hasShadow: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    })
    w.loadFile(path.join(__dirname, 'timer.html'))
    w.setAlwaysOnTop(true, 'screen-saver')
  })

  // ── Minimiser la fenêtre appelante ──
  ipcMain.on('minimize', (e) => {
    const w = BrowserWindow.fromWebContents(e.sender)
    if (w) w.minimize()
  })

  // ── Fermer la fenêtre appelante ──
  ipcMain.on('close', (e) => {
    const w = BrowserWindow.fromWebContents(e.sender)
    if (w) w.close()
  })

  // ── Déplacer la fenêtre appelante ──
  ipcMain.on('move-win', (e, { dx, dy }) => {
    const w = BrowserWindow.fromWebContents(e.sender)
    if (w) {
      const [x, y] = w.getPosition()
      w.setPosition(x + dx, y + dy)
    }
  })

  // ── Quitter l'application ──
  ipcMain.on('quit', () => app.quit())

})

app.on('window-all-closed', () => app.quit())