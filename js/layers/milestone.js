
addLayer("milestone_m", {
    name: "milestone", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#793784",
    requires(){
		if(player.milestone_m.points.gte([0,5,10,16,20,25,25][player.tm.buyables[8].toNumber()]))return new Decimal(Infinity);
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
		if(player.milestone_m.points.gte(16))base = base.add(0.15);
		if(player.milestone_m.points.gte(20))base = base.add(0.1);
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
				if(player.tm.buyables[8].gte(2))return "Points boost milestone power gain. Currently: "+format(player.points.add(1e100).log10().log10().pow(1.5))+"x (Upgraded)";
				return "Points boost milestone power gain. Currently: "+format(player.points.add(1e100).log10().log10())+"x"
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
				return "The effect of 7th milestone is better.";
			},
        },
		{
			requirementDescription: "20th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(19)},
            done() {return player[this.layer].best.gte(20)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "The effect of 7th milestone is better.";
			},
        },
		{
			requirementDescription: "21st MT-Milestone",
            unlocked() {return player[this.layer].best.gte(20)},
            done() {return player[this.layer].best.gte(21)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Milestone Power boost all Rings in T layer in the Game Dev Tree. Currently: "+format(tmp.milestone_m.milestone21Effect)+"x";
			},
        },
		{
			requirementDescription: "22nd MT-Milestone",
            unlocked() {return player[this.layer].best.gte(21)},
            done() {return player[this.layer].best.gte(22)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Prestige Point Gain is multiplied by 10";
			},
        },
		{
			requirementDescription: "23rd MT-Milestone",
            unlocked() {return player[this.layer].best.gte(22)},
            done() {return player[this.layer].best.gte(23)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Prestige Upgrade 23's effect is better.";
			},
        },
		{
			requirementDescription: "24th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(23)},
            done() {return player[this.layer].best.gte(24)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Prestige Upgrade 24's effect is better.";
			},
        },
		{
			requirementDescription: "25th MT-Milestone",
            unlocked() {return player[this.layer].best.gte(24)},
            done() {return player[this.layer].best.gte(25)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "Add another effect to milestone power.";
			},
        },
	],
	milestone1Effect(){
		var r=new Decimal(1);
		if(player.milestone_m.best.gte(2))r=r.mul(player.points.add(1e100).log10().log10());
		if(player.milestone_m.best.gte(2)&&player.tm.buyables[8].gte(2))r=r.mul(player.points.add(1e100).log10().log10().pow(0.5));
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
		return [eff1,eff2];
	},
	milestone3Effect(){
		var m=Decimal.log10(player.modpoints[8].add(20)).pow(0.9);
		var b=new Decimal(2);
		if(player.milestone_m.best.gte(4))b=b.add(layers.milestone_m.milestone4Effect());
		if(player.tm.buyables[8].gte(3))m=m.mul(1.016);
		if(player.milestone_m.best.gte(17))m=m.mul(1.017);
		if(player.milestone_m.best.gte(18))m=m.mul(1.018);
		if(player.tm.buyables[8].gte(7))m=m.mul(1.019);
		if(hasUpgrade("milestone_p",23)){
			b=b.mul(player.milestone_p.points.add(1e20).log10().log10().div(player.milestone_m.best.gte(23)?29:30).add(1));
		}
		if(hasUpgrade("milestone_p",24)){
			b=b.mul(player.milestone_p.points.add(1e20).log10().log10().div(player.milestone_m.best.gte(24)?25:30).add(1));
		}
		return Decimal.pow(b,m);
	},
	milestone4EffectExponent(){
		if(player.tm.buyables[8].gte(3))return 0.51;
		return 0.5;
	},
	milestone4Effect(){
		return player.milestone_m.best.sub(2).pow(layers.milestone_m.milestone4EffectExponent());
	},
	milestone5Effect(){
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
		return p;
	},
	milestone21Effect(){
		return player.modpoints[8].add(100).log10();
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
		if(player.milestone_m.best.gte(22))mult=mult.mul(10);
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
        cols: 4,
		11: {
			title: "Prestige Upgrade 11",
            description: "First Milestone's effect is boosted by your prestige points.",
            cost: new Decimal(1),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=3;
				if(player.milestone_m.points.gte(11))base+=0.25;
				if(player.tm.buyables[8].gte(5))base+=0.25;
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
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
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
        cols: 4,
		11: {
			title: "Super-Prestige Upgrade 11",
            description: "First Milestone's effect is boosted by your super-prestige points.",
            cost: new Decimal(1),
            unlocked() { return true}, // The upgrade is only visible when this is true
			effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
				let base=50;
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
                let ret = Decimal.pow(base,Decimal.log10(player[this.layer].points.add(1)).pow(0.9).add(1))
                return ret;
            },
            effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
        },
	},
	branches: ["milestone_p"],
	passiveGeneration(){
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