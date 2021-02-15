// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, ipcMain, dialog} = require('electron')
const path = require('path');
let fs = require('fs-extra');
var xl = require('excel4node');
let mainWindow;

function MultiplyMatrix(A, B){
	let rowsA = A.length, 
		colsA = A[0].length,
		rowsB = B.length, 
		colsB = B[0].length,
		C = [];
	if(colsA != rowsB) return false;
	for(let i = 0; i < rowsA; i++) C[i] = [];
	for(let k = 0; k < colsB; k++){
		for(let i = 0; i < rowsA; i++){
			let t = 0;
			for(let j = 0; j < rowsB; j++) t += A[i][j] * B[j][k];
			C[i][k] = t;
		}
	}
	return C;
}

ipcMain.handle('export', async (event, {a, b, result}) => {
	let dir = dialog.showOpenDialogSync(mainWindow, {
		properties: ['openDirectory']
	});

	if(dir !== undefined) {
		await fs.stat(dir[0]).then(async () => {

			//Export A matrix
			const wbA = new xl.Workbook();
			const wsA = wbA.addWorksheet('Sheet');
			const styleCenterA = wbA.createStyle({
				alignment: { // §18.8.1
					horizontal: ['center'],
				},
			});
			let rowIndexA = 1;
			let colIndexA = 1;
			for(let row of a){
				for(let col of row){
					wsA.cell(rowIndexA, colIndexA)
						.number(Math.round((col + Number.EPSILON) * 1000) / 1000)
						.style(styleCenterA);
					colIndexA++;
				}
				colIndexA = 1;
				rowIndexA++;
			}

			wbA.write(path.join(dir[0], 'MatrixA.xlsx'));

			//Export B matrix
			const wbB = new xl.Workbook();
			const wsB = wbB.addWorksheet('Sheet');
			const styleCenterB = wbB.createStyle({
				alignment: { // §18.8.1
					horizontal: ['center'],
				},
			});
			let rowIndexB = 1;
			let colIndexB = 1;
			for(let row of b){
				for(let col of row){
					wsB.cell(rowIndexB, colIndexB)
						.number(Math.round((col + Number.EPSILON) * 1000) / 1000)
						.style(styleCenterB);
					colIndexB++;
				}
				colIndexB = 1;
				rowIndexB++;
			}

			wbB.write(path.join(dir[0], 'MatrixB.xlsx'));

			//Export result
			const wbResult = new xl.Workbook();
			const wsResult = wbResult.addWorksheet('Sheet');
			const styleCenterResult = wbResult.createStyle({
				alignment: { // §18.8.1
					horizontal: ['center'],
				},
			});

			let rowIndexResult = 1;
			let colIndexResult = 1;
			for(let row of result){
				for(let col of row){
					wsResult.cell(rowIndexResult, colIndexResult)
						.number(Math.round((col + Number.EPSILON) * 1000) / 1000)
						.style(styleCenterResult);
					colIndexResult++;
				}
				colIndexResult = 1;
				rowIndexResult++;
			}

			wbResult.write(path.join(dir[0], 'MatrixResult.xlsx'));

			await new Promise((resolve) => {
				setTimeout(() => {
					dialog.showMessageBoxSync(mainWindow, {
						title: 'Успех!',
						type: 'info',
						message: 'Данные успешно экспортированы'
					});
					resolve();
				}, 500)
			})
		}).catch((error) => {
			dialog.showMessageBoxSync(mainWindow, {
				title: 'Ошибка!',
				type: 'error',
				message: 'Выбранная директория не существует, экспорт отменен',
				detail: 'Код ошибки: '+ error.code
			});
		});
	} else dialog.showMessageBoxSync(mainWindow, {
		title: 'Внимание!',
		type: 'warning',
		message: 'Экспорт отменен, папка небыла выбрана'
	});
});

ipcMain.handle('calc', async (event, {a, b}) => {
	return MultiplyMatrix(a, b)
});

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
	  nodeIntegration: true,
	  contextIsolation: false,
	  enableRemoteModule: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  Menu.setApplicationMenu(null)
  // Open the DevTools
	// mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
