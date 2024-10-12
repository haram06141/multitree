

addLayer("burning_a", {
    name: "burning_a", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		flameStrength: new Decimal(0)
    }},
    color: "#444444",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "ashes", // Name of prestige currency
    baseResource: "embers", // Name of resource prestige is based on
    baseAmount() {return player.modpoints[4]}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(hasUpgrade("burning_a",22))mult=mult.mul(upgradeEffect("burning_a",22));
		if(hasUpgrade("tptc_p",23))mult=mult.mul(upgradeEffect("tptc_p",23));
		mult=mult.mul(tmp.burning_e.allocatedEffects[1]);
		return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown(){return player.tm.currentTree==4;},
		
		doReset(l){
			if(!l.startsWith("burning_")){return;}
			player.burning_a.flameStrength=layers.burning_a.maxFlameStrength();
			if(l=="burning_a" || !l.startsWith("burning_")){return;}
			layerDataReset("burning_a",["upgrades","milestones","challenges"]);
			player.burning_a.flameStrength=layers.burning_a.maxFlameStrength();
			return;
		},
		
    hotkeys: [
        {key: "a", description: "a: reset your embers for ashes",
			onPress(){if (player.tm.currentTree==4 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==4}}
    ],
	
		upgrades: {
            rows: 4,
            cols: 4,
			11: {
				title: "Ash Upgrade 11",
                description: "Start producing embers.",
                cost: new Decimal(0),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				onPurchase(){
					player.burning_a.flameStrength=new Decimal(1);
				}
			},
			12: {
				title: "Ash Upgrade 12",
                description: "The flame loses strength at half the rate.",
                cost: new Decimal(2),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			13: {
				title: "Ash Upgrade 13",
                description: "Gain more embers based on your ashes.",
                cost: new Decimal(2),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=3;
                    let ret = Decimal.pow(base,Decimal.log10(player.burning_a.points.add(3)).pow(0.9));
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			14: {
				title: "Ash Upgrade 14",
                description: "Embers boost point gain.",
                cost: new Decimal(5),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=1e10;
                    let ret = Decimal.pow(base,Decimal.log10(player.modpoints[4].mul(10).add(1)).pow(0.9));
					if(hasUpgrade("burning_a",23))ret=ret.pow(3);
					if(hasUpgrade("burning_c",11))ret=ret.pow(upgradeEffect("burning_c",11));
					if(hasUpgrade("burning_e",13))ret=ret.pow(layers.burning_e.allocatedEffects()[3]);
					return ret;
                },
				effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			21: {
				title: "Ash Upgrade 21",
                description: "Points boost ember gain.",
                cost: new Decimal(25),
                unlocked() { return player.tm.buyables[4].gte(2); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=1.01;
                    let ret = Decimal.pow(base,Decimal.log10(player.points.add(1)).pow(0.5));
					if(hasUpgrade("burning_a",42))ret=ret.pow(2);
					if(hasUpgrade("burning_c",21))ret=ret.pow(upgradeEffect("burning_c",21));
					if(hasUpgrade("burning_e",25))ret=ret.pow(layers.burning_e.allocatedEffects()[5]);
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			22: {
				title: "Ash Upgrade 22",
                description: "Flame boost ash gain.",
                cost: new Decimal(100),
                unlocked() { return player.tm.buyables[4].gte(2); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=3;
                    let ret = Decimal.pow(base,Decimal.log10(player.burning_a.flameStrength.add(1)).pow(0.5));
					if(hasUpgrade("burning_a",43))ret=ret.pow(2);
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			23: {
				title: "Ash Upgrade 23",
                description: "Ash Upgrade 14 is cubed.",
                cost: new Decimal(300),
                unlocked() { return player.tm.buyables[4].gte(2); }, // The upgrade is only visible when this is true
			},
			24: {
				title: "Ash Upgrade 24",
                description: "Unlock a Prestige upgrade in The Prestige Tree Classic.",
                cost: new Decimal(500),
                unlocked() { return player.tm.buyables[4].gte(2); }, // The upgrade is only visible when this is true
			},
			31: {
				title: "Ash Upgrade 31",
                description(){
					return "Keep "+format(this.effect().mul(100))+"% of your max flame strength.";
				},
                cost: new Decimal(1e8),
                unlocked() { return player.tm.buyables[4].gte(3); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let ret=new Decimal(0.02);
					if(hasUpgrade("burning_a",33))ret=ret.add(upgradeEffect("burning_a",33));
					if(hasUpgrade("burning_c",15))ret=ret.add(0.2);
					if(hasUpgrade("burning_e",15))ret=ret.add(0.2);
					return ret;
                },
			},
			32: {
				title: "Ash Upgrade 32",
                description: "Flame Decay uses a better formula.",
                cost: new Decimal(1e9),
                unlocked() { return player.tm.buyables[4].gte(3); }, // The upgrade is only visible when this is true
			},
			33: {
				title: "Ash Upgrade 33",
                description: "Ash Upgrade 31 is boosted based on Ash Upgrades.",
                cost: new Decimal(1e20),
                unlocked() { return player.tm.buyables[4].gte(3); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					return new Decimal(player.burning_a.upgrades.length).mul(0.015);
                },
                effectDisplay() { return "+"+format(this.effect().mul(100))+"%" }, // Add formatting to the effect
			},
			34: {
				title: "Ash Upgrade 34",
                description: "Gain 100% of ash gain per second.",
                cost: new Decimal(1e25),
                unlocked() { return player.tm.buyables[4].gte(3); }, // The upgrade is only visible when this is true
			},
			41: {
				title: "Ash Upgrade 41",
                description: "Electricity boost flame.",
                cost: new Decimal(1e30),
                unlocked() { return player.tm.buyables[4].gte(4); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=2;
                    let ret = Decimal.pow(base,Decimal.log10(player.burning_e.points.add(1)).pow(0.5));
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			42: {
				title: "Ash Upgrade 42",
                description: "Ash Upgrade 21 is squared.",
                cost: new Decimal(1e50),
                unlocked() { return player.tm.buyables[4].gte(4); }, // The upgrade is only visible when this is true
			},
			43: {
				title: "Ash Upgrade 43",
                description: "Ash Upgrade 22 is squared.",
                cost: new Decimal(1e75),
                unlocked() { return player.tm.buyables[4].gte(4); }, // The upgrade is only visible when this is true
			},
			44: {
				title: "Ash Upgrade 44",
                description: "Ashes boost Electricity gain.",
                cost: new Decimal(1e80),
                unlocked() { return player.tm.buyables[4].gte(5); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=2;
                    let ret = Decimal.pow(base,Decimal.log10(player.burning_a.points.add(1)).pow(0.5));
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
		},
		maxFlameStrength(){
			let ret=new Decimal(1);
			ret=ret.mul(tmp.burning_c.effect);
			ret=ret.mul(tmp.burning_e.allocatedEffects[0]);
			if(hasUpgrade("burning_a",41))ret=ret.mul(upgradeEffect("burning_a",41));
			return ret;
		},
		update(diff){
			let mult=new Decimal(25);
			if(hasUpgrade("burning_a",13))mult=mult.mul(upgradeEffect("burning_a",13));
			if(hasUpgrade("burning_a",21))mult=mult.mul(upgradeEffect("burning_a",21));
			mult=mult.mul(tmp.burning_e.allocatedEffects[2]);
			if(hasUpgrade("burning_c",12))mult=mult.mul(upgradeEffect("burning_c",12));
			if(hasUpgrade("burning_a",11) && hasUpgrade("burning_a",32)){
				player.burning_a.flameStrength=player.burning_a.flameStrength.min(tmp.burning_a.maxFlameStrength);
				player.modpoints[4]=player.modpoints[4].add(player.burning_a.flameStrength.mul(mult).mul(diff));
				player.burning_a.flameStrength=player.burning_a.flameStrength.sub(tmp.burning_a.flameKeep).mul(Decimal.pow(0.5,tmp.burning_a.flameDecay.mul(diff))).add(tmp.burning_a.flameKeep).max(tmp.burning_a.flameKeep);
			}else if(hasUpgrade("burning_a",11)){
				player.burning_a.flameStrength=player.burning_a.flameStrength.min(tmp.burning_a.maxFlameStrength);
				player.modpoints[4]=player.modpoints[4].add(player.burning_a.flameStrength.mul(mult).mul(diff));
				player.burning_a.flameStrength=player.burning_a.flameStrength.sub(tmp.burning_a.flameDecay.mul(diff)).max(tmp.burning_a.flameKeep);
			}
		},
		flameDecay(){
			let ret=new Decimal(1);
			if(hasUpgrade("burning_a",12))ret=ret.div(2);
			if(!hasUpgrade("burning_a",32))ret=ret.mul(tmp.burning_a.maxFlameStrength);
			return ret;
		},
		flameKeep(){
			let ret=new Decimal(0);
			if(hasUpgrade("burning_a",31))ret=new Decimal(upgradeEffect("burning_a",31));
			ret=ret.mul(tmp.burning_a.maxFlameStrength);
			return ret;
		},
	passiveGeneration(){
		if(hasUpgrade("burning_a",34))return 1;
		return 0;
	}
});


addLayer("burning_c", {
    name: "burning_c", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0)
    }},
    color: "#666666",
    requires: new Decimal(100), // Can be a function that takes requirement increases into account
    resource: "coal", // Name of prestige currency
    baseResource: "embers", // Name of resource prestige is based on
    baseAmount() {return player.modpoints[4]}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	base: 2,
    exponent: 1.1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown(){return player.tm.currentTree==4 && player.tm.buyables[4].gte(2);},
		
		doReset(l){
			if(!l.startsWith("burning_")){return;}
			if(l=="burning_a" || l=="burning_c" || l=="burning_e" || !l.startsWith("burning_")){return;}
			layerDataReset("burning_c",["upgrades","milestones","challenges"]);
			return;
		},
		
    hotkeys: [
        {key: "c", description: "c: reset your embers for coal",
			onPress(){if (player.tm.currentTree==4 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==4}}
    ],
	
    effect() {
        let effect = player[this.layer].points.add(1).pow(0.75)
		if(hasUpgrade("burning_c",15))effect = player[this.layer].points.add(1).mul(Decimal.pow(1.05,player[this.layer].points));
		if(hasUpgrade("burning_e",24))effect = effect.pow(layers.burning_e.allocatedEffects()[4]);
        return effect
    },

    effectDescription() {
        return "boosting the flame effect by " + format(tmp[this.layer].effect) + "x"
    },
	 branches: ["burning_a"],
	 upgrades: {
            rows: 2,
            cols: 5,
			11: {
				title: "Coal Upgrade 11",
                description: "Boost Ash Upgrade 14 by your best coal.",
                cost: new Decimal(12),
                unlocked() { return player.tm.buyables[4].gte(3); }, // The upgrade is only visible when this is true
				effect() {
					let base=3;
                    let ret = Decimal.pow(base,Decimal.log10(player.burning_c.best.add(3)).pow(0.9));
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
				},
                effectDisplay() { return "^"+format(this.effect()) }, // Add formatting to the effect
			},
			12: {
				title: "Coal Upgrade 12",
                description: "Coal boost ember gain.",
                cost: new Decimal(15),
                unlocked() { return player.tm.buyables[4].gte(3); }, // The upgrade is only visible when this is true
				effect() {
					return Decimal.pow(1.2,player.burning_c.points).mul(1.25);
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			13: {
				title: "Coal Upgrade 13",
                description: "Coal boost electricity gain. Nice.",
                cost: new Decimal(69),
                unlocked() { return player.tm.buyables[4].gte(4); }, // The upgrade is only visible when this is true
				effect() {
					return player.burning_c.points.add(1);
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			14: {
				title: "Coal Upgrade 14",
                description: "Autobuy coal, coal reset resets nothing, you can buy max coal.",
                cost: new Decimal(100),
                unlocked() { return player.tm.buyables[4].gte(4); }, // The upgrade is only visible when this is true
			},
			15: {
				title: "Coal Upgrade 15",
                description: "Coal's effect uses a better formula, and +20% to Ash Upgrade 31.",
                cost: new Decimal(125),
                unlocked() { return player.tm.buyables[4].gte(5); }, // The upgrade is only visible when this is true
			},
			21: {
				title: "Coal Upgrade 21",
                description: "Boost Ash Upgrade 21 by your best coal.",
                cost: new Decimal(200),
                unlocked() { return hasUpgrade("tm",13); }, // The upgrade is only visible when this is true
				effect() {
					let base=1.2;
					if(hasUpgrade("burning_c",22))base+=0.3;
					if(hasUpgrade("burning_c",23))base+=0.3;
					if(hasUpgrade("burning_c",24))base+=0.2;
					if(hasUpgrade("burning_c",25))base+=0.1;
                    let ret = Decimal.pow(base,Decimal.log10(player.burning_c.best.add(3)).pow(0.9));
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
				},
                effectDisplay() { return "^"+format(this.effect()) }, // Add formatting to the effect
			},
			22: {
				title: "Coal Upgrade 22",
                description: "Coal Upgrade 21's effect is better.",
                cost: new Decimal(333),
                unlocked() { return hasUpgrade("tm",13); }, // The upgrade is only visible when this is true
			},
			23: {
				title: "Coal Upgrade 23",
                description: "Coal Upgrade 21's effect is better.",
                cost: new Decimal(500),
                unlocked() { return hasUpgrade("tm",13); }, // The upgrade is only visible when this is true
			},
			24: {
				title: "Coal Upgrade 24",
                description: "Coal Upgrade 21's effect is better.",
                cost: new Decimal(2000),
                unlocked() { return hasUpgrade("tm",24); }, // The upgrade is only visible when this is true
			},
			25: {
				title: "Coal Upgrade 25",
                description: "Coal Upgrade 21's effect is better.",
                cost: new Decimal(4000),
                unlocked() { return hasUpgrade("tm",24); }, // The upgrade is only visible when this is true
			},
	 },
	 
		
		canBuyMax() {return hasUpgrade("burning_c",14);},
	 autoPrestige(){
		 return hasUpgrade("burning_c",14);
	 },resetsNothing(){
		 return hasUpgrade("burning_c",14)
	 },
});


addLayer("burning_e", {
    name: "burning_e", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		allocation: [0,0,0,0,0,0],
    }},
    color: "#dddd00",
    requires: new Decimal(100), // Can be a function that takes requirement increases into account
    resource: "electricity", // Name of prestige currency
    baseResource: "embers", // Name of resource prestige is based on
    baseAmount() {return player.modpoints[4]}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.65, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(hasUpgrade("burning_c",13))mult=mult.mul(upgradeEffect("burning_c",13));
		if(hasUpgrade("burning_e",15))mult=mult.mul(upgradeEffect("burning_e",15));
			if(hasUpgrade("burning_a",44))mult=mult.mul(upgradeEffect("burning_a",44));
		return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown(){return player.tm.currentTree==4 && player.tm.buyables[4].gte(3);},
		
		doReset(l){
			if(!l.startsWith("burning_")){return;}
			if(l=="burning_a" || l=="burning_c" || l=="burning_e" || !l.startsWith("burning_")){return;}
			layerDataReset("burning_c",["upgrades","milestones","challenges"]);
			return;
		},
		
    hotkeys: [
        {key: "e", description: "e: reset your embers for electricity",
			onPress(){if (player.tm.currentTree==4 && canReset(this.layer) && player.tm.buyables[4].gte(3)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==4}}
    ],
	
    effect() {
        let base=3;
        let ret = Decimal.pow(base,Decimal.log10(player.burning_e.points.add(1)).pow(0.9));
        //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
        return ret;
    },

    effectDescription() {
        return "providing " + format(tmp[this.layer].effect) + "x strength to allocated electricity."
    },
	 branches: ["burning_a"],
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
					["display-text",function(){return 'Electricity points allocated: ' + formatWhole(tmp.burning_e.totalAllocation) + '/' + formatWhole(tmp.burning_e.maxAllocation) + ', Next at '+format(tmp.burning_e.maxAllocationNext)+' electricity'}],
					["display-text",function(){return 'Max electricity points in a single bar: ' + formatWhole(tmp.burning_e.maxAllocation2)}],
					"blank",
        ["row", [["clickable", 11], "blank", ["bar", "flameBoost"], "blank", ["clickable", 12]]],
        "blank",
        ["row", [["clickable", 21], "blank", ["bar", "ashBoost"], "blank", ["clickable", 22]]],
        "blank",
        ["row", [["clickable", 31], "blank", ["bar", "emberBoost"], "blank", ["clickable", 32]]],
        "blank",
        ["row", [["clickable", 41], "blank", ["bar", "a14Boost"], "blank", ["clickable", 42]]],
        "blank",
        ["row", [["clickable", 51], "blank", ["bar", "coalBoost"], "blank", ["clickable", 52]]],
        "blank",
        ["row", [["clickable", 61], "blank", ["bar", "a21Boost"], "blank", ["clickable", 62]]],
					"upgrades"
				],
		
    bars: {
        flameBoost: {
            direction: RIGHT,
            width: 300,
            height: 50,
            progress() {
                return player[this.layer].allocation[0] / layers[this.layer].maxAllocation2()
            },
            display() {
                return "Boost flame effect (" + format(layers[this.layer].allocatedEffects()[0]) + "x)"
            },
            baseStyle: {
                "background-color": "#FFFFFF"
            },
            fillStyle: {
                "background-color": "#DDDD00"
            },
            textStyle: {
                "color": "#000000"
            }
        },
        ashBoost: {
            direction: RIGHT,
            width: 300,
            height: 50,
            progress() {
                return player[this.layer].allocation[1] / layers[this.layer].maxAllocation2()
            },
            display() {
                return "Boost ash gain (" + format(layers[this.layer].allocatedEffects()[1]) + "x)"
            },
            baseStyle: {
                "background-color": "#FFFFFF"
            },
            fillStyle: {
                "background-color": "#DDDD00"
            },
            textStyle: {
                "color": "#000000"
            }
        },
        emberBoost: {
            direction: RIGHT,
            width: 300,
            height: 50,
            progress() {
                return player[this.layer].allocation[2] / layers[this.layer].maxAllocation2()
            },
            display() {
                return "Boost ember gain (" + format(layers[this.layer].allocatedEffects()[2]) + "x)"
            },
            baseStyle: {
                "background-color": "#FFFFFF"
            },
            fillStyle: {
                "background-color": "#DDDD00"
            },
            textStyle: {
                "color": "#000000"
            }
        },
        a14Boost: {
            direction: RIGHT,
            width: 300,
            height: 50,
            progress() {
                return player[this.layer].allocation[3] / layers[this.layer].maxAllocation2()
            },
            display() {
                return "Boost Ash Upgrade 14 (^" + format(layers[this.layer].allocatedEffects()[3]) + ")"
            },
            baseStyle: {
                "background-color": "#FFFFFF"
            },
            fillStyle: {
                "background-color": "#DDDD00"
            },
            textStyle: {
                "color": "#000000"
            },
			unlocked(){
				return hasUpgrade("burning_e",13);
			},
        },
        coalBoost: {
            direction: RIGHT,
            width: 300,
            height: 50,
            progress() {
                return player[this.layer].allocation[4] / layers[this.layer].maxAllocation2()
            },
            display() {
                return "Boost Coal Effect (^" + format(layers[this.layer].allocatedEffects()[4]) + ")"
            },
            baseStyle: {
                "background-color": "#FFFFFF"
            },
            fillStyle: {
                "background-color": "#DDDD00"
            },
            textStyle: {
                "color": "#000000"
            },
			unlocked(){
				return hasUpgrade("burning_e",24);
			},
        },
        a21Boost: {
            direction: RIGHT,
            width: 300,
            height: 50,
            progress() {
                return player[this.layer].allocation[5] / layers[this.layer].maxAllocation2()
            },
            display() {
                return "Boost Ash Upgrade 21 (^" + format(layers[this.layer].allocatedEffects()[5]) + ")"
            },
            baseStyle: {
                "background-color": "#FFFFFF"
            },
            fillStyle: {
                "background-color": "#DDDD00"
            },
            textStyle: {
                "color": "#000000"
            },
			unlocked(){
				return hasUpgrade("burning_e",25);
			},
        },
    },
				clickables: {
        rows: 6,
        cols: 2,
        11: {
            display() {
                return "<h1><b>-</b></h1>"
            },
            canClick() {
                return player[this.layer].allocation[0] > 0
            },
            onClick(){
                player[this.layer].allocation[0] = Math.round(player[this.layer].allocation[0] - 1)
            },
            style: {
                "width": "50px",
                "height": "50px"
            }
        },
        12: {
            display() {
                return "<h1><b>+</b></h1>"
            },
            canClick() {
                return layers[this.layer].totalAllocation() < layers[this.layer].maxAllocation() && player[this.layer].allocation[0] < layers[this.layer].maxAllocation2()
            },
            onClick(){
                player[this.layer].allocation[0] = Math.round(player[this.layer].allocation[0] + 1)
            },
            style: {
                "width": "50px",
                "height": "50px"
            }
        },
        21: {
            display() {
                return "<h1><b>-</b></h1>"
            },
            canClick() {
                return player[this.layer].allocation[1] > 0
            },
            onClick(){
                player[this.layer].allocation[1] = Math.round(player[this.layer].allocation[1] - 1)
            },
            style: {
                "width": "50px",
                "height": "50px"
            }
        },
        22: {
            display() {
                return "<h1><b>+</b></h1>"
            },
            canClick() {
                return layers[this.layer].totalAllocation() < layers[this.layer].maxAllocation() && player[this.layer].allocation[1] < layers[this.layer].maxAllocation2()
            },
            onClick(){
                player[this.layer].allocation[1] = Math.round(player[this.layer].allocation[1] + 1)
            },
            style: {
                "width": "50px",
                "height": "50px"
            }
        },
        31: {
            display() {
                return "<h1><b>-</b></h1>"
            },
            canClick() {
                return player[this.layer].allocation[2] > 0
            },
            onClick(){
                player[this.layer].allocation[2] = Math.round(player[this.layer].allocation[2] - 1)
            },
            style: {
                "width": "50px",
                "height": "50px"
            }
        },
        32: {
            display() {
                return "<h1><b>+</b></h1>"
            },
            canClick() {
                return layers[this.layer].totalAllocation() < layers[this.layer].maxAllocation() && player[this.layer].allocation[2] < layers[this.layer].maxAllocation2()
            },
            onClick(){
                player[this.layer].allocation[2] = Math.round(player[this.layer].allocation[2] + 1)
            },
            style: {
                "width": "50px",
                "height": "50px"
            }
        },
        41: {
            display() {
                return "<h1><b>-</b></h1>"
            },
            canClick() {
                return player[this.layer].allocation[3] > 0
            },
            onClick(){
                player[this.layer].allocation[3] = Math.round(player[this.layer].allocation[3] - 1)
            },
			unlocked(){
				return hasUpgrade("burning_e",13);
			},
            style: {
                "width": "50px",
                "height": "50px"
            }
        },
        42: {
            display() {
                return "<h1><b>+</b></h1>"
            },
            canClick() {
                return layers[this.layer].totalAllocation() < layers[this.layer].maxAllocation() && player[this.layer].allocation[3] < layers[this.layer].maxAllocation2()
            },
            onClick(){
                player[this.layer].allocation[3] = Math.round(player[this.layer].allocation[3] + 1)
            },
			unlocked(){
				return hasUpgrade("burning_e",13);
			},
            style: {
                "width": "50px",
                "height": "50px"
            }
        },
        51: {
            display() {
                return "<h1><b>-</b></h1>"
            },
            canClick() {
                return player[this.layer].allocation[4] > 0
            },
            onClick(){
                player[this.layer].allocation[4] = Math.round(player[this.layer].allocation[4] - 1)
            },
			unlocked(){
				return hasUpgrade("burning_e",24);
			},
            style: {
                "width": "50px",
                "height": "50px"
            }
        },
        52: {
            display() {
                return "<h1><b>+</b></h1>"
            },
            canClick() {
                return layers[this.layer].totalAllocation() < layers[this.layer].maxAllocation() && player[this.layer].allocation[4] < layers[this.layer].maxAllocation2()
            },
            onClick(){
                player[this.layer].allocation[4] = Math.round(player[this.layer].allocation[4] + 1)
            },
			unlocked(){
				return hasUpgrade("burning_e",24);
			},
            style: {
                "width": "50px",
                "height": "50px"
            }
        },
        61: {
            display() {
                return "<h1><b>-</b></h1>"
            },
            canClick() {
                return player[this.layer].allocation[5] > 0
            },
            onClick(){
                player[this.layer].allocation[5] = Math.round(player[this.layer].allocation[5] - 1)
            },
			unlocked(){
				return hasUpgrade("burning_e",25);
			},
            style: {
                "width": "50px",
                "height": "50px"
            }
        },
        62: {
            display() {
                return "<h1><b>+</b></h1>"
            },
            canClick() {
                return layers[this.layer].totalAllocation() < layers[this.layer].maxAllocation() && player[this.layer].allocation[5] < layers[this.layer].maxAllocation2()
            },
            onClick(){
                player[this.layer].allocation[5] = Math.round(player[this.layer].allocation[5] + 1)
            },
			unlocked(){
				return hasUpgrade("burning_e",25);
			},
            style: {
                "width": "50px",
                "height": "50px"
            }
        },
    },
	totalAllocation(){
		return player[this.layer].allocation[0] + player[this.layer].allocation[1] + player[this.layer].allocation[2] + player[this.layer].allocation[3] + player[this.layer].allocation[4] + player[this.layer].allocation[5]
	},
	maxAllocation(){
		let base=10;
		if(hasUpgrade("burning_e",11))base=5;
		let ret=Decimal.log(player[this.layer].points.add(base-1),base);
		if(ret.gte(500))ret = ret.mul(2).log10().mul(100).add(200);
		return Math.floor(ret.min(1e10).toNumber());
	},
	maxAllocationNext(){
		let base=10;
		if(hasUpgrade("burning_e",11))base=5;
		if(tmp[this.layer].maxAllocation>=500){
			return Decimal.pow(base,Decimal.pow(10,(tmp[this.layer].maxAllocation-199)/100).div(2)).sub(base-1);
		}
		return Decimal.pow(base,tmp[this.layer].maxAllocation+1).sub(base-1);
	},
	maxAllocation2(){
		let ret=3;
		if(hasUpgrade("burning_e",12))ret=ret+upgradeEffect("burning_e",12);
		return ret;
	},
	allocatedEffects(){
		let ret=[
		tmp[this.layer].effect.mul(player[this.layer].allocation[0]**layers[this.layer].allocationPower() / 100).add(1).pow(0.75),
		tmp[this.layer].effect.mul(player[this.layer].allocation[1]**layers[this.layer].allocationPower() / 100).add(1),
		tmp[this.layer].effect.mul(player[this.layer].allocation[2]**layers[this.layer].allocationPower() / 100).add(1).pow(1.25),
		tmp[this.layer].effect.mul(Decimal.pow(2,player[this.layer].allocation[3]**layers[this.layer].allocationPower()).sub(1)).div(1e8).add(1).log10().pow(0.5).div(10).add(1),
		tmp[this.layer].effect.mul(Decimal.pow(2,player[this.layer].allocation[4]**layers[this.layer].allocationPower()).sub(1)).div("1e1000").add(1).log10().pow(0.5).div(100).add(1).min(1.9),
		tmp[this.layer].effect.mul(Decimal.pow(2,player[this.layer].allocation[5]**layers[this.layer].allocationPower()).sub(1)).div("1e2500").add(1).log10().pow(0.5).div(65).add(1).min(2.2)
		];
		if(ret[3].gte(70))ret[3]=ret[3].mul(70).sqrt();
		return ret;
	},
	allocationPower(){
		let ret=1;
		if(hasUpgrade("burning_e",21))ret=ret+0.3;
		if(hasUpgrade("burning_e",22))ret=ret+0.3;
		if(hasUpgrade("burning_e",23))ret=ret+0.2;
		return ret;
	},
	
		upgrades: {
            rows: 3,
            cols: 5,
			11: {
				title: "Electricity Upgrade 11",
                description: "Electricity points base is reduced to 5.",
                cost: new Decimal(10000),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			12: {
				title: "Electricity Upgrade 12",
                description: "Boost max electricity points in a single bar based on Electricity upgrades.",
                cost: new Decimal(1e10),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
					return player.burning_e.upgrades.length*player.burning_e.upgrades.length;
				},
                effectDisplay() { return "+"+format(this.effect()) }, // Add formatting to the effect
			},
			13: {
				title: "Electricity Upgrade 13",
                description: "Unlock an electricity bar.",
                cost: new Decimal(1e20),
                unlocked() { return player.tm.buyables[4].gte(4); }, // The upgrade is only visible when this is true
			},
			14: {
				title: "Electricity Upgrade 14",
                description: "Gain 100% of electricity gain per second.",
                cost: new Decimal(1e35),
                unlocked() { return player.tm.buyables[4].gte(4); }, // The upgrade is only visible when this is true
			},
			15: {
				title: "Electricity Upgrade 15",
                description: "Electricity boost itself, and +20% to Ash Upgrade 31.",
                cost: new Decimal(1e50),
                unlocked() { return player.tm.buyables[4].gte(5); }, // The upgrade is only visible when this is true
				effect() {
					let base=1.1;
                    let ret = Decimal.pow(base,Decimal.log10(player.burning_e.points.add(1)).pow(0.9));
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			21: {
				title: "Electricity Upgrade 21",
                description: "Effects of allocated electricity points are better.",
                cost: new Decimal(1e110),
                unlocked() { return hasUpgrade("tm",13); }, // The upgrade is only visible when this is true
			},
			22: {
				title: "Electricity Upgrade 22",
                description: "Effects of allocated electricity points are better.",
                cost: new Decimal(1e200),
                unlocked() { return hasUpgrade("tm",13); }, // The upgrade is only visible when this is true
			},
			23: {
				title: "Electricity Upgrade 23",
                description: "Effects of allocated electricity points are better.",
                cost: new Decimal("1e1000"),
                unlocked() { return hasUpgrade("tm",24); }, // The upgrade is only visible when this is true
			},
			24: {
				title: "Electricity Upgrade 24",
                description: "Unlock an electricity bar.",
                cost: new Decimal("1e3000"),
                unlocked() { return hasUpgrade("tm",24); }, // The upgrade is only visible when this is true
			},
			25: {
				title: "Electricity Upgrade 25",
                description: "Unlock an electricity bar.",
                cost: new Decimal("1e6200"),
                unlocked() { return hasUpgrade("tm",24); }, // The upgrade is only visible when this is true
			},
		},
		passiveGeneration(){
			if(hasUpgrade("burning_e",14))return 1;
			return 0;
		}
});
