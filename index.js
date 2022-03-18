let dictoCards = {};
let colorFilter = [];
let table = null;
let loMiaCards = new Set();

function swapColor(color) {
	if(colorFilter.includes(color)){
		const ind = colorFilter.indexOf(color);
		colorFilter.splice(ind, 1);
	}
	else{
		colorFilter.push(color);
	}
	refreshTable();
}

async function loadData() {
	const cardRes = await fetch('./static/cards.json', {
		method: 'GET'
	});
	dictoCards = await cardRes.json();
	for (const [key, value] of Object.entries(dictoCards)) {
		value.playCount = 0;
		value.winCount = 0;
		value.seeCount = 0;
		value.pickCount = 0;
		value.tbdFloors = 0;
	}
	
	const loFilesRes = await fetch('./list.php', {
		method: 'GET'
	});
	let filesText = await loFilesRes.text();
	const loFiles = JSON.parse(filesText.substring(0, filesText.length-1));
	
	for(let i = 0; i < loFiles.length; i++) {
		const file = await fetch(loFiles[i], {
			method: 'GET'
		});
		const json = await file.json();
		let endFloor = json.floor_reached;
		if(endFloor < 51) {
			endFloor = 51;
		}
		for(let j = 0; j < json.master_deck.length; j++) {
			let cardName = json.master_deck[j];
			cardName = replaceIdWithName(cardName);
			if(dictoCards[cardName]) {
				dictoCards[cardName].playCount++;
				if(json.victory) {
					dictoCards[cardName].winCount++;
				}
			}
			else {
				loMiaCards.add(cardName);
			}
		}
		for(let k = 0; k < json.card_choices.length; k++) {
			for(let l = 0; l < json.card_choices[k].not_picked.length; l++) {
				let cardName = json.card_choices[k].not_picked[l];
				cardName = replaceIdWithName(cardName);
				if(dictoCards[cardName]) {
					dictoCards[cardName].seeCount++;
				}
				else {
					loMiaCards.add(cardName);
				}
			}
			let cardName = json.card_choices[k].picked;
			cardName = replaceIdWithName(cardName);
			if(dictoCards[cardName]) {
				dictoCards[cardName].seeCount++;
				dictoCards[cardName].pickCount++;
				dictoCards[cardName].tbdFloors = dictoCards[cardName].tbdFloors + 100 * (endFloor - json.card_choices[k].floor) / endFloor;
			}
			else {
				loMiaCards.add(cardName);
			}
		}
	}
	console.log(loMiaCards);
	
	refreshTable();
}

function replaceIdWithName(cardName) {
	cardName = cardName.replace('+1', "");
	cardName = cardName.replace(/([A-Z])/g, ' $1')
	cardName = cardName.replace('_ R', '-Red');
	cardName = cardName.replace('_ G', '-Green');
	cardName = cardName.replace('_ B', '-Blue');
	cardName = cardName.replace('_ P', '-Purple');
	cardName = cardName.replace('Follow Up', 'Follow-Up');
	cardName = cardName.replace('  ', ' ');
	cardName = cardName.replace('  ', ' ');
	cardName = cardName.replace('  ', ' ');
	cardName = cardName.replace('v2', '');
	cardName = cardName.replace('Of', 'of');
	cardName = cardName.replace('The', 'the');
	cardName = cardName.replace('And', 'and');
	cardName = cardName.replace('Adaptation', 'Rushdown');
	cardName = cardName.replace('Clear the Mind', 'Empty Mind');
	cardName = cardName.replace('Path To Victory', 'Pressure Points');
	cardName = cardName.replace('Judgement', 'Judgment');
	cardName = cardName.replace('Ascenders Bane', 'Ascender\'s Bane');
	cardName = cardName.replace('Talk To the Hand', 'Talk to the Hand');
	cardName = cardName.replace('J. A. X.', 'J.A.X.');
	cardName = cardName.replace('Wireheading', 'Foresight');
	cardName = cardName.replace('Fasting2', 'Fasting');
	cardName = cardName.replace('Night Terror', 'Nightmare');
	cardName = cardName.replace('Crippling Poison', 'Crippling Cloud');
	cardName = cardName.replace('All Out Attack', 'All-Out Attack');
	cardName = cardName.replace('Underhanded Strike', 'Sneaky Strike');
	cardName = cardName.replace('Venomology', 'Alchemize');
	cardName = cardName.replace('Well Laid Plans', 'Well-Laid Plans');
	cardName = cardName.replace('Riddle With Holes', 'Riddle with Holes');
	cardName = cardName.replace('Creative A I', 'Creative AI');
	cardName = cardName.replace('Steam Power', 'Overclock');
	cardName = cardName.replace('Gash', 'Claw');
	cardName = cardName.replace('Undo', 'Equilibrium');
	cardName = cardName.replace('offering', 'Offering');
	cardName = cardName.replace('Shrug It off', 'Shrug It Off');
	cardName = cardName.replace('F T L', 'FTL');
	cardName = cardName.replace('Conserve Battery', 'Charge Battery');
	cardName = cardName.replace('All For One', 'All for One');
	cardName = cardName.replace('Turbo', 'TURBO');
	cardName = cardName.replace('Auto Shields', 'Auto-Shields');
	cardName = cardName.replace('Multi- Cast', 'Multi-Cast');
	cardName = cardName.replace('the Bomb', 'The Bomb');
	cardName = cardName.replace('Searing Blow+9', 'Searing Blow');
	cardName = cardName.replace('Vengeance', 'Simmering Fury');
	cardName = cardName.replace('Lockon', 'Bullseye');
	cardName = cardName.trim();
	if(cardName === "Steam") {
		cardName = "Tranquility";
	}
	if(cardName === "Redo") {
		cardName = "Recursion";
	}
	return cardName;
}

function refreshTable() {
	cardTable.innerHTML = 	`<thead> 
								<tr>
									<th>Name</th>
									<th>Rarity</th>
									<th>Plays</th>
									<th>Wins</th>
									<th>Win Rate</th>
									<th>Seen</th>
									<th>Picks</th>
									<th>Pick Rate</th> 
									<th>Pick x Win</th> 
									<th>Floor%</th>
								</tr>
							</thead>
							<tbody>
							</tbody>
							<tfoot> 
								<tr>
									<th>Name</th>
									<th>Rarity</th>
									<th>Plays</th>
									<th>Wins</th>
									<th>Win Rate</th>
									<th>Seen</th>
									<th>Picks</th>
									<th>Pick Rate</th> 
									<th>Pick x Win</th>
									<th>Floor%</th>
								</tr>
							</tfoot>`;
							
	for (const [key, value] of Object.entries(dictoCards)) {
		if(this.isValid(value)) {
			let row = cardTable.getElementsByTagName('tbody')[0].insertRow(-1);
			let cell0 = row.insertCell(0);
			let cell1 = row.insertCell(1);
			let cell2 = row.insertCell(2);
			let cell3 = row.insertCell(3);
			let cell4 = row.insertCell(4);
			let cell5 = row.insertCell(5);
			let cell6 = row.insertCell(6);
			let cell7 = row.insertCell(7);
			let cell8 = row.insertCell(8);
			let cell9 = row.insertCell(9);
			let winrate = Math.ceil(100 * value.winCount / value.playCount);
			let pickrate = Math.ceil(100 * value.pickCount / value.seeCount);
			let pickxwin = Math.ceil(winrate * pickrate / 100);
			let tbdFloors = Math.ceil(value.tbdFloors / value.pickCount);
			cell0.innerHTML = key;
			cell1.innerHTML = value.Rarity;
			cell2.innerHTML = isNaN(value.playCount) ? 0 : value.playCount;
			cell3.innerHTML = isNaN(value.winCount) ? 0 : value.winCount;
			cell4.innerHTML = isNaN(winrate) ? 0 : winrate;
			cell5.innerHTML = isNaN(value.seeCount) ? 0 : value.seeCount;
			cell6.innerHTML = isNaN(value.pickCount) ? 0 : value.pickCount;
			cell7.innerHTML = isNaN(pickrate) ? 0 : pickrate;
			cell8.innerHTML = isNaN(pickxwin) ? 0 : pickxwin;
			cell9.innerHTML = isNaN(tbdFloors) ? 0 : tbdFloors;
			
			addColors(cell0, value);
		}
	}
	table = $('#cardTable').dataTable( {
		destroy: true,
		"scrollY":        "80%",
		"scrollCollapse": true,
		"paging":         false,
		dom: 'Bfrtip',
		buttons: [
			{
				text: 'Red',
				className: getClassName('Red'),
				action: function ( e, dt, node, config ) {
					swapColor('Red');
				}
			},
			{
				text: 'Green',
				className: getClassName('Green'),
				action: function ( e, dt, node, config ) {
					swapColor('Green');
				}
			},
			{
				text: 'Blue',
				className: getClassName('Blue'),
				action: function ( e, dt, node, config ) {
					swapColor('Blue');
				}
			},
			{
				text: 'Purple',
				className: getClassName('Purple'),
				action: function ( e, dt, node, config ) {
					swapColor('Purple');
				}
			},
			{
				text: 'Colorless',
				className: getClassName('Colorless'),
				action: function ( e, dt, node, config ) {
					swapColor('Colorless');
				}
			},
			{
				text: 'Curse',
				className: getClassName('Curse'),
				action: function ( e, dt, node, config ) {
					swapColor('Curse');
				}
			}
		]
	} );
}

function addColors(cell0, value) {
	if(value.Color === "Red") {
		cell0.style.backgroundColor = "Coral";
	}
	if(value.Color === "Green") {
		cell0.style.backgroundColor = "MediumSeaGreen";
	}
	if(value.Color === "Blue") {
		cell0.style.backgroundColor = "SteelBlue";
	}
	if(value.Color === "Purple") {
		cell0.style.backgroundColor = "mediumpurple";
	}
	if(value.Color === "Curse") {
		cell0.style.backgroundColor = 'grey';
	}
	if(value.Color === "Colorless") {
		cell0.style.backgroundColor = 'silver';
	}
}

function getClassName(color) {
	if(colorFilter.includes(color)) {
		return "toggleActive";
	}
	return "";
}

function isValid(card) {
	if(card.Color === "Status") {
		return false;
	}
	if(card.Color === "Colorless" && card.Rarity === "Special" && card.Name !== "J.A.X.") {
		return false;
	}
	if(colorFilter.length < 1) {
		return true;
	}
	if(colorFilter.includes(card.Color)) {
		return true;
	}
	return false;
}