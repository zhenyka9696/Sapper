console.clear();
let size = 10;
let bombFrequancy = 0.2;
let tileSize = 50;
const board = document.querySelectorAll('.board')[0];
let tiles;
let boardSize;
const restartBtn = document.querySelectorAll('.sapper-btn')[0];
const endscreen = document.querySelectorAll('.endscreen')[0]
const boardSizeBtn = document.getElementById('boardSize');
const tileSizeBtn = document.getElementById('tileSize');
const difficultyBtns = document.querySelectorAll('.difficulty');
let bombs = [];
let numbers = [];
let numberColors = ['#2498df', '#7ecc73', '#e74c3b', '#eb59b4', '#f1c40f', '#1abc9c','#34495e', '#7f8c8d',];
let endscreenContent = {win: '<span>✔ you have won!</span>',loose: '💣 Boom! Game over.'};//
let gameOver = false;
let h1 =document.getElementsByTagName('h1')[0];
let start = document.getElementById('start');
let stop = document.getElementById('stop');
let reset = document.getElementById('reset');
let sec = 0;
let min = 0;
let hours = 0;
let timeCounter = false;
let scoreCounter = 0;
let standartClicks = 0;

const clear = () => {
    gameOver = false;
    bombs = [];
    numbers = [];
    endscreen.innerHTML = '';
    endscreen.classList.remove('show');
    tiles.forEach(tile => {
        tile.remove();
    });
    setup();
}

const setup = () => {
    for (let i=0; i< Math.pow (size, 2); i++){
        const tile = document.createElement('div');
        tile.classList.add('tile');
        board.appendChild(tile);
    }
    tiles = document.querySelectorAll('.tile');
    boardSize = Math.sqrt(tiles.length);
    board.style.width = boardSize * tileSize + 'px';
    document.documentElement.style.setProperty('--tileSize', `${tileSize}px`);
    document.documentElement.style.setProperty('--boardSize', `${boardSize*tileSize}px`);
    let x = 0;
    let y = 0;
    tiles.forEach((tile,i) => {
        tile.setAttribute('data-tile', `${x},${y}`);
        let random_boolean = Math.random() < bombFrequancy;
		if (random_boolean) {
			bombs.push(`${x},${y}`);
			if (x > 0) numbers.push(`${x-1},${y}`);
			if (x < boardSize - 1) numbers.push(`${x+1},${y}`);
			if (y > 0) numbers.push(`${x},${y-1}`);
			if (y < boardSize - 1) numbers.push(`${x},${y+1}`);
			
			if (x > 0 && y > 0) numbers.push(`${x-1},${y-1}`);
			if (x < boardSize - 1 && y < boardSize - 1) numbers.push(`${x+1},${y+1}`);
			
			if (y > 0 && x < boardSize - 1) numbers.push(`${x+1},${y-1}`);
			if (x > 0 && y < boardSize - 1) numbers.push(`${x-1},${y+1}`);
		}
    x++;
    if (x>= boardSize){
        x=0;
        y++;
    }
    tile.oncontextmenu = function(e){
        e.preventDefault();
        flag(tile);
    }
    tile.addEventListener('click', function(e){
        clickTile(tile);
    });
    });
	numbers.forEach(num => {
		let coords = num.split(',');
		let tile = document.querySelectorAll(`[data-tile="${parseInt(coords[0])},${parseInt(coords[1])}"]`)[0];
		let dataNum = parseInt(tile.getAttribute('data-num'));
		if (!dataNum) dataNum = 0;
		tile.setAttribute('data-num', dataNum + 1);
	});
}

const flag = (tile) => {
    if (gameOver) return;
    if (!tile.classList.contains('tile--checked')){
        if (!tile.classList.contains('tile--flaged')){
            tile.innerHTML = '🚩'; // I am not sure
            tile.classList.add('tile--flaged');
        }
        else{
            tile.innerHTML = '';
            this.classList.remove('tile--flagged');
        }
    }
}

const clickTile = (tile) => {

	if (timeCounter == false){
        function tick(){
            sec++;
            if(sec >= 60){
                sec = 0;
                min++;
                if (min >= 60){
                    min = 0;
                    hours++;
                }
            }
        }
        
        function timeStart(){
            tick();
            h1.textContent = (hours>9 ? hours : "0" + hours) + ":" + (min > 9 ? min : "0" + min) + 
            ":" + (sec > 9 ? sec : "0" +sec);
            timer();
        }
        
        function timer(){
            t = setTimeout(timeStart, 1000);
        }
        
        timer();
        start.onclick = timer;
        stop.onclick = function(){
            clearTimeout(t);
        }
        reset.onclick = function(){
            clearTimeout(t);
            h1.textContent = "00:00:00";
            sec = 0;
            min = 0;
            hours = 0;
            //seconds = 0; minutes = 0; Houres = 0;
        }
        timeCounter = true;
        }
	
    if (gameOver) return;
    if (tile.classList.contains('tile--checked') || tile.classList.contains('tile-flagged')) return;
    let coordinate =tile.getAttribute('data-tile');
    if (bombs.includes(coordinate)) {
        endGame(tile);
    }
    else {
        let num = tile.getAttribute('data-num');
        if (num!=null){
            tile.classList.add('data-num');
			standartClicks++;
			console.log('standartClicks = ' + standartClicks);
			//standart clicks
            tile.innerHTML = num;
            tile.style.color = numberColors [num - 1];
            setTimeout(() => {
                checkVictory();
            },100);
            return;
        }
        checkTile(tile, coordinate);
    }
    tile.classList.add('tile--checked');
}

const checkTile = (tile, coordinate) => {
    console.log('✔');
	scoreCounter++;
	document.getElementById("score-count").innerHTML=scoreCounter;
	console.log("scoreCounter = " + scoreCounter);
    let coords = coordinate.split(',');
    let x = parseInt(coords[0]);
    let y = parseInt(coords[1]);
    setTimeout(() => {
		if (x > 0) {
			let targetW = document.querySelectorAll(`[data-tile="${x-1},${y}"`)[0];
			clickTile(targetW, `${x-1},${y}`);
		}
		if (x < boardSize - 1) {
			let targetE = document.querySelectorAll(`[data-tile="${x+1},${y}"`)[0];
			clickTile(targetE, `${x+1},${y}`);
		}
		if (y > 0) {
			let targetN = document.querySelectorAll(`[data-tile="${x},${y-1}"]`)[0];
			clickTile(targetN, `${x},${y-1}`);
		}
		if (y < boardSize - 1) {
			let targetS = document.querySelectorAll(`[data-tile="${x},${y+1}"]`)[0];
			clickTile(targetS, `${x},${y+1}`);
		}
		
		if (x > 0 && y > 0) {
			let targetNW = document.querySelectorAll(`[data-tile="${x-1},${y-1}"`)[0];
			clickTile(targetNW, `${x-1},${y-1}`);
		}
		if (x < boardSize - 1 && y < boardSize - 1) {
			let targetSE = document.querySelectorAll(`[data-tile="${x+1},${y+1}"`)[0];
			clickTile(targetSE, `${x+1},${y+1}`);
		}
		
		if (y > 0 && x < boardSize - 1) {
			let targetNE = document.querySelectorAll(`[data-tile="${x+1},${y-1}"]`)[0];
			clickTile(targetNE, `${x+1},${y-1}`);
		}
		if (x > 0 && y < boardSize - 1) {
			let targetSW = document.querySelectorAll(`[data-tile="${x-1},${y+1}"`)[0];
			clickTile(targetSW, `${x-1},${y+1}`);
		}
	}, 10);
}
const endGame = (tile) => {
	console.log('💣 Booom! Game over.');
	endscreen.innerHTML=endscreenContent.loose;
	endscreen.classList.add('show');
	gameOver = true;
	tiles.forEach(tile => {
		let coordinate = tile.getAttribute('data-tile');
		if (bombs.includes(coordinate)) {
			tile.classList.remove('tile--flagged');
			tile.classList.add('tile--checked', 'tile--bomb');
			tile.innerHTML = '💣';
		}
	});
}

const checkVictory = () => {
    let win = true;
    tiles.forEach(tile => {
        let coordinate = tile.getAttribute('data-tile');
        if (!tile.classList.contains('tile--checked')&&
        !bombs.includes(coordinate)) win = false;
    });
    if (win) {
        endscreen.innerHTML=endscreenContent.win;
        endscreen.classList.add('show');
        gameOver = true;
    }
}


setup();
restartBtn.addEventListener('click',function(e){
    e.preventDefault();
    clear();
});
boardSizeBtn.addEventListener('change',function(e){
    console.log(this.value);
    size= this.value;
    tileSize = 70 - (size*2);
    clear();
});
//?
	tileSizeBtn.addEventListener('change', function(e) {
	console.log(this.value);
	tileSize = this.value;
	clear();
	});
//?
difficultyBtns.forEach(btn => {
    btn.addEventListener('click',function(){
        console.log(this.value);
        bombFrequancy = this.value;
        clear();
    });
});