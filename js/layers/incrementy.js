addLayer("incrementy_i", {
    name: "incrementy_i", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
		points: new Decimal(0),
        unlocked: true
    }},
    color: "#4B4C83",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown(){return player.tm.currentTree==5 && player.tm.buyables[5].gte(1);},
		
		doReset(l){
			if(!l.startsWith("incrementy_")){return;}
			if(l=="incrementy_i" || !l.startsWith("incrementy_")){return;}
			layerDataReset("incrementy_i",["upgrades","milestones","challenges"]);
			return;
		},
		
	tooltip(){
		return format(player.modpoints[5])+" incrementy";
	},
	 upgrades: {
            rows: 4,
            cols: 5,
			11: {
				title: "Incrementy Upgrade 11",
                description(){
					return "Gain "+format(upgradeEffect("incrementy_i",11))+" Incrementy per second.";
				},
                cost: new Decimal(0),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
                    let ret = new Decimal(1);
					if(hasUpgrade("incrementy_i",12))ret=ret.mul(upgradeEffect("incrementy_i",12));
					if(hasUpgrade("incrementy_i",14)&&hasUpgrade("incrementy_am",21))ret=ret.mul(upgradeEffect("incrementy_i",14));
					if(hasUpgrade("incrementy_am",13))ret=ret.mul(upgradeEffect("incrementy_am",13));
					if(hasUpgrade("incrementy_am",14))ret=ret.mul(upgradeEffect("incrementy_am",14));
					if(hasUpgrade("incrementy_i",35))ret=ret.mul(upgradeEffect("incrementy_i",35));
					if(hasUpgrade("incrementy_i",33))ret=ret.mul(layers.incrementy_am.effect());
					if(hasUpgrade("incrementy_am",22))ret=ret.mul(upgradeEffect("incrementy_am",22));
					if(hasUpgrade("tptc_p",24))ret=ret.mul(upgradeEffect("tptc_p",24));
					if(hasUpgrade("incrementy_m",11))ret=ret.mul(upgradeEffect("incrementy_m",11));
					if(hasUpgrade("incrementy_a",21))ret=ret.mul(upgradeEffect("incrementy_a",21));
					if(hasUpgrade("incrementy_a",22))ret=ret.mul(upgradeEffect("incrementy_a",22));
					if(hasUpgrade("incrementy_a",23))ret=ret.mul(upgradeEffect("incrementy_a",23));
					if(hasUpgrade("incrementy_a",11)&&hasUpgrade("incrementy_a",24))ret=ret.mul(upgradeEffect("incrementy_a",11));
					if(hasUpgrade("incrementy_n",14))ret=ret.mul(buyableEffect("incrementy_n",13));
					if(hasUpgrade("incrementy_g",21))ret=ret.mul(upgradeEffect("incrementy_g",21));
					
					if(hasUpgrade("incrementy_i",22))ret=ret.pow(buyableEffect("incrementy_i",13));
					
					if(hasUpgrade("incrementy_i",14)&&!hasUpgrade("incrementy_am",21))ret=ret.mul(upgradeEffect("incrementy_i",14));
					if(hasUpgrade("incrementy_i",15))ret=ret.mul(buyableEffect("incrementy_i",11));
					if(hasUpgrade("incrementy_i",21))ret=ret.mul(buyableEffect("incrementy_i",12));
					if(!hasUpgrade("incrementy_i",33))ret=ret.mul(layers.incrementy_am.effect());
					if(hasUpgrade("incrementy_am",11))ret=ret.mul(upgradeEffect("incrementy_am",11));
					ret=ret.mul(layers.incrementy_a.effect()[0]);
					if(hasUpgrade("incrementy_a",11)&&!hasUpgrade("incrementy_a",24))ret=ret.mul(upgradeEffect("incrementy_a",11));
					ret=ret.mul(layers.incrementy_m.effect()[0]);
					if(hasUpgrade("incrementy_e",14))ret=ret.mul(upgradeEffect("incrementy_e",14));
					if(hasUpgrade("incrementy_n",22))ret=ret.mul(buyableEffect("incrementy_n",21));
					if(hasUpgrade("incrementy_g",24))ret=ret.mul(upgradeEffect("incrementy_g",24));
					ret=ret.mul(layers.incrementy_s.effect());
					
					if(inChallenge("incrementy_am",11))ret=ret.pow(0.1);
					if(inChallenge("incrementy_m",11))ret=ret.root(2);
					if(inChallenge("incrementy_m",12))ret=ret.root(3);
					if(inChallenge("incrementy_q",11))ret=ret.root(2);
					if(inChallenge("incrementy_q",12))ret=ret.root(3);
					if(inChallenge("incrementy_q",21))ret=ret.root(5);
					if(inChallenge("incrementy_q",22))ret=ret.root(4);
                    return ret;
				},
				currencyLayer: "modpoints",
				currencyInternalName: "5",
				currencyDisplayName: "incrementy",
			},
			12: {
				title: "Incrementy Upgrade 12",
                description: "Boost your base incrementy gain based on your points.",
                cost: new Decimal(10),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
                    let base=1.01;
                    let ret = Decimal.pow(base,Decimal.log10(player.points.add(1)).pow(0.5));
					if(hasUpgrade("incrementy_am",12))ret=ret.pow(2);
					if(hasUpgrade("incrementy_m",12))ret=ret.pow(2);
					if(hasUpgrade("incrementy_p",15))ret=ret.pow(2);
					if(hasUpgrade("incrementy_g",22))ret=ret.pow(upgradeEffect("incrementy_g",22));
					if(hasUpgrade("incrementy_i",41))ret=ret.pow(2);
                    return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
				currencyLayer: "modpoints",
				currencyInternalName: "5",
				currencyDisplayName: "incrementy",
			},
			13: {
				title: "Incrementy Upgrade 13",
                description: "Boost your point gain based on your incrementy.",
                cost: new Decimal(100),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
                    let base=1e10;
                    let ret = Decimal.pow(base,Decimal.log10(player.modpoints[5].add(1)).pow(0.9));
                    return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
				currencyLayer: "modpoints",
				currencyInternalName: "5",
				currencyDisplayName: "incrementy",
			},
			14: {
				title: "Incrementy Upgrade 14",
                description(){
					if(hasUpgrade("incrementy_am",21))return "Boost your base Incrementy gain based on your Incrementy upgrades.";
					return "Boost your Incrementy gain based on your Incrementy upgrades.";
				},
                cost: new Decimal(300),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
                    let ret=Decimal.pow(1.2,player.incrementy_i.upgrades.length);
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
				currencyLayer: "modpoints",
				currencyInternalName: "5",
				currencyDisplayName: "incrementy",
			},
			15: {
				title: "Incrementy Upgrade 15",
                description: "Unlock an Incrementy buyable.",
                cost: new Decimal(500),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				currencyLayer: "modpoints",
				currencyInternalName: "5",
				currencyDisplayName: "incrementy",
			},
			21: {
				title: "Incrementy Upgrade 21",
                description: "Unlock an Incrementy buyable, and the first Incrementy buyable's effect base +0.1.",
                cost: new Decimal(4e4),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				currencyLayer: "modpoints",
				currencyInternalName: "5",
				currencyDisplayName: "incrementy",
			},
			22: {
				title: "Incrementy Upgrade 22",
                description: "Unlock an Incrementy buyable, and the effect base of first 2 Incrementy buyables +0.1.",
                cost: new Decimal(1e8),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				currencyLayer: "modpoints",
				currencyInternalName: "5",
				currencyDisplayName: "incrementy",
			},
			23: {
				title: "Incrementy Upgrade 23",
                description: "Remove the linear cost scaling of Incrementy Speed",
                cost: new Decimal(1e11),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				currencyLayer: "modpoints",
				currencyInternalName: "5",
				currencyDisplayName: "incrementy",
			},
			24: {
				title: "Incrementy Upgrade 24",
                description: "Remove the linear cost scaling of Incrementy Strength",
                cost: new Decimal(1e25),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				currencyLayer: "modpoints",
				currencyInternalName: "5",
				currencyDisplayName: "incrementy",
			},
			25: {
				title: "Incrementy Upgrade 25",
                description: "Remove the linear cost scaling of Incrementy Stamina",
                cost: new Decimal(5e27),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				currencyLayer: "modpoints",
				currencyInternalName: "5",
				currencyDisplayName: "incrementy",
			},
			31: {
				title: "Incrementy Upgrade 31",
                description: "Each Incrementy Strength adds .02 to the Incrementy Strength base (capped at 10)",
                cost: new Decimal(1e60),
                unlocked() { return player.tm.buyables[5].gte(2); }, // The upgrade is only visible when this is true
				effect() {
                    let ret = Decimal.mul(player.incrementy_i.buyables[12],0.02).min(10);
                    return ret;
				},
                effectDisplay() { return "+"+format(this.effect()) }, // Add formatting to the effect
				currencyLayer: "modpoints",
				currencyInternalName: "5",
				currencyDisplayName: "incrementy",
			},
			32: {
				title: "Incrementy Upgrade 32",
                description(){
					if(hasUpgrade("incrementy_a",25))return "Each bought Incrementy Speed adds .01 to the Incrementy Speed base";
					return "Each bought Incrementy Speed adds .01 to the Incrementy Speed base (capped at 10)";
				},
                cost: new Decimal(1e79),
                unlocked() { return player.tm.buyables[5].gte(2); }, // The upgrade is only visible when this is true
				effect() {
                    let ret = Decimal.mul(player.incrementy_i.buyables[11],0.01);
					if(!hasUpgrade("incrementy_a",25))ret=ret.min(10);
                    return ret;
				},
                effectDisplay() { return "+"+format(this.effect()) }, // Add formatting to the effect
				currencyLayer: "modpoints",
				currencyInternalName: "5",
				currencyDisplayName: "incrementy",
			},
			33: {
				title: "Incrementy Upgrade 33",
                description: "Antimatter effect is applied before Incrementy Stamina",
                cost: new Decimal(1e260),
                unlocked() { return player.tm.buyables[5].gte(2); }, // The upgrade is only visible when this is true
				currencyLayer: "modpoints",
				currencyInternalName: "5",
				currencyDisplayName: "incrementy",
			},
			34: {
				title: "Incrementy Upgrade 34",
                description: "Remove the quadratic cost scaling of Incrementy Stamina",
                cost: new Decimal("1e560"),
                unlocked() { return player.tm.buyables[5].gte(2); }, // The upgrade is only visible when this is true
				currencyLayer: "modpoints",
				currencyInternalName: "5",
				currencyDisplayName: "incrementy",
			},
			35: {
				title: "Incrementy Upgrade 35",
                description: "Multiply your base incrementy gain based on your Incrementy Stamina levels.",
                cost: new Decimal("1e590"),
                unlocked() { return player.tm.buyables[5].gte(2); }, // The upgrade is only visible when this is true
				effect() {
                    let ret=player.incrementy_i.buyables[13].add(1);
					if(hasUpgrade("incrementy_m",14))ret=ret.pow(5);
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
				currencyLayer: "modpoints",
				currencyInternalName: "5",
				currencyDisplayName: "incrementy",
			},
			41: {
				title: "Incrementy Upgrade 41",
                description: "Square Incrementy Upgrade 12.",
                cost: new Decimal("e1e5"),
                unlocked() { return player.incrementy_q.challenges[11]; }, // The upgrade is only visible when this is true
				currencyLayer: "modpoints",
				currencyInternalName: "5",
				currencyDisplayName: "incrementy",
			},
			42: {
				title: "Incrementy Upgrade 42",
                description: "Neutrino Generation levels add to Incrementy Speed levels.",
                cost: new Decimal("e1.196e5"),
                unlocked() { return player.incrementy_q.challenges[11]; }, // The upgrade is only visible when this is true
				currencyLayer: "modpoints",
				currencyInternalName: "5",
				currencyDisplayName: "incrementy",
			},
			43: {
				title: "Incrementy Upgrade 43",
                description: "Incrementy Boost Gluon gain.",
                cost: new Decimal("e1.22e5"),
                unlocked() { return player.incrementy_q.challenges[11]; }, // The upgrade is only visible when this is true
				effect() {
                    let ret=player.modpoints[5].add(10).log10().pow(player.modpoints[5].add(10).log10().add(10).log10());
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
				currencyLayer: "modpoints",
				currencyInternalName: "5",
				currencyDisplayName: "incrementy",
			},
			44: {
				title: "Incrementy Upgrade 44",
                description: "Incrementy Boost Neutrino gain.",
                cost: new Decimal("e1.38e5"),
                unlocked() { return player.incrementy_q.challenges[11]; }, // The upgrade is only visible when this is true
				effect() {
                    let ret=player.modpoints[5].add(10).log10().pow(player.modpoints[5].add(10).log10().add(10).log10().mul(2));
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
				currencyLayer: "modpoints",
				currencyInternalName: "5",
				currencyDisplayName: "incrementy",
			},
			45: {
				title: "Incrementy Upgrade 45",
                description: "Matter gain exponent is multiplied by 2.",
                cost: new Decimal("e1.43e5"),
                unlocked() { return player.incrementy_q.challenges[11]; }, // The upgrade is only visible when this is true
				currencyLayer: "modpoints",
				currencyInternalName: "5",
				currencyDisplayName: "incrementy",
			},
	 },
	 buyables:{
		 rows: 1,
		 cols: 3,
		 11: {
                title: "Incrementy Speed",
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x).mul(Decimal.pow(1.01, x.pow(2))).mul(10);
					if(hasUpgrade("incrementy_i",23))cost = Decimal.pow(1.01, x.pow(2)).mul(10);
					if(hasUpgrade("incrementy_a",12))cost = Decimal.pow(1.01, x.pow(2));
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Amount: "+formatWhole(player.incrementy_i.buyables[11])+"+"+formatWhole(data.free)+"<br>"+
					"Cost: "+format(data.cost)+" Incrementy<br>"+
					"Effect: Incrementy gain x"+format(data.effect);
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
					return player.modpoints[5].gte(tmp[this.layer].buyables[this.id].cost);
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player.modpoints[5] = player.modpoints[5].sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				effect(){
					let base=new Decimal(1.5);
					if(hasUpgrade("incrementy_i",21))base=base.add(0.1);
					if(hasUpgrade("incrementy_i",22))base=base.add(0.1);
					if(hasUpgrade("incrementy_i",32))base=base.add(upgradeEffect("incrementy_i",32));
					return Decimal.pow(base,player[this.layer].buyables[this.id].add(layers[this.layer].buyables[this.id].free()));
				},
				unlocked(){ return hasUpgrade("incrementy_i",15)},
				free(){
					let ret=new Decimal(0);
					if(hasUpgrade("incrementy_i",42))ret=ret.add(player.incrementy_n.buyables[11]);
					if(hasUpgrade("incrementy_i",42))ret=ret.add(layers.incrementy_n.buyables[11].free());
					return ret;
				},
        },
		 12: {
                title: "Incrementy Strength",
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(4, x).mul(Decimal.pow(1.25, x.pow(2))).mul(1e4);
					if(hasUpgrade("incrementy_i",24))cost = Decimal.pow(1.25, x.pow(2)).mul(1e4);
					if(hasUpgrade("incrementy_a",13))cost = Decimal.pow(1.25, x.pow(2));
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Amount: "+formatWhole(player.incrementy_i.buyables[12])+"<br>"+
					"Cost: "+format(data.cost)+" Incrementy<br>"+
					"Effect: Incrementy gain x"+format(data.effect);
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
					return player.modpoints[5].gte(tmp[this.layer].buyables[this.id].cost);
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player.modpoints[5] = player.modpoints[5].sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				effect(){
					let base=new Decimal(2);
					if(hasUpgrade("incrementy_i",22))base=base.add(0.1);
					if(hasUpgrade("incrementy_i",31))base=base.add(upgradeEffect("incrementy_i",31));
					return Decimal.pow(base,player[this.layer].buyables[this.id]);
				},
				unlocked(){ return hasUpgrade("incrementy_i",21)},
        },
		 13: {
                title: "Incrementy Stamina",
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x).mul(Decimal.pow(1.25, x.pow(2))).mul(Decimal.pow(1.1, Decimal.pow(1.2, x))).mul(1e6);
					if(hasUpgrade("incrementy_i",25))cost = Decimal.pow(1.25, x.pow(2)).mul(Decimal.pow(1.1, Decimal.pow(1.2, x))).mul(1e6);
					if(hasUpgrade("incrementy_i",34))cost = Decimal.pow(1.1, Decimal.pow(1.2, x)).mul(1e6);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Amount: "+formatWhole(player.incrementy_i.buyables[13])+"<br>"+
					"Cost: "+format(data.cost)+" Incrementy<br>"+
					"Effect: Base incrementy gain ^"+format(data.effect)+(player.incrementy_i.buyables[13].gte(data.softcap)?" (softcapped)<br>Softcap starts at "+formatWhole(data.softcap):"");
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
					return player.modpoints[5].gte(tmp[this.layer].buyables[this.id].cost);
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player.modpoints[5] = player.modpoints[5].sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				effect(){
					let base=new Decimal(1.04);
					let power=player[this.layer].buyables[this.id];
					let softcap=layers[this.layer].buyables[this.id].softcap();
					if(power.gte(softcap))power=power.div(softcap).sqrt().mul(softcap);
					return Decimal.pow(base,power);
				},
				softcap(){
					let ret=new Decimal(40);
					if(player.incrementy_am.challenges[11])ret=ret.add(5);
					if(player.incrementy_m.challenges[11])ret=ret.add(5);
					if(hasUpgrade("incrementy_e",22))ret=ret.add(1);
					if(hasUpgrade("incrementy_e",24))ret=ret.add(1);
					if(hasUpgrade("incrementy_am",32))ret=ret.add(3);
					return ret;
				},
				unlocked(){ return hasUpgrade("incrementy_i",22)},
        },
	 },
	 tabFormat: ["upgrades","buyables"],
		update(diff){
			if(hasUpgrade("incrementy_i",11))player.modpoints[5]=player.modpoints[5].add(upgradeEffect("incrementy_i",11).mul(diff));
			
					if(hasUpgrade("incrementy_a",12)){
						var target=player.modpoints[5].add(1).log(1.01).pow(1/2).add(1).floor();
						if(target.gt(player.incrementy_i.buyables[11])){
							player.incrementy_i.buyables[11]=target;
						}
					}
					if(hasUpgrade("incrementy_a",13)){
						var target=player.modpoints[5].add(1).log(1.25).pow(1/2).add(1).floor();
						if(target.gt(player.incrementy_i.buyables[12])){
							player.incrementy_i.buyables[12]=target;
						}
					}
					if(hasUpgrade("incrementy_m",13)){
						var target=player.modpoints[5].div(1e6).add(1).log(1.1).add(1).log(1.2).add(1).floor();
						if(target.gt(player.incrementy_i.buyables[13])){
							player.incrementy_i.buyables[13]=target;
						}
					}
		},
});


addLayer("incrementy_am", {
    name: "incrementy_am", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "AM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#DB4C83",
    requires: new Decimal(110), // Can be a function that takes requirement increases into account
    resource: "antimatter", // Name of prestige currency
    baseResource: "total incrementy buyable levels", // Name of resource prestige is based on
    baseAmount() {return player.incrementy_i.buyables[11].add(player.incrementy_i.buyables[12]).add(player.incrementy_i.buyables[13])}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(15)
		mult=mult.mul(layers.incrementy_a.effect()[1]);
		mult=mult.mul(layers.incrementy_m.effect()[1]);
		if(hasUpgrade("incrementy_n",25))mult = mult.mul(buyableEffect("incrementy_n",32));
		if(hasUpgrade("incrementy_am",31))mult = mult.mul(upgradeEffect("incrementy_am",31));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    branches: ["incrementy_i"],
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.tm.currentTree==5 && player.tm.buyables[5].gte(2)},
		doReset(l){
			if(l=="incrementy_i" || l=="incrementy_am" || l=="incrementy_m" || !l.startsWith("incrementy_")){return;}
			layerDataReset("incrementy_am",["upgrades","milestones","challenges"]);
			return;
		},
        effect(){
			if (inChallenge("incrementy_m", 12)) return new Decimal(1)
                let ret = player.incrementy_am.points.plus(1).pow(1.5)
                return ret
        },
        effectDescription(){
			if(hasUpgrade("incrementy_i",33))return "which multiplies base incrementy gain by " + format(layers.incrementy_am.effect())
                return "which multiplies incrementy gain by " + format(layers.incrementy_am.effect())
        },
	getResetGain() {
		let ret=player.incrementy_i.buyables[11].add(player.incrementy_i.buyables[12]).add(player.incrementy_i.buyables[13]);
		if(ret.lt(110))return new Decimal(0);
		ret=Decimal.pow(1.1,ret.sub(110)).mul(layers.incrementy_am.gainMult()).floor();
		return ret;
	},
	getNextAt() {
		let ret=player.incrementy_i.buyables[11].add(player.incrementy_i.buyables[12]).add(player.incrementy_i.buyables[13]).add(1).max(110);
		return ret;
	},
	 upgrades: {
            rows: 3,
            cols: 5,
			11: {
				title: "Antimatter Upgrade 11",
                description: "Incrementy boosts Incrementy gain.",
                cost: new Decimal(2),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
                    let base=1.5;
                    let ret = Decimal.pow(base,Decimal.log10(player.modpoints[5].add(1)).pow(0.9));
					if(hasUpgrade("incrementy_am",21))ret=ret.pow(1.5);
                    return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			12: {
				title: "Antimatter Upgrade 12",
                description: "Incrementy Upgrade 12 is squared.",
                cost: new Decimal(200),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			13: {
				title: "Antimatter Upgrade 13",
                description: "Multiply your base incrementy gain based on your Incrementy Speed levels.",
                cost: new Decimal(1000),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
                    let ret=player.incrementy_i.buyables[11].add(1);
					if(hasUpgrade("incrementy_am",24))ret=ret.pow(2);
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			14: {
				title: "Antimatter Upgrade 14",
                description: "Multiply your base incrementy gain based on your Incrementy Strength levels.",
                cost: new Decimal(20000),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
                    return player.incrementy_i.buyables[12].add(1);
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			15: {
				title: "Antimatter Upgrade 15",
                description: "Gain 100% of antimatter gain per second.",
                cost: new Decimal(1e10),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			21: {
				title: "Antimatter Upgrade 21",
                description: "Antimatter Upgrade 11's effect ^1.5, and Incrementy Upgrade 14 boost base incrementy gain instead.",
                cost: new Decimal(1e40),
                unlocked() { return player.tm.buyables[5].gte(4); }, // The upgrade is only visible when this is true
			},
			22: {
				title: "Antimatter Upgrade 22",
                description: "Each Antimatter Upgrade multiplies base incrementy gain by 10.",
                cost: new Decimal(1e43),
                unlocked() { return player.tm.buyables[5].gte(4); }, // The upgrade is only visible when this is true
				effect() {
                    let ret=Decimal.pow(10,player.incrementy_am.upgrades.length);
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			23: {
				title: "Antimatter Upgrade 23",
                description: "Unlock an antimatter challenge.",
                cost: new Decimal(1e46),
                unlocked() { return player.tm.buyables[5].gte(4); }, // The upgrade is only visible when this is true
			},
			24: {
				title: "Antimatter Upgrade 24",
                description: "Antimatter Upgrade 13 is squared.",
                cost: new Decimal(1e50),
                unlocked() { return player.tm.buyables[5].gte(5); }, // The upgrade is only visible when this is true
			},
			25: {
				title: "Antimatter Upgrade 25",
                description: "Unlock an antimatter challenge.",
                cost: new Decimal(1e55),
                unlocked() { return player.tm.buyables[5].gte(5); }, // The upgrade is only visible when this is true
			},
			31: {
				title: "Antimatter Upgrade 31",
                description: "Antimatter gain is boosted by Quark Challenge completions.",
                cost: new Decimal("1e1550"),
				effect(){
                                let c = 0
                                if (hasChallenge("incrementy_q", 11)) c ++
                                if (hasChallenge("incrementy_q", 12)) c ++
                                if (hasChallenge("incrementy_q", 21)) c ++
                                if (hasChallenge("incrementy_q", 22)) c ++
                                return Decimal.pow(1+c, 300)
                        },
                unlocked() { return hasChallenge("incrementy_q", 21); }, // The upgrade is only visible when this is true
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			32: {
				title: "Antimatter Upgrade 32",
                description: "Incrementy Softcap starts 3 later <br>(52 -> 55)",
                cost: new Decimal("1e1770"),
                unlocked() { return hasChallenge("incrementy_q", 21); }, // The upgrade is only visible when this is true
			},
			33: {
				title: "Antimatter Upgrade 33",
                description: "Particle gain formula is better.",
                cost: new Decimal("1e1815"),
                unlocked() { return hasChallenge("incrementy_q", 21); }, // The upgrade is only visible when this is true
			},
			34: {
				title: "Antimatter Upgrade 34",
                description: "Unlock a quark challenge.",
                cost: new Decimal("1e1900"),
                unlocked() { return hasChallenge("incrementy_q", 21); }, // The upgrade is only visible when this is true
			},
			35: {
				title: "Antimatter Upgrade 35",
                description: "Amoeba gain formula is better.",
                cost: new Decimal("1e2000"),
                unlocked() { return hasChallenge("incrementy_q", 21); }, // The upgrade is only visible when this is true
			},
	 },
	passiveGeneration(){
		if(hasUpgrade("incrementy_am",15))return 1;
		return 0;
	},
	
        challenges:{
                rows: 1,
                cols: 2,
                11: {
                        name: "Know?", 
                        challengeDescription: "Get ^.1 of your normal Incrementy gain",
                        rewardDescription: "Incrementy Stamina softcap starts 5 later (40 -> 45)",
                        unlocked(){
                                return hasUpgrade("incrementy_am",23);
                        },
                        goal: new Decimal(1e68),
                        currencyLayer: "modpoints",
                        currencyInternalName: "5",
		                currencyDisplayName: "incrementy",
                },
                12: {
                        name: "No!", 
                        challengeDescription: "Your points are reset, Get ^.1 of your normal point gain",
                        rewardDescription: "Unlock Matter and the ability to Matter Prestige",
                        unlocked(){
                                return hasUpgrade("incrementy_am",25);
                        },
                        goal: new Decimal("1e30000"),
                        currencyInternalName: "points",
						resetPoints: true,
                },
		},
});


addLayer("incrementy_a", {
    name: "incrementy_a", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#1B4C23",
    requires: new Decimal("1e600"), // Can be a function that takes requirement increases into account
    resource: "amoebas", // Name of prestige currency
    baseResource: "incrementy", // Name of resource prestige is based on
    baseAmount() {return player.modpoints[5]}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(hasUpgrade("incrementy_n",25))mult = mult.mul(buyableEffect("incrementy_n",33));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    branches: ["incrementy_am"],
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.tm.currentTree==5 && player.tm.buyables[5].gte(3)},
		doReset(l){
			if(l=="incrementy_i" || l=="incrementy_am" || l=="incrementy_m" || l=="incrementy_a" || l=="incrementy_e" || !l.startsWith("incrementy_")){return;}
			layerDataReset("incrementy_a",["upgrades","milestones","challenges"]);
			return;
		},
	getResetGain() {
		let ret=player.modpoints[5];
		if(ret.lt("1e600"))return new Decimal(0);
		ret=ret.log10().div(6).pow(hasUpgrade("incrementy_am",35)?0.52:0.5).sub(10);
		ret=Decimal.pow(10,ret).mul(layers.incrementy_a.gainMult()).floor();
		return ret;
	},
	getNextAt() {
		let ret=tmp.incrementy_a.getResetGain.plus(1);
		ret=ret.div(layers.incrementy_a.gainMult()).max(1).log10();
		ret=ret.add(10).pow(hasUpgrade("incrementy_am",35)?(1/0.52):2).mul(6);
		ret=Decimal.pow(10,ret);
		return ret;
	},
        effect(){
			if (inChallenge("incrementy_m", 11) || inChallenge("incrementy_m", 12)) return [new Decimal(1), new Decimal(1)]
                let eff1 = player.incrementy_a.points.add(1).pow(6)
                let eff2 = player.incrementy_a.points.add(1).pow(2)
                return [eff1, eff2]
        },
        effectDescription(){
                let eff = layers.incrementy_a.effect()
                return "which multiplies incrementy gain by " + format(eff[0]) + " and antimatter gain by " + format(eff[1])
        },
		
	 upgrades: {
            rows: 3,
            cols: 5,
			11: {
				title: "Amoeba Upgrade 11",
                description(){
					if(hasUpgrade("incrementy_a",24))return "Each Amoeba Upgrade multiplies base Incrementy gain by 1e10.";
					return "Each Amoeba Upgrade multiplies Incrementy gain by 1e10.";
				},
                cost: new Decimal(1),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
                    let ret=Decimal.pow(1e10,player.incrementy_a.upgrades.length);
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			12: {
				title: "Amoeba Upgrade 12",
                description: "Autobuy Incrementy Speed, and divide Incrementy Speed costs by 10.",
                cost: new Decimal(3),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			13: {
				title: "Amoeba Upgrade 13",
                description: "Autobuy Incrementy Strength, and divide Incrementy Strength costs by 1e4.",
                cost: new Decimal(5),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			14: {
				title: "Amoeba Upgrade 14",
                description: "Unlock a Prestige upgrade in The Prestige Tree Classic.",
                cost: new Decimal(100),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			15: {
				title: "Amoeba Upgrade 15",
                description: "Gain 100% of amoeba gain per second.",
                cost: new Decimal(2000),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			21: {
				title: "Amoeba Upgrade 21",
                description: "Boost your base incrementy gain based on your amoebas.",
                cost: new Decimal(1e30),
                unlocked() { return player.tm.buyables[5].gte(7); }, // The upgrade is only visible when this is true
				effect() {
                    let ret=player.incrementy_a.points.add(10);
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			22: {
				title: "Amoeba Upgrade 22",
                description: "Boost your base incrementy gain based on your matter.",
                cost: new Decimal(1e31),
                unlocked() { return player.tm.buyables[5].gte(7); }, // The upgrade is only visible when this is true
				effect() {
                    let base=3;
                    let ret = Decimal.pow(base,Decimal.log10(player.incrementy_m.points.add(1)).pow(0.9));
                    return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			23: {
				title: "Amoeba Upgrade 23",
                description: "Boost your base incrementy gain based on your energy.",
                cost: new Decimal(1e32),
                unlocked() { return player.tm.buyables[5].gte(7); }, // The upgrade is only visible when this is true
				effect() {
                    let base=3;
                    let ret = Decimal.pow(base,Decimal.log10(player.incrementy_e.points.add(1)).pow(0.9));
                    return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			24: {
				title: "Amoeba Upgrade 24",
                description: "Amoeba Upgrade 11 boost base incrementy gain instead.",
                cost: new Decimal(1e34),
                unlocked() { return player.tm.buyables[5].gte(7); }, // The upgrade is only visible when this is true
			},
			25: {
				title: "Amoeba Upgrade 25",
                description: "Uncap Incrementy Upgrade 32.",
                cost: new Decimal(1e37),
                unlocked() { return player.tm.buyables[5].gte(7); }, // The upgrade is only visible when this is true
			},
	 },
	passiveGeneration(){
		if(hasUpgrade("incrementy_a",15))return 1;
		return 0;
	}
});


addLayer("incrementy_m", {
    name: "incrementy_m", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#3B1053",
    requires: new Decimal("1e2000"), // Can be a function that takes requirement increases into account
    resource: "matter", // Name of prestige currency
    baseResource: "incrementy", // Name of resource prestige is based on
    baseAmount() {return player.modpoints[5]}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent(){
		let ret=new Decimal(0.001);
		if(hasUpgrade("incrementy_i",45))ret=ret.mul(2);
		return ret;
	}, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(10)
		if(hasUpgrade("incrementy_e",12))mult=mult.mul(upgradeEffect("incrementy_e",12));
		if(hasUpgrade("incrementy_m",22))mult=mult.mul(upgradeEffect("incrementy_m",22));
		if(hasUpgrade("incrementy_m",24))mult=mult.mul(upgradeEffect("incrementy_m",24));
		if(hasUpgrade("incrementy_e",15))mult=mult.mul(upgradeEffect("incrementy_e",15));
		if(hasUpgrade("incrementy_e",21))mult=mult.mul(upgradeEffect("incrementy_e",21));
		if(hasUpgrade("incrementy_e",23))mult=mult.mul(upgradeEffect("incrementy_e",23));
		if(hasUpgrade("incrementy_n",25))mult = mult.mul(buyableEffect("incrementy_n",31));
		if(hasUpgrade("incrementy_p",35))mult = mult.mul(buyableEffect("incrementy_p",13));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    branches: ["incrementy_i"],
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.tm.currentTree==5 && player.tm.buyables[5].gte(3) && player.incrementy_am.challenges[12]>=1;},
		doReset(l){
			if(l=="incrementy_i" || l=="incrementy_am" || l=="incrementy_m" || !l.startsWith("incrementy_")){return;}
			layerDataReset("incrementy_m",["upgrades","milestones","challenges"]);
			return;
		},
        effect(){
                let eff1 = player.incrementy_m.points.add(1).pow(10)
                let eff2 = player.incrementy_m.points.mul(10).add(1).pow(0.5)
                return [eff1, eff2]
        },
        effectDescription(){
                let eff = layers.incrementy_m.effect()
                return "which multiplies incrementy gain by " + format(eff[0]) + " and antimatter gain by " + format(eff[1])
        },
		
	 upgrades: {
            rows: 3,
            cols: 5,
			11: {
				title: "Matter Upgrade 11",
                description(){
					if(hasUpgrade("incrementy_m",21) && player.incrementy_m.challenges[12])return "Each Matter Upgrade multiplies base Incrementy gain by 1e9.";
					if(hasUpgrade("incrementy_m",21) || player.incrementy_m.challenges[12])return "Each Matter Upgrade multiplies base Incrementy gain by 1e6.";
					return "Each Matter Upgrade multiplies base Incrementy gain by 1e4.";
				},
                cost: new Decimal(20),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
                    let ret=Decimal.pow(1e4,player.incrementy_m.upgrades.length);
					if(hasUpgrade("incrementy_m",21))ret=ret.pow(1.5);
					if(player.incrementy_m.challenges[12])ret=ret.pow(1.5);
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			12: {
				title: "Matter Upgrade 12",
                description: "Incrementy Upgrade 12 is squared.",
                cost: new Decimal(20),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			13: {
				title: "Matter Upgrade 13",
                description: "Autobuy Incrementy Stamina.",
                cost: new Decimal(50),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			14: {
				title: "Matter Upgrade 14",
                description: "Incrementy Upgrade 35's effect ^5.",
                cost: new Decimal(150),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			15: {
				title: "Matter Upgrade 15",
                description: "Unlock Energy.",
                cost: new Decimal(300),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			21: {
				title: "Matter Upgrade 21",
                description: "Matter Upgrade 11's effect ^1.5.",
                cost: new Decimal(1e40),
                unlocked() { return player.tm.buyables[5].gte(5); }, // The upgrade is only visible when this is true
			},
			22: {
				title: "Matter Upgrade 22",
                description: "Boost Matter gain by Incrementy Stamina levels.",
                cost: new Decimal(1e45),
                unlocked() { return player.tm.buyables[5].gte(5); }, // The upgrade is only visible when this is true
				effect() {
                    let ret=player.incrementy_i.buyables[13].add(1).pow(1.2);
					ret=Decimal.pow(1.1,ret);
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			23: {
				title: "Matter Upgrade 23",
                description: "Unlock a matter challenge.",
                cost: new Decimal(1e62),
                unlocked() { return player.tm.buyables[5].gte(6); }, // The upgrade is only visible when this is true
			},
			24: {
				title: "Matter Upgrade 24",
                description: "Matter gain is boosted by your antimatter.",
                cost: new Decimal(1e70),
                unlocked() { return player.tm.buyables[5].gte(6); }, // The upgrade is only visible when this is true
				effect() {
                    let base=3;
                    let ret = Decimal.pow(base,Decimal.log10(player.incrementy_a.points.add(1)).pow(0.9));
                    return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			25: {
				title: "Matter Upgrade 25",
                description: "Unlock a matter challenge.",
                cost: new Decimal(1e110),
                unlocked() { return player.tm.buyables[5].gte(6); }, // The upgrade is only visible when this is true
			},
	 },
	passiveGeneration(){
		if(hasUpgrade("incrementy_e",11))return 100;
		return 0;
	},
	challenges:{
                rows: 1,
                cols: 2,
                11: {
                        name: "Creak", 
                        challengeDescription: "Amoebas base effects are 1 and square root Incrementy gain",
                        rewardDescription: "Incrementy Stamina softcap starts 5 later (45 -> 50)",
                        unlocked(){
                                return hasUpgrade("incrementy_m",23)
                        },
                        goal: new Decimal("1e2100"),
                        currencyLayer: "modpoints",
                        currencyInternalName: "5",
		                currencyDisplayName: "incrementy",
                },
                12: {
                        name: "Creek", 
                        challengeDescription: "Amoebas and Antimatter base effects are 1 and cube root Incrementy gain",
                        rewardDescription: "Matter Upgrade 11's effect ^1.5",
                        unlocked(){
                                return hasUpgrade("incrementy_m",25)
                        },
                        goal: new Decimal("1e960"),
                        currencyLayer: "modpoints",
                        currencyInternalName: "5",
		                currencyDisplayName: "incrementy",
                },
        },
});


addLayer("incrementy_e", {
    name: "incrementy_e", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#E3FF00",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "energy", // Name of prestige currency
    baseResource: "least amount of Matter and Antimatter", // Name of resource prestige is based on
    baseAmount() {return player.incrementy_m.points.min(player.incrementy_am.points)}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(hasUpgrade("incrementy_e",13))mult=mult.mul(upgradeEffect("incrementy_e",13));
		if(hasUpgrade("incrementy_n",22))mult = mult.mul(buyableEffect("incrementy_n",23));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    branches: ["incrementy_am","incrementy_m"],
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.tm.currentTree==5 && player.tm.buyables[5].gte(3) && hasUpgrade("incrementy_m",15);},
		doReset(l){
			if(l=="incrementy_i" || l=="incrementy_am" || l=="incrementy_m" || l=="incrementy_a" || l=="incrementy_e" || !l.startsWith("incrementy_")){return;}
			layerDataReset("incrementy_e",["upgrades","milestones","challenges"]);
			return;
		},
		
	 upgrades: {
            rows: 3,
            cols: 5,
			11: {
				title: "Energy Upgrade 11",
                description: "Gain 10000% of energy and matter gain per second.",
                cost: new Decimal(1),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			12: {
				title: "Energy Upgrade 12",
                description: "Boost matter gain based on your energy.",
                cost: new Decimal(1e9),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
                    let base=10;
                    let ret = Decimal.pow(base,Decimal.log10(player.incrementy_e.points.add(1)).pow(0.9));
                    return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			13: {
				title: "Energy Upgrade 13",
                description: "Boost energy gain based on your incrementy.",
                cost: new Decimal(1e30),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
                    let base=1.01;
                    let ret = Decimal.pow(base,Decimal.log10(player.modpoints[5].add(1)).pow(0.9));
                    return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			14: {
				title: "Energy Upgrade 14",
                description: "Each Energy Upgrade multiplies Incrementy gain by 1e50.",
                cost: new Decimal(1e50),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
                    let ret=Decimal.pow(1e50,player.incrementy_e.upgrades.length);
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			15: {
				title: "Energy Upgrade 15",
                description: "Boost Matter gain by Incrementy Speed levels.",
                cost: new Decimal(1e100),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
                    let ret=player.incrementy_i.buyables[11].add(1);
					ret=Decimal.pow(1.01,ret);
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			21: {
				title: "Energy Upgrade 21",
                description(){
					if(hasUpgrade("incrementy_e",25) && player.incrementy_m.challenges[12])return "Each Energy Upgrade multiplies matter gain by 1e8.";
					return "Each Energy Upgrade multiplies matter gain by 1e5.";
				},
                cost: new Decimal(1e175),
                unlocked() { return player.tm.buyables[5].gte(8); }, // The upgrade is only visible when this is true
				effect() {
                    let ret=Decimal.pow(1e5,player.incrementy_e.upgrades.length);
					if(hasUpgrade("incrementy_e",25))ret=ret.pow(1.6);
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			22: {
				title: "Energy Upgrade 22",
                description: "Incrementy Stamina softcap starts 1 later (50 -> 51)",
                cost: new Decimal(1e257),
                unlocked() { return player.tm.buyables[5].gte(8); }, // The upgrade is only visible when this is true
			},
			23: {
				title: "Energy Upgrade 23",
                description: "The level of this tree boost matter gain.",
                cost: new Decimal(1e272),
                unlocked() { return player.tm.buyables[5].gte(9); }, // The upgrade is only visible when this is true
				effect() {
                    let ret=Decimal.pow(2,player.tm.buyables[5].pow(1.5));
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			24: {
				title: "Energy Upgrade 24",
                description: "Incrementy Stamina softcap starts 1 later (51 -> 52)",
                cost: new Decimal("1e313"),
                unlocked() { return player.tm.buyables[5].gte(9); }, // The upgrade is only visible when this is true
			},
			25: {
				title: "Energy Upgrade 25",
                description: "Energy Upgrade 21's effect ^1.6",
                cost: new Decimal("1e335"),
                unlocked() { return player.tm.buyables[5].gte(9); }, // The upgrade is only visible when this is true
			},
	 },
	 resetsNothing: true,
	passiveGeneration(){
		if(hasUpgrade("incrementy_e",11))return 100;
		return 0;
	}
});


addLayer("incrementy_p", {
    name: "incrementy_p", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#FFC0F0",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "Particles", // Name of prestige currency
    baseResource: "incrementy", // Name of resource prestige is based on
    baseAmount() {return player.modpoints[5]}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(hasUpgrade("incrementy_n",13))mult = mult.mul(buyableEffect("incrementy_n",12));
		if(hasUpgrade("incrementy_n",22))mult = mult.mul(buyableEffect("incrementy_n",22));
		if(hasUpgrade("incrementy_g",13))mult = mult.mul(upgradeEffect("incrementy_g",13));
		if(hasUpgrade("incrementy_p",31))mult = mult.mul(buyableEffect("incrementy_p",11));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        mult = new Decimal(1)
		if(hasUpgrade("incrementy_n",24))mult = mult.mul(1.5);
		if(hasUpgrade("incrementy_g",14))mult = mult.mul(upgradeEffect("incrementy_g",14));
		if(hasUpgrade("incrementy_am",33))mult = mult.mul(1.05);
        return mult
    },
	getResetGain() {
		if(hasUpgrade("incrementy_n",23))return layers.incrementy_p.getResetGainReal();
		let ret=layers.incrementy_p.getResetGainReal();
		return Decimal.min(ret,ret.mul(60).sub(player.incrementy_p.points)).max(0);
	},
	getResetGainReal() {
		let ret=player.modpoints[5];
		if(ret.lt(1))return new Decimal(0);
		if(hasUpgrade("incrementy_n",15))ret=ret.log10().pow(2).pow(layers.incrementy_p.gainExp());
		else ret=ret.log10().div(20000).sqrt().pow(layers.incrementy_p.gainExp());
		ret=ret.mul(layers.incrementy_p.gainMult());
		return ret;
	},
	canReset() {
		return layers.incrementy_p.getResetGain().gt(0);
	},
        prestigeButtonText(){
				if(layers.incrementy_p.getResetGain().lte(0))return "+<b>0</b> Particles";
				if(layers.incrementy_p.getResetGain().lt(1e-3))return "+<b>"+exponentialFormat1(layers.incrementy_p.getResetGain(),2)+"</b> Particles";
				if(layers.incrementy_p.getResetGain().lt(1))return "+<b>"+format(layers.incrementy_p.getResetGain(),4)+"</b> Particles";
                return "+<b>"+format(layers.incrementy_p.getResetGain())+"</b> Particles";
        },
	getNextAt() {
		let ret=tmp.incrementy_p.getResetGainReal.plus(1).floor();
		ret=ret.div(layers.incrementy_p.gainMult()).max(1);
		if(hasUpgrade("incrementy_n",15))ret=ret.sqrt().root(layers.incrementy_p.gainExp());
		else ret=ret.pow(2).mul(20000).root(layers.incrementy_p.gainExp());
		ret=Decimal.pow(10,ret);
		return ret;
	},
    branches: ["incrementy_i","incrementy_n","incrementy_g","incrementy_q"],
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.tm.currentTree==5 && player.tm.buyables[5].gte(10);},
		doReset(l){
			if(l=="incrementy_i" || l=="incrementy_am" || l=="incrementy_m" || l=="incrementy_a" || l=="incrementy_e" || !l.startsWith("incrementy_")){return;}
			layerDataReset("incrementy_p",["upgrades","milestones","challenges"]);
			return;
		},
		
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
						"milestones",
					["display-text",function(){if(hasUpgrade("incrementy_n",23))return "";return "Particle Cap: "+format(tmp.incrementy_p.getResetGainReal.mul(60))+" (based on your incrementy)"}],
					"upgrades","buyables"
				],
	 resetsNothing: true,
	passiveGeneration(){
		if(hasUpgrade("incrementy_s",11)&&hasUpgrade("incrementy_p",11))return 100;
		if(hasUpgrade("incrementy_p",11))return 1;
		return 0;
	},
	
	 upgrades: {
            rows: 3,
            cols: 5,
			11: {
				title: "Particle Upgrade 11",
                description(){return "Gain "+(hasUpgrade("incrementy_s",11)?10000:100)+"% of particle gain per second."},
                cost: new Decimal(15),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			12: {
				title: "Particle Upgrade 12",
                description: "Unlock Neutrinos.",
                cost: new Decimal(65),
                unlocked() { return player.tm.buyables[5].gte(11); }, // The upgrade is only visible when this is true
			},
			13: {
				title: "Particle Upgrade 13",
                description: "Neutrino gain exponent is multiplied by 1.35",
                cost: new Decimal(6e13),
                unlocked() { return player.tm.buyables[5].gte(11); }, // The upgrade is only visible when this is true
			},
			14: {
				title: "Particle Upgrade 14",
                description: "Neutrino gain is boosted by neutrinos.",
                cost: new Decimal(2e14),
                unlocked() { return player.tm.buyables[5].gte(11); }, // The upgrade is only visible when this is true
				effect() {
                    let base=1.5;
                    let ret = Decimal.pow(base,Decimal.log10(player.incrementy_n.points.add(1)).pow(0.9));
					if(hasUpgrade("incrementy_n",21))ret=ret.pow(2);
					if(hasUpgrade("incrementy_p",22))ret=ret.pow(2);
                    return ret;
				},
				effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			15: {
				title: "Particle Upgrade 15",
                description: "Incrementy Upgrade 12 is squared.",
                cost: new Decimal(5e14),
                unlocked() { return player.tm.buyables[5].gte(11); }, // The upgrade is only visible when this is true
			},
			21: {
				title: "Particle Upgrade 21",
                description: "Neutrino gain exponent is multiplied by 1.1",
                cost: new Decimal(1e55),
                unlocked() { return player.tm.buyables[5].gte(13); }, // The upgrade is only visible when this is true
			},
			22: {
				title: "Particle Upgrade 22",
                description: "Particle Upgrade 14 is squared.",
                cost: new Decimal(1e90),
                unlocked() { return player.tm.buyables[5].gte(13); }, // The upgrade is only visible when this is true
			},
			23: {
				title: "Particle Upgrade 23",
                description: "Particle Upgrades add to first column of neutrino buyables.",
                cost: new Decimal(1e150),
                unlocked() { return player.tm.buyables[5].gte(13); }, // The upgrade is only visible when this is true
			},
			24: {
				title: "Particle Upgrade 24",
                description: "Particle Upgrades add to second column of neutrino buyables.",
                cost: new Decimal(1e153),
                unlocked() { return player.tm.buyables[5].gte(13); }, // The upgrade is only visible when this is true
			},
			25: {
				title: "Particle Upgrade 25",
                description: "Particle Upgrades add to third column of neutrino buyables.",
                cost: new Decimal(1e219),
                unlocked() { return player.tm.buyables[5].gte(13); }, // The upgrade is only visible when this is true
			},
			31: {
				title: "Particle Upgrade 31",
                description: "Unlock the first Particle buyable.",
                cost: new Decimal("1e943"),
                unlocked() { return player.tm.buyables[5].gte(18); }, // The upgrade is only visible when this is true
			},
			32: {
				title: "Particle Upgrade 32",
                description: "Unlock the second Particle buyable.",
                cost: new Decimal("1e1045"),
                unlocked() { return hasChallenge("incrementy_q",22); }, // The upgrade is only visible when this is true
			},
			33: {
				title: "Particle Upgrade 33",
                description: "Particle Acceleration add to first column of neutrino buyables.",
                cost: new Decimal("1e1096"),
                unlocked() { return hasChallenge("incrementy_q",22); }, // The upgrade is only visible when this is true
			},
			34: {
				title: "Particle Upgrade 34",
                description: "Gain 1e3x more rewritten points in TPTR, and 10x more experience in Game Dev Tree.",
                cost: new Decimal("1e1170"),
                unlocked() { return hasChallenge("incrementy_q",22); }, // The upgrade is only visible when this is true
			},
			35: {
				title: "Particle Upgrade 35",
                description: "Unlock the third Particle buyable.",
                cost: new Decimal("1e1250"),
                unlocked() { return hasChallenge("incrementy_q",22); }, // The upgrade is only visible when this is true
			},
	 },
	 buyables:{
                rows: 1, 
                cols: 3,
                11: {
                        title: "Particle Acceleration",
						cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
							let cost = Decimal.pow(2, x.pow(3)).mul("1e990");
							return cost
						},
						display() { // Everything else displayed in the buyable button after the title
							let data = tmp[this.layer].buyables[this.id]
							return "Amount: "+formatWhole(player.incrementy_p.buyables[11])+"<br>"+
							"Cost: "+format(data.cost)+" Particles<br>"+
							"Effect: Particle gain x"+format(data.effect);
						},
                        unlocked(){ return hasUpgrade("incrementy_p", 31) },
						canAfford() {
							return player.incrementy_p.points.gte(tmp[this.layer].buyables[this.id].cost);
						},
						buy() { 
							cost = tmp[this.layer].buyables[this.id].cost
							player.incrementy_n.points = player.incrementy_n.points.sub(cost)
							player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
						},
						effect(){
							let base=new Decimal(100);
							return Decimal.pow(base,player[this.layer].buyables[this.id].add(layers[this.layer].buyables[this.id].free()));
						},
						free(){
							let ret=new Decimal(0);
							return ret;
						}
                },
                12: {
                        title: "Particle Collision",
						cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
							let cost = Decimal.pow(2, x.pow(3)).mul("1e1090");
							return cost
						},
						display() { // Everything else displayed in the buyable button after the title
							let data = tmp[this.layer].buyables[this.id]
							return "Amount: "+formatWhole(player.incrementy_p.buyables[12])+"<br>"+
							"Cost: "+format(data.cost)+" Particles<br>"+
							"Effect: Neutrino and Quark gain x"+format(data.effect);
						},
                        unlocked(){ return hasUpgrade("incrementy_p", 31) },
						canAfford() {
							return player.incrementy_p.points.gte(tmp[this.layer].buyables[this.id].cost);
						},
						buy() { 
							cost = tmp[this.layer].buyables[this.id].cost
							player.incrementy_n.points = player.incrementy_n.points.sub(cost)
							player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
						},
						effect(){
							let base=new Decimal(1e7);
							return Decimal.pow(base,player[this.layer].buyables[this.id].add(layers[this.layer].buyables[this.id].free()));
						},
						free(){
							let ret=new Decimal(0);
							return ret;
						}
                },
                13: {
                        title: "Particle Simulation",
						cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
							let cost = Decimal.pow(5, x.pow(3)).mul("1e1250");
							return cost
						},
						display() { // Everything else displayed in the buyable button after the title
							let data = tmp[this.layer].buyables[this.id]
							return "Amount: "+formatWhole(player.incrementy_p.buyables[13])+"<br>"+
							"Cost: "+format(data.cost)+" Particles<br>"+
							"Effect: Gluons, Matter, and Neutrinos gain x"+format(data.effect);
						},
                        unlocked(){ return hasUpgrade("incrementy_p", 35) },
						canAfford() {
							return player.incrementy_p.points.gte(tmp[this.layer].buyables[this.id].cost);
						},
						buy() { 
							cost = tmp[this.layer].buyables[this.id].cost
							player.incrementy_n.points = player.incrementy_n.points.sub(cost)
							player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
						},
						effect(){
							let base=new Decimal(1e10);
							return Decimal.pow(base,player[this.layer].buyables[this.id].add(layers[this.layer].buyables[this.id].free()));
						},
						free(){
							let ret=new Decimal(0);
							return ret;
						}
                },
	 },
		update(diff){
					if(hasUpgrade("incrementy_s",12)){
						var target=player.incrementy_p.points.div("1e990").add(1).log(2).pow(1/3).add(1).floor();
						if(target.gt(player.incrementy_p.buyables[11])){
							player.incrementy_p.buyables[11]=target;
						}
					}
					if(hasUpgrade("incrementy_s",12)){
						var target=player.incrementy_p.points.div("1e1090").add(1).log(2).pow(1/3).add(1).floor();
						if(target.gt(player.incrementy_p.buyables[12])){
							player.incrementy_p.buyables[12]=target;
						}
					}
					if(hasUpgrade("incrementy_s",12)){
						var target=player.incrementy_p.points.div("1e1250").add(1).log(5).pow(1/3).add(1).floor();
						if(target.gt(player.incrementy_p.buyables[13])){
							player.incrementy_p.buyables[13]=target;
						}
					}
		},
	 
});


addLayer("incrementy_n", {
    name: "incrementy_n", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "N", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#B5F146",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "Neutrinos", // Name of prestige currency
    baseResource: "Particles", // Name of resource prestige is based on
    baseAmount() {return player.incrementy_p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        ret = new Decimal(1)
		if(hasUpgrade("incrementy_p",13))ret = ret.mul(1.35);
		if(hasUpgrade("incrementy_p",21))ret = ret.mul(1.1);
		if(hasUpgrade("incrementy_g",15))ret = ret.mul(upgradeEffect("incrementy_g",15));
        return ret
    },
	gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(hasUpgrade("incrementy_n",12))mult = mult.mul(buyableEffect("incrementy_n",11));
		if(hasUpgrade("incrementy_p",14))mult = mult.mul(upgradeEffect("incrementy_p",14));
		if(hasUpgrade("incrementy_g",12))mult = mult.mul(upgradeEffect("incrementy_g",12));
		if(hasUpgrade("incrementy_i",44))mult = mult.mul(upgradeEffect("incrementy_i",44));
		if(hasUpgrade("incrementy_p",32))mult = mult.mul(buyableEffect("incrementy_p",12));
		if(hasUpgrade("incrementy_p",35))mult = mult.mul(buyableEffect("incrementy_p",13));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.tm.currentTree==5 && hasUpgrade("incrementy_p",12);},
		doReset(l){
			if(l=="incrementy_i" || l=="incrementy_am" || l=="incrementy_m" || !l.startsWith("incrementy_")){return;}
			layerDataReset("incrementy_n",["upgrades","milestones","challenges"]);
			return;
		},
		
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
						"milestones",
						"buyables",
					"upgrades"
				],
	 resetsNothing: true,
	passiveGeneration(){
		if(hasUpgrade("incrementy_s",11)&&hasUpgrade("incrementy_n",11))return 100;
		if(hasUpgrade("incrementy_n",11))return 1;
		return 0;
	},
	
	 upgrades: {
            rows: 2,
            cols: 5,
			11: {
				title: "Neutrino Upgrade 11",
                description(){return "Gain "+(hasUpgrade("incrementy_s",11)?10000:100)+"% of Neutrino gain per second."},
                cost: new Decimal(15),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			12: {
				title: "Neutrino Upgrade 12",
                description: "Unlock a neutrino buyable.",
                cost: new Decimal(1e3),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			13: {
				title: "Neutrino Upgrade 13",
                description: "Unlock a neutrino buyable.",
                cost: new Decimal(1e6),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			14: {
				title: "Neutrino Upgrade 14",
                description: "Unlock a neutrino buyable.",
                cost: new Decimal(1e12),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			15: {
				title: "Neutrino Upgrade 15",
                description: "Base particle gain formula is better.",
                cost: new Decimal(1e18),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			21: {
				title: "Neutrino Upgrade 21",
                description: "Particle Upgrade 14 is squared.",
                cost: new Decimal(1e54),
                unlocked() { return player.tm.buyables[5].gte(12); }, // The upgrade is only visible when this is true
			},
			22: {
				title: "Neutrino Upgrade 22",
                description: "Unlock 3 neutrino buyables.",
                cost: new Decimal(1e65),
                unlocked() { return player.tm.buyables[5].gte(12); }, // The upgrade is only visible when this is true
			},
			23: {
				title: "Neutrino Upgrade 23",
                description: "Remove Particle Cap.",
                cost: new Decimal(1e169),
                unlocked() { return player.tm.buyables[5].gte(12); }, // The upgrade is only visible when this is true
			},
			24: {
				title: "Neutrino Upgrade 24",
                description: "Base particle gain exponent is multiplied by 1.5",
                cost: new Decimal(1e175),
                unlocked() { return player.tm.buyables[5].gte(12); }, // The upgrade is only visible when this is true
			},
			25: {
				title: "Neutrino Upgrade 25",
                description: "Unlock 3 neutrino buyables.",
                cost: new Decimal(1e200),
                unlocked() { return player.tm.buyables[5].gte(13); }, // The upgrade is only visible when this is true
			},
	 },
		update(diff){
					if(hasUpgrade("incrementy_s",11)){
						var target=player.incrementy_n.points.div(100).add(1).log(1.25).pow(1/2).add(1).floor();
						if(target.gt(player.incrementy_n.buyables[11])){
							player.incrementy_n.buyables[11]=target;
						}
					}
					if(hasUpgrade("incrementy_s",11)){
						var target=player.incrementy_n.points.div(1e6).add(1).log(1.5).pow(1/2).add(1).floor();
						if(target.gt(player.incrementy_n.buyables[12])){
							player.incrementy_n.buyables[12]=target;
						}
					}
					if(hasUpgrade("incrementy_s",11)){
						var target=player.incrementy_n.points.div(1e11).add(1).log(2).pow(1/2).add(1).floor();
						if(target.gt(player.incrementy_n.buyables[13])){
							player.incrementy_n.buyables[13]=target;
						}
					}
					if(hasUpgrade("incrementy_s",11)){
						var target=player.incrementy_n.points.div(1e50).add(1).log(2.5).pow(1/2).add(1).floor();
						if(target.gt(player.incrementy_n.buyables[21])){
							player.incrementy_n.buyables[21]=target;
						}
					}
					if(hasUpgrade("incrementy_s",11)){
						var target=player.incrementy_n.points.div(1e70).add(1).log(5).pow(1/2).add(1).floor();
						if(target.gt(player.incrementy_n.buyables[22])){
							player.incrementy_n.buyables[22]=target;
						}
					}
					if(hasUpgrade("incrementy_s",11)){
						var target=player.incrementy_n.points.div(1e110).add(1).log(125).pow(1/2).add(1).floor();
						if(target.gt(player.incrementy_n.buyables[23])){
							player.incrementy_n.buyables[23]=target;
						}
					}
					if(hasUpgrade("incrementy_s",11)){
						var target=player.incrementy_n.points.div(1e150).add(1).log(1000).pow(1/2).add(1).floor();
						if(target.gt(player.incrementy_n.buyables[31])){
							player.incrementy_n.buyables[31]=target;
						}
					}
					if(hasUpgrade("incrementy_s",11)){
						var target=player.incrementy_n.points.div(1e200).add(1).log(1250).pow(1/2).add(1).floor();
						if(target.gt(player.incrementy_n.buyables[32])){
							player.incrementy_n.buyables[32]=target;
						}
					}
					if(hasUpgrade("incrementy_s",11)){
						var target=player.incrementy_n.points.div(1e250).add(1).log(1e10).pow(1/2).add(1).floor();
						if(target.gt(player.incrementy_n.buyables[33])){
							player.incrementy_n.buyables[33]=target;
						}
					}
		},
	 
	 buyables:{
		 rows: 3,
		 cols: 3,
		 11: {
                title: "Neutrino Generation",
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1.25, x.pow(2)).mul(100);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Amount: "+formatWhole(player.incrementy_n.buyables[11])+"+"+formatWhole(data.free)+"<br>"+
					"Cost: "+format(data.cost)+" Neutrinos<br>"+
					"Effect: Neutrino gain x"+format(data.effect);
                },
                unlocked() { return hasUpgrade("incrementy_n",12) }, 
                canAfford() {
					return player.incrementy_n.points.gte(tmp[this.layer].buyables[this.id].cost);
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player.incrementy_n.points = player.incrementy_n.points.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				effect(){
					let base=new Decimal(3);
					if(hasUpgrade("incrementy_g",23))base=base.mul(1.5);
					if(hasUpgrade("incrementy_s",12))base=base.mul(1.2);
					return Decimal.pow(base,player[this.layer].buyables[this.id].add(layers[this.layer].buyables[this.id].free()));
				},
				free(){
					let ret=player.incrementy_n.buyables[12];
					ret=ret.add(layers.incrementy_n.buyables[12].free());
					ret=ret.add(player.incrementy_n.buyables[21]);
					ret=ret.add(layers.incrementy_n.buyables[21].free());
					if(hasUpgrade("incrementy_p",23))ret=ret.add(player.incrementy_p.upgrades.length||0);
					if(hasUpgrade("incrementy_p",33))ret=ret.add(player.incrementy_p.buyables[11]);
					if(hasUpgrade("incrementy_s",13))ret=ret.add(player.incrementy_s.upgrades.length||0);
					return ret;
				}
        },
		 12: {
                title: "Particle Generation",
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1.5, x.pow(2)).mul(1e6);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Amount: "+formatWhole(player.incrementy_n.buyables[12])+"+"+formatWhole(data.free)+"<br>"+
					"Cost: "+format(data.cost)+" Neutrinos<br>"+
					"Effect: Particle gain x"+format(data.effect);
                },
                unlocked() { return hasUpgrade("incrementy_n",13) }, 
                canAfford() {
					return player.incrementy_n.points.gte(tmp[this.layer].buyables[this.id].cost);
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player.incrementy_n.points = player.incrementy_n.points.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				effect(){
					let base=new Decimal(1.4);
					return Decimal.pow(base,player[this.layer].buyables[this.id].add(layers[this.layer].buyables[this.id].free()));
				},
				free(){
					let ret=player.incrementy_n.buyables[13];
					ret=ret.add(layers.incrementy_n.buyables[13].free());
					ret=ret.add(player.incrementy_n.buyables[22]);
					ret=ret.add(layers.incrementy_n.buyables[22].free());
					if(hasUpgrade("incrementy_p",24))ret=ret.add(player.incrementy_p.upgrades.length||0);
					if(hasUpgrade("incrementy_s",14))ret=ret.add(player.incrementy_p.buyables[12]);
					if(hasUpgrade("incrementy_s",13))ret=ret.add(player.incrementy_s.upgrades.length||0);
					return ret;
				}
        },
		 13: {
                title: "Base Incrementy Gain",
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(2)).mul(1e11);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Amount: "+formatWhole(player.incrementy_n.buyables[13])+"+"+formatWhole(data.free)+"<br>"+
					"Cost: "+format(data.cost)+" Neutrinos<br>"+
					"Effect: Base incrementy gain x"+format(data.effect);
                },
                unlocked() { return hasUpgrade("incrementy_n",14) }, 
                canAfford() {
					return player.incrementy_n.points.gte(tmp[this.layer].buyables[this.id].cost);
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player.incrementy_n.points = player.incrementy_n.points.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				effect(){
					let base=new Decimal(1e5);
					return Decimal.pow(base,player[this.layer].buyables[this.id].add(layers[this.layer].buyables[this.id].free()));
				},
				free(){
					let ret=player.incrementy_n.buyables[23];
					ret=ret.add(layers.incrementy_n.buyables[23].free());
					if(hasUpgrade("incrementy_p",25))ret=ret.add(player.incrementy_p.upgrades.length||0);
					if(hasUpgrade("incrementy_s",15))ret=ret.add(player.incrementy_p.buyables[13]);
					if(hasUpgrade("incrementy_s",13))ret=ret.add(player.incrementy_s.upgrades.length||0);
					return ret;
				}
        },
		 21: {
                title: "Incrementy Boost",
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2.5, x.pow(2)).mul(1e50);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Amount: "+formatWhole(player.incrementy_n.buyables[21])+"+"+formatWhole(data.free)+"<br>"+
					"Cost: "+format(data.cost)+" Neutrinos<br>"+
					"Effect: Incrementy gain x"+format(data.effect)+" (based on neutrinos)";
                },
                unlocked() { return hasUpgrade("incrementy_n",22) }, 
                canAfford() {
					return player.incrementy_n.points.gte(tmp[this.layer].buyables[this.id].cost);
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player.incrementy_n.points = player.incrementy_n.points.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				effect(){
					let base=player.incrementy_n.best.plus(10).log10().pow(10);
					return Decimal.pow(base,player[this.layer].buyables[this.id].add(layers[this.layer].buyables[this.id].free()));
				},
				free(){
					let ret=player.incrementy_n.buyables[22];
					ret=ret.add(layers.incrementy_n.buyables[22].free());
					ret=ret.add(player.incrementy_n.buyables[31]);
					ret=ret.add(layers.incrementy_n.buyables[31].free());
					if(hasUpgrade("incrementy_p",23))ret=ret.add(player.incrementy_p.upgrades.length||0);
					if(hasUpgrade("incrementy_p",33))ret=ret.add(player.incrementy_p.buyables[11]);
					if(hasUpgrade("incrementy_s",13))ret=ret.add(player.incrementy_s.upgrades.length||0);
					return ret;
				}
        },
		 22: {
                title: "Particle Boost",
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(5, x.pow(2)).mul(1e70);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Amount: "+formatWhole(player.incrementy_n.buyables[22])+"+"+formatWhole(data.free)+"<br>"+
					"Cost: "+format(data.cost)+" Neutrinos<br>"+
					"Effect: Particle gain x"+format(data.effect)+" (based on neutrinos)";
                },
                unlocked() { return hasUpgrade("incrementy_n",22) }, 
                canAfford() {
					return player.incrementy_n.points.gte(tmp[this.layer].buyables[this.id].cost);
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player.incrementy_n.points = player.incrementy_n.points.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				effect(){
					let base=player.incrementy_n.best.plus(10).log10().pow(0.5);
					return Decimal.pow(base,player[this.layer].buyables[this.id].add(layers[this.layer].buyables[this.id].free()));
				},
				free(){
					let ret=player.incrementy_n.buyables[23];
					ret=ret.add(layers.incrementy_n.buyables[23].free());
					ret=ret.add(player.incrementy_n.buyables[32]);
					ret=ret.add(layers.incrementy_n.buyables[32].free());
					if(hasUpgrade("incrementy_p",24))ret=ret.add(player.incrementy_p.upgrades.length||0);
					if(hasUpgrade("incrementy_s",14))ret=ret.add(player.incrementy_p.buyables[12]);
					if(hasUpgrade("incrementy_s",13))ret=ret.add(player.incrementy_s.upgrades.length||0);
					return ret;
				}
        },
		 23: {
                title: "Energy Boost",
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(125, x.pow(2)).mul(1e110);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Amount: "+formatWhole(player.incrementy_n.buyables[23])+"+"+formatWhole(data.free)+"<br>"+
					"Cost: "+format(data.cost)+" Neutrinos<br>"+
					"Effect: Energy gain x"+format(data.effect);
                },
                unlocked() { return hasUpgrade("incrementy_n",22) }, 
                canAfford() {
					return player.incrementy_n.points.gte(tmp[this.layer].buyables[this.id].cost);
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player.incrementy_n.points = player.incrementy_n.points.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				effect(){
					let base=new Decimal(100);
					return Decimal.pow(base,player[this.layer].buyables[this.id].add(layers[this.layer].buyables[this.id].free()));
				},
				free(){
					let ret=player.incrementy_n.buyables[33];
					ret=ret.add(layers.incrementy_n.buyables[33].free());
					if(hasUpgrade("incrementy_p",25))ret=ret.add(player.incrementy_p.upgrades.length||0);
					if(hasUpgrade("incrementy_s",15))ret=ret.add(player.incrementy_p.buyables[13]);
					if(hasUpgrade("incrementy_s",13))ret=ret.add(player.incrementy_s.upgrades.length||0);
					return ret;
				}
        },
		 31: {
                title: "Matter Gain",
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1000, x.pow(2)).mul(1e150);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Amount: "+formatWhole(player.incrementy_n.buyables[31])+"+"+formatWhole(data.free)+"<br>"+
					"Cost: "+format(data.cost)+" Neutrinos<br>"+
					"Effect: Matter gain x"+format(data.effect);
                },
                unlocked() { return hasUpgrade("incrementy_n",25) }, 
                canAfford() {
					return player.incrementy_n.points.gte(tmp[this.layer].buyables[this.id].cost);
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player.incrementy_n.points = player.incrementy_n.points.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				effect(){
					let base=new Decimal(25);
					return Decimal.pow(base,player[this.layer].buyables[this.id].add(layers[this.layer].buyables[this.id].free()));
				},
				free(){
					let ret=player.incrementy_n.buyables[32];
					ret=ret.add(layers.incrementy_n.buyables[32].free());
					if(hasUpgrade("incrementy_p",23))ret=ret.add(player.incrementy_p.upgrades.length||0);
					if(hasUpgrade("incrementy_p",33))ret=ret.add(player.incrementy_p.buyables[11]);
					if(hasUpgrade("incrementy_s",13))ret=ret.add(player.incrementy_s.upgrades.length||0);
					return ret;
				}
        },
		 32: {
                title: "Antimatter Gain",
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1250, x.pow(2)).mul(1e200);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Amount: "+formatWhole(player.incrementy_n.buyables[32])+"+"+formatWhole(data.free)+"<br>"+
					"Cost: "+format(data.cost)+" Neutrinos<br>"+
					"Effect: Antimatter gain x"+format(data.effect);
                },
                unlocked() { return hasUpgrade("incrementy_n",25) }, 
                canAfford() {
					return player.incrementy_n.points.gte(tmp[this.layer].buyables[this.id].cost);
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player.incrementy_n.points = player.incrementy_n.points.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				effect(){
					let base=new Decimal(10);
					return Decimal.pow(base,player[this.layer].buyables[this.id].add(layers[this.layer].buyables[this.id].free()));
				},
				free(){
					let ret=player.incrementy_n.buyables[33];
					ret=ret.add(layers.incrementy_n.buyables[33].free());
					if(hasUpgrade("incrementy_p",24))ret=ret.add(player.incrementy_p.upgrades.length||0);
					if(hasUpgrade("incrementy_s",14))ret=ret.add(player.incrementy_p.buyables[12]);
					if(hasUpgrade("incrementy_s",13))ret=ret.add(player.incrementy_s.upgrades.length||0);
					return ret;
				}
        },
		 33: {
                title: "Amoeba Gain",
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1e10, x.pow(2)).mul(1e250);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Amount: "+formatWhole(player.incrementy_n.buyables[33])+"+"+formatWhole(data.free)+"<br>"+
					"Cost: "+format(data.cost)+" Neutrinos<br>"+
					"Effect: Amoeba gain x"+format(data.effect);
                },
                unlocked() { return hasUpgrade("incrementy_n",25) }, 
                canAfford() {
					return player.incrementy_n.points.gte(tmp[this.layer].buyables[this.id].cost);
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player.incrementy_n.points = player.incrementy_n.points.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				effect(){
					let base=new Decimal(10);
					return Decimal.pow(base,player[this.layer].buyables[this.id].add(layers[this.layer].buyables[this.id].free()));
				},
				free(){
					let ret=new Decimal(0);
					if(hasUpgrade("incrementy_p",25))ret=ret.add(player.incrementy_p.upgrades.length||0);
					if(hasUpgrade("incrementy_s",15))ret=ret.add(player.incrementy_p.buyables[13]);
					if(hasUpgrade("incrementy_s",13))ret=ret.add(player.incrementy_s.upgrades.length||0);
					return ret;
				}
        },
	 },
});


addLayer("incrementy_g", {
    name: "incrementy_g", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#744100",
    requires: new Decimal(1e300), // Can be a function that takes requirement increases into account
    resource: "Gluons", // Name of prestige currency
    baseResource: "Particles", // Name of resource prestige is based on
    baseAmount() {return player.incrementy_p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        ret = new Decimal(1)
		if(hasUpgrade("incrementy_g",34))ret = ret.mul(upgradeEffect("incrementy_g",34));
        return ret
    },
	gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(hasUpgrade("incrementy_i",43))mult = mult.mul(upgradeEffect("incrementy_i",43));
		if(hasUpgrade("incrementy_p",35))mult = mult.mul(buyableEffect("incrementy_p",13));
		return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.tm.currentTree==5 && player.tm.buyables[5].gte(14);},
		doReset(l){
			if(l=="incrementy_i" || l=="incrementy_am" || l=="incrementy_m" || !l.startsWith("incrementy_")){return;}
			layerDataReset("incrementy_g",["upgrades","milestones","challenges"]);
			return;
		},
		
	 resetsNothing: true,
	passiveGeneration(){
		if(hasUpgrade("incrementy_s",11)&&hasUpgrade("incrementy_g",11))return 100;
		if(hasUpgrade("incrementy_g",11))return 1;
		return 0;
	},
	
	 upgrades: {
            rows: 3,
            cols: 5,
			11: {
				title: "Gluon Upgrade 11",
                description(){return "Gain "+(hasUpgrade("incrementy_s",11)?10000:100)+"% of Gluon gain per second."},
                cost: new Decimal(15),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			12: {
				title: "Gluon Upgrade 12",
                description: "Gluons boost Neutrinos.",
                cost: new Decimal(1e25),
				effect() {
                    let base=10;
                    let ret = Decimal.pow(base,Decimal.log10(player.incrementy_g.points.add(1)).pow(0.9));
                    return ret;
				},
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			13: {
				title: "Gluon Upgrade 13",
                description: "Gluons boost Particles.",
                cost: new Decimal(1e28),
				effect() {
                    let base=1.5;
                    let ret = Decimal.pow(base,Decimal.log10(player.incrementy_g.points.add(1)).pow(0.9));
					if(hasUpgrade("incrementy_g",31))ret=ret.pow(2);
                    return ret;
				},
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			14: {
				title: "Gluon Upgrade 14",
                description: "Gluons boost Particle gain exponent.",
                cost: new Decimal(1e32),
				effect() {
                    let ret = player.incrementy_g.points.add(1).log10().pow(0.5).mul(0.1).add(1);
					if(hasUpgrade("incrementy_g",25))ret=ret.pow(2);
					if(hasUpgrade("incrementy_g",32))ret=ret.pow(1.1);
                    return ret;
				},
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			15: {
				title: "Gluon Upgrade 15",
                description: "Gluons boost Neutrino gain exponent.",
                cost: new Decimal(1e57),
				effect() {
                    let ret = player.incrementy_g.points.add(1).log10().pow(0.2).mul(0.01).add(1);
					if(hasUpgrade("incrementy_g",33))ret=ret.pow(1.5);
                    return ret;
				},
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			21: {
				title: "Gluon Upgrade 21",
                description: "Gluons boost base Incrementy gain.",
                cost: new Decimal(1e63),
				effect() {
                    let ret = player.incrementy_g.points.add(1);
                    return ret;
				},
                unlocked() { return player.tm.buyables[5].gte(15); }, // The upgrade is only visible when this is true
				effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			22: {
				title: "Gluon Upgrade 22",
                description: "Incrementy Upgrade 12's effect is boosted by the level of this tree.",
                cost: new Decimal(1e64),
				effect() {
                    let ret = player.tm.buyables[5].sqrt();
                    return ret;
				},
                unlocked() { return player.tm.buyables[5].gte(15); }, // The upgrade is only visible when this is true
				effectDisplay() { return "^"+format(this.effect()) }, // Add formatting to the effect
			},
			23: {
				title: "Gluon Upgrade 23",
                description: "Multiply the base of Neutrino Generation by 1.5",
                cost: new Decimal(1e65),
                unlocked() { return player.tm.buyables[5].gte(15); }, // The upgrade is only visible when this is true
			},
			24: {
				title: "Gluon Upgrade 24",
                description: "Neutrinos boost Incrementy gain.",
                cost: new Decimal(1e126),
				effect() {
                    let ret = player.incrementy_n.points.add(1);
                    return ret;
				},
                unlocked() { return player.tm.buyables[5].gte(15); }, // The upgrade is only visible when this is true
				effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			25: {
				title: "Gluon Upgrade 25",
                description: "Gluon Upgrade 14 is squared.",
                cost: new Decimal(1e127),
                unlocked() { return player.tm.buyables[5].gte(15); }, // The upgrade is only visible when this is true
			},
			31: {
				title: "Gluon Upgrade 31",
                description: "Gluon Upgrade 13 is squared.",
                cost: new Decimal(1e296),
                unlocked() { return player.incrementy_q.challenges[12]; }, // The upgrade is only visible when this is true
			},
			32: {
				title: "Gluon Upgrade 32",
                description: "Gluon Upgrade 14's effect ^1.1",
                cost: new Decimal("1e390"),
                unlocked() { return player.incrementy_q.challenges[12]; }, // The upgrade is only visible when this is true
			},
			33: {
				title: "Gluon Upgrade 33",
                description: "Gluon Upgrade 15's effect ^1.5",
                cost: new Decimal("1e509"),
                unlocked() { return player.incrementy_q.challenges[12]; }, // The upgrade is only visible when this is true
			},
			34: {
				title: "Gluon Upgrade 34",
                description: "Gluons boost Gluon gain exponent.",
                cost: new Decimal("1e538"),
				effect() {
                    let ret = player.incrementy_g.points.add(1).log10().add(1).log10().pow(0.2).mul(0.04).add(1);
                    return ret;
				},
                unlocked() { return player.incrementy_q.challenges[12]; }, // The upgrade is only visible when this is true
				effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			35: {
				title: "Gluon Upgrade 35",
                description: "Gluons cheapens Phantom Souls in The Prestige Tree Classic.",
                cost: new Decimal("1e600"),
				effect() {
                    let base=1e30;
                    let ret = Decimal.pow(base,Decimal.log10(player.incrementy_g.points.add(1)).pow(0.9));
                    return ret;
				},
                unlocked() { return player.incrementy_q.challenges[12]; }, // The upgrade is only visible when this is true
				effectDisplay() { return "/"+format(this.effect()) }, // Add formatting to the effect
			},
	 },
});


addLayer("incrementy_q", {
    name: "incrementy_q", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Q", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#A40130",
    requires: new Decimal("1e500"), // Can be a function that takes requirement increases into account
    resource: "Quarks", // Name of prestige currency
    baseResource: "Particles", // Name of resource prestige is based on
    baseAmount() {return player.incrementy_p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent() {
        ret = new Decimal(0.5)
        return ret
    },
	gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(hasUpgrade("incrementy_p",32))mult = mult.mul(buyableEffect("incrementy_p",12));
		return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.tm.currentTree==5 && player.tm.buyables[5].gte(16);},
		doReset(l){
			if(l=="incrementy_i" || l=="incrementy_am" || l=="incrementy_m" || !l.startsWith("incrementy_")){return;}
			layerDataReset("incrementy_q",["upgrades","milestones","challenges"]);
			return;
		},
		
	 resetsNothing: true,
	passiveGeneration(){
		if(hasUpgrade("incrementy_s",11)&&hasUpgrade("incrementy_q",11))return 100;
		if(hasUpgrade("incrementy_q",11))return 1;
		return 0;
	},
	
	 upgrades: {
            rows: 2,
            cols: 5,
			11: {
				title: "Quark Upgrade 11",
                description(){return "Gain "+(hasUpgrade("incrementy_s",11)?10000:100)+"% of Quark gain per second."},
                cost: new Decimal(15),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			12: {
				title: "Quark Upgrade 12",
                description: "Unlock a quark challenge.",
                cost: new Decimal(1e10),
                unlocked() { return player.tm.buyables[5].gte(17); }, // The upgrade is only visible when this is true
			},
			13: {
				title: "Quark Upgrade 13",
                description: "Unlock a quark challenge.",
                cost: new Decimal(1e35),
                unlocked() { return player.tm.buyables[5].gte(17); }, // The upgrade is only visible when this is true
			},
			14: {
				title: "Quark Upgrade 14",
                description: "Quarks boost Prestige Point gain in The Prestige Tree Classic.",
                cost: new Decimal(1e190),
				effect() {
                    let ret = Decimal.log10(player.incrementy_q.points.add(1)).pow(2e4);
                    return ret;
				},
                unlocked() { return player.tm.buyables[5].gte(17); }, // The upgrade is only visible when this is true
				effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			15: {
				title: "Quark Upgrade 15",
                description: "Unlock a quark challenge.",
                cost: new Decimal(1e192),
                unlocked() { return player.tm.buyables[5].gte(18); }, // The upgrade is only visible when this is true
			},
	 },
	 
        challenges: {
                rows: 2,
                cols: 2,
                11: {
                        name: "Son",
                        challengeDescription: "Square root Incrementy gain",
                        rewardDescription: "Unlock some Incrementy Upgrades",
                        unlocked(){
                                return hasUpgrade("incrementy_q",12);
                        },
                        currencyDisplayName: "incrementy",
                        currencyInternalName: "5",
                        currencyLayer: "modpoints",
                        goal(){
                                let exp = layers.incrementy_q.getChallGoalExp()
                                return Decimal.pow(10, 50000).pow(exp)
                        },
                },
                12: {
                        name: "Sun",
                        challengeDescription: "Cube root Incrementy gain",
                        rewardDescription: "Unlock some Gluon Upgrades",
                        unlocked(){
                                return hasUpgrade("incrementy_q",13);
                        },
                        currencyDisplayName: "incrementy",
                        currencyInternalName: "5",
                        currencyLayer: "modpoints",
                        goal(){
                                let exp = layers.incrementy_q.getChallGoalExp()
                                return Decimal.pow(10, 37800).pow(exp)
                        },
                },
                21: {
                        name: "Pole",
                        challengeDescription: "Fifth root Incremenety gain",
                        rewardDescription: "Unlock some Antimatter Upgrades",
                        unlocked(){
                                return hasUpgrade("incrementy_q",15);
                        },
                        currencyDisplayName: "incrementy",
                        currencyInternalName: "5",
                        currencyLayer: "modpoints",
                        goal(){
                                let exp = layers.incrementy_q.getChallGoalExp()
                                return Decimal.pow(10, 28838).pow(exp)
                        },
                },
                22: {
                        name: "Poll",
                        challengeDescription: "Fourth root Incremenety gain",
                        rewardDescription: "Unlock some Particle Upgrades",
                        unlocked(){
                                return hasUpgrade("incrementy_am",34);
                        },
                        currencyDisplayName: "incrementy",
                        currencyInternalName: "5",
                        currencyLayer: "modpoints",
                        goal(){
                                let exp = layers.incrementy_q.getChallGoalExp()
                                return Decimal.pow(10, 44000).pow(exp)
                        },
                },
		},
		
        getChallGoalExp(){
                let q = player.incrementy_q.points
                if (q.gt(100)) q = q.log10().times(50)
                if (q.gt(1e4)) q = q.log10().times(2.5).pow(4)
                if (q.gt(1e10)) q = q.log10().pow(10)
                return q.plus(10).log10().plus(9).log10().pow(-1)
        },
});


addLayer("incrementy_s", {
    name: "incrementy_s", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#1346DF",
    requires: new Decimal("1e1450"), // Can be a function that takes requirement increases into account
    resource: "Shards", // Name of prestige currency
    baseResource: "particles", // Name of resource prestige is based on
    baseAmount() {return player.incrementy_p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    branches: ["incrementy_p"],
    row: 3, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.tm.currentTree==5 && player.tm.buyables[5].gte(19)},
		doReset(l){
			if(l=="incrementy_i" || l=="incrementy_am" || l=="incrementy_m" || l=="incrementy_a" || l=="incrementy_e" || l=="incrementy_n" || l=="incrementy_g" || l=="incrementy_q" || l=="incrementy_p" ||  l=="incrementy_s" || !l.startsWith("incrementy_")){return;}
			layerDataReset("incrementy_s",["upgrades","milestones","challenges"]);
			return;
		},
	getResetGain() {
		let ret=player.incrementy_p.points;
		if(ret.lt("1e1450"))return new Decimal(0);
		ret=ret.div("1e1440").log10().div(10).pow(0.5).floor();
		return ret;
	},
	getNextAt() {
		let ret=tmp.incrementy_s.getResetGain.plus(1);
		ret=ret.pow(2).mul(10);
		ret=Decimal.pow(10,ret).mul("1e1440");
		return ret;
	},
        effect(){
				if(!player.incrementy_s.unlocked)return new Decimal(1);
                let eff1 = player.incrementy_s.points.add(1).pow(10).max(10000);
                return eff1
        },
        effectDescription(){
                let eff = layers.incrementy_s.effect()
                return "which multiplies incrementy gain by " + format(eff) + ". The effect is always at least 10,000 once you have Shard reset once"
        },
		
	 upgrades: {
            rows: 2,
            cols: 5,
			11: {
				title: "Shard Upgrade 11",
                description: "Autobuy Neutrino Buyables. 100x to Particle/Neutrino/ Gluon/Quark Upgrades 11.",
                cost: new Decimal(1),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			12: {
				title: "Shard Upgrade 12",
                description: "Autobuy Particle Buyables. x1.2 to Neutrino Generation base.",
                cost: new Decimal(3),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			13: {
				title: "Shard Upgrade 13",
                description: "Shard Upgrades add to all neutrino buyables.",
                cost: new Decimal(10),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			14: {
				title: "Shard Upgrade 14",
                description: "Particle Collision add to second column of neutrino buyables.",
                cost: new Decimal(30),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			15: {
				title: "Shard Upgrade 15",
                description: "Particle Simulation add to third column of neutrino buyables.",
                cost: new Decimal(100),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
	 },
	passiveGeneration(){
		return 0;
	}
});
