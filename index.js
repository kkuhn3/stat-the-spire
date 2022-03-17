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
		//json.is_ascension_mode
		for(let j = 0; j < json.master_deck.length; j++) {
			let cardName = json.master_deck[j];
			cardName = replaceIdWithName(cardName);
			if(dictoCards[cardName]) {
				if(dictoCards[cardName].playCount) {
					dictoCards[cardName].playCount++;
				}
				else {
					dictoCards[cardName].playCount = 1;
				}
				if(dictoCards[cardName].winCount) {
					if(json.victory) {
						dictoCards[cardName].winCount++;
					}
				}
				else {
					if(json.victory) {
						dictoCards[cardName].winCount = 1;
					}
					else {
						dictoCards[cardName].winCount = 0;
					}
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
					if(dictoCards[cardName].seeCount) {
						dictoCards[cardName].seeCount++;
					}
					else {
						dictoCards[cardName].seeCount = 1;
					}
				}
				else {
					loMiaCards.add(cardName);
				}
			}
			let cardName = json.card_choices[k].picked;
			cardName = replaceIdWithName(cardName);
			if(dictoCards[cardName]) {
				if(dictoCards[cardName].seeCount) {
					dictoCards[cardName].seeCount++;
				}
				else {
					dictoCards[cardName].seeCount = 1;
				}
				if(dictoCards[cardName].pickCount) {
					dictoCards[cardName].pickCount++;
				}
				else {
					dictoCards[cardName].pickCount = 1;
				}
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
									<th>Plays</th>
									<th>Wins</th>
									<th>Win Rate</th>
									<th>Seen</th>
									<th>Picks</th>
									<th>Pick Rate</th> 
									<th>Pick x Win</th> 
									<th>Floors Climbed</th>
								</tr>
							</thead>
							<tbody>
							</tbody>
							<tfoot> 
								<tr>
									<th>Name</th>
									<th>Plays</th>
									<th>Wins</th>
									<th>Win Rate</th>
									<th>Seen</th>
									<th>Picks</th>
									<th>Pick Rate</th> 
									<th>Pick x Win</th>
									<th>Floors Climbed</th>
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
			let winrate = Math.ceil(100 * value.winCount / value.playCount);
			let pickrate = Math.ceil(100 * value.pickCount / value.seeCount);
			let pickxwin = Math.ceil(winrate * pickrate / 100);
			cell0.innerHTML = key;
			cell1.innerHTML = isNaN(value.playCount) ? 0 : value.playCount;
			cell2.innerHTML = isNaN(value.winCount) ? 0 : value.winCount;
			cell3.innerHTML = isNaN(winrate) ? 0 : winrate;
			cell4.innerHTML = isNaN(value.seeCount) ? 0 : value.seeCount;
			cell5.innerHTML = isNaN(value.pickCount) ? 0 : value.pickCount;
			cell6.innerHTML = isNaN(pickrate) ? 0 : pickrate;
			cell7.innerHTML = isNaN(pickxwin) ? 0 : pickxwin;
			cell8.innerHTML = "TBD";
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