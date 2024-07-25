


addLayer("stardust_s", {
    name: "stardust_s", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#404060",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "stardust", // Name of prestige currency
    baseResource: "energy", // Name of resource prestige is based on
    baseAmount() {return player.modpoints[2]}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		mult = mult.mul(tmp.stardust_so.effect);
		if(hasUpgrade("tptc_p",21))mult = mult.mul(upgradeEffect("tptc_p",21));
		mult = mult.mul(buyableEffect("stardust_n",13));
		if(hasUpgrade("stardust_c",13))mult = mult.mul(upgradeEffect("stardust_c",13));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown(){return player.tm.currentTree==2},
		
		doReset(l){
			if(l=="stardust_s" || !l.startsWith("stardust_")){return;}
			layerDataReset("stardust_s",["upgrades","milestones","challenges"]);
			return;
		},
		update(diff){
			let gain=new Decimal(0);
			if(hasUpgrade("stardust_s",11))gain=gain.add(1);
			gain=gain.add(buyableEffect("stardust_so",11));
			if(hasUpgrade("stardust_s",13))gain=gain.mul(upgradeEffect("stardust_s",13));
			gain=gain.mul(tmp.stardust_n.effect);
			gain=gain.mul(buyableEffect("stardust_n",11));
			if(hasUpgrade("stardust_s",21))gain=gain.mul(upgradeEffect("stardust_s",21));
			if(hasUpgrade("stardust_s",22))gain=gain.mul(upgradeEffect("stardust_s",22));
			gain=gain.mul(buyableEffect("stardust_n",12));
			if(hasUpgrade("stardust_c",15))gain=gain.mul(upgradeEffect("stardust_c",15));
			player.modpoints[2]=player.modpoints[2].add(gain.mul(diff));
		},
		upgrades: {
            rows: 4,
            cols: 5,
			11: {
				title: "Stardust Upgrade 11",
                description: "Add 1 to base energy gain.",
                cost: new Decimal(0),
                unlocked() { return true; }, // The upgrade is only visible when this is true
            },
			12: {
				title: "Stardust Upgrade 12",
                description: "Point gain is boosted based on your energy.",
                cost: new Decimal(1),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=20;
                    let ret = Decimal.pow(base,Decimal.log10(player.modpoints[2].mul(10).add(1)).pow(0.9));
					if(player.stardust_c.points.gte(31))ret = Decimal.pow(base,Decimal.log10(player.modpoints[2].mul(10).add(1)).pow(0.95));
					if(player.stardust_c.points.gte(33))ret = player.modpoints[2].pow(1.3);
					if(player.stardust_c.points.gte(37))ret = player.modpoints[2].pow(1.5625);
					if(hasUpgrade("stardust_so",11))ret=ret.pow(2);
					if(hasUpgrade("stardust_n",11))ret=ret.pow(2);
					if(hasUpgrade("stardust_s",31))ret=ret.pow(2);
					if(hasUpgrade("stardust_c",14))ret=ret.pow(2);
					if(hasUpgrade("stardust_c",31))ret=ret.pow(upgradeEffect("stardust_c",31));
					if(hasUpgrade("stardust_s",14))ret=ret.pow(2);
					if(hasUpgrade("stardust_s",43))ret=ret.pow(2);
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			13: {
				title: "Stardust Upgrade 13",
                description: "Energy gain is boosted based on the level of this tree.",
                cost: new Decimal(1),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let ret=Decimal.pow(2,player.tm.buyables[2].pow(1.5));
					return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			21: {
				title: "Stardust Upgrade 21",
                description: "Points boost energy gain.",
                cost: new Decimal(3e5),
                unlocked() { return player.tm.buyables[2].gte(4); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=1.03;
                    let ret = Decimal.pow(base,Decimal.log10(player.points.add(1)).pow(0.5));
					if(hasUpgrade("stardust_s",33))ret=ret.pow(2);
					if(hasUpgrade("stardust_c",35))ret=ret.pow(upgradeEffect("stardust_c",35));
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			22: {
				title: "Stardust Upgrade 22",
                description: "Stardust boost energy gain.",
                cost: new Decimal(1e6),
                unlocked() { return player.tm.buyables[2].gte(4); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=2;
                    let ret = Decimal.pow(base,Decimal.log10(player.stardust_s.points.add(1)).pow(0.9));
					if(hasUpgrade("stardust_c",32))ret=ret.pow(upgradeEffect("stardust_c",32));
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			23: {
				title: "Stardust Upgrade 23",
                description: "Unlock a Prestige upgrade in The Prestige Tree Classic.",
                cost: new Decimal(5e7),
                unlocked() { return player.tm.buyables[2].gte(4); }, // The upgrade is only visible when this is true
            },
			31: {
				title: "Stardust Upgrade 31",
                description: "Stardust Upgrade 12 is squared.",
                cost: new Decimal(1e19),
                unlocked() { return player.tm.buyables[2].gte(6); }, // The upgrade is only visible when this is true
            },
			32: {
				title: "Stardust Upgrade 32",
                description: "Gain 100% of stardust gain per second.",
                cost: new Decimal(1e20),
                unlocked() { return player.tm.buyables[2].gte(6); }, // The upgrade is only visible when this is true
            },
			33: {
				title: "Stardust Upgrade 33",
                description: "Stardust Upgrade 21 is squared.",
                cost: new Decimal(1e21),
                unlocked() { return player.tm.buyables[2].gte(6); }, // The upgrade is only visible when this is true
            },
			14: {
				title: "Stardust Upgrade 14",
                description: "Stardust Upgrade 12 is squared.",
                cost: new Decimal("1e600"),
                unlocked() { return hasUpgrade("tm",12); }, // The upgrade is only visible when this is true
            },
			24: {
				title: "Stardust Upgrade 24",
                description: "Effects of Reflection Nebulae and Dark Nebulae are squared.",
                cost: new Decimal("1e635"),
                unlocked() { return hasUpgrade("tm",12); }, // The upgrade is only visible when this is true
            },
			34: {
				title: "Stardust Upgrade 34",
                description: "Base effect of Constellation 3 is cubed.",
                cost: new Decimal("1e700"),
                unlocked() { return hasUpgrade("tm",12); }, // The upgrade is only visible when this is true
            },
			15: {
				title: "Stardust Upgrade 15",
                description: "Crystal Upgrade 31's effect ^2",
                cost: new Decimal("1e1900"),
                unlocked() { return hasUpgrade("tm",21); }, // The upgrade is only visible when this is true
            },
			25: {
				title: "Stardust Upgrade 25",
                description: "Base effect of stars ^1.5",
                cost: new Decimal("1e1980"),
                unlocked() { return hasUpgrade("tm",21); }, // The upgrade is only visible when this is true
            },
			35: {
				title: "Stardust Upgrade 35",
                description: "Base effect of nebulae ^1.5",
                cost: new Decimal("1e2550"),
                unlocked() { return hasUpgrade("tm",21); }, // The upgrade is only visible when this is true
            },
			41: {
				title: "Stardust Upgrade 41",
                description: "Star Upgrade 12 is better, and applied to Generators in TPTC.",
                cost: new Decimal("1e9450"),
                unlocked() { return hasUpgrade("tm",32); }, // The upgrade is only visible when this is true
            },
			42: {
				title: "Stardust Upgrade 42",
                description: "Nebulae Upgrade 12 is better, and applied to Boosters in TPTC.",
                cost: new Decimal("1e9480"),
                unlocked() { return hasUpgrade("tm",32); }, // The upgrade is only visible when this is true
            },
			43: {
				title: "Stardust Upgrade 43",
                description: "Stardust Upgrade 12 is squared.",
                cost: new Decimal("1e9510"),
                unlocked() { return hasUpgrade("tm",32); }, // The upgrade is only visible when this is true
            },
			44: {
				title: "Stardust Upgrade 44",
                description: "Base effect of Constellation 3 is cubed.",
                cost: new Decimal("1e9600"),
                unlocked() { return hasUpgrade("tm",32); }, // The upgrade is only visible when this is true
            },
			45: {
				title: "Stardust Upgrade 45",
                description: "Unlock a Constellation.",
                cost: new Decimal("1e9610"),
                unlocked() { return hasUpgrade("tm",32); }, // The upgrade is only visible when this is true
            },
		},
	 passiveGeneration(){
		 if(hasUpgrade("stardust_s",32))return 1;
		 return 0;
	 },
	 hotkeys: [
		{key: "s", description: "s: Collect stardust", onPress(){if (player.tm.currentTree==2 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==2}}
    ],
});


addLayer("stardust_so", {
    name: "stardust_so", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "SO", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#fadb6b",
    requires: new Decimal(200), // Can be a function that takes requirement increases into account
    resource: "stars", // Name of prestige currency
    baseResource: "energy", // Name of resource prestige is based on
    baseAmount() {return player.modpoints[2]}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.4, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		mult = mult.div(buyableEffect("stardust_n",13).pow(layers.stardust_n.nerfPower()));
		if(hasUpgrade("stardust_c",25))mult=mult.mul(upgradeEffect("stardust_c",25));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    effect() {
        eff = player[this.layer].points.add(1).sqrt()
		if(hasUpgrade("stardust_s",25))eff = eff.pow(1.5);
		if(hasUpgrade("stardust_so",14))eff = eff.mul(buyableEffect("stardust_so",12));
        return eff
        },
    effectDescription() {
        eff = this.effect();
        return "which are boosting stardust gain by "+format(eff)+"."
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown(){return player.tm.currentTree==2 && player.tm.buyables[2].gte(2)},
		
		doReset(l){
			if(l=="stardust_s" || l=="stardust_so" || l=="stardust_n" || !l.startsWith("stardust_")){return;}
			layerDataReset("stardust_so",["upgrades","milestones","challenges"]);
			return;
		},
		
		buyables: {
            rows: 1,
            cols: 4,
			11: {
                title : "Constellation 1", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.4))
					if(hasUpgrade("stardust_c",21))cost = Decimal.pow(2, x.pow(1.3))
					return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = Decimal.pow(3, x.pow(0.9)).mul(x)
					if(hasUpgrade("stardust_c",21))eff = Decimal.pow(4, x).mul(x)
					eff = eff.mul(buyableEffect("stardust_n",14));
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " stars\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Adds + " + format(data.effect) + " to the energy generation base"
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
            },
			12: {
                title : "Constellation 2", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.4)).times(1e6)
					if(hasUpgrade("stardust_c",21))cost = Decimal.pow(2, x.pow(1.3))
					return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = Decimal.pow(2, x.pow(0.8)).mul(x).add(1)
					if(hasUpgrade("stardust_c",21))eff = Decimal.pow(3, x.pow(0.9)).mul(x).add(1)
					eff = eff.mul(buyableEffect("stardust_n",14));
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " stars\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Multiplying the star effect by " + format(data.effect) + "x"
                },
                unlocked() { return hasUpgrade("stardust_so",14); }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
            },
			13: {
                title : "Constellation 3", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(3, x.pow(1.5))
					return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = Decimal.pow(1.5, x.pow(0.7)).mul(x).add(1)
					if(hasUpgrade("stardust_s",34))eff=eff.pow(3);
					if(hasUpgrade("stardust_s",44))eff=eff.pow(3);
					eff = eff.mul(buyableEffect("stardust_n",14));
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " stars\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Multiplying subspace gain in The Prestige Tree Classic by " + format(data.effect) + "x"
                },
                unlocked() { return hasUpgrade("stardust_c",33); }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
            },
			14: {
                title : "Constellation 4", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(4, x.pow(1.5))
					return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = Decimal.pow(10, x).mul(x.pow(2).add(1))
					eff = eff.mul(buyableEffect("stardust_n",14));
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " stars\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Divide Crystal requirement by " + format(data.effect)
                },
                unlocked() { return hasUpgrade("stardust_s",45); }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
            },
		},
		upgrades: {
            rows: 1,
            cols: 5,
			11: {
				title: "Star Upgrade 11",
                description: "Stardust Upgrade 12 is squared.",
                cost: new Decimal(1000),
                unlocked() { return player.tm.buyables[2].gte(4); }, // The upgrade is only visible when this is true
            },
			12: {
				title: "Star Upgrade 12",
                description: "Boosters in The Prestige Tree Classic are cheaper based on your stars.",
                cost: new Decimal(1e6),
                unlocked() { return player.tm.buyables[2].gte(5); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=1e12;
                    let ret = Decimal.pow(base,Decimal.log10(player.stardust_so.points.add(1)).pow(0.9)).add(1);
					if(hasUpgrade("stardust_s",41))ret=player.stardust_so.points.pow(50).add(1);
					if(hasUpgrade("stardust_so",13))ret=ret.pow(2);
                    return ret;
                },
                effectDisplay() { return "/"+format(this.effect()) }, // Add formatting to the effect
            },
			13: {
				title: "Star Upgrade 13",
                description: "Star Upgrade 12 is squared.",
                cost: new Decimal(1e9),
                unlocked() { return player.tm.buyables[2].gte(6); },
            },
			14: {
				title: "Star Upgrade 14",
                description: "Unlock a Constellation.",
                cost: new Decimal(1e10),
                unlocked() { return player.tm.buyables[2].gte(7); },
            },
			15: {
				title: "Star Upgrade 15",
                description: "Crystals are cheaper based on your stars.",
                cost: new Decimal(1e100),
                unlocked() { return player.tm.buyables[2].gte(8); },
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=1.3;
                    let ret = Decimal.pow(base,Decimal.log10(player.stardust_so.points.add(1)).pow(0.9));
                    return ret;
                },
                effectDisplay() { return "/"+format(this.effect()) }, // Add formatting to the effect
            },
		},
		   branches: [["stardust_s", 5]],
	 hotkeys: [
		{key: "S", description: "Shift-s: reset your stardust for stars", onPress(){if (player.tm.currentTree==2 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==2}}
    ],
	 passiveGeneration(){
		 if(hasUpgrade("stardust_c",11))return 1;
		 return 0;
	 },
});


addLayer("stardust_n", {
    name: "stardust_n", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "N", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#6541d1",
    requires: new Decimal(100), // Can be a function that takes requirement increases into account
    resource: "nebulae", // Name of prestige currency
    baseResource: "stardust", // Name of resource prestige is based on
    baseAmount() {return player.stardust_s.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.4, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		mult = mult.div(buyableEffect("stardust_n",12).pow(layers.stardust_n.nerfPower()));
		if(hasUpgrade("stardust_c",25))mult=mult.mul(upgradeEffect("stardust_c",25));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    effect() {
        eff = player[this.layer].points.add(1).sqrt()
		if(hasUpgrade("stardust_s",35))eff = eff.pow(1.5);
        return eff
        },
    effectDescription() {
        eff = this.effect();
        return "which are boosting energy gain by "+format(eff)+"."
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown(){return player.tm.currentTree==2 && player.tm.buyables[2].gte(3)},
		
		doReset(l){
			if(l=="stardust_s" || l=="stardust_so" || l=="stardust_n" || !l.startsWith("stardust_")){return;}
			layerDataReset("stardust_n",["upgrades","milestones","challenges"]);
			return;
		},
		
		buyables: {
            rows: 1,
            cols: 4,
			11: {
                title : "Emission Nebulae", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.4))
					if(hasUpgrade("stardust_c",22))cost = Decimal.pow(2, x.pow(1.3))
					return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = Decimal.pow(3, x.pow(0.6))
					if(hasUpgrade("stardust_c",22))eff = Decimal.pow(4, x.pow(0.8))
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " nebulae\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Further multiply energy gain by " + format(data.effect) + "x"
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
            },
			12: {
                title : "Reflection Nebulae", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(2))
					if(hasUpgrade("stardust_c",22))cost = Decimal.pow(2, x.pow(1.7))
					return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = Decimal.pow(3, x.pow(0.8))
					if(hasUpgrade("stardust_c",22))eff = Decimal.pow(4, x.pow(0.8))
					if(hasUpgrade("stardust_s",24))eff=eff.pow(2);
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " nebulae\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Divides nebula gain by " + format(data.effect.pow(layers.stardust_n.nerfPower())) + "x and multiplies energy gain by " + format(data.effect) + "x"
                },
                unlocked() { return player[this.layer].unlocked && player.tm.buyables[2].gte(4)}, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
            },
			13: {
                title : "Dark Nebulae", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(2))
					if(hasUpgrade("stardust_c",22))cost = Decimal.pow(2, x.pow(1.7))
					return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = Decimal.pow(3, x.pow(0.8))
					if(hasUpgrade("stardust_c",22))eff = Decimal.pow(4, x.pow(0.8))
					if(hasUpgrade("stardust_s",24))eff=eff.pow(2);
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " nebulae\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Divides star gain by " + format(data.effect.pow(layers.stardust_n.nerfPower())) + "x and multiplies stardust gain by " + format(data.effect) + "x"
                },
                unlocked() { return player[this.layer].unlocked && player.tm.buyables[2].gte(5)}, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
            },
			14: {
                title : "Planetary Nebulae", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.7))
					if(hasUpgrade("stardust_c",22))cost = Decimal.pow(2, x.pow(1.5))
					return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = Decimal.pow(1.3, x)
					if(hasUpgrade("stardust_c",22))eff = Decimal.pow(1.4, x)
                    return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Cost: " + format(data.cost) + " nebulae\n\
                    Amount: " + player[this.layer].buyables[this.id] + "\n\
                    Multiplies constellation effects by " + format(data.effect) + "x"
                },
                unlocked() { return player[this.layer].unlocked && player.tm.buyables[2].gte(6)}, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
            },
		},
		nerfPower (){
			let ret = new Decimal(0.35);
			if(hasUpgrade("stardust_n",14))ret=ret.mul(0.8);
			if(hasUpgrade("stardust_n",15))ret=ret.mul(0.6);
			return ret;
		},
		upgrades: {
            rows: 1,
            cols: 5,
			11: {
				title: "Nebulae Upgrade 11",
                description: "Stardust Upgrade 12 is squared.",
                cost: new Decimal(100),
                unlocked() { return player.tm.buyables[2].gte(4); }, // The upgrade is only visible when this is true
            },
			12: {
				title: "Nebulae Upgrade 12",
                description: "Generators in The Prestige Tree Classic are cheaper based on your nebulae.",
                cost: new Decimal(1e5),
                unlocked() { return player.tm.buyables[2].gte(5); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=1e12;
                    let ret = Decimal.pow(base,Decimal.log10(player.stardust_n.points.add(1)).pow(0.9)).add(1);
					if(hasUpgrade("stardust_s",42))ret=player.stardust_n.points.pow(50).add(1);
					if(hasUpgrade("stardust_n",13))ret=ret.pow(2);
                    return ret;
                },
                effectDisplay() { return "/"+format(this.effect()) }, // Add formatting to the effect
            },
			13: {
				title: "Nebulae Upgrade 13",
                description: "Nebulae Upgrade 12 is squared.",
                cost: new Decimal(1e7),
                unlocked() { return player.tm.buyables[2].gte(6); },
            },
			14: {
				title: "Nebulae Upgrade 14",
                description: "Nerf effects of Nebula buyables ^0.8",
                cost: new Decimal(1e8),
                unlocked() { return player.tm.buyables[2].gte(7); },
            },
			15: {
				title: "Nebulae Upgrade 15",
                description: "Nerf effects of Nebula buyables ^0.6",
                cost: new Decimal(1e100),
                unlocked() { return player.tm.buyables[2].gte(8); },
            },
		},
		   branches: [["stardust_s", 6]],
        hotkeys: [
            {key: "n", 
            description: "n: reset your stardust for nebulas",
			onPress(){if (player.tm.currentTree==2 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==2}}
        ],
	 passiveGeneration(){
		 if(hasUpgrade("stardust_c",12))return 1;
		 return 0;
	 },
});


addLayer("stardust_c", {
    name: "stardust_c", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		shards: new Decimal(0),
    }},
    color: "#A0A0E0",
    requires: new Decimal(3.333e33), // Can be a function that takes requirement increases into account
    resource: "crystals", // Name of prestige currency
    baseResource: "stardust", // Name of resource prestige is based on
    baseAmount() {return player.stardust_s.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    base: 9,
    exponent: 3,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(hasUpgrade("stardust_so",15))mult = mult.div(upgradeEffect("stardust_so",15));
		if(hasUpgrade("stardust_c",34))mult = mult.div(upgradeEffect("stardust_c",34));
		if(hasUpgrade("stardust_s",45))mult = mult.div(buyableEffect("stardust_so",14));
		return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    effect() {
        eff = player[this.layer].points.pow(1.25).floor().times(5);
        return eff
    },
    effectDescription() {
		if(player[this.layer].points.gte(17))return "";
        eff = this.effect();
        return "which are providing "+format(eff)+" shards."
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown(){return player.tm.currentTree==2 && player.tm.buyables[2].gte(8)},
		
		doReset(l){
			if(l=="stardust_s" || l=="stardust_so" || l=="stardust_n" || l=="stardust_c" || !l.startsWith("stardust_")){return;}
			layerDataReset("stardust_c",["upgrades","milestones","challenges"]);
			return;
		},
		buyables: {
            1: {
                title: "Respec Crystal Upgrades",
                display: "",
                unlocked() { return player[this.layer].unlocked && player[this.layer].points.lt(17)}, 
                canAfford() {
					return true;
				},
                buy() { 
					if(confirm("This will force a Crystal reset! Are you sure?")){
						player[this.layer].upgrades=[];
						doReset(this.layer,true);
					}
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'60px'},
            },
		},
		upgrades: {
            rows: 3,
            cols: 5,
			11: {
				title: "Crystal Upgrade 11",
                description: "Gain 100% of star gain per second.",
                cost(){
					return new Decimal(6).sub(player.stardust_c.points).max(0);
				},
				currencyDisplayName: "shards",
				currencyInternalName: "shards",
				currencyLayer: "stardust_c",
                unlocked() { return player.tm.buyables[2].gte(8); }, // The upgrade is only visible when this is true
            },
			12: {
				title: "Crystal Upgrade 12",
                description: "Gain 100% of nebulae gain per second.",
                cost(){
					return new Decimal(6).sub(player.stardust_c.points).max(0);
				},
				currencyDisplayName: "shards",
				currencyInternalName: "shards",
				currencyLayer: "stardust_c",
                unlocked() { return player.tm.buyables[2].gte(8); }, // The upgrade is only visible when this is true
            },
			13: {
				title: "Crystal Upgrade 13",
                description: "Crystals multiply stardust gain.",
                cost(){
					return new Decimal(8).sub(player.stardust_c.points).max(0);
				},
				currencyDisplayName: "shards",
				currencyInternalName: "shards",
				currencyLayer: "stardust_c",
                unlocked() { return player.tm.buyables[2].gte(9); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let ret=player.stardust_c.points.add(1).pow(4);
					if(player.stardust_c.points.gte(3))ret=ret.pow(2.5);
					if(player.stardust_c.points.gte(28))ret=Decimal.pow(10,player.stardust_c.points);
					if(player.stardust_c.points.gte(41))ret=Decimal.pow(1e10,player.stardust_c.points);
					return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			14: {
				title: "Crystal Upgrade 14",
                description: "Stardust Upgrade 12 is squared.",
                cost(){
					return new Decimal(15).sub(player.stardust_c.points.mul(2)).max(0);
				},
				currencyDisplayName: "shards",
				currencyInternalName: "shards",
				currencyLayer: "stardust_c",
                unlocked() { return player.tm.buyables[2].gte(9); }, // The upgrade is only visible when this is true
            },
			15: {
				title: "Crystal Upgrade 15",
                description: "Crystals multiply energy gain.",
                cost(){
					return new Decimal(13).sub(player.stardust_c.points.mul(2)).max(0);
				},
				currencyDisplayName: "shards",
				currencyInternalName: "shards",
				currencyLayer: "stardust_c",
                unlocked() { return player.tm.buyables[2].gte(9); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let ret=player.stardust_c.points.add(1).pow(5);
					if(player.stardust_c.points.gte(3))ret=ret.pow(2.5);
					if(player.stardust_c.points.gte(28))ret=Decimal.pow(1e10,player.stardust_c.points);
					return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			21: {
				title: "Crystal Upgrade 21",
                description: "Constellations are cheaper, and Constellations' effects are better.",
                cost(){
					return new Decimal(18).sub(player.stardust_c.points.mul(2)).max(0);
				},
				currencyDisplayName: "shards",
				currencyInternalName: "shards",
				currencyLayer: "stardust_c",
                unlocked() { return player.tm.buyables[2].gte(10); }, // The upgrade is only visible when this is true
            },
			22: {
				title: "Crystal Upgrade 22",
                description: "Nebula buyables are cheaper, and effects of Nebula buyables are better.",
                cost(){
					return new Decimal(18).sub(player.stardust_c.points.mul(2)).max(0);
				},
				currencyDisplayName: "shards",
				currencyInternalName: "shards",
				currencyLayer: "stardust_c",
                unlocked() { return player.tm.buyables[2].gte(10); }, // The upgrade is only visible when this is true
            },
			23: {
				title: "Crystal Upgrade 23",
                description: "Autobuy Constellations.",
                cost(){
					return new Decimal(8).sub(player.stardust_c.points).max(0);
				},
				currencyDisplayName: "shards",
				currencyInternalName: "shards",
				currencyLayer: "stardust_c",
                unlocked() { return player.tm.buyables[2].gte(10); }, // The upgrade is only visible when this is true
            },
			24: {
				title: "Crystal Upgrade 24",
                description: "Autobuy Nebula buyables.",
                cost(){
					return new Decimal(8).sub(player.stardust_c.points).max(0);
				},
				currencyDisplayName: "shards",
				currencyInternalName: "shards",
				currencyLayer: "stardust_c",
                unlocked() { return player.tm.buyables[2].gte(10); }, // The upgrade is only visible when this is true
            },
			25: {
				title: "Crystal Upgrade 25",
                description: "Crystals multiply star and nebula gain.",
                cost(){
					return new Decimal(10).sub(player.stardust_c.points).max(0);
				},
				currencyDisplayName: "shards",
				currencyInternalName: "shards",
				currencyLayer: "stardust_c",
                unlocked() { return player.tm.buyables[2].gte(10); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let ret=player.stardust_c.points.add(1).pow(6);
					if(player.stardust_c.points.gte(30))ret=Decimal.pow(2,player.stardust_c.points);
					if(player.stardust_c.points.gte(41))ret=Decimal.pow(1e10,player.stardust_c.points);
					return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			31: {
				title: "Crystal Upgrade 31",
                description: "Crystals boost Stardust Upgrade 12.",
                cost(){
					return new Decimal(35).sub(player.stardust_c.points.mul(3)).max(0);
				},
				currencyDisplayName: "shards",
				currencyInternalName: "shards",
				currencyLayer: "stardust_c",
                unlocked() { return player.tm.buyables[2].gte(11); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let ret=player.stardust_c.points.pow(0.5).div(5).add(1);
					if(player.stardust_c.points.gte(28))ret=player.stardust_c.points.pow(0.5).div(2);
					if(hasUpgrade("stardust_s",15))ret=ret.pow(2);
					return ret;
                },
                effectDisplay() { return "^"+format(this.effect()) }, // Add formatting to the effect
            },
			32: {
				title: "Crystal Upgrade 32",
                description: "Crystals boost Stardust Upgrade 22.",
                cost(){
					return new Decimal(40).sub(player.stardust_c.points.mul(3)).max(0);
				},
				currencyDisplayName: "shards",
				currencyInternalName: "shards",
				currencyLayer: "stardust_c",
                unlocked() { return player.tm.buyables[2].gte(11); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let ret=player.stardust_c.points.pow(0.5).div(2.5).add(1);
					if(player.stardust_c.points.gte(38))ret=player.stardust_c.points.div(10);
					if(player.stardust_c.points.gte(68))ret=new Decimal(6.8);
					if(player.stardust_c.points.gte(90))ret=new Decimal(7);
					if(player.stardust_c.points.gte(140))ret=player.stardust_c.points.div(20);
					if(player.stardust_c.points.gte(200))ret=new Decimal(10);
					return ret;
                },
                effectDisplay() { return "^"+format(this.effect()) }, // Add formatting to the effect
            },
			33: {
				title: "Crystal Upgrade 33",
                description: "Unlock a Constellation.",
                cost(){
					return new Decimal(50).sub(player.stardust_c.points.mul(3)).max(0);
				},
				currencyDisplayName: "shards",
				currencyInternalName: "shards",
				currencyLayer: "stardust_c",
                unlocked() { return player.tm.buyables[2].gte(11); }, // The upgrade is only visible when this is true
            },
			34: {
				title: "Crystal Upgrade 34",
                description: "Crystals cheapens itself.",
                cost(){
					return new Decimal(42).sub(player.stardust_c.points.mul(3)).max(0);
				},
				currencyDisplayName: "shards",
				currencyInternalName: "shards",
				currencyLayer: "stardust_c",
                unlocked() { return player.tm.buyables[2].gte(12); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let ret=Decimal.pow(275,player.stardust_c.points.sub(2).max(0).pow(2.3)).max(1);
					return ret;
                },
                effectDisplay() { return "/"+format(this.effect()) }, // Add formatting to the effect
            },
			35: {
				title: "Crystal Upgrade 35",
                description: "Crystals boost Stardust Upgrade 21.",
                cost(){
					return new Decimal(14).sub(player.stardust_c.points).max(0);
				},
				currencyDisplayName: "shards",
				currencyInternalName: "shards",
				currencyLayer: "stardust_c",
                unlocked() { return player.tm.buyables[2].gte(12) && player.stardust_c.best.gte(8); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let ret=player.stardust_c.points.pow(0.5).mul(2).add(1);
					if(player.stardust_c.points.gte(43))ret=player.stardust_c.points.div(3);
					if(player.stardust_c.points.gte(129))ret=player.stardust_c.points.div(2.5);
					if(player.stardust_c.points.gte(200))ret=player.stardust_c.points.pow(2).div(500);
					if(player.stardust_c.points.gte(250))ret=player.stardust_c.points.div(2);
					return ret;
                },
                effectDisplay() { return "^"+format(this.effect()) }, // Add formatting to the effect
            },
		},
		   branches: [["stardust_s", 4]],
        hotkeys: [
            {key: "c", 
            description: "c: compress stardust into crystals",
			onPress(){if (player.tm.currentTree==2 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==2}}
        ],
		
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
					["display-text",function(){if(player.stardust_c.points.lt(17))return "Shards Remaining: "+format(player.stardust_c.shards)+"/"+format(tmp.stardust_c.effect)}],
					["buyable",1],
					"upgrades","milestones"
				],
		usedShards(){
			var ret=new Decimal(0);
			for(var i in player.stardust_c.upgrades){
				ret=tmp.stardust_c.upgrades[player.stardust_c.upgrades[i]].cost.add(ret);
			}
			return ret;
		},
		update(diff){
			player.stardust_c.shards=layers.stardust_c.effect().sub(layers.stardust_c.usedShards());
			if(hasUpgrade("stardust_c",23)){
				var target=player.stardust_so.points.add(1).log(2).pow(1/1.4).add(1).floor();
				if(hasUpgrade("stardust_c",21))target=player.stardust_so.points.add(1).log(2).pow(1/1.3).add(1).floor();
				if(target.gt(player.stardust_so.buyables[11])){
					player.stardust_so.buyables[11]=target;
				}
			}
			if(hasUpgrade("stardust_c",23) && hasUpgrade("stardust_so",14)){
				var target=player.stardust_so.points.div(1e6).add(1).log(2).pow(1/1.4).add(1).floor();
				if(hasUpgrade("stardust_c",21))target=player.stardust_so.points.add(1).log(2).pow(1/1.3).add(1).floor();
				if(target.gt(player.stardust_so.buyables[12])){
					player.stardust_so.buyables[12]=target;
				}
			}
			if(hasUpgrade("stardust_c",23) && hasUpgrade("stardust_c",33)){
				var target=player.stardust_so.points.add(1).log(3).pow(1/1.5).add(1).floor();
				if(target.gt(player.stardust_so.buyables[13])){
					player.stardust_so.buyables[13]=target;
				}
			}
			if(hasUpgrade("stardust_c",23) && hasUpgrade("stardust_s",45)){
				var target=player.stardust_so.points.add(1).log(4).pow(1/1.5).add(1).floor();
				if(target.gt(player.stardust_so.buyables[14])){
					player.stardust_so.buyables[14]=target;
				}
			}
			if(hasUpgrade("stardust_c",24)){
				var target=player.stardust_n.points.add(1).log(2).pow(1/1.4).add(1).floor();
				if(hasUpgrade("stardust_c",22))target=player.stardust_n.points.add(1).log(2).pow(1/1.3).add(1).floor();
				if(target.gt(player.stardust_n.buyables[11])){
					player.stardust_n.buyables[11]=target;
				}
			}
			if(hasUpgrade("stardust_c",24)){
				var target=player.stardust_n.points.add(1).log(2).pow(1/2).add(1).floor();
				if(hasUpgrade("stardust_c",22))target=player.stardust_n.points.add(1).log(2).pow(1/1.7).add(1).floor();
				if(target.gt(player.stardust_n.buyables[12])){
					player.stardust_n.buyables[12]=target;
				}
			}
			if(hasUpgrade("stardust_c",24)){
				var target=player.stardust_n.points.add(1).log(2).pow(1/2).add(1).floor();
				if(hasUpgrade("stardust_c",22))target=player.stardust_n.points.add(1).log(2).pow(1/1.7).add(1).floor();
				if(target.gt(player.stardust_n.buyables[13])){
					player.stardust_n.buyables[13]=target;
				}
			}
			if(hasUpgrade("stardust_c",24)){
				var target=player.stardust_n.points.add(1).log(2).pow(1/1.7).add(1).floor();
				if(hasUpgrade("stardust_c",22))target=player.stardust_n.points.add(1).log(2).pow(1/1.5).add(1).floor();
				if(target.gt(player.stardust_n.buyables[14])){
					player.stardust_n.buyables[14]=target;
				}
			}
		},
		
		
	 canBuyMax(){
		 return player.stardust_c.best.gte(50);
	 },autoPrestige(){
		 return player.stardust_c.best.gte(50);
	 },resetsNothing(){
		 return player.stardust_c.best.gte(50);
	 },
	milestones: [
		{
			requirementDescription: "50 Crystals",
            done() {return player.stardust_c.best.gte(50)}, // Used to determine when to give the milestone
            effectDescription: "Automate this layer.",
        },
		]
});
