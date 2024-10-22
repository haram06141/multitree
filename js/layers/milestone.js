addLayer("milestone_um", {
    name: "upgraded milestone", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "UM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#ccbb00",
    resource: "upgraded milestones", // Name of prestige currency
    type: "none",
    row: 1,
    layerShown(){return player.tm.currentTree==8 && player.tm.buyables[8].gte(2)},
	doReset(){},
	effectDescription: "Upgrade the tree to gain more.",
	tabFormat: ["main-display"],
	branches: ["milestone_m"],
	update(){
		player.milestone_um.points=new Decimal([0,0,2,5,9,14,16,18,21,24,28,30,34,39,40,42,45,47][player.tm.buyables[8].toNumber()]);
	}
})

addLayer("milestone_m", {
    name: "milestone", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#793784",
    requires(){
		if(player.milestone_m.points.gte([0,5,10,16,20,25,25,29,32,35,38,40,43,45,48,50,55,60][player.tm.buyables[8].toNumber()]))return new Decimal(Infinity);
		if(player.milestone_m.points.gte(55))return new Decimal(1);
		return new Decimal("e2e8");
	},
    resource: "MT-Milestones", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
	base: new Decimal("e1e7"),
	exponent: function(){
		var base=new Decimal(3);
		if(player.milestone_m.points.gte(50)){
			base = new Decimal(3.8);
			if(player.milestone_m.points.gte(55))base = base.add(0.025);
		}else{
			if(player.milestone_m.points.gte(16))base = base.add(0.15);
			if(player.milestone_m.points.gte(20))base = base.add(0.1);
			if(player.milestone_m.points.gte(25))base = base.add(0.25);
			if(player.milestone_m.points.gte(29))base = base.add(0.05);
			if(player.milestone_m.points.gte(35))base = base.add(0.058);
			if(player.milestone_m.points.gte(38))base = base.add(0.042);
			if(player.milestone_m.points.gte(40))base = base.add(0.025);
			if(player.milestone_m.points.gte(43))base = base.add(0.042);
			if(player.milestone_m.points.gte(45))base = base.add(0.033);
			if(player.milestone_m.points.gte(48))base = base.add(0.03);
		}
		return base;
	},
    layerShown(){return player.tm.currentTree==8},
		doReset(l){
			return;
		},
	resetsNothing(){return true},
	milestones: [
		{
			requirementDescription: "1st MT-Milestone",
            unlocked() {return player[this.layer].best.gte(0)},
            done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
            effectDescription: function(){
				if(player.tm.buyables[8].gte(2))return "Gain "+format(layers[this.layer].milestone1Effect())+" milestone power per second. (Upgraded)";
				return "Gain "+format(layers[this.layer].milestone1Effect())+" milestone power per second.";
			},
			style() {
				if(player.tm.buyables[8].gte(2)&&player[this.layer].best.gte(1)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "2nd MT-Milestone",
            unlocked() {return player[this.layer].best.gte(1)},
            done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
            effectDescription: function(){
				if(player.tm.buyables[8].gte(2))return "Points boost milestone power gain. Currently: "+format(layers[this.layer].milestone2Effect())+"x (Upgraded)";
				return "Points boost milestone power gain. Currently: "+format(layers[this.layer].milestone2Effect())+"x"
			},
			style() {
				if(player.tm.buyables[8].gte(2)&&player[this.layer].best.gte(2)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "3rd MT-Milestone",
            unlocked() {return player[this.layer].best.gte(2)},
            done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="First MT-Milestone's effect is boosted by your milestone power. Currently: "+format(tmp.milestone_m.milestone3Effect)+"x";
				if(player.tm.buyables[8].gte(3))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(3)&&player[this.layer].best.gte(3)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "4th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(3)},
            done() {return player[this.layer].best.gte(4)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="Third Milestone's effect is better based on your milestones. Currently: 3rd Milestone's base effect base +"+format(tmp.milestone_m.milestone4Effect);
				if(player.tm.buyables[8].gte(3))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(3)&&player[this.layer].best.gte(4)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "5th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(4)},
            done() {return player[this.layer].best.gte(5)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="Milestone Power boost Super Prestige point gain in the Incrementreeverse. Currently: "+format(tmp.milestone_m.milestone5Effect)+"x";
				if(player.tm.buyables[8].gte(3))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(3)&&player[this.layer].best.gte(5)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "6th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(5)},
            done() {return player[this.layer].best.gte(6)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="Prestige Point gain is boosted by your milestones. Currently: "+format(tmp.milestone_m.milestone6Effect)+"x";
				if(player.tm.buyables[8].gte(4))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(4)&&player[this.layer].best.gte(6)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "7th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(6)},
            done() {return player[this.layer].best.gte(7)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="Add another effect to milestone power.";
				if(player.tm.buyables[8].gte(4))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(4)&&player[this.layer].best.gte(7)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "8th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(7)},
            done() {return player[this.layer].best.gte(8)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="The effect of previous milestone is better.";
				if(player.tm.buyables[8].gte(4))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(4)&&player[this.layer].best.gte(8)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "9th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(8)},
            done() {return player[this.layer].best.gte(9)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="The effect of previous milestone is better.";
				if(player.tm.buyables[8].gte(4))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(4)&&player[this.layer].best.gte(9)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "10th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(9)},
            done() {return player[this.layer].best.gte(10)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				if(player.tm.buyables[8].gte(5))return "Gain 10000% of Prestige Points per second. (Upgraded)";
				return "Gain 100% of Prestige Points per second.";
			},
			style() {
				if(player.tm.buyables[8].gte(5)&&player[this.layer].best.gte(10)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "11th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(10)},
            done() {return player[this.layer].best.gte(11)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="Prestige Upgrade 11's effect is better.";
				if(player.tm.buyables[8].gte(5))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(5)&&player[this.layer].best.gte(11)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "12th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(11)},
            done() {return player[this.layer].best.gte(12)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="Prestige Upgrade 12's effect is better.";
				if(player.tm.buyables[8].gte(5))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(5)&&player[this.layer].best.gte(12)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "13th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(12)},
            done() {return player[this.layer].best.gte(13)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="Prestige Upgrade 13's effect is better.";
				if(player.tm.buyables[8].gte(5))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(5)&&player[this.layer].best.gte(13)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "14th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(13)},
            done() {return player[this.layer].best.gte(14)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="Prestige Upgrade 14's effect is better.";
				if(player.tm.buyables[8].gte(5))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(5)&&player[this.layer].best.gte(14)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "15th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(14)},
            done() {return player[this.layer].best.gte(15)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="The effect of 7th milestone is better.";
				if(player.tm.buyables[8].gte(6))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(6)&&player[this.layer].best.gte(15)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "16th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(15)},
            done() {return player[this.layer].best.gte(16)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="The effect of 5th milestone is better.";
				if(player.tm.buyables[8].gte(6))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(6)&&player[this.layer].best.gte(16)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "17th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(16)},
            done() {return player[this.layer].best.gte(17)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				if(player.tm.buyables[8].gte(7))return "3rd Milestone's effect ^1.027 (Upgraded)";
				return "3rd Milestone's effect ^1.017";
			},
			style() {
				if(player.tm.buyables[8].gte(7)&&player[this.layer].best.gte(17)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "18th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(17)},
            done() {return player[this.layer].best.gte(18)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				if(player.tm.buyables[8].gte(7))return "3rd Milestone's effect ^1.028 (Upgraded)";
				return "3rd Milestone's effect ^1.018";
			},
			style() {
				if(player.tm.buyables[8].gte(7)&&player[this.layer].best.gte(18)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "19th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(18)},
            done() {return player[this.layer].best.gte(19)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				if(player.tm.buyables[8].gte(8))return "The effect of 7th milestone is better. (Upgraded)";
				return "The effect of 7th milestone is better.";
			},
			style() {
				if(player.tm.buyables[8].gte(8)&&player[this.layer].best.gte(19)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "20th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(19)},
            done() {return player[this.layer].best.gte(20)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				if(player.tm.buyables[8].gte(8))return "The effect of 7th milestone is better. (Upgraded)";
				return "The effect of 7th milestone is better.";
			},
			style() {
				if(player.tm.buyables[8].gte(8)&&player[this.layer].best.gte(20)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "21st MT-Milestone",
            unlocked() {return player[this.layer].best.gte(20)},
            done() {return player[this.layer].best.gte(21)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="Milestone Power boost all Rings in T layer in the Game Dev Tree. Currently: "+format(tmp.milestone_m.milestone21Effect)+"x";
				if(player.tm.buyables[8].gte(8))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(8)&&player[this.layer].best.gte(21)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "22nd MT-Milestone",
            unlocked() {return player[this.layer].best.gte(21)},
            done() {return player[this.layer].best.gte(22)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				if(player.tm.buyables[8].gte(9))return "Prestige Point Gain is multiplied by 1e10 (Upgraded)";
				return "Prestige Point Gain is multiplied by 10";
			},
			style() {
				if(player.tm.buyables[8].gte(9)&&player[this.layer].best.gte(22)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "23rd MT-Milestone",
            unlocked() {return player[this.layer].best.gte(22)},
            done() {return player[this.layer].best.gte(23)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="Prestige Upgrade 23's effect is better.";
				if(player.tm.buyables[8].gte(9))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(9)&&player[this.layer].best.gte(23)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "24th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(23)},
            done() {return player[this.layer].best.gte(24)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="Prestige Upgrade 24's effect is better.";
				if(player.tm.buyables[8].gte(9))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(9)&&player[this.layer].best.gte(24)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "25th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(24)},
            done() {return player[this.layer].best.gte(25)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="Add another effect to milestone power.";
				if(player.tm.buyables[8].gte(10))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(10)&&player[this.layer].best.gte(25)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "26th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(25)},
            done() {return player[this.layer].best.gte(26)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="The effect of 7th milestone is better.";
				if(player.tm.buyables[8].gte(10))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(10)&&player[this.layer].best.gte(26)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "27th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(26)},
            done() {return player[this.layer].points.gte(27)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="Super-Prestige Point gain is boosted by your milestones. Currently: "+format(tmp.milestone_m.milestone27Effect)+"x";
				if(player.tm.buyables[8].gte(10))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(10)&&player[this.layer].best.gte(27)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "28th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(27)},
            done() {return player[this.layer].best.gte(28)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="The effect of 7th milestone is better.";
				if(player.tm.buyables[8].gte(10))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(10)&&player[this.layer].best.gte(28)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "29th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(28)},
            done() {return player[this.layer].best.gte(29)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="Milestone Power boost update gain in the Game Dev Tree. Currently: "+format(tmp.milestone_m.milestone29Effect)+"x";
				if(player.tm.buyables[8].gte(11))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(11)&&player[this.layer].best.gte(29)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "30th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(29)},
            done() {return player[this.layer].best.gte(30)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				if(player.tm.buyables[8].gte(11))return "The previous milestone also boost Time Flux, Lectures, Experience and Cash gain in the Game Dev Tree. (Upgraded)";
				return "The previous milestone also boost Time Flux and Lectures gain in the Game Dev Tree.";
			},
			style() {
				if(player.tm.buyables[8].gte(11)&&player[this.layer].best.gte(30)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "31st MT-Milestone",
            unlocked() {return player[this.layer].best.gte(30)},
            done() {return player[this.layer].best.gte(31)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="Prestige and Super-Prestige Upgrade 11's effect is better.";
				if(player.tm.buyables[8].gte(12))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(12)&&player[this.layer].best.gte(31)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "32nd MT-Milestone",
            unlocked() {return player[this.layer].best.gte(31)},
            done() {return player[this.layer].best.gte(32)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="Prestige and Super-Prestige Upgrade 12's effect is better.";
				if(player.tm.buyables[8].gte(12))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(12)&&player[this.layer].best.gte(32)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "33rd MT-Milestone",
            unlocked() {return player[this.layer].best.gte(32)},
            done() {return player[this.layer].best.gte(33)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="Prestige and Super-Prestige Upgrade 13's effect is better.";
				if(player.tm.buyables[8].gte(12))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(12)&&player[this.layer].best.gte(33)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "34th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(33)},
            done() {return player[this.layer].best.gte(34)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="Prestige and Super-Prestige Upgrade 14's effects are better; also, unlock a Multitree-Exclusive Prestige Upgrade.";
				if(player.tm.buyables[8].gte(12))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(12)&&player[this.layer].best.gte(34)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "35th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(34)},
            done() {return player[this.layer].best.gte(35)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="The effect of 29th milestone is better; also, unlock a Multitree-Exclusive Super-Prestige Upgrade.";
				if(player.tm.buyables[8].gte(13))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(13)&&player[this.layer].best.gte(35)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "36th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(35)},
            done() {return player[this.layer].best.gte(36)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				if(player.tm.buyables[8].gte(13))return "Gain 10000% of Super-Prestige Points per second. (Upgraded)";
				return "Gain 100% of Super-Prestige Points per second.";
			},
			style() {
				if(player.tm.buyables[8].gte(13)&&player[this.layer].best.gte(36)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "37th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(36)},
            done() {return player[this.layer].best.gte(37)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				if(player.tm.buyables[8].gte(13))return "3rd Milestone's effect ^1.049 (Upgraded)";
				return "3rd Milestone's effect ^1.037";
			},
			style() {
				if(player.tm.buyables[8].gte(13)&&player[this.layer].best.gte(37)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "38th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(37)},
            done() {return player[this.layer].best.gte(38)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				if(player.tm.buyables[8].gte(13))return "3rd Milestone's effect ^1.050 (Upgraded)";
				return "3rd Milestone's effect ^1.038";
			},
			style() {
				if(player.tm.buyables[8].gte(13)&&player[this.layer].best.gte(38)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "39th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(38)},
            done() {return player[this.layer].best.gte(39)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				if(player.tm.buyables[8].gte(13))return "3rd Milestone's effect ^1.051 (Upgraded)";
				return "3rd Milestone's effect ^1.039";
			},
			style() {
				if(player.tm.buyables[8].gte(13)&&player[this.layer].best.gte(39)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "40th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(39)},
            done() {return player[this.layer].best.gte(40)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="Increase 2nd Milestone Effect.";
				if(player.tm.buyables[8].gte(14))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(14)&&player[this.layer].best.gte(40)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "41st MT-Milestone",
            unlocked() {return player[this.layer].best.gte(40)},
            done() {return player[this.layer].best.gte(41)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				if(player.tm.buyables[8].gte(15))return "3rd Milestone's base effect exponent ^1.001 (Upgraded)";
				return "3rd Milestone's base effect exponent ^1.0005";
			},
			style() {
				if(player.tm.buyables[8].gte(15)&&player[this.layer].best.gte(41)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "42nd MT-Milestone",
            unlocked() {return player[this.layer].best.gte(41)},
            done() {return player[this.layer].best.gte(42)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				if(player.tm.buyables[8].gte(15))return "Effect of 2nd & 6th milestones ^3 (Upgraded)";
				return "Effect of 2nd & 6th milestones ^2";
			},
			style() {
				if(player.tm.buyables[8].gte(15)&&player[this.layer].best.gte(42)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "43rd MT-Milestone",
            unlocked() {return player[this.layer].best.gte(42)},
            done() {return player[this.layer].best.gte(43)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="4th milestone is better.";
				if(player.tm.buyables[8].gte(16))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(16)&&player[this.layer].best.gte(43)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "44th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(43)},
            done() {return player[this.layer].best.gte(44)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="First row of Prestige Upgrades is boosted.";
				if(player.tm.buyables[8].gte(16))ret+=" (Upgraded)";
				return ret;
			},
			style() {
				if(player.tm.buyables[8].gte(16)&&player[this.layer].best.gte(44)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "45th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(44)},
            done() {return player[this.layer].best.gte(45)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				if(player.tm.buyables[8].gte(16))return "3rd Milestone's base effect exponent ^1.001 (Upgraded)";
				return "3rd Milestone's base effect exponent ^1.0005";
			},
			style() {
				if(player.tm.buyables[8].gte(16)&&player[this.layer].best.gte(45)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "46th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(45)},
            done() {return player[this.layer].best.gte(46)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				if(player.tm.buyables[8].gte(17))return "3rd Milestone's base effect exponent ^1.001 (Upgraded)";
				return "3rd Milestone's base effect exponent ^1.0005";
			},
			style() {
				if(player.tm.buyables[8].gte(17)&&player[this.layer].best.gte(45)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "47th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(46)},
            done() {return player[this.layer].best.gte(47)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				if(player.tm.buyables[8].gte(17))return "27th Milestone's effect ^3 (Upgraded)";
				return "27th Milestone's effect ^2";
			},
			style() {
				if(player.tm.buyables[8].gte(17)&&player[this.layer].best.gte(45)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},
        },
		{
			requirementDescription: "48th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(47)},
            done() {return player[this.layer].best.gte(48)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "4th milestone is better.";
			},
        },
		{
			requirementDescription: "49th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(48)},
            done() {return player[this.layer].best.gte(49)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Super-Prestige Upgrade 11-14 are better.";
			},
        },
		{
			requirementDescription: "50th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(49)},
            done() {return player[this.layer].best.gte(50)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				let ret="Milestone Power Boost Pion gain in The Incrementreeverse. Currently: "+format(tmp.milestone_m.milestone50Effect)+"x";
				//if(player.tm.buyables[8].gte(3))ret+=" (Upgraded)";
				return ret;
			},/*
			style() {
				if(player.tm.buyables[8].gte(3)&&player[this.layer].best.gte(5)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},*/
        },
		{
			requirementDescription: "51st MT-Milestone",
            unlocked() {return player[this.layer].best.gte(50)},
            done() {return player[this.layer].best.gte(51)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				//if(player.tm.buyables[8].gte(16))return "3rd Milestone's base effect exponent ^1.001 (Upgraded)";
				return "3rd Milestone's base effect exponent ^1.0005";
			},/*
			style() {
				if(player.tm.buyables[8].gte(16)&&player[this.layer].best.gte(45)){
					return {backgroundColor: "#cccc00"};
				}
				return {};
			},*/
        },
		{
			requirementDescription: "52nd MT-Milestone",
            unlocked() {return player[this.layer].best.gte(51)},
            done() {return player[this.layer].best.gte(52)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "2nd Milestone is better.";
			},
        },
		{
			requirementDescription: "53rd MT-Milestone",
            unlocked() {return player[this.layer].best.gte(52)},
            done() {return player[this.layer].best.gte(53)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "4th Milestone is better.";
			},
        },
		{
			requirementDescription: "54th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(53)},
            done() {return player[this.layer].best.gte(54)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "50th Milestone is better.";
			},
        },
		{
			requirementDescription: "55th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(54)},
            done() {return player[this.layer].best.gte(55)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "50th Milestone is better.";
			},
        },
		{
			requirementDescription: "56th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(55)},
            done() {return player[this.layer].best.gte(56)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "5th Milestone is better.";
			},
        },
		{
			requirementDescription: "57th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(56)},
            done() {return player[this.layer].best.gte(57)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Unlock more upgrades, including a Multitree-Exclusive Super-Prestige Upgrade.";
			},
        },
		{
			requirementDescription: "58th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(57)},
            done() {return player[this.layer].best.gte(58)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "4th Milestone is better.";
			},
        },
		{
			requirementDescription: "59th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(58)},
            done() {return player[this.layer].best.gte(59)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "First row of Prestige Upgrades is boosted.";
			},
        },
		{
			requirementDescription: "60th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(59)},
            done() {return player[this.layer].best.gte(60)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Multitree Upgrade 55 is better.";
			},
        },
	],
	milestone1Effect(){
		var r=new Decimal(1);
		if(player.milestone_m.best.gte(2))r=r.mul(this.milestone2Effect());
		if(player.milestone_m.best.gte(3))r=r.mul(tmp.milestone_m.milestone3Effect);
		if(player.tm.buyables[8].gte(2))r=r.mul(3);
		if(hasUpgrade("milestone_p",11))r=r.mul(upgradeEffect("milestone_p",11));
		if(hasUpgrade("milestone_p",12))r=r.mul(upgradeEffect("milestone_p",12));
		if(hasUpgrade("milestone_sp",11))r=r.mul(upgradeEffect("milestone_sp",11));
		if(hasUpgrade("milestone_sp",12))r=r.mul(upgradeEffect("milestone_sp",12));
		return r;
	},
	update(diff){
		if(player.milestone_m.best.gte(1)){
			player.modpoints[8]=player.modpoints[8].add(layers.milestone_m.milestone1Effect().mul(diff));
		}
	},
	powerEffect(){
		let eff1=Decimal.pow(10,player.modpoints[8]);
		if(player.modpoints[8].gte(50000))eff1=player.modpoints[8].mul(2).pow(10000);
		let eff2=new Decimal(1);
		if(player.milestone_m.best.gte(25))eff2=player.modpoints[8].pow(1e6);
		if(hasUpgrade("milestone_p",15))eff2 = eff2.pow(upgradeEffect("milestone_p",15));
		if(hasUpgrade("milestone_sp",15))eff2 = eff2.pow(upgradeEffect("milestone_sp",15));
		return [eff1,eff2];
	},
	milestone2Effect(){
		if(player.milestone_m.best.gte(52)){
			let base=1.01;
			let ret = Decimal.pow(base,Decimal.log10(player.points.add(1e10)).pow(hasUpgrade("milestone_sp",25)?0.34:1/3).add(1));
			return ret;
		}
		if(player.milestone_m.best.gte(40)){
			let ret=player.points.add(1e100).log10();
			if(player.milestone_m.best.gte(42))ret=ret.pow(2);
			if(player.tm.buyables[8].gte(14))ret=ret.pow(2);
			if(player.tm.buyables[8].gte(15))ret=ret.pow(1.5);
			return ret;
		}
		if(player.tm.buyables[8].gte(2))return player.points.add(1e100).log10().log10().pow(1.5);
		return player.points.add(1e100).log10().log10();
	},
	milestone3Effect(){
		var m=Decimal.log10(player.modpoints[8].add(20)).pow(0.9);
		if(player.milestone_m.best.gte(41))m=m.pow(player.tm.buyables[8].gte(15)?1.001:1.0005);
		if(player.milestone_m.best.gte(45))m=m.pow(player.tm.buyables[8].gte(16)?1.001:1.0005);
		if(player.milestone_m.best.gte(46))m=m.pow(player.tm.buyables[8].gte(17)?1.001:1.0005);
		if(player.milestone_m.best.gte(51))m=m.pow(1.0005);
		var b=new Decimal(2);
		if(player.milestone_m.best.gte(4))b=b.add(layers.milestone_m.milestone4Effect());
		if(player.tm.buyables[8].gte(3))m=m.mul(1.016);
		if(player.milestone_m.best.gte(17))m=m.mul(1.017);
		if(player.milestone_m.best.gte(18))m=m.mul(1.018);
		if(player.tm.buyables[8].gte(7))m=m.mul(1.019);
		if(player.tm.buyables[8].gte(13))m=m.mul(1.036);
		if(player.milestone_m.best.gte(37))m=m.mul(1.037);
		if(player.milestone_m.best.gte(38))m=m.mul(1.038);
		if(player.milestone_m.best.gte(39))m=m.mul(1.039);
		if(hasUpgrade("milestone_p",23)){
			b=b.mul(player.milestone_p.points.add(1e20).log10().log10().div(player.tm.buyables[8].gte(9)?24:player.milestone_m.best.gte(23)?29:30).add(1));
		}
		if(hasUpgrade("milestone_p",24)){
			b=b.mul(player.milestone_p.points.add(1e20).log10().log10().div(player.tm.buyables[8].gte(9)?24:player.milestone_m.best.gte(24)?25:30).add(1));
		}
		if(hasUpgrade("milestone_sp",24)){
			b=b.mul(player.milestone_sp.points.add(1e20).log10().log10().div(100).add(1));
		}

		return Decimal.pow(b,m);
	},
	milestone4EffectExponent(){
		if(player.milestone_m.best.gte(58))return 0.53;
		if(player.milestone_m.best.gte(53))return 0.52;
		if(player.tm.buyables[8].gte(16))return 0.515;
		if(player.milestone_m.best.gte(48))return 0.512;
		if(player.milestone_m.best.gte(43))return 0.511;
		if(player.tm.buyables[8].gte(3))return 0.51;
		return 0.5;
	},
	milestone4Effect(){
		return player.milestone_m.best.sub(2).pow(layers.milestone_m.milestone4EffectExponent());
	},
	milestone5Effect(){
		if(player.milestone_m.best.gte(56))return player.modpoints[8].add(100).log10().pow(6);
		if(player.tm.buyables[8].gte(6))return player.modpoints[8].add(100).log10().pow(4);
		if(player.milestone_m.best.gte(15))return player.modpoints[8].add(100).log10().pow(3);
		if(player.tm.buyables[8].gte(3))return player.modpoints[8].add(100).log10().pow(2);
		return player.modpoints[8].add(100).log10();
	},
	milestone6Effect(){
		var p=player.milestone_m.best;
		if(player.tm.buyables[8].gte(4))p=p.pow(1.98);
		if(hasUpgrade("milestone_p",21))p=p.pow(1.5);
		if(hasUpgrade("milestone_p",22))p=p.pow(1.5);
		if(player.milestone_m.best.gte(42))p=p.pow(2);
		if(player.tm.buyables[8].gte(15))p=p.pow(1.5);
		if(hasUpgrade("milestone_sp",23))p=p.pow(2);
		return p;
	},
	milestone21Effect(){
		if(hasUpgrade("milestone_p",25))return player.modpoints[8].add(100).log10().pow(10);
		if(player.tm.buyables[8].gte(8))return player.modpoints[8].add(100).log10().pow(2);
		return player.modpoints[8].add(100).log10();
	},
	milestone27Effect(){
		var p=player.milestone_m.best;
		if(player.tm.buyables[8].gte(10))p=p.pow(2);
		if(player.milestone_m.best.gte(47))p=p.pow(2);
		if(hasUpgrade("milestone_sp",23))p=p.pow(2);
		if(player.tm.buyables[8].gte(17))p=p.pow(1.5);
		return p;
	},
	milestone29Effect(){
		if(player.tm.buyables[8].gte(13))return player.modpoints[8].add(100).log10().pow(10);
		if(player.tm.buyables[8].gte(10))return player.modpoints[8].add(100).log10().pow(5);
		if(player.milestone_m.best.gte(35))return player.modpoints[8].add(100).log10().pow(2);
		return player.modpoints[8].add(100).log10();
	},
	milestone50Effect(){
		if(player.milestone_m.best.gte(55))return player.modpoints[8].add(100).log10().pow(2);
		if(player.milestone_m.best.gte(54))return player.modpoints[8].add(100).log10();
		return player.modpoints[8].add(100).log10().sqrt();
	},
});


addLayer("milestone_p", {
    name: "milestone_p", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#658091",
    requires(){
		return new Decimal(1e6);
	},
    resource: "prestige points", // Name of prestige currency
    baseResource: "milestone power", // Name of resource prestige is based on
    baseAmount() {return player.modpoints[8]}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(player.milestone_m.best.gte(6))mult = mult.mul(tmp.milestone_m.milestone6Effect);
		if(hasUpgrade("milestone_p",13))mult=mult.mul(upgradeEffect("milestone_p",13));
		if(hasUpgrade("milestone_p",14))mult=mult.mul(upgradeEffect("milestone_p",14));
		if(hasUpgrade("milestone_sp",13))mult=mult.mul(upgradeEffect("milestone_sp",13));
		if(hasUpgrade("milestone_sp",14))mult=mult.mul(upgradeEffect("milestone_sp",14));
		if(player.milestone_m.best.gte(22))mult=mult.mul(10);
		if(player.tm.buyables[8].gte(9))mult=mult.mul(1e9);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
		let m=new Decimal(1);
		return m;
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
	exponent: 0.5,
    layerShown(){return player.tm.currentTree==8 && player.tm.buyables[8].gte(2)},
	upgrades: {
        rows: 4,
        cols: 5,
		11: {
			title: "Prestige Upgrade 11",
            description: "First Milestone's effect is boosted by your prestige points.",
            cost: new Decimal(1),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=3;
				if(player.milestone_m.points.gte(11))base+=0.25;
				if(player.tm.buyables[8].gte(5))base+=0.25;
				if(player.milestone_m.points.gte(31))base+=0.25;
				if(player.tm.buyables[8].gte(12))base+=0.25;
				if(player.milestone_m.points.gte(44))base+=0.1;
				if(player.tm.buyables[8].gte(16))base+=0.1;
				if(player.milestone_m.points.gte(59))base+=0.1;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		12: {
			title: "Prestige Upgrade 12",
            description: "First Milestone's effect is boosted by your prestige points.",
            cost: new Decimal(4),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=2;
				if(player.milestone_m.points.gte(12))base+=0.2;
				if(player.tm.buyables[8].gte(5))base+=0.2;
				if(player.milestone_m.points.gte(32))base+=0.1;
				if(player.tm.buyables[8].gte(12))base+=0.1;
				if(player.milestone_m.points.gte(44))base+=0.1;
				if(player.tm.buyables[8].gte(16))base+=0.1;
				if(player.milestone_m.points.gte(59))base+=0.05;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		13: {
			title: "Prestige Upgrade 13",
            description: "Prestige Point gain is boosted by your prestige points.",
            cost: new Decimal(100000000),
            unlocked() { return player.tm.buyables[8].gte(3)}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=1.2;
				if(player.milestone_m.points.gte(13))base+=0.1;
				if(player.tm.buyables[8].gte(5))base+=0.2;
				if(player.milestone_m.points.gte(33))base+=0.025;
				if(player.tm.buyables[8].gte(12))base+=0.025;
				if(player.milestone_m.points.gte(44))base+=0.025;
				if(player.tm.buyables[8].gte(16))base+=0.025;
				if(player.milestone_m.points.gte(59))base+=0.025;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		14: {
			title: "Prestige Upgrade 14",
            description: "Prestige Point gain is boosted by your prestige points.",
            cost: new Decimal(1e11),
            unlocked() { return player.tm.buyables[8].gte(3)}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=1.1;
				if(player.milestone_m.points.gte(14))base+=0.05;
				if(player.tm.buyables[8].gte(5))base+=0.1;
				if(player.milestone_m.points.gte(34))base+=0.05;
				if(player.tm.buyables[8].gte(12))base+=0.05;
				if(player.milestone_m.points.gte(44))base+=0.025;
				if(player.tm.buyables[8].gte(16))base+=0.025;
				if(player.milestone_m.points.gte(59))base+=0.025;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		15: {
			title: "Prestige Upgrade 15",
            description: "Milestone Power effect to point gain is raised to a power.",
            cost: new Decimal("1e500"),
            unlocked() { return player.milestone_m.points.gte(34)}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                let ret = 50;
                return ret;
            },
            effectDisplay() { return "^"+format(this.effect()) }, // Add formatting to the effect
        },
		21: {
			title: "Prestige Upgrade 21",
            description: "6th Milestone's effect ^1.5",
            cost: new Decimal(1e25),
            unlocked() { return player.tm.buyables[8].gte(4)}, // The upgrade is only visible when this is true
        },
		22: {
			title: "Prestige Upgrade 22",
            description: "6th Milestone's effect ^1.5",
            cost: new Decimal(1e33),
            unlocked() { return player.tm.buyables[8].gte(4)}, // The upgrade is only visible when this is true
        },
		23: {
			title: "Prestige Upgrade 23",
            description: "Third Milestone's effect is boosted by your prestige points.",
            cost: new Decimal(1e63),
            unlocked() { return player.tm.buyables[8].gte(5)}, // The upgrade is only visible when this is true
        },
		24: {
			title: "Prestige Upgrade 24",
            description: "Third Milestone's effect is boosted by your prestige points.",
            cost: new Decimal(1e80),
            unlocked() { return player.tm.buyables[8].gte(5)}, // The upgrade is only visible when this is true
        },
		25: {
			title: "Prestige Upgrade 25",
            description: "21st milestone's effect ^5",
            cost: new Decimal("1e560"),
            unlocked() { return player.milestone_m.points.gte(34)}, // The upgrade is only visible when this is true
        },
	},
	branches: ["milestone_m"],
	passiveGeneration(){
		if(player.tm.buyables[8].gte(5))return 100;
		if(player.milestone_m.best.gte(10))return 1;
		return 0;
	},
	softcap(){
		return new Decimal(Infinity);
	},
	softcapPower(){
		return new Decimal(1);
	},
		doReset(l){
			if(l=="milestone_p" || !l.startsWith("milestone_")){return;}
			var b=new Decimal(player[this.layer].best);
			layerDataReset(this.layer,["upgrades","milestones","challenges"]);
			player[this.layer].best=b;
			return;
		},
})



addLayer("milestone_sp", {
    name: "milestone_sp", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SP", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#65A0B0",
    requires(){
		return new Decimal(1e98);
	}, // Can be a function that takes requirement increases into account
    resource: "super-prestige points", // Name of prestige currency
    baseResource: "prestige points", // Name of resource prestige is based on
    baseAmount() {return player.milestone_p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(player.milestone_m.best.gte(27))mult = mult.mul(tmp.milestone_m.milestone27Effect);
		if(hasUpgrade("milestone_sp",21))mult=mult.mul(upgradeEffect("milestone_sp",21));
		if(hasUpgrade("milestone_sp",22))mult=mult.mul(upgradeEffect("milestone_sp",22));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
	exponent: 0.1,
    layerShown(){return player.tm.currentTree==8 && player.tm.buyables[8].gte(6)},
	upgrades: {
        rows: 4,
        cols: 5,
		11: {
			title: "Super-Prestige Upgrade 11",
            description: "First Milestone's effect is boosted by your super-prestige points.",
            cost: new Decimal(1),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=50;
				if(player.milestone_m.points.gte(31))base+=2.5;
				if(player.tm.buyables[8].gte(12))base+=2.5;
				if(player.milestone_m.points.gte(49))base+=2.5;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		12: {
			title: "Super-Prestige Upgrade 12",
            description: "First Milestone's effect is boosted by your super-prestige points.",
            cost: new Decimal(4),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=10;
				if(player.milestone_m.points.gte(32))base+=0.5;
				if(player.tm.buyables[8].gte(12))base+=0.5;
				if(player.milestone_m.points.gte(49))base+=0.5;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		13: {
			title: "Super-Prestige Upgrade 13",
            description: "Prestige Point gain is boosted by your super-prestige points.",
            cost: new Decimal(1e15),
            unlocked() { return player.tm.buyables[8].gte(9)}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=3;
				if(player.milestone_m.points.gte(33))base+=0.25;
				if(player.tm.buyables[8].gte(12))base+=0.25;
				if(player.milestone_m.points.gte(49))base+=0.25;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		14: {
			title: "Super-Prestige Upgrade 14",
            description: "Prestige Point gain is boosted by your super-prestige points.",
            cost: new Decimal(1e33),
            unlocked() { return player.tm.buyables[8].gte(9)}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=1.5;
				if(player.milestone_m.points.gte(34))base+=0.25;
				if(player.tm.buyables[8].gte(12))base+=0.25;
				if(player.milestone_m.points.gte(49))base+=0.25;
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		15: {
			title: "Super-Prestige Upgrade 15",
            description: "Milestone Power effect to point gain is raised to a power.",
            cost: new Decimal(2e43),
            unlocked() { return player.milestone_m.points.gte(35)}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                let ret = 2;
                return ret;
            },
            effectDisplay() { return "^"+format(this.effect()) }, // Add formatting to the effect
        },
		21: {
			title: "Super-Prestige Upgrade 21",
            description: "Super-Prestige Point gain is boosted by your super-prestige points.",
            cost: new Decimal(1e52),
            unlocked() { return player.tm.buyables[8].gte(10)}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=1.3;
				//if(player.m.effective.gte(266))base+=4.1;//5.4
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		22: {
			title: "Super-Prestige Upgrade 22",
            description: "Super-Prestige Point gain is boosted by your super-prestige points.",
            cost: new Decimal(1e110),
            unlocked() { return player.tm.buyables[8].gte(10)}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=1.1;
				//if(player.m.effective.gte(266))base+=2.5;//3.6
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
		23: {
			title: "Super-Prestige Upgrade 23",
            description: "6th and 27th Milestone's effect ^2",
            cost: new Decimal("1e437"),
            unlocked() { return player.tm.buyables[8].gte(16)}, // The upgrade is only visible when this is true
        },
		24: {
			title: "Super-Prestige Upgrade 24",
            description: "Third Milestone's effect is boosted by your super-prestige points.",
            cost: new Decimal("1e578"),
            unlocked() { return player.tm.buyables[8].gte(16)}, // The upgrade is only visible when this is true
        },
		25: {
			title: "Super-Prestige Upgrade 25",
            description: "2nd milestone is better.",
            cost: new Decimal("1e600"),
            unlocked() { return player.tm.buyables[8].gte(16)}, // The upgrade is only visible when this is true
        },

	},
	branches: ["milestone_p"],
	passiveGeneration(){
		if(player.tm.buyables[8].gte(13))return 100;
		if(player.milestone_m.best.gte(36))return 1;
		return 0;
	},
	softcap:new Decimal(Infinity),
	softcapPower:new Decimal(1),
		doReset(l){
			if(l=="milestone_p" || l=="milestone_sp" || !l.startsWith("milestone_")){return;}
			var b=new Decimal(player[this.layer].best);
			layerDataReset(this.layer,["upgrades","milestones","challenges"]);
			player[this.layer].best=b;
			return;
		}
})