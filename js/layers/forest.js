

addLayer("forest_p", {
    name: "forest_p", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		amtsacrificed: new Decimal(0),
		amtcompressed: new Decimal(0),
    }},
    color: "#ffffff",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "particles", // Name of prestige currency
    baseResource: "energy", // Name of resource prestige is based on
    baseAmount() {return player.modpoints[3]}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
		if(player.forest_c.best.gte(1)){
			return 0.75;
		}
		if(player.forest_A.best.gte(1)){
			return 0.7;
		}
		return 0.5;
	}, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(hasUpgrade("forest_p",14))mult=mult.mul(upgradeEffect("forest_p",14));
		if(hasUpgrade("tptc_p",22))mult=mult.mul(upgradeEffect("tptc_p",22));
		if(hasUpgrade("forest_p",25))mult=mult.mul(clickableEffect("forest_p",12));
		if(hasUpgrade("forest_A",11))mult=mult.mul(upgradeEffect("forest_A",11));
		if(hasUpgrade("forest_p",43))mult=mult.mul(upgradeEffect("forest_p",43));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown(){return player.tm.currentTree==3},
		
    resetDescription: "Change the energy's form for ",
		doReset(l){
			if(l=="forest_p" || !l.startsWith("forest_")){return;}
			layerDataReset("forest_p",["upgrades","milestones","challenges"]);
			return;
		},
		
		upgrades: {
            rows: 5,
            cols: 5,
			11: {
				title: "Particle Upgrade 11",
                description() {
					return "Gain "+format(this.effect())+" energy per second."
				},
                cost: new Decimal(0),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
					let ret = new Decimal(1);
					if(hasUpgrade("forest_p",12))ret=ret.mul(upgradeEffect("forest_p",12));
					if(hasUpgrade("forest_p",13))ret=ret.mul(upgradeEffect("forest_p",13));
					if(hasUpgrade("forest_p",15))ret=ret.mul(clickableEffect("forest_p",11));
					if(hasUpgrade("forest_p",22))ret=ret.mul(upgradeEffect("forest_p",22));
					if(hasUpgrade("forest_A",11))ret=ret.mul(upgradeEffect("forest_A",11));
					if(hasUpgrade("forest_p",41))ret=ret.mul(upgradeEffect("forest_p",41));
                    return ret;
                },
            },
			12: {
				title: "Particle Upgrade 12",
                description: "Particles are now being smashed together multiplying energy gain",
                cost: new Decimal(1),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
					let ret = player.forest_p.points.add(2).sqrt();
					if(hasUpgrade("forest_p",34))ret=ret.pow(1.2);
                    return ret;
                },
				effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			13: {
				title: "Particle Upgrade 13",
                description: "Energy is now drawn towards the generator, making it stronger",
                cost: new Decimal(5),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
					if (player.modpoints[3].lessThan(1)) return 1
					let logamt = new Decimal("1000").div(player.modpoints[3].root(1.01)).add(1.05)
					if(hasUpgrade("forest_p",31)){
						logamt = logamt.sub(0.04);
					}
					if(hasUpgrade("forest_p",42)){
						logamt = logamt.sub(0.009);
					}
					let value = player.modpoints[3].log(logamt).add(2);
					if(hasUpgrade("forest_p",31))value=value.pow(1.1);
					if(hasUpgrade("forest_A",12))value=value.pow(upgradeEffect("forest_A",12));
					if(hasUpgrade("forest_p",42))value=value.pow(1.1);
					if (value.lessThan(2)) return 2
					return value;
                },
				effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			14: {
				title: "Particle Upgrade 14",
                description: "Uses gravity to create more particles (Particle Upgrade 13 boost Particle gain)",
                cost: new Decimal(10),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
					let value = new Decimal(upgradeEffect("forest_p", 13)).pow((.5))
					if(hasUpgrade("forest_p",32))value=value.pow(1.5);
					if(hasUpgrade("forest_A",13))value=value.pow(1.3);
					if (value.lessThan(1)) return 1
					return value
                },
				effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			15: {
				title: "Particle Upgrade 15",
                description: "Unlock the Reactor.",
                cost: new Decimal(250),
                unlocked() { return player.tm.buyables[3].gte(2); }, // The upgrade is only visible when this is true
            },
			21: {
				title: "Particle Upgrade 21",
                description: "Point gain is boosted based on your energy.",
                cost: new Decimal(15),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
					let base=1e4;
                    let ret = Decimal.pow(base,Decimal.log10(player.modpoints[3].mul(10).add(1)).pow(0.9));
					if(hasUpgrade("forest_p",24))ret=ret.pow(2);
					ret=ret.pow(player.forest_A.best.pow(0.7).add(1));
					ret=ret.pow(new Decimal(player.forest_A.upgrades.length).mul(0.25).add(1));
					return ret;
                },
				effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			22: {
				title: "Particle Upgrade 22",
                description: "Points boost energy gain.",
                cost: new Decimal(1e6),
                unlocked() { return player.tm.buyables[3].gte(2); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=1.03;
                    let ret = Decimal.pow(base,Decimal.log10(player.points.add(1)).pow(0.5));
					if(hasUpgrade("forest_p",33))ret=ret.pow(2);
					if(hasUpgrade("forest_p",45))ret=ret.pow(1.4);
					if(player.forest_c.best.gte(1)){
						ret=ret.pow(player.forest_c.best.pow(0.8).add(1));
					}
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			23: {
				title: "Particle Upgrade 23",
                description: "Unlock a Prestige upgrade in The Prestige Tree Classic.",
                cost: new Decimal(1e7),
                unlocked() { return player.tm.buyables[3].gte(2); }, // The upgrade is only visible when this is true
            },
			24: {
				title: "Particle Upgrade 24",
                description: "Particle Upgrade 21 is squared.",
                cost: new Decimal(1e9),
                unlocked() { return player.tm.buyables[3].gte(2); }, // The upgrade is only visible when this is true
            },
			25: {
				title: "Particle Upgrade 25",
                description: "Unlock the Compressor.",
                cost: new Decimal(1e14),
                unlocked() { return player.tm.buyables[3].gte(3); }, // The upgrade is only visible when this is true
            },
			31: {
				title: "Particle Upgrade 31",
                description: "Particle Upgrade 13 is boosted.",
                cost: new Decimal(1e17),
                unlocked() { return player.tm.buyables[3].gte(3); }, // The upgrade is only visible when this is true
            },
			32: {
				title: "Particle Upgrade 32",
                description: "Particle Upgrade 14's effect ^1.5",
                cost: new Decimal(1e18),
                unlocked() { return player.tm.buyables[3].gte(3); }, // The upgrade is only visible when this is true
            },
			33: {
				title: "Particle Upgrade 33",
                description: "Particle Upgrade 22 is squared.",
                cost: new Decimal(1e20),
                unlocked() { return player.tm.buyables[3].gte(3); }, // The upgrade is only visible when this is true
            },
			34: {
				title: "Particle Upgrade 34",
                description: "Particle Upgrade 12's effect ^1.2",
                cost: new Decimal(1e22),
                unlocked() { return player.tm.buyables[3].gte(3); }, // The upgrade is only visible when this is true
            },
			35: {
				title: "Particle Upgrade 35",
                description: "Reactor and Compressor's effects ^1.2, and Reactor and Compressor don't remove your energy and particles",
                cost: new Decimal(1e25),
                unlocked() { return player.tm.buyables[3].gte(3); }, // The upgrade is only visible when this is true
            },
			41: {
				title: "Particle Upgrade 41",
                description: "The level of this tree boost Energy gain.",
                cost: new Decimal(1e30),
                unlocked() { return player.tm.buyables[3].gte(4); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let ret = Decimal.pow(2,player.tm.buyables[3].pow(1.5));
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			42: {
				title: "Particle Upgrade 42",
                description: "Particle Upgrade 13 is boosted.",
                cost: new Decimal(1e46),
                unlocked() { return player.tm.buyables[3].gte(4); }, // The upgrade is only visible when this is true
            },
			43: {
				title: "Particle Upgrade 43",
                description: "The level of this tree boost Particle gain.",
                cost: new Decimal(1e64),
                unlocked() { return player.tm.buyables[3].gte(5); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let ret = Decimal.pow(2,player.tm.buyables[3].pow(1.5));
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			44: {
				title: "Particle Upgrade 44",
                description: "Reactor and Compressor's effects ^1.2",
                cost: new Decimal(1e72),
                unlocked() { return player.tm.buyables[3].gte(5); }, // The upgrade is only visible when this is true
            },
			45: {
				title: "Particle Upgrade 45",
                description: "Particle Upgrade 22's effect ^1.4",
                cost: new Decimal(1e80),
                unlocked() { return player.tm.buyables[3].gte(5); }, // The upgrade is only visible when this is true
            },
			51: {
				title: "Particle Upgrade 51",
                description: "Particles cheapens Boosters in The Prestige Tree Classic.",
                cost: new Decimal("1e555"),
                unlocked() { return hasUpgrade("tm",14); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=1e30;
                    let ret = Decimal.pow(base,Decimal.log10(player.forest_p.points.mul(10).add(1)).pow(0.9));
					return ret;
                },
                effectDisplay() { return "/"+format(this.effect()) }, // Add formatting to the effect
            },
			52: {
				title: "Particle Upgrade 52",
                description: "Energy cheapens Generators in The Prestige Tree Classic.",
                cost: new Decimal("1e575"),
                unlocked() { return hasUpgrade("tm",14); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=1e30;
                    let ret = Decimal.pow(base,Decimal.log10(player.modpoints[3].mul(10).add(1)).pow(0.9));
					return ret;
                },
                effectDisplay() { return "/"+format(this.effect()) }, // Add formatting to the effect
            },
			53: {
				title: "Particle Upgrade 53",
                description: "Post-5 Chemicals cost scaling is weaker based on Particles.",
                cost: new Decimal("1e575"),
                unlocked() { return hasUpgrade("tm",14); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let ret = Decimal.log10(Decimal.log10(Decimal.log10(player.forest_p.points.add(1)).add(1)).add(1)).add(1).pow(0.2);
					return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			54: {
				title: "Particle Upgrade 54",
                description: "Energy cheapens Boosters in The Prestige Tree Classic.",
                cost: new Decimal("1e6900"),
                unlocked() { return hasUpgrade("tm",14); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=1e30;
                    let ret = Decimal.pow(base,Decimal.log10(player.modpoints[3].mul(10).add(1)).pow(0.9));
					return ret;
                },
                effectDisplay() { return "/"+format(this.effect()) }, // Add formatting to the effect
            },
			55: {
				title: "Particle Upgrade 55",
                description: "Particles cheapens Generators in The Prestige Tree Classic.",
                cost: new Decimal("1e6900"),
                unlocked() { return hasUpgrade("tm",14); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=1e30;
                    let ret = Decimal.pow(base,Decimal.log10(player.forest_p.points.mul(10).add(1)).pow(0.9));
					return ret;
                },
                effectDisplay() { return "/"+format(this.effect()) }, // Add formatting to the effect
            },
		},
		update(diff){
			if(hasUpgrade("forest_p",11))player.modpoints[3]=player.modpoints[3].add(upgradeEffect("forest_p",11).mul(diff));
			if (getClickableState("forest_p", 11)) {
				var temp=player.forest_p.points.div(20).times(diff).min(player.forest_p.points);
				if(!hasUpgrade("forest_p",35))player.forest_p.points = player.forest_p.points.sub(temp)
				player.forest_p.amtsacrificed = player.forest_p.amtsacrificed.add(temp)
			}
			if (getClickableState("forest_p", 12)) {
				var temp=player.modpoints[3].div(2).times(diff).min(player.modpoints[3]);
				if(!hasUpgrade("forest_p",35))player.modpoints[3] = player.modpoints[3].sub(temp)
				player.forest_p.amtcompressed = player.forest_p.amtcompressed.add(temp)
			}
		},
		clickables: {
        rows: 1,
        cols: 2,
        11: {
            title: "The Reactor",
            unlocked: function() {return hasUpgrade("forest_p", 15)},
            display: function() {
                value = "Allows you to activate the reactor, losing 5% of your particles per second but you gain a boost based on total particles lost.\n" + "Currently: " + clickableEffect("forest_p", 11)+ "\n "
                if (typeof getClickableState("forest_p", 11) == "undefined") {setClickableState("forest_p", 11, true)}
                if (getClickableState("forest_p", 11)) {value += "On"}
                else {value += "Off"}
                return value
            },
            effect: function() {
                if (player.forest_p.amtsacrificed.lessThan(1)) {return 1}
                let ret=player.forest_p.amtsacrificed.log(1.05).times(10);
				if(hasUpgrade("forest_p",35))ret=ret.pow(1.2);
				if(hasUpgrade("forest_p",44))ret=ret.pow(1.2);
				if(hasUpgrade("forest_A",14))ret=ret.pow(upgradeEffect("forest_A",14));
				return ret;
            },
            canClick: function() {
                return true
            },
            onClick: function() {
                if (typeof getClickableState("forest_p", 11) == "undefined") {setClickableState("forest_p", 11, true)}
                setClickableState("forest_p", 11, !getClickableState("forest_p", 11))
            },
            style: {
                "height": "200px",
                "width": "200px",
                "border-radius": "25%",
                "border": "2px solid",
                "border-color": 'rgba(0, 0, 0, 0.125)',
                "font-size": '10px'
            }
        },
        12: {
            title: "The Compressor",
            display: function() {
                value = "Allows you to activate the compressor, losing 50% of your energy per second but you gain a boost to particles based on total energy lost\n" + "Currently: " + clickableEffect("forest_p", 12)+ "\n "
                if (typeof getClickableState("forest_p", 12) == "undefined") {setClickableState("forest_p", 12, true)}
                if (getClickableState("forest_p", 12)) {value += "On"}
                else {value += "Off"}
                return value
            },
            effect: function () {
                let ret=player.forest_p.amtcompressed.add(1).log(2).add(1);
				if(hasUpgrade("forest_p",35))ret=ret.pow(1.2);
				if(hasUpgrade("forest_p",44))ret=ret.pow(1.2);
				if(hasUpgrade("forest_A",15))ret=ret.pow(upgradeEffect("forest_A",15));
				return ret;
            },
            unlocked: function() {return hasUpgrade("forest_p", 25)},
            canClick: function() {
                return true
            },
            onClick: function() {
                if (typeof getClickableState("forest_p", 12) == "undefined") {setClickableState("forest_p", 12, true)}
                setClickableState("forest_p", 12, !getClickableState("forest_p", 12))
            },
            style: {
                "height": "200px",
                "width": "200px",
                "border-radius": "25%",
                "border": "2px solid",
                "border-color": 'rgba(0, 0, 0, 0.125)',
                "font-size": '10px'
            }
        }
		},
    hotkeys: [
        {key: "p", description: "P: Reset for particles",
			onPress(){if (player.tm.currentTree==3 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==3}}
    ],
	passiveGeneration(){
		if(player.forest_A.best.gte(6))return 1;
		return 0;
	}
});


addLayer("forest_A", {
    name: "forest_A", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0)
    }},
    color: "#17E6F0",
    requires: new Decimal(1e10), // Can be a function that takes requirement increases into account
    resource: "atoms", // Name of prestige currency
    baseResource: "energy", // Name of resource prestige is based on
    baseAmount() {return player.modpoints[3]}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
	base(){
		let ret=new Decimal(1e10);
		if(hasUpgrade("forest_A",11))ret=ret.pow(0.9);
		if(hasUpgrade("forest_A",21))ret=ret.pow(0.9);
		if(hasUpgrade("forest_A",22))ret=ret.pow(0.9);
		if(hasUpgrade("forest_A",23))ret=ret.pow(0.9);
		return ret;
	},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown(){return player.tm.currentTree==3 && player.tm.buyables[3].gte(3);},
		
    resetDescription: "Compress energy for ",
		doReset(l){
			if(l=="forest_p" || l=="forest_A" || !l.startsWith("forest_")){return;}
			var b=new Decimal(player.forest_A.best);
			layerDataReset("forest_A",["upgrades","milestones","challenges"]);
			player.forest_A.best=b;
			return;
		},
		
    hotkeys: [
        {key: "a", description: "A: Reset for atoms",
			onPress(){if (player.tm.currentTree==3 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==3}}
    ],
	 branches: ["forest_p"],
	milestones: {
            0: {requirementDescription: "1 Atom",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription(){
					return "Particle gain exponent 0.5 -> 0.7. Particle Upgrade 21's effect ^"+format(player[this.layer].best.pow(0.7).add(1))+" (based on best Atoms)";
				},
            },
            1: {requirementDescription: "3 Atoms",
                done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
                effectDescription(){
					return "Particle Upgrade 21's effect ^"+format(new Decimal(player[this.layer].upgrades.length).mul(0.25).add(1))+" (based on Atom upgrades)";
				},
            },
            2: {requirementDescription: "6 Atoms",
                done() {return player[this.layer].best.gte(6)}, // Used to determine when to give the milestone
                effectDescription(){
					return "Gain 100% of Particle gain per second.";
				},
            },
	},
	
		upgrades: {
            rows: 2,
            cols: 5,
			11: {
				title: "Atom Upgrade 11",
                description: "Atoms boost Energy and Particle gain, and Atom requirement is reduced.",
                cost: new Decimal(3),
                unlocked() { return player[this.layer].best.gte(3); }, // The upgrade is only visible when this is true
				effect() {
					let ret = new Decimal(1).add(player.forest_A.points).pow(3.5);
                    return ret;
                },
				effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			12: {
				title: "Atom Upgrade 12",
                description: "Atoms boost Particle Upgrade 13",
                cost: new Decimal(4),
                unlocked() { return player[this.layer].best.gte(3); }, // The upgrade is only visible when this is true
				effect() {
					let ret = player.forest_A.points.pow(0.5).mul(0.2).add(1);
                    return ret;
                },
				effectDisplay() { return "^"+format(this.effect()) }, // Add formatting to the effect
            },
			13: {
				title: "Atom Upgrade 13",
                description: "Particle Upgrade 14's effect ^1.3",
                cost: new Decimal(7),
                unlocked() { return player[this.layer].best.gte(3) && player.tm.buyables[3].gte(5); }, // The upgrade is only visible when this is true
            },
			14: {
				title: "Atom Upgrade 14",
                description: "Atoms boost Reactor.",
                cost: new Decimal(9),
                unlocked() { return player[this.layer].best.gte(3) && player.tm.buyables[3].gte(6); }, // The upgrade is only visible when this is true
				effect() {
					let ret = player.forest_A.points.pow(0.5).mul(0.1).add(1);
                    return ret;
                },
				effectDisplay() { return "^"+format(this.effect()) }, // Add formatting to the effect
            },
			15: {
				title: "Atom Upgrade 15",
                description: "Atoms boost Compressor.",
                cost: new Decimal(11),
                unlocked() { return player[this.layer].best.gte(3) && player.tm.buyables[3].gte(7); }, // The upgrade is only visible when this is true
				effect() {
					let ret = player.forest_A.points.pow(0.5).mul(0.1).add(1);
                    return ret;
                },
				effectDisplay() { return "^"+format(this.effect()) }, // Add formatting to the effect
            },
			21: {
				title: "Atom Upgrade 21",
                description: "Atom requirement is reduced.",
                cost: new Decimal(17),
                unlocked() { return player[this.layer].best.gte(3) && player.tm.buyables[3].gte(9); }, // The upgrade is only visible when this is true
            },
			22: {
				title: "Atom Upgrade 22",
                description: "Atom requirement is reduced.",
                cost: new Decimal(20),
                unlocked() { return player[this.layer].best.gte(3) && player.tm.buyables[3].gte(9); }, // The upgrade is only visible when this is true
            },
			23: {
				title: "Atom Upgrade 23",
                description: "Atom requirement is reduced.",
                cost: new Decimal(28),
                unlocked() { return player[this.layer].best.gte(3) && player.tm.buyables[3].gte(9); }, // The upgrade is only visible when this is true
            },
		},
		
		canBuyMax() {return player.forest_c.best.gte(1)},
	 autoPrestige(){
		 return player.forest_c.best.gte(1);
	 },resetsNothing(){
		 return player.forest_c.best.gte(1);
	 },
});


addLayer("forest_c", {
    name: "forest_c", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0)
    }},
    color: "#DC143C",
    requires: new Decimal(11), // Can be a function that takes requirement increases into account
    resource: "Chemical Synthesizers", // Name of prestige currency
    baseResource: "atoms", // Name of resource prestige is based on
    baseAmount() {return player.forest_A.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	getResetGain: function() {return new Decimal(1)},
    getNextAt() {
		let scaling=new Decimal(2);
		if(hasUpgrade("forest_p",53))scaling=scaling.div(upgradeEffect("forest_p",53));
		if(player.forest_c.points.gte(15))scaling=scaling.mul(player.forest_c.points.sub(15).pow(player.forest_c.points.div(6)).mul(0.1).add(1));
		let ret=new Decimal(11).add(player.forest_c.points.times(Decimal.max(10,player.forest_c.points.mul(scaling))));
		ret=ret.ceil();
		return ret;
    },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.tm.currentTree==3 && player.tm.buyables[3].gte(8);},
		
    resetDescription: "Compress atoms together for ",
		doReset(l){
			if(l=="forest_p" || l=="forest_A" || l=="forest_c" || !l.startsWith("forest_")){return;}
			var b=new Decimal(player.forest_c.best);
			layerDataReset("forest_c",["upgrades","milestones","challenges"]);
			player.forest_c.best=b;
			return;
		},
		
    hotkeys: [
        {key: "c", description: "C: Reset for chemicals",
			onPress(){if (player.tm.currentTree==3 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==3}}
    ],
	 branches: ["forest_A"],
	 roundUpCost:true,
	 
	milestones: {
            0: {requirementDescription: "1 Chemical Synthesizer",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription(){
					return "Particle gain exponent 0.7 -> 0.75. Particle Upgrade 22's effect ^"+format(player[this.layer].best.pow(0.8).add(1))+" (based on best Chemical Synthesizers). Autobuy atoms, atom reset resets nothing, you can buy max atoms.";
				},
            },
            1: {requirementDescription: "15 Chemical Synthesizers",
                done() {return player[this.layer].best.gte(15)}, // Used to determine when to give the milestone
                effectDescription(){
					return "Chemical Synthesizer resets nothing.";
				},
            },
	},resetsNothing(){
		 return player.forest_c.best.gte(15);
	 },
});
