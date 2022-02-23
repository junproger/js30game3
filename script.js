//js for HH game
'use strict';

let lastItem = 0;
let currentId = 0;
let formerData = [];
let currentData = '';
let clickCounter = 0;
// if it will be use;
let queueRounds = [];
const idMask = 'id#0';
const keyMask = 'HuHaDATA#';
const localStore = window.localStorage;
const board = document.getElementById('place');
const score = document.getElementById('aside');
const iplay = document.getElementById('iplay');
const modal = document.getElementById('modal');
const last10list = document.getElementById('listrounds');
const nomsong = new Audio('./assets/audio/nom-nom-song.mp3');

window.onload = checkStorage;

iplay.addEventListener('click', startGame);

function preloadImage() {
	const img = new Image();
	img.src = "./assets/img/game_hamster.png";
	img.src = "./assets/img/nom_nom_nom.gif";
	img.src = "./assets/img/rip_hungry.jpg";
};

preloadImage();

function setupStore(args) {
	let stringData = args.join(', ');
	localStore.setItem('HuHaID', idMask + currentId);
	localStore.setItem('HuHaEND', currentId);
	localStore.setItem('HuHaDATA#' + currentId, stringData);
};

function setupHUHA() {
	localStore.setItem('HuHaUP', 1);
	localStore.setItem('HuHaID', 'id#00');
	localStore.setItem('HuHaEND', 0);
	localStore.setItem('HuHaDATA#0', 'id#00, null, null, null, null');
	const HuHaUP = localStore.getItem('HuHaUP');
		if (parseInt(HuHaUP, 10) >= 1) {
			console.log(Object.keys(localStore));
			console.log('THE HUHA SETUP!');
		};
};

function checkStorage() {
	let stLength = localStore.length;
	if (stLength === 0) {
		// call function to add to storage;
		console.log(Object.keys(localStore));
		console.log('STORE IS EMPTY!');
		setupHUHA();
	} else if (stLength > 0) {
		let storeKeys = Object.keys(localStore);
		// get lastItem for game from storage;
		if (storeKeys.includes('HuHaUP')) {
			console.log('HUHA IS THERE!');
			lastItem = parseInt(localStore.getItem('HuHaEND'), 10);
			currentId = (lastItem + 1);
			setFormer();
		} else {
			// call function to add to storage;
			console.log(Object.keys(localStore));
			console.log('NO HUHA JET!');
			setupHUHA();
		};
	};
};

function setFormer() {
	lastItem = parseInt(localStore.getItem('HuHaEND'), 10);
	currentId = (lastItem + 1);
	//console.log('Last Item:', lastItem);
	formerData = (localStore.getItem('HuHaDATA#' + lastItem)).split(', ');
	//console.log('formerData:', formerData);
	printPrevious(formerData);
	quControl();
};

function quControl() {
	let huhaup = parseInt(localStore.getItem('HuHaUP'), 10);
	let divide = lastItem - huhaup;
	if (divide === 10) {
		localStore.removeItem('HuHaDATA#' + (lastItem - 11));
		huhaup = huhaup + 1;
		localStore.setItem('HuHaUP', huhaup);
	};
	printRounds(huhaup, lastItem);
};

function printRounds(huhaup, lastItem) {
	let br = document.createElement("br")
	for (let i = (huhaup - 1); i <= lastItem; i++) {
		last10list.append(localStore.getItem('HuHaDATA#' + i), ' ');
	};
};

function printPrevious(args) {
	lastgame.textContent = ' ' + args[0];
	lasttime.textContent = ' ' + args[1];
	lastscore.textContent = ' ' + args[2];
	lasthunger.textContent = ' ' + args[3];
	lastresult.textContent = ' ' + args[4];
};

function printCurrent(args) {
	actgame.textContent = ' ' + args[0];
	acttime.textContent = ' ' + args[1];
	actscore.textContent = ' ' + args[2];
	acthunger.textContent = ' ' + args[3];
	actresult.textContent = ' ' + args[4];
};

function resetPrevious() {
	actgame.textContent = ' ' + '—';
	acttime.textContent = ' ' + '—';
	actscore.textContent = ' ' + '—';
	acthunger.textContent = ' ' + '—';
	actresult.textContent = ' ' + '—';
};

class currentGame {
	constructor(name, weight, hunger, health, timer) {
		this.name = name;
		this.weight = weight;
		this.hunger = hunger;
		this.health = health;
		this.timer = timer;
		this.round = 70000;
		this.result = '';
	};
	eatFood() {
		console.log(`${this.name}: Nom-nom-nom!`);
		alert(`${this.name}: Nom-nom-nom!`);
	};
	isHungry() {
		board.innerHTML = `
		<big>The "Hungry Hamster" Game:<\/big> <br /> <br />
		<img src="./assets/img/nom_nom_nom.gif" width="256" alt="Nom-Nom-Nom"> <br />
		<br /> Name: ${this.name}; <br />
		Weight: ${this.weight}; <br />
		Hunger: ${this.hunger}%; <br />
		<progress value="${this.hunger}" max="100"><\/progress> <br />
		Health: ${this.health}%. <br />
		<progress value="${this.health}" max="100"><\/progress> <br /> <br />
		`;
		this.round = this.round - 100;
		if (this.round === 0 || clickCounter === 300) {
			nomsong.pause();
			nomsong.currentTime = 0;
			clearInterval(this.timer);
			this.result = 'win';
			modalToggle();
			message.innerHTML = 'GREAT! YOU WIN! <br /> CLICK TO RETURN';
			message.onclick = modalToggle;
			iplay.removeEventListener('click', feedHamst);
			iplay.textContent = 'Try Again! Click to Restart.';
			iplay.addEventListener('click', restartGame);
			console.log('The Hamster is Fed! Try Again!');
			this.closeGame();
		} else if (this.health <= 0) {
			nomsong.pause();
			nomsong.currentTime = 0;
			clearInterval(this.timer);
			this.result = 'loss';
			modalToggle();
			message.innerHTML = 'SALDY! YOU LOSE! <br /> CLICK TO RETURN';
			message.onclick = modalToggle;
			board.innerHTML = `
			<big>The "Hungry Hamster" Game:<\/big> <br /> <br />
			<img src="./assets/img/rip_hungry.jpg" width="216" alt="Rip Hungry"> <br />
			<br /> Name: ${this.name}; <br />
			Weight: ${this.weight}; <br />
			Hunger: 0%; <br />
			<progress value="0" max="100"><\/progress> <br />
			Health: 0%; The Hamster is Dead! <br />
			<progress value="0" max="100"><\/progress> <br /> <br />
			`;
			iplay.removeEventListener('click', feedHamst);
			iplay.textContent = 'Game Over! Click to Restart.';
			iplay.addEventListener('click', restartGame);
			console.log('The Hamster is Dead! Game Over!');
			this.closeGame();
		} else if (this.hunger >= 100) {
			this.health -= 1;
		} else {
			this.hunger += 1;
		};
	};
	closeGame() {
		currentData = [(idMask + currentId), (70000 - this.round), clickCounter, this.hunger, this.result];
		printCurrent(currentData);
		setupStore(currentData);
		this.round = 70000;
		clickCounter = 0;
	};
};

const homyak = new currentGame('homyak', '100g.', '0', '100', null);

const eatFood = homyak.eatFood.bind(homyak);
const feedHamst = () => {
	homyak.hunger -= 2;
	clickCounter += 1;
};

function playNomNom() {
	nomsong.currentTime = 3;
	nomsong.play();
};

function modalToggle() {
	modal.classList.toggle('none');
	modal.classList.toggle('view');
};

board.innerHTML = '<big>The "Hungry Hamster" Game:</big> <br /> <small>(Feed the hungry in 70000 ms or 300 clicks)</small> <br /> <br /> <img src="./assets/img/game_hamster.png" width="256" alt="The Hungry Hamster Game"> <br /> <br />';

function startGame() {
	playNomNom();
	iplay.removeEventListener('click', startGame);
	iplay.textContent = 'Feed the Hungry Hamster!';
	homyak.hunger = 0;
	homyak.health = 100;
	homyak.timer = setInterval(homyak.isHungry.bind(homyak), 100);
	iplay.addEventListener('click', feedHamst);
	console.log('The "Hungry Hamster" Started!');
};

function restartGame() {
	resetPrevious();
	setFormer();
	playNomNom();
	iplay.removeEventListener('click', restartGame);
	iplay.textContent = 'Feed the Hungry Hamster!';
	homyak.hunger = 0;
	homyak.health = 100;
	homyak.timer = setInterval(homyak.isHungry.bind(homyak), 100);
	iplay.addEventListener('click', feedHamst);
	console.log('The "Hungry Hamster" Restart!');
};

last10open.onclick = function() {
	last10text.classList.add('open');
};

last10close.onclick = function() {
	last10text.classList.remove('open');
};
