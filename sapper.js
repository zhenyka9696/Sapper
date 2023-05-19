let input = "";
console.clear();
let size = 10;
let bombFrequency = 0.2;
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
let endscreenContent = {win: 'You have won!',loose: '💣 Boom! Game over.'};
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
let scoreCounterForPush = 0;
let standartClicks = 0;
let standartClicksForPush = 0;
let saves = [];
let clickSaves = [];//"clicks: "
let scoreSaves = [];//"score: "
let clickSaveInf="";
let scoreSaveInf="";
let scoreText=[];
let dataDownload = [];

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
        let random_boolean = Math.random() < bombFrequency;
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
        standartClicks++;
        document.getElementById("clicks-count").innerHTML=standartClicks;
		console.log('standartClicks = ' + standartClicks);
        standartClicksForPush=standartClicks;
		clickSaves.push(standartClicksForPush);
		console.log("clickSaves: " + clickSaves);
		let sound3 = document.getElementById("audio3");
		sound3.play();
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
        if (!tile.classList.contains('tile--flagged')){
            tile.innerHTML = '🚩';
            tile.classList.add('tile--flagged');
        }
        else{
            tile.innerHTML = '';
            tile.classList.remove('tile--flagged');
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
        }
        timeCounter = true;
        }
	
    if (gameOver) return;
    if (tile.classList.contains('tile--checked') || tile.classList.contains('tile--flagged')) return;
    let coordinate =tile.getAttribute('data-tile');
    if (bombs.includes(coordinate)) {
        endGame(tile);
    }
    else {
        let num = tile.getAttribute('data-num');
        if (num!=null){
            tile.classList.add('tile--checked');
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

    scoreCounterForPush=scoreCounter;
    scoreSaves.push(scoreCounterForPush);
    console.log("scoreSaves: " + scoreSaves);
	let sound1 = document.getElementById("audio1");
	sound1.play();
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
	if (standartClicks>1){
	console.log('💣 Booom! Game over.');
    scoreSaveInf = scoreSaves.pop();
    clickSaveInf = clickSaves.pop();
    console.log("scoreSaveInf : " + scoreSaveInf);
    console.log("clickSaveInf : " + clickSaveInf);
		scoreText = ("scoreSaveInf : " + scoreSaveInf + "\n" + "clickSaveInf : " + clickSaveInf);
		document.getElementById('todownload').onclick = function() {
		dataDownload = 'data:application/txt;charset=utf-8,' + encodeURIComponent(scoreText);
		this.href = dataDownload;
		this.download = 'data.txt';
		}
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
}

const checkVictory = () => {
    let win = true;
    tiles.forEach(tile => {
        let coordinate = tile.getAttribute('data-tile');
        if (!tile.classList.contains('tile--checked')&&!bombs.includes(coordinate))
        win = false;
    });
    if (win) {
        let sound2 = document.getElementById("audio2");
		sound2.play();
        endscreen.innerHTML=endscreenContent.win;
        endscreen.classList.add('show');
        scoreSaveInf = scoreSaves.pop();
        clickSaveInf = clickSaves.pop();
        console.log("scoreSaveInf : " + scoreSaveInf);
        console.log("clickSaveInf : " + clickSaveInf);
		scoreText = ("scoreSaveInf : " + scoreSaveInf + "\n" + "clickSaveInf : " + clickSaveInf);
		document.getElementById('todownload').onclick = function() {
		dataDownload = 'data:application/txt;charset=utf-8,' + encodeURIComponent(scoreText);
		this.href = dataDownload;
		this.download = 'data.txt';
}
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
	tileSizeBtn.addEventListener('change', function(e) {
	console.log(this.value);
	tileSize = this.value;
	clear();
	});
difficultyBtns.forEach(btn => {
    btn.addEventListener('click',function(){
        console.log(this.value);
        bombFrequency = this.value;
        clear();
    });
});