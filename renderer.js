// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const {ipcRenderer, remote} = require('electron');

let aTemp, bTemp, resultTemp;
$(document).ready(() => {
	$('input[type="number"]').on('keyup', function(){
		$(this).val($(this).val().replace (/\D/, ''));
	});
})

function setMatrixA(){
	if($('#aW').val() != $('#bH').val()){
		remote.dialog.showMessageBoxSync(remote.getCurrentWindow(), {
			title: 'Ошибка!',
			type: 'error',
			message: 'Такие матрицы нельзя перемножить, так как количество столбцов матрицы А не равно количеству строк матрицы В.',
		});
       return false;
	}

	$('#matrixSize').hide();
	
	const w = $('#aW').val();
	const h = $('#aH').val();
	let h4 = document.createElement('label');
	h4.classList.add('form-label');
	h4.innerText = 'Значения матрицы А:';


	let matrixContainer = document.createElement('div');
	matrixContainer.classList.add('matrixContainer');
	document.querySelector('#matrixA').appendChild(matrixContainer)

	document.querySelector("#matrixA").insertBefore(h4, document.querySelector('#matrixA > .matrixContainer'))
	for(let rowI = 0; rowI < h; rowI++){
		var row = document.createElement('div');
		row.classList.add('row')
		for(let col = 0; col < w; col++){
			let colEl = document.createElement('div');
			colEl.classList.add('col', 'mb-1')
			let inputEl = document.createElement('input');
			inputEl.type = 'text';
			inputEl.step = 1;

			inputEl.classList.add('form-control');
			colEl.appendChild(inputEl);
			row.prepend(colEl)
		}
		document.querySelector("#matrixA > .matrixContainer").appendChild(row);
		if(h-1 != rowI)	document.querySelector("#matrixA > .matrixContainer").appendChild(document.createElement('hr'));
	}

	let btnGroup = document.createElement('div');
	btnGroup.classList.add('btn-group')

	let next = document.createElement('button');
	next.classList.add('btn', 'btn-dark', 'mt-2');
	next.innerText = 'Далее';
	next.onclick = setMatrixB;
	btnGroup.appendChild(next)

	let back = document.createElement('button');
	back.classList.add('btn', 'btn-primary', 'mt-2');
	back.innerText = 'Назад';
	back.onclick = function () {
		$('#matrixA').hide();
		$('#matrixA').html('');
		$('#matrixSize').show();
	};
	btnGroup.appendChild(back)

	document.querySelector("#matrixA").appendChild(btnGroup)

	$('#matrixA').show();
}
function setMatrixB(){
	$('#matrixA').hide();
	
	const w = $('#bW').val();
	const h = $('#bH').val();
	let h4 = document.createElement('label');
	h4.classList.add('form-label');
	h4.innerText = 'Значения матрицы B:';

	let matrixContainer = document.createElement('div');
	matrixContainer.classList.add('matrixContainer');
	document.querySelector('#matrixB').appendChild(matrixContainer)

	document.querySelector("#matrixB").insertBefore(h4, document.querySelector('#matrixB > .matrixContainer'))
	for(let rowI = 0; rowI < h; rowI++){
		var row = document.createElement('div');
		row.classList.add('row')
		for(let col = 0; col < w; col++){
			let colEl = document.createElement('div');
			colEl.classList.add('col', 'mb-1')
			let inputEl = document.createElement('input');
			inputEl.type = 'text';
			inputEl.step = 1;

			inputEl.classList.add('form-control');
			colEl.appendChild(inputEl);
			row.prepend(colEl)
		}
		document.querySelector("#matrixB > .matrixContainer").appendChild(row)
		if(h-1 != rowI)	document.querySelector("#matrixB > .matrixContainer").appendChild(document.createElement('hr'));
	}

	let btnGroup = document.createElement('div');
	btnGroup.classList.add('btn-group')

	let next = document.createElement('button');
	next.classList.add('btn', 'btn-dark', 'mt-2');
	next.innerText = 'Далее';
	next.onclick = result;
	btnGroup.appendChild(next)

	let back = document.createElement('button');
	back.classList.add('btn', 'btn-primary', 'mt-2');
	back.innerText = 'Назад';
	back.onclick = function () {
		$('#matrixB').hide();
		$('#matrixB').html('');
		$('#matrixA').show();
	};
	btnGroup.appendChild(back)

	document.querySelector("#matrixB").appendChild(btnGroup)

	$('#matrixB').show();
}

async function result(){
	let a = [], b = [];
	let matrixRowsA = document.querySelectorAll('#matrixA > .matrixContainer > .row');
	for(let row of matrixRowsA){
		let cols = [];
		for(let col of row.querySelectorAll('input')){
			let valueCol = col.value.replace(/\s+/igm, '').replace(',', '.');
			if(!valueCol){
				valueCol = 0;
			} else if(col.value.indexOf(',') || col.value.indexOf('.')){
				valueCol = parseFloat(col.value);
			} else {
				valueCol = parseInt(col.value);
			}
			cols.push(valueCol);
		}
		a.push(cols);
	}

	let matrixRowsB = document.querySelectorAll('#matrixB > .matrixContainer > .row');
	for(let row of matrixRowsB){
		let cols = [];
		for(let col of row.querySelectorAll('input')){
			let valueCol = col.value.replace(/\s+/igm, '').replace(',', '.');
			if(!valueCol){
				valueCol = 0;
			} else if(col.value.indexOf(',') || col.value.indexOf('.')){
				valueCol = parseFloat(col.value);
			} else {
				valueCol = parseInt(col.value);
			}
			cols.push(valueCol);
		}
		b.push(cols);
	}

	$('#matrixB').hide();
    let containerA = document.createElement('div');
	containerA.classList.add('matrixContainer');
	
	
	let tableA = document.createElement('table');
	tableA.border = 1;
	tableA.width = '100%';
	for(let row of a){
		let tr = document.createElement('tr');
		
		for(let col of row){
			let td = document.createElement('td');
			td.innerText = col;
			tr.appendChild(td);
		}
		tableA.appendChild(tr);
	}
	
	let h6A = document.createElement('h6');
	h6A.innerText = 'Значения A:';
	h6A.classList.add('form-label');
	document.querySelector("#result").appendChild(h6A)
	containerA.appendChild(tableA)
	document.querySelector("#result").appendChild(containerA)

    let containerB = document.createElement('div');
	containerB.classList.add('matrixContainer');
	
	
	let tableB = document.createElement('table');
	tableB.border = 1;
	tableB.width = '100%';
	for(let row of b){
		let tr = document.createElement('tr');
		
		for(let col of row){
			let td = document.createElement('td');
			td.innerText = col;
			tr.appendChild(td);
		}
		tableB.appendChild(tr);
	}
	
	let h6B = document.createElement('h6');
	h6B.innerText = 'Значения B:';
	h6B.classList.add('form-label');
	document.querySelector("#result").appendChild(h6B)
	containerB.appendChild(tableB)
	document.querySelector("#result").appendChild(containerB);
	
	
	await ipcRenderer.invoke('calc', {a, b}).then((result) => {
		let containerResultCalc = document.createElement('div');
		containerResultCalc.classList.add('matrixContainer');
		
		
		let tableResultCalc = document.createElement('table');
		tableResultCalc.border = 1;
		tableResultCalc.width = '100%';
		for(let row of result){
			let tr = document.createElement('tr');
			
			for(let col of row){
				let td = document.createElement('td');

				td.innerText = Math.round((col + Number.EPSILON) * 1000) / 1000;
				tr.appendChild(td);
			}
			tableResultCalc.appendChild(tr);
		}
		
		let h6ResultCalc = document.createElement('h6');
		h6ResultCalc.innerText = 'Результат умножения:';
		h6ResultCalc.classList.add('form-label');
		document.querySelector("#result").appendChild(h6ResultCalc)
		containerResultCalc.appendChild(tableResultCalc)
		document.querySelector("#result").appendChild(containerResultCalc);


		let btnGroup = document.createElement('div');
		btnGroup.classList.add('btn-group')

		let exportBtn = document.createElement('button');
		exportBtn.classList.add('btn', 'btn-success', 'mt-2');
		exportBtn.innerText = 'Выбрать папку для экспорта данных';
		aTemp = a;
		bTemp = b;
		resultTemp = result;
		exportBtn.onclick = async function () {
			await ipcRenderer.invoke('export', {a: aTemp, b: bTemp, result: resultTemp}).then((result) => {

			});
		};
		btnGroup.appendChild(exportBtn);

		let goToStart = document.createElement('button');
		goToStart.classList.add('btn', 'btn-primary', 'mt-2');
		goToStart.innerText = 'Перейти в начало';
		goToStart.onclick = function () {
			$('#result').hide();

			$('#matrixB').html('');
			$('#matrixA').html('');
			$('#result').html('');
			aTemp = null;
			bTemp = null;
			resultTemp = null;

			$("#matrixSize").show();
		};
		btnGroup.appendChild(goToStart)

		document.querySelector("#result").appendChild(btnGroup)

	});
	$('#result').show();
}
$('#setMatrixSize').on('click', setMatrixA);