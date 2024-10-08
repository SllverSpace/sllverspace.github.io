
var gamesE = []

var selectedTags = []
var isBeta = false

var searchBox = new ui.TextBox("Search")
searchBox.outlineColour = [255, 255, 255, 1]
searchBox.colour = [10, 10, 10, 1]

var sortDrop = new ui.Dropdown(["Coolest", "Clicks", "Newest", "Oldest"])
sortDrop.bgColour = [22, 22, 22, 1]
sortDrop.outlineColour = [255, 255, 255, 1]

var sort = "Newest"

var lastSearch = ""

function createGames(games) {
	gamesE = []
	for (let data of games) {
		gamesE.push(new Game(0, 0, 0, 0, data))
	}
}

createGames(getGames(selectedTags, false))

function gamesTick() {
	ui.text(sidebar / 2, 50 * su, 75 * su, "Games", {align: "center"})

	backButton.basic()
	backButton.x = sidebar / 2
	backButton.y = 150 * su
	backButton.width = sidebar * 0.9
	backButton.height = 50 * su
	backButton.textSize = 35 * su
	backButton.textOff = -60 * su / 2
	backButton.bgColour = [0.25 * 255, 0.25 * 255, 0.25 * 255, 1]
	backButton.draw()
	ui.img(sidebar / 2 + 40 * su, 150 * su, 45 * su, 45 * su, hubImg)

	if (backButton.hovered() && mouse.lclick) {
		backButton.click()
		page = "silver"
	}

	let lines = ui.text(10 * su, 150 * su + 55 * su * 1, 20 * su, "This is a list of all the main games i have made in Godot, Scratch, and JS. \n \nLook at the info page on this website to find links for where the games are from.", {wrap: sidebar - 10 * su}).lines

	ui.rect(sidebar / 2, 150 * su + 55 * su * 1 + lines * 20 * su + 10 * su, sidebar, 5 * su, [255, 255, 255, 1])

	let starty = canvas.height-300*su
	
	ui.text(sidebar/2, starty + 35*su, 35*su, "Featured Game", {align: "center"})

	featuredGame.x = sidebar/2
	featuredGame.y = starty + 35*su + 130 * su
	featuredGame.width = 300*su
	featuredGame.height = 200*su
	featuredGame.basic(ui.hovered(featuredGame.x, featuredGame.y, featuredGame.width, featuredGame.height))
	featuredGame.draw()

	if (games[featured][5].includes("Beta")) {
		ctx.save()
		ctx.translate(sidebar/2-160*su, starty+255*su)
		ctx.rotate(Math.PI/16)
		ui.text(0, 0, 25*su, "BETA", {colour: [255, 50, 50, 1]})
		ctx.restore()
	}

	let is = 300*su
	let ia = 240/400

	let iw = Math.floor(content.width / (is))

	ui.setC(content)
	
	gameAddon = Math.ceil(gamesE.length / iw) * (is * ia) + 5*su

	let off = (content.width - iw*is)/2

	let x = 0
	let y = 0
	for (let game of gamesE) {
		if (x >= iw) {
			x = 0
			y += 1
		} 
		
		if (y*is*ia < canvas.height-content.off.y && y*is*ia + is*ia > 0-content.off.y) {
			game.x = x * is + is/2 + off
			game.y = y * (is * ia) + (is * ia)/2
			game.width = is
			game.height = is * ia
			game.basic(ui.hovered(game.x+content.x-content.width/2, game.y+content.off.y+content.y-content.height/2, game.width, game.height) && !sortDrop.hovered())
			game.draw()
		}
		
		x += 1
	}

	for (let game of gamesE) {
		if (game.size > 1 && game.y < canvas.height-content.off.y && game.y + is*ia > 0-content.off.y) {
			game.front()
		}
	}

	for (let game of gamesE) {
		if (game.hovered && game.y < canvas.height-content.off.y && game.y + is*ia > 0-content.off.y) {
			game.front()
		}
	}

	content.drawScroll({x: 10*su, y: 10*su}, 10*su)

	ui.setC()

	ui.rect(cSidebar+sidebar, canvas.height/2 + tSidebar/2, 5*su, canvas.height - tSidebar, [255, 255, 255, 1])
	ui.rect(sidebar + content.width/2 + (cSidebar - 1.25*su)/2, tSidebar, content.width+2.5*su+cSidebar, 5*su, [255, 255, 255, 1])

	searchBox.set(sidebar + content.width/2 - 45*su, 27.5*su, content.width-100*su, 50*su)
	searchBox.outlineSize = 10*su
	searchBox.hover()
	searchBox.draw()

	sortDrop.set(sidebar + content.width - 95*su, 27.5*su, 200*su, 50*su)
	sortDrop.set2(25*su, 5*su)
    sortDrop.basic()
    sortDrop.draw()

	if (searchBox.text != lastSearch) {
		createGames(getGames(selectedTags, isBeta))
		lastSearch = searchBox.text
	}

	for (let i = 0; i < tags.length; i++) {
		if (tags[i] == "None") { continue }
		let colour = [200, 200, 200, 1]
		let textColour = [255, 255, 255, 1]
		if (selectedTags.includes(tags[i]) || (isBeta && tags[i] == "Beta")) {
			colour = [125, 125, 125, 1]
			textColour = [200, 200, 200, 1]
		}
		if (ui.hovered(sidebar + cSidebar/2, i*42.5*su + tSidebar + 22.5*su, cSidebar-5*su, 40*su)) {
			colour[0] += 25; colour[1] += 25; colour[2] += 25
		}
		ui.rect(sidebar + cSidebar/2, i*42.5*su + tSidebar + 22.5*su, cSidebar-5*su, 40*su, colour)
		ui.text(sidebar + cSidebar/2, i*42.5*su + tSidebar + 22.5*su, 30*su, tags[i], {align: "center", colour: textColour})
	}

	for (let i = 0; i < tags.length; i++) {
		if (tags[i] == "None") { continue }
		if (ui.hovered(sidebar + cSidebar/2, i*42.5*su + tSidebar + 22.5*su, cSidebar-5*su, 40*su) && mouse.lclick) {
			if (tags[i] == "Beta") {
				isBeta = !isBeta
				createGames(getGames(selectedTags, isBeta))
			} else {
				if (selectedTags.includes(tags[i])) {
					selectedTags.splice(selectedTags.indexOf(tags[i]), 1)
					createGames(getGames(selectedTags, isBeta))
				} else {
					selectedTags.push(tags[i])
					createGames(getGames(selectedTags, isBeta))
				}
			}
		}
	}
}

function checkGames() {
	if (sortDrop.hovered()) return
	for (let game of gamesE) {
		if (game.hovered) {
			ws.send(JSON.stringify({click: [game.data, id]}))
			window.open(games[game.data][2], "_blank")
		}
	}
}

sortDrop.changed = (value) => {
	createGames(getGames(selectedTags, isBeta))
}
