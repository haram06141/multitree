let modInfo = {
	name: "The Multitree",
	id: "multitree",
	author: "loader3229",
	pointsName: "points",
	discordName: "loader3229's Discord Server",
	discordLink: "https://discord.gg/jztUReQ2vT",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 24,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.6.1.1",
	name: "Milestones!",
}

let changelog = `
	<h3>v1.6.1.1</h3><br>
	- Fixed an NaN issue<br>
	<h3>v1.6.1</h3><br>
	- Added Upgraded Milestones in The Milestone Tree<br>
	- Endgame: ee11 points<br>
	<h3>v1.6</h3><br>
	- Added a new tree (The Milestone Tree)<br>
	- Endgame: e3.9e8 points<br>
	<h3>v1.5.4.1</h3><br>
	- Added Super-Generators in TPTR<br>
	- Endgame: e1.07e8 points<br>
	<h3>v1.5.4</h3><br>
	- Added Hindrance in TPTR<br>
	- Added Quirks in TPTR<br>
	- Endgame: e9.8e7 points<br>
	<h3>v1.5.3.2</h3><br>
	- Fixed some bugs<br>
	- Endgame: e3.9e7 points<br>
	<h3>v1.5.3.1</h3><br>
	- Fixed some bugs<br>
	- Endgame: e3.78e7 points<br>
	<h3>v1.5.3</h3><br>
	- Added Space Energy in TPTR<br>
	- Added Enhance in TPTR<br>
	- Endgame: e3.75e7 points<br>
	<h3>v1.5.2.1</h3><br>
	- Added Time Capsules in TPTR<br>
	- Endgame: e2.75e7 points<br>
	<h3>v1.5.2</h3><br>
	- Endgame: e2.57e7 points<br>
	<h3>v1.5.1</h3><br>
	- Added Generators in TPTR<br>
	- Endgame: e2.23e7 points<br>
	<h3>v1.5</h3><br>
	- Added a new tree (The Prestige Tree Rewritten)<br>
	- Added Rewrite TPT<br>
	- Endgame: e2.18e7 points, 4 Boosters in The Prestige Tree Rewritten<br>
	<h3>v1.4.5</h3><br>
	- Endgame: e1.7e7 points<br>
	<h3>v1.4.4</h3><br>
	- Endgame: e3e6 points<br>
	<h3>v1.4.3</h3><br>
	- Endgame: e2e6 points<br>
	<h3>v1.4.2</h3><br>
	- Endgame: e1.5e6 points<br>
	<h3>v1.4.1</h3><br>
	- Endgame: e1.1e6 points<br>
	<h3>v1.4</h3><br>
	- Added a new tree (The Game Dev Tree)<br>
	- Endgame: 6 mastery bricks in The Prestige Tree Classic, e6.7e5 points<br>
	<h3>v1.3</h3><br>
	- Added a new tree (The Incrementreeverse)<br>
	- Endgame: Antimatter challenge 2 in The Incrementreeverse completed, e3e5 points<br>
	<h3>v1.2</h3><br>
	- Added a new tree (The Burning Tree)<br>
	- Endgame: e55000 points<br>
	<h3>v1.1.2</h3><br>
	- Added Hotkeys<br>
	<h3>v1.1.1</h3><br>
	- Fixed an NaN issue<br>
	<h3>v1.1</h3><br>
	- Added a new tree (The Prestige Forest)<br>
	- Endgame: e15600 points<br>
	<h3>v1.0</h3><br>
	- Added 2 trees (The Prestige Tree Classic, The Stardust Tree)<br>
	- Endgame: e6000 points<br>
`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if(hasUpgrade("tptc_p",11))gain = gain.mul(upgradeEffect("tptc_p",11));
	if(hasUpgrade("tptc_p",12))gain = gain.mul(upgradeEffect("tptc_p",12));
	gain = gain.mul(tmp.tptc_b.effect);
	gain = gain.mul(tmp.tptc_g.getGenPowerEff);
	gain = gain.mul(tmp.tptc_t.getEnergyEff);
	gain = gain.mul(tmp.tptc_s.buyables[11].effect);
	gain = gain.mul(tmp.tptc_q.quirkEff);
	if(hasUpgrade("tptc_sp",12))gain = gain.mul(upgradeEffect("tptc_sp",12));
	gain = gain.mul(tmp.tm.buyables[0].effect);
	
	
	let mfot=new Decimal(1);
	if(hasUpgrade("stardust_s",12))mfot = mfot.mul(upgradeEffect("stardust_s",12));
	if(hasUpgrade("forest_p",21))mfot = mfot.mul(upgradeEffect("forest_p",21));
	if(hasUpgrade("burning_a",14))mfot = mfot.mul(upgradeEffect("burning_a",14));
	if(hasUpgrade("incrementy_i",13))mfot = mfot.mul(upgradeEffect("incrementy_i",13));
	if(hasUpgrade("gd_u",21))mfot = mfot.mul(upgradeEffect("gd_u",21));
	mfot = mfot.mul(buyableEffect("gd_f",15));
	if(inChallenge("tptc_ge",11))mfot = mfot.pow(layers.tptc_ge.c11pow());
	if(inChallenge("tptr_h",22)&&inChallenge("incrementy_am",12))return mfot.pow(0.1);
	if(inChallenge("tptr_h",22))return mfot;
	gain=gain.mul(mfot);
	
	if(inChallenge("incrementy_am",12))gain=gain.pow(0.1);
	
	return gain;
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	modpoints: [new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)]
}}

var TREES=["","The Prestige Tree Classic","The Stardust Tree","The Prestige Forest","The Burning Tree","The Incrementreeverse","The Game Dev Tree","The Prestige Tree Rewritten","The Milestone Tree"];
var TREEAUTHOR=["","jacorb90","okamii17","unpingabot","thefinaluptake","pg132","thepaperpilot","jacorb90","loader3229"];
var MODPOINTSNAME=["","","energy","energy","embers","incrementy","hours of work","rewritten points","milestone power"];
var TREEVERS=[[],["","Pre-Alpha Build 1","Pre-Alpha Build 2","Alpha Build 1","Beta v1.0","Beta v1.1 Alpha 12","Beta v1.1","Beta v1.2","1.0","1.1","1.1","1.1","1.1","1.1","1.1","1.2","1.2","1.2","1.2","1.2","1.2"],["","0.0.3a","0.0.3a","0.0.3a","0.0.3a","0.0.3a","0.0.3a","0.0.3a","0.0.3a","0.0.3a","0.0.3a","0.0.3a","0.0.3a"],["","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0","0.0"],["","0.0.1","0.0.2","0.2.0","0.2.0","0.2.0","0.2.0"],["","0.1","0.3","0.4","0.5","0.5","0.6","0.7","0.8","0.8","0.8","0.85","0.85","0.85","0.87","0.87","0.88","0.88","0.88","0.9","0.9","0.9","0.9","0.9","0.9","0.91","0.91","0.92","0.92","0.92","0.92","0.92","0.92","0.92","0.92","0.92","0.92"],["","0.0","0.1","0.2","0.2","0.2","1.0","1.0","1.0","1.0","1.0","1.0"],["","0.1","0.2","0.3","0.3","0.3","0.3","0.4","0.4","0.4","0.5","0.5","0.5","0.5","0.5","0.5","0.5","0.5","0.5","0.5","0.5","0.5","0.5","0.5","0.6","0.6"],["","1.005","1.010","1.016","1.019"]];

// Display extra things at the top of the page
var displayThings = [
	"Mod Author: loader3229",
	function(){
		if(hasUpgrade("tptc_p",13)){
			return "Current Tree: "+TREES[player.tm.currentTree]+" Version "+TREEVERS[player.tm.currentTree][player.tm.buyables[player.tm.currentTree].toNumber()];
		}
		return "";
	},
	function(){
		if(player.tm.currentTree!=1){
			return "You have "+format(player.modpoints[player.tm.currentTree])+" "+MODPOINTSNAME[player.tm.currentTree];
		}
		return "";
	},
	function(){
		if(player.tm.currentTree==4){
			return "Flame Strength: "+format(player.burning_a.flameStrength)+"/"+format(tmp.burning_a.maxFlameStrength);
		}
		if(player.tm.currentTree==6){
			return "Base productivity is "+format(tmp.gd_u.upgrades[11].realEffect);
		}
		if(player.tm.currentTree==8){
			let ret="Milestone Power Effects: <br>"+format(tmp.milestone_m.powerEffect[0])+"x Prestige point gain in TPTR";
			if(player.milestone_m.best.gte(7))ret="Milestone Power Effects: <br>"+format((tmp.milestone_m.powerEffect[0]||new Decimal(1)).pow(player.milestone_m.best.gte(19)?0.35:player.tm.buyables[8].gte(4)?(1/3):player.milestone_m.best.gte(15)?0.3:player.milestone_m.best.gte(9)?0.25:player.milestone_m.best.gte(8)?0.2:0.1))+"x Rewritten Point gain & "+format(tmp.milestone_m.powerEffect[0])+"x Prestige point gain in TPTR";
			return ret;
		}
		return "";
	},
	function(){
		if(player.tm.currentTree==6){
			return "Productivity slowdown starts at "+format(tmp.gd_u.scstart);
		}
		return "";
	},
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte("ee11");
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}