addLayer("tm", {
    name: "treemanager", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "TM", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(1),
		currentTree: 1,
    }},
    color: "#FFFFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "trees", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: "side", // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
            {key: "m", description: "M: Show Tree Manager<br>Hotkeys below this line are based on the current tree.<br>", onPress(){if(hasUpgrade("tptc_p",13))document.getElementById("tm").click();}},
			{key: "ifyoucantseethehotkeys", description: "If you can't see the hotkeys below, re-enter the info tab", onPress(){}},
	],
    layerShown(){return hasUpgrade("tptc_p",13);},
	tabFormat: function(){
		let ret=["main-display"];
		for(i=1;player.tm.points.gte(i);i++){
			ret.push(["row",[["display-text",TREES[i]+" <br>Author: "+TREEAUTHOR[i]+" <br>Version: "+TREEVERS[i][player.tm.buyables[i].toNumber()]],["buyable",i],["clickable",i]]]);
		}
		if(hasUpgrade("tptc_sp",13)){
			ret.push(["buyable",0]);
		}
		return ret;
	},
	
	buyables: {
            0: {
                title: "The Modding Tree", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = [new Decimal("1e800"),new Decimal("1e4000"),new Decimal("1e20000"),new Decimal(Infinity)][player[this.layer].buyables[this.id].toNumber()];
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Level: "+formatWhole(player[this.layer].buyables[this.id])+"<br>Cost: "+format(data.cost)+" points<br>Effect: Multiply point gain by "+format(data.effect)+", and Unlock "+formatWhole(player[this.layer].buyables[this.id])+" new trees";
                },
                unlocked() { return player[this.layer].points.gte(this.id) }, 
                canAfford() {
                    return player.points.gte(tmp[this.layer].buyables[this.id].cost)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player.points = player.points.sub(cost)
					player[this.layer].points = player[this.layer].buyables[this.id].add(1)
				},
                buyMax() {}, // You'll have to handle this yourself if you want
				effect() {
					return Decimal.pow(1e20,player[this.layer].buyables[this.id].pow(2));
				},
                style: {'height':'200px','width':'200px'},
            },
            1: {
                title: "Upgrade", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = [new Decimal(0),new Decimal(100),new Decimal(1e6),new Decimal(1e30),new Decimal(1e50),new Decimal(1e150),new Decimal(1e300),new Decimal("1e700"),new Decimal("1e1500"),new Decimal("1e3000"),new Decimal("1e7000"),new Decimal("1e13000"),new Decimal("1e30000"),new Decimal(Infinity)][player[this.layer].buyables[this.id].toNumber()];
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Level: "+formatWhole(player[this.layer].buyables[this.id])+"<br>Cost: "+format(data.cost)+" points";
                },
                unlocked() { return player[this.layer].points.gte(this.id) }, 
                canAfford() {
                    return player.points.gte(tmp[this.layer].buyables[this.id].cost)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player.points = player.points.sub(cost)
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'100px','width':'150px'},
            },
            2: {
                title: "Upgrade", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					if(player[this.layer].buyables[this.id].lt(0.5))return new Decimal(0);
					if(player[this.layer].buyables[this.id].gt(11.5))return new Decimal(Infinity);
					return Decimal.pow(10,player[this.layer].buyables[this.id].pow(2).mul(500).add(1500).sub(player[this.layer].buyables[this.id].mul(750)));
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Level: "+formatWhole(player[this.layer].buyables[this.id])+"<br>Cost: "+format(data.cost)+" points";
                },
                unlocked() { return player[this.layer].points.gte(this.id) }, 
                canAfford() {
                    return player.points.gte(tmp[this.layer].buyables[this.id].cost)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player.points = player.points.sub(cost)
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'100px','width':'150px'},
            },
            3: {
                title: "Upgrade", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(player[this.layer].buyables[this.id].lt(0.5))return new Decimal(0);
					if(player[this.layer].buyables[this.id].gt(4.5))return new Decimal(Infinity);
					return Decimal.pow(10,player[this.layer].buyables[this.id].pow(2).mul(2500).add(9500).sub(player[this.layer].buyables[this.id].mul(2000)));
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Level: "+formatWhole(player[this.layer].buyables[this.id])+"<br>Cost: "+format(data.cost)+" points";
                },
                unlocked() { return player[this.layer].points.gte(this.id) }, 
                canAfford() {
                    return player.points.gte(tmp[this.layer].buyables[this.id].cost)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player.points = player.points.sub(cost)
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'100px','width':'150px'},
            },
            4: {
                title: "Upgrade", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = [new Decimal(0),new Decimal("1e32000"),new Decimal(Infinity)][player[this.layer].buyables[this.id].toNumber()];
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Level: "+formatWhole(player[this.layer].buyables[this.id])+"<br>Cost: "+format(data.cost)+" points";
                },
                unlocked() { return player[this.layer].points.gte(this.id) }, 
                canAfford() {
                    return player.points.gte(tmp[this.layer].buyables[this.id].cost)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player.points = player.points.sub(cost)
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'100px','width':'150px'},
            },
	},
	clickables: {
            1: {
                title: "Switch to this tree",
                display: "",
                unlocked() { return player[this.layer].points.gte(this.id) && hasUpgrade("tptc_sp",13)}, 
				canClick(){return player[this.layer].points.gte(this.id) && hasUpgrade("tptc_sp",13)},
				onClick(){
					player[this.layer].currentTree=this.id;
				},
                style: {'height':'100px','width':'150px'},
            },
            2: {
                title: "Switch to this tree",
                display: "",
                unlocked() { return player[this.layer].points.gte(this.id) && hasUpgrade("tptc_sp",13)}, 
				canClick(){return player[this.layer].points.gte(this.id) && hasUpgrade("tptc_sp",13)},
				onClick(){
					player[this.layer].currentTree=this.id;
				},
                style: {'height':'100px','width':'150px'},
            },
            3: {
                title: "Switch to this tree",
                display: "",
                unlocked() { return player[this.layer].points.gte(this.id) && hasUpgrade("tptc_sp",13)}, 
				canClick(){return player[this.layer].points.gte(this.id) && hasUpgrade("tptc_sp",13)},
				onClick(){
					player[this.layer].currentTree=this.id;
				},
                style: {'height':'100px','width':'150px'},
            },
            4: {
                title: "Switch to this tree",
                display: "",
                unlocked() { return player[this.layer].points.gte(this.id) && hasUpgrade("tptc_sp",13)}, 
				canClick(){return player[this.layer].points.gte(this.id) && hasUpgrade("tptc_sp",13)},
				onClick(){
					player[this.layer].currentTree=this.id;
				},
                style: {'height':'100px','width':'150px'},
            },
	},
	update(){
		for(i=1;player.tm.points.gte(i);i++){
			if(player.tm.buyables[i].lt(1))player.tm.buyables[i]=new Decimal(1);
		}
		player.tm.points=player.tm.buyables[0].add(1);
		
		if(player.tm.currentTree!=currentTreeTemp){
			currentTreeTemp=player.tm.currentTree;
			hotkeys = {};
			hotkeys[layers.tm.hotkeys[0].key] = layers.tm.hotkeys[0];
			hotkeys[layers.tm.hotkeys[0].key].layer = 'tm';
			hotkeys[layers.tm.hotkeys[0].key].id = 0;
			hotkeys[layers.tm.hotkeys[0].key].unlocked = true;
			//hotkeys[layers.tm.hotkeys[1].key] = layers.tm.hotkeys[1];
			//hotkeys[layers.tm.hotkeys[1].key].layer = 'tm';
			//hotkeys[layers.tm.hotkeys[1].key].id = 1;
			//hotkeys[layers.tm.hotkeys[1].key].unlocked = true;
			for (layer in layers){
				if(!layer.startsWith(["_","tptc_","stardust_","forest_","burning_"][currentTreeTemp]))continue;
				hk = layers[layer].hotkeys
				if (hk){
					for (id in hk){
						hotkeys[hk[id].key] = hk[id]
						hotkeys[hk[id].key].layer = layer
						hotkeys[hk[id].key].id = id
						if (hk[id].unlocked === undefined)
							hk[id].unlocked = true
					}
				}
			}
		}
	}
})

addLayer("tptc_p", {
    name: "tptc_p", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#00bfbf",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		mult = mult.mul(tmp.tptc_s.buyables[12].effect);
		mult = mult.mul(tmp.tptc_e.buyables[11].effect[1]);
		if(hasUpgrade("tptc_sp",11))mult = mult.mul(upgradeEffect("tptc_sp",11));
		if(inChallenge("tptc_h",12))mult = new Decimal(0);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.tm.currentTree==1},
		upgrades: {
            rows: 2,
            cols: 3,
			11: {
				title: "Prestige Upgrade 11",
                description(){
					if(hasUpgrade("tptc_p",13))return "Point generation is boosted based on the level of this tree.";
					return "Point generation is doubled.";
				},
                cost: new Decimal(1),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let ret=Decimal.pow(2,player.tm.buyables[1].pow(1.5));
					return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			12: {
				title: "Prestige Upgrade 12",
                description: "Point generation is faster based on your Prestige Point amount.",
                cost: new Decimal(1),
                unlocked() { return true; },
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=3;
                    let ret = Decimal.pow(base,Decimal.log10(player.tptc_p.points.mul(2).add(3)).pow(0.9));
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			13: {
				title: "Prestige Upgrade 13",
                description: "Unlock the Tree Manager.",
                cost: new Decimal(2),
                unlocked() { return true; },
            },
			21: {
				title: "Prestige Upgrade 21",
                description(){
					return "Stardust gain in The Stardust Tree is boosted by your Prestige Points.";
				},
                cost: new Decimal("1e2400"),
                unlocked() { return hasUpgrade("stardust_s",23); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=1.03;
                    let ret = Decimal.pow(base,Decimal.log10(player.tptc_p.points.add(1)).pow(0.5));
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			22: {
				title: "Prestige Upgrade 22",
                description(){
					return "Particle gain in The Prestige Forest is boosted by your Prestige Points.";
				},
                cost: new Decimal("1e7200"),
                unlocked() { return hasUpgrade("forest_p",23); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=1.03;
                    let ret = Decimal.pow(base,Decimal.log10(player.tptc_p.points.add(1)).pow(0.5));
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			23: {
				title: "Prestige Upgrade 23",
                description(){
					return "Ash gain in The Burning Tree is boosted by your Prestige Points.";
				},
                cost: new Decimal("1e12000"),
                unlocked() { return hasUpgrade("burning_a",24); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=1.03;
                    let ret = Decimal.pow(base,Decimal.log10(player.tptc_p.points.add(1)).pow(0.5));
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
		},
		
		doReset(l){
			if(l=="tptc_p" || !l.startsWith("tptc_")){return;}
			layerDataReset("tptc_p",["upgrades","milestones","challenges"]);
			return;
		},
	 passiveGeneration(){
		 if(player.tptc_g.best.gte(3))return 1;
		 return 0;
	 },
	 hotkeys: [
           {key: "p", description: "P: Prestige reset",
			onPress(){if (player.tm.currentTree==1 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==1}}
     ],
});


addLayer("tptc_b", {
    name: "tptc_b",
    symbol: "B",
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#415a9e",
    requires: function(){
		return new Decimal(500);
	},
    resource: "boosters",
    baseResource: "points", 
    baseAmount() {return player.points},
    type: "static",
	base: 10,
    exponent: 1.5,
	gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(hasUpgrade("stardust_so",12))mult = mult.div(upgradeEffect("stardust_so",12));
		if(player.tptc_i.buyables[11].gte(2))mult = mult.div(buyableEffect("tptc_s",14));
        return mult
    },
    row: 1,
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(2)},
	branches: ["tptc_p"],
	effect() {
		let ret = player.tptc_b.points;
		let base = new Decimal(2);
		base = base.add(tmp.tptc_e.buyables[11].effect[0]);
		base = base.mul(tmp.tptc_sb.effect);
		ret = Decimal.pow(base,ret);
		return ret;
	},
	effectDescription() { // Optional text to describe the effects
           let eff = this.effect();
           return "translated to a "+format(eff)+"x multiplier to to point gain"
       },
	doReset(l){
			if(l=="tptc_p" || l=="tptc_b" || l=="tptc_g" || !l.startsWith("tptc_")){return;}
			var b=new Decimal(player.tptc_b.best);
			layerDataReset("tptc_b",["upgrades","milestones","challenges"]);
			player.tptc_b.best=b;
		},
		canBuyMax() {return player.tptc_t.best.gte(2)},
	 autoPrestige(){
		 return player.tptc_h.best.gte(1);
	 },resetsNothing(){
		 return player.tptc_h.best.gte(1);
	 },
	 hotkeys: [
           {key: "b", description: "B: Booster reset",
			onPress(){if (player.tm.currentTree==1 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==1}}
     ],
});

addLayer("tptc_g", {
    name: "tptc_g",
    symbol: "G",
    position: 1,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		power: new Decimal(0),
	}},
	color: "#409c6e",
    requires: function(){
		return new Decimal(500);
	},
    resource: "generators",
    baseResource: "points", 
    baseAmount() {return player.points},
    type: "static",
	base: 10,
    exponent: 1.5,
	gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(hasUpgrade("stardust_n",12))mult = mult.div(upgradeEffect("stardust_n",12));
		if(player.tptc_i.buyables[11].gte(2))mult = mult.div(buyableEffect("tptc_s",14));
        return mult
    },
    row: 1,
    hotkeys: [],
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(2)},
	branches: ["tptc_p"],
	effect() {
		let ret = player.tptc_g.points;
		let base = new Decimal(2);
		base = base.add(tmp.tptc_sg.getSGenPowerEff);
		base = base.add(tmp.tptc_e.buyables[11].effect[0]);
		ret = Decimal.pow(base,ret).mul(ret);
		ret = ret.mul(tmp.tptc_q.quirkEff);
		return ret;
	},
	effectDescription() { // Optional text to describe the effects
           let eff = this.effect();
           return "which are generating "+format(eff)+" Generator Power/sec"
       },
	doReset(l){
			if(l=="tptc_p" || l=="tptc_b" || l=="tptc_g" || !l.startsWith("tptc_")){return;}
			var b=new Decimal(player.tptc_g.best);
			layerDataReset("tptc_g",["upgrades","milestones","challenges"]);
			player.tptc_g.best=b;
		},
		
	 update(diff){
		 player.tptc_g.power = player.tptc_g.power.add(tmp.tptc_g.effect.times(diff)).max(0)
	 },
	 
		canBuyMax() {return player.tptc_s.best.gte(2)},
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
                    ["display-text",
                        function() {
							return 'You have ' + format(player.tptc_g.power) + ' Generator Power, which multiplies point gain by ' + format(tmp.tptc_g.getGenPowerEff);
						},
                        {}],
						"milestones"
				],
	
	getGenPowerEffExp() {
		let exp = new Decimal(0.4)
		return exp;
	},
	getGenPowerEff() {
		let power = player.tptc_g.power;
		let eff = power.add(1).pow(tmp.tptc_g.getGenPowerEffExp);
		return eff
	},
	milestones: {
            0: {requirementDescription: "3 Generators",
                done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
                effectDescription: "Gain 100% of Prestige Point gain every second",
            },
	},
	 autoPrestige(){
		 return player.tptc_h.best.gte(1);
	 },resetsNothing(){
		 return player.tptc_h.best.gte(1);
	 },
	 hotkeys: [
           {key: "g", description: "G: Generator reset",
			onPress(){if (player.tm.currentTree==1 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==1}}
     ],
});


addLayer("tptc_t", {
    name: "tptc_t",
    symbol: "T",
    position: 1,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		energy: new Decimal(0),
	}},
	color: "#3f993d",
    requires: function(){
		return new Decimal(5e6);
	},
    resource: "time capsules",
    baseResource: "points", 
    baseAmount() {return player.points},
    type: "static",
	base: 1e4,
    exponent: 2,
    row: 2,
    hotkeys: [],
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(3)},
	branches: ["tptc_b"],
	effect() {
		let ret = player.tptc_t.points.add(player.tptc_t.buyables[11]);
		let base = new Decimal(2);
		if(player.tptc_h.challenges[11])base=base.add(tmp.tptc_h.challenges[11].rewardEffect);
		ret = Decimal.pow(base,ret).mul(ret);
		ret=ret.mul(tmp.tptc_m.clickables[11].effect);
		return ret;
	},
	effectDescription() { // Optional text to describe the effects
           let eff = this.effect();
           return "which are generating "+format(eff)+" Time Energy/sec"+(inChallenge("tptc_h",11)?", but with a limit of "+format(player.tptc_t.points.pow(player.tptc_t.buyables[11].sqrt().add(5)))+" Time Energy":"");
       },
	doReset(l){
			if(l=="tptc_p" || l=="tptc_b" || l=="tptc_g" || l=="tptc_t" || l=="tptc_e" || l=="tptc_s" || l=="tptc_sb" || l=="tptc_sg" || !l.startsWith("tptc_")){return;}
			var b=new Decimal(player.tptc_t.best);
			layerDataReset("tptc_t",["upgrades","milestones","challenges"]);
			player.tptc_t.best=b;
		},
		
	 update(diff){
		 player.tptc_t.energy = player.tptc_t.energy.add(tmp.tptc_t.effect.times(diff)).max(0)
		 if(inChallenge("tptc_h",11))player.tptc_t.energy=player.tptc_t.energy.min(player.tptc_t.points.pow(player.tptc_t.buyables[11].sqrt().add(5)));
		 if(player.tptc_m.best.gte(1)){
			player.tptc_t.buyables[11]=player.tptc_t.buyables[11].max(player.tptc_b.points.add(1).pow(1/1.5).sub(2).add(0.000001).floor());
		 }
	 },
	 
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
                        "milestones",
                    ["display-text",
                        function() {
							return 'You have ' + format(player.tptc_t.energy) + ' Time Energy, which multiplies point gain by ' + format(tmp.tptc_t.getEnergyEff);
						},
                        {}],
                        "buyables"
				],
	
	getEnergyEffExp() {
		let exp = new Decimal(1)
		return exp;
	},
	getEnergyEff() {
		let energy = player.tptc_t.energy;
		let eff = energy.add(1).pow(tmp.tptc_t.getEnergyEffExp);
		return eff
	},
	
	milestones: {
            0: {requirementDescription: "2 Time Capsules",
                done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
                effectDescription: "You can buy max Boosters.",
            },
	},
	
	buyables: {
            rows: 1,
            cols: 1,
            11: {
                title: "Extra Time Capsule", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x.add(3).pow(1.5).sub(1).ceil();
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+formatWhole(player[this.layer].buyables[this.id])+" Extra Time Capsules.\n\
					Cost for Next Extra Time Capsule: " + format(data.cost) + " Boosters";
                },
                unlocked() { return player.tptc_h.challenges[11] }, 
                canAfford() {
                    return player.tptc_b.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player.tptc_b.points = player.tptc_b.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
	},
	 
		canBuyMax() {return player.tptc_h.best.gte(1)},
	 autoPrestige(){
		 return player.tptc_m.best.gte(1);
	 },resetsNothing(){
		 return player.tptc_m.best.gte(1);
	 },
	 hotkeys: [
           {key: "t", description: "T: Time reset",
			onPress(){if (player.tm.currentTree==1 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==1}}
     ],
});


addLayer("tptc_s", {
    name: "tptc_s",
    symbol: "S",
    position: 3,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		energy: new Decimal(0),
	}},
	color: "#dfdfdf",
    requires: function(){
		return new Decimal(5e6);
	},
    resource: "space energy",
    baseResource: "points", 
    baseAmount() {return player.points},
    type: "static",
	base: 1e4,
    exponent: 2,
    row: 2,
    hotkeys: [],
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(3)},
	branches: ["tptc_g"],
	doReset(l){
			if(l=="tptc_p" || l=="tptc_b" || l=="tptc_g" || l=="tptc_t" || l=="tptc_e" || l=="tptc_s" || l=="tptc_sb" || l=="tptc_sg" || !l.startsWith("tptc_")){return;}
			var b=new Decimal(player.tptc_s.best);
			layerDataReset("tptc_s",["upgrades","milestones","challenges"]);
			player.tptc_s.best=b;
		},
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
                        "milestones",
                    ["display-text",
                        function() {
							return 'You have ' + format(tmp.tptc_s.getSpace) + ' Space remaining for Space Buildings.'
						},
						 {}],
                    ["display-text",
                        function() {return 'You have ' + format(player.tptc_g.power) + ' Generator Power'},
                        {}],
                        "buyables"
				],
				    
	getBaseSpace(){
		let baseSpace = player.tptc_s.best.pow(3).mul(10);
		baseSpace=baseSpace.floor();
		return baseSpace;
	},
	getSpace(){
		let baseSpace = tmp.tptc_s.getBaseSpace;
		return baseSpace.sub(tmp.tptc_s.getSpaceSpent);
	},
	getSpaceSpent(){
		return player[this.layer].buyables[11].add(player[this.layer].buyables[12]).add(player[this.layer].buyables[13]).add(player[this.layer].buyables[14]);
	},
	
	buyables: {
            rows: 1,
            cols: 4,
            11: {
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1e4,Decimal.pow(x,1.35))
					if(x.eq(0))return new Decimal(0)
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = Decimal.pow(player.tptc_s.points.add(1),x.mul(3));
					eff=eff.pow(tmp.tptc_ss.ssEff);
					eff=eff.pow(tmp.tptc_hs.buyables[11].effect);
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Space Building 1\n\
					Cost: " + format(data.cost) + " Generator Power\n\
                    Level: " + format(player[this.layer].buyables[this.id]) + "\n"+
                    "Currently: Multiply Point gain by "+format(data.effect)+". (Boosted by your Space Energy)";
                },
                unlocked() { return true }, 
                canAfford() {
                    return player.tptc_g.power.gte(tmp[this.layer].buyables[this.id].cost) && tmp.tptc_s.getSpace.gt(0)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player.tptc_g.power = player.tptc_g.power.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'120px','width':'120px'},
            },
            12: {
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1e6,Decimal.pow(x,1.35))
					if(x.eq(0))return new Decimal(0)
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = Decimal.pow(player.tptc_s.points.add(1),x.mul(3));
					eff=eff.pow(tmp.tptc_ss.ssEff);
					eff=eff.pow(tmp.tptc_hs.buyables[12].effect);
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Space Building 2\n\
					Cost: " + format(data.cost) + " Generator Power\n\
                    Level: " + format(player[this.layer].buyables[this.id]) + "\n"+
                    "Currently: Multiply Prestige Point gain by "+format(data.effect)+". (Boosted by your Space Energy)";
                },
                unlocked() { return true }, 
                canAfford() {
                    return player.tptc_g.power.gte(tmp[this.layer].buyables[this.id].cost) && tmp.tptc_s.getSpace.gt(0)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player.tptc_g.power = player.tptc_g.power.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'120px','width':'120px'},
            },
            13: {
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1e20,Decimal.pow(x,1.35))
					if(x.eq(0))return new Decimal(0)
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = x.add(1).mul(player.tptc_s.points.add(1).pow(0.7));
					eff=eff.pow(tmp.tptc_ss.ssEff);
					eff=eff.pow(tmp.tptc_hs.buyables[13].effect);
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Space Building 3\n\
					Cost: " + format(data.cost) + " Generator Power\n\
                    Level: " + format(player[this.layer].buyables[this.id]) + "\n"+
                    "Currently: Multiply Subspace gain by "+format(data.effect)+". (Boosted by your Space Energy)";
                },
                unlocked() { return player.tptc_i.buyables[11].gte(1) }, 
                canAfford() {
                    return player.tptc_g.power.gte(tmp[this.layer].buyables[this.id].cost) && tmp.tptc_s.getSpace.gt(0)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player.tptc_g.power = player.tptc_g.power.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'120px','width':'120px'},
            },
            14: {
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1e10,Decimal.pow(x,1.35))
					if(x.eq(0))return new Decimal(0)
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = Decimal.pow(player.tptc_s.points.add(1),x.mul(3));
					eff=eff.pow(tmp.tptc_ss.ssEff);
					eff=eff.pow(tmp.tptc_hs.buyables[14].effect);
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Space Building 4\n\
					Cost: " + format(data.cost) + " Generator Power\n\
                    Level: " + format(player[this.layer].buyables[this.id]) + "\n"+
                    "Currently: Divide Booster/Generator costs by "+format(data.effect)+". (Boosted by your Space Energy)";
                },
                unlocked() { return player.tptc_i.buyables[11].gte(2) }, 
                canAfford() {
                    return player.tptc_g.power.gte(tmp[this.layer].buyables[this.id].cost) && tmp.tptc_s.getSpace.gt(0)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player.tptc_g.power = player.tptc_g.power.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'120px','width':'120px'},
            },
	},
	
	milestones: {
            0: {requirementDescription: "2 Space Energy",
                done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
                effectDescription: "You can buy max Generators.",
            },
	},
	
		canBuyMax() {return player.tptc_ss.best.gte(1)},
	 autoPrestige(){
		 return player.tptc_ba.best.gte(1);
	 },resetsNothing(){
		 return player.tptc_ba.best.gte(1);
	 },update(diff){
		 if(player.tptc_ba.best.gte(1)){
			var pow=player.tptc_g.power;
			if(player.tptc_i.buyables[11].gte(2)){
				var target=pow.add(1).log(1e10).pow(1/1.35).add(1).floor();
				if(target.gte(tmp.tptc_s.getSpace.add(player.tptc_s.buyables[14])))target=tmp.tptc_s.getSpace.add(player.tptc_s.buyables[14]);
				if(target.gt(player.tptc_s.buyables[14])){
					player.tptc_s.buyables[14]=target;
				}
			}
			if(player.tptc_i.buyables[11].gte(1)){
				var target=pow.add(1).log(1e20).pow(1/1.35).add(1).floor();
				if(target.gte(tmp.tptc_s.getSpace.add(player.tptc_s.buyables[13])))target=tmp.tptc_s.getSpace.add(player.tptc_s.buyables[13]);
				if(target.gt(player.tptc_s.buyables[13])){
					player.tptc_s.buyables[13]=target;
				}
			}
			var target=pow.add(1).log(1e6).pow(1/1.35).add(1).floor();
			if(target.gte(tmp.tptc_s.getSpace.add(player.tptc_s.buyables[12])))target=tmp.tptc_s.getSpace.add(player.tptc_s.buyables[12]);
			if(target.gt(player.tptc_s.buyables[12])){
				player.tptc_s.buyables[12]=target;
			}
			target=pow.add(1).log(1e4).pow(1/1.35).add(1).floor();
			if(target.gte(tmp.tptc_s.getSpace.add(player.tptc_s.buyables[11])))target=tmp.tptc_s.getSpace.add(player.tptc_s.buyables[11]);
			if(target.gt(player.tptc_s.buyables[11])){
				player.tptc_s.buyables[11]=target;
			}
		 }
	 },
	 
	 hotkeys: [
           {key: "s", description: "S: Space reset",
			onPress(){if (player.tm.currentTree==1 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==1}}
     ],
});


addLayer("tptc_e", {
    name: "tptc_e",
    symbol: "E",
    position: 2,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
	}},
	color: "#9643a3",
    requires: function(){
		return new Decimal(5e6);
	},
    resource: "enhance points",
    baseResource: "points", 
    baseAmount() {return player.points},
    type: "normal",
    exponent: 0.1,
    row: 2,
    hotkeys: [],
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(3)},
	branches: ["tptc_b","tptc_g"],
	doReset(l){
			if(l=="tptc_p" || l=="tptc_b" || l=="tptc_g" || l=="tptc_t" || l=="tptc_e" || l=="tptc_s" || l=="tptc_sb" || l=="tptc_sg" || !l.startsWith("tptc_")){return;}
			var b=new Decimal(player.tptc_e.best);
			layerDataReset("tptc_e",["upgrades","milestones","challenges"]);
			player.tptc_e.best=b;
		},
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
                        "buyables"
				],
	buyables: {
            rows: 1,
            cols: 1,
            11: {
                title: "Enhancer", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.5))
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = [];
					eff[0]=x;
					eff[1]=Decimal.pow(10,x.pow(0.9));
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+formatWhole(player[this.layer].buyables[this.id])+" Enhancers.\n\
					They are multiplying Prestige Point gain by "+format(data.effect[1])+"\n\
					They are adding Booster/Generator bases by "+format(data.effect[0])+"\n\
					Cost for Next Enhancer: " + format(data.cost) + " Enhance Points";
                },
                unlocked() { return true }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
	},
	 passiveGeneration(){
		 if(player.tptc_q.best.gte(1))return 1;
		 return 0;
	 },
	 update(diff){
		 if(player.tptc_ba.best.gte(1)){
				var target=player.tptc_e.points.add(1).log(2).pow(1/1.5).add(1).floor();
				if(target.gt(player.tptc_e.buyables[11])){
					player.tptc_e.buyables[11]=target;
				}
		 }
	 },
	 
	 hotkeys: [
           {key: "e", description: "E: Enhance reset",
			onPress(){if (player.tm.currentTree==1 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==1}}
     ],
});


addLayer("tptc_sb", {
    name: "tptc_sb",
    symbol: "SB",
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#415a9e",
    requires: function(){
		return new Decimal(10);
	},
    resource: "super boosters",
    baseResource: "boosters", 
    baseAmount() {return player.tptc_b.points},
    type: "static",
	base: 1.2,
    exponent: 1.2,
    row: 2,
	roundUpCost: true,
    hotkeys: [],
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(4)},
	branches: ["tptc_b"],
	effect() {
		let ret = player.tptc_sb.points;
		let base = new Decimal(1.5);
		base = base.mul(tmp.tptc_hb.effect);
		ret = Decimal.pow(base,ret);
		return ret;
	},
	effectDescription() { // Optional text to describe the effects
           let eff = this.effect();
           return "which are multiplying the Booster effect base by "+format(eff);
       },
	doReset(l){
			if(l=="tptc_p" || l=="tptc_b" || l=="tptc_g" || l=="tptc_t" || l=="tptc_e" || l=="tptc_s" || l=="tptc_sb" || l=="tptc_sg" || !l.startsWith("tptc_")){return;}
			var b=new Decimal(player.tptc_sb.best);
			layerDataReset("tptc_sb",["upgrades","milestones","challenges"]);
			player.tptc_sb.best=b;
		},
		
		canBuyMax() {return player.tptc_hb.best.gte(1)},
	 autoPrestige(){
		 return player.tptc_m.best.gte(1);
	 },resetsNothing(){
		 return player.tptc_m.best.gte(1);
	 },
	 
	 hotkeys: [
           {key: "B", description: "Shift+B: Super-Booster reset",
			onPress(){if (player.tm.currentTree==1 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==1}}
     ],
});

addLayer("tptc_sg", {
    name: "tptc_sg",
    symbol: "SG",
    position: 4,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		power: new Decimal(0),
    }},
    color: "#409c6e",
    requires: function(){
		return new Decimal(70);
	},
    resource: "super generators",
    baseResource: "generators", 
    baseAmount() {return player.tptc_g.points},
    type: "static",
	base: 1.1,
    exponent: 1.2,
    row: 2,
	roundUpCost: true,
    hotkeys: [],
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(7) && player.tptc_h.challenges[12]>=1},
	branches: ["tptc_g"],
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
                    ["display-text",
                        function() {
							return 'You have ' + format(player.tptc_sg.power) + ' Super Generator Power, which adds the Generator base by ' + format(tmp.tptc_sg.getSGenPowerEff);
						},
                        {}]
				],
	effect() {
		let ret = player.tptc_sg.points;
		let base = new Decimal(2);
		ret = Decimal.pow(base,ret).mul(ret);
		return ret;
	},
	effectDescription() { // Optional text to describe the effects
           let eff = this.effect();
           return "which are generating "+format(eff)+" Super Generator Power/sec";
       },
	doReset(l){
			if(l=="tptc_p" || l=="tptc_b" || l=="tptc_g" || l=="tptc_t" || l=="tptc_e" || l=="tptc_s" || l=="tptc_sb" || l=="tptc_sg" || !l.startsWith("tptc_")){return;}
			var b=new Decimal(player.tptc_sg.best);
			layerDataReset("tptc_sg",["upgrades","milestones","challenges"]);
			player.tptc_sg.best=b;
		},
		
	 update(diff){
		 player.tptc_sg.power = player.tptc_sg.power.add(tmp.tptc_sg.effect.times(diff)).max(0)
	 },
	getSGenPowerEff(){
		return player.tptc_sg.power.add(1).pow(0.4).sub(1).mul(2);
	},
	 canBuyMax(){
		 return player.tptc_sp.best.gte(1);
	 },autoPrestige(){
		 return player.tptc_sp.best.gte(1);
	 },resetsNothing(){
		 return player.tptc_sp.best.gte(1);
	 },
	 hotkeys: [
           {key: "G", description: "Shift+G: Super-Generator reset",
			onPress(){if (player.tm.currentTree==1 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==1}}
     ],
});


addLayer("tptc_h", {
    name: "tptc_h",
    symbol: "H",
    position: 1,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
	}},
	color: "#a14040",
    requires: function(){
		return new Decimal(2e4);
	},
    resource: "hindrance spirit",
    baseResource: "time energy", 
    baseAmount() {return player.tptc_t.energy},
    type: "normal",
    exponent: 0.5,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		mult = mult.mul(tmp.tptc_m.hexEff);
		mult = mult.mul(tmp.tptc_ba.baEff);
        return mult
    },
    row: 3,
    hotkeys: [],
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(5)},
	branches: ["tptc_t"],
	doReset(l){
			if(l=="tptc_p" || l=="tptc_b" || l=="tptc_g" || l=="tptc_t" || l=="tptc_e" || l=="tptc_s" || l=="tptc_sb" || l=="tptc_sg" || l=="tptc_h" || l=="tptc_q" || l=="tptc_hb" || l=="tptc_ss" || !l.startsWith("tptc_")){return;}
			var b=new Decimal(player.tptc_h.best);
			layerDataReset("tptc_h",["upgrades","milestones","challenges"]);
			player.tptc_h.best=b;
		},
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
                        "milestones",
                        "challenges"
				],
	
	milestones: {
            0: {requirementDescription: "1 Hindrance Spirit",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy Boosters/Generators, Boosters/Generators resets nothing. You can buy max Time Capsules.",
            },
	},
	challenges: {
            rows: 1,
    		cols: 2,
		    11: {
                name: "Real Prestige Tree",
                completionLimit: 1,
			    challengeDescription() {
					return "Time Energy has a limit based on Time Capsules."
				},
                unlocked() { return true },
                goal: function(){
					return new Decimal(1e48);
				},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardEffect() {
                    let ret = new Decimal(1).add(player.tptc_h.points.add(1).log10().pow(0.5)).mul(player.tm.buyables[1]).div(5);
                    return ret;
                },
                rewardDisplay() { 
					return "Time Capsule Base +"+format(this.rewardEffect()); 
				},
                rewardDescription() { 
					return "Unlock Extra Time Capsules. Time Capsule Base is boosted by your Hindrance Spirit and the level of this tree."
				},
            },
		    12: {
                name: "No Prestige",
                completionLimit: 1,
			    challengeDescription() {
					return "You can't gain any Prestige Points."
				},
                unlocked() { return player.tm.buyables[1].gte(7) },
                goal: function(){
					return new Decimal("1e320");
				},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardDescription() { 
					return "Unlock Super Generators."
				},
            },
	},
	 passiveGeneration(){
		 if(player.tptc_sp.best.gte(1))return 1;
		 return 0;
	 },
	 hotkeys: [
           {key: "h", description: "H: Hindrance reset",
			onPress(){if (player.tm.currentTree==1 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==1}}
     ],
});


addLayer("tptc_q", {
    name: "tptc_q",
    symbol: "Q",
    position: 2,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		energy: new Decimal(0),
		time1: 0
	}},
	color: "#ff2bf2",
    requires: function(){
		return new Decimal(1e20);
	},
    resource: "quirks",
    baseResource: "generator power", 
    baseAmount() {return player.tptc_g.power},
    type: "normal",
    exponent: 0.075,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		mult = mult.mul(tmp.tptc_m.hexEff);
		mult = mult.mul(tmp.tptc_ba.baEff);
        return mult
    },
    row: 3,
    hotkeys: [],
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(5)},
	branches: ["tptc_e"],
	doReset(l){
			if(l=="tptc_p" || l=="tptc_b" || l=="tptc_g" || l=="tptc_t" || l=="tptc_e" || l=="tptc_s" || l=="tptc_sb" || l=="tptc_sg" || l=="tptc_h" || l=="tptc_q" || l=="tptc_hb" || l=="tptc_ss" || !l.startsWith("tptc_")){return;}
			var b=new Decimal(player.tptc_q.best);
			layerDataReset("tptc_q",["upgrades","milestones","challenges"]);
			player.tptc_q.best=b;
		},
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
                        "milestones",
                        "buyables",
                    ["display-text",
                        function() {return 'You have ' + format(player.tptc_q.energy) + ' Quirk Energy, which multiplies Point & Generator Power gain by '+ format(tmp.tptc_q.quirkEff) },
                        {}]
				],
	
	milestones: {
            0: {requirementDescription: "1 Quirks",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Gain 100% of Enhance Point gain per second.",
            },
	},
	
	buyables: {
            rows: 1,
            cols: 1,
            11: {
                title: "Quirk Layer", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(2))
					return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let base=new Decimal(player.timePlayed);
					let eff = x.mul(Decimal.pow(base,x.sub(1)));
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player[this.layer].buyables[this.id])+" Quirk Layers.<br>"+
                    "They are producing "+format(data.effect)+" Quirk Energy per second.<br>"+
					"Cost for next Quirk Layer: " + format(data.cost) + " Quirks";
                },
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
                
            },
	},
	
		update(diff){
			player.tptc_q.energy=player.tptc_q.energy.add(tmp.tptc_q.buyables[11].effect.mul(diff)).max(0);
			
		 if(player.tptc_hs.best.gte(1)){
				var target=player.tptc_q.points.add(1).log(2).pow(1/2).add(1).floor();
				if(target.gt(player.tptc_q.buyables[11])){
					player.tptc_q.buyables[11]=target;
				}
		 }
		},
	
				   quirkEff(){
					   let x=player.tptc_q.energy.add(1);
					   return x;
				   },
	 passiveGeneration(){
		 if(player.tptc_sp.best.gte(1))return 1;
		 return 0;
	 },
	 hotkeys: [
           {key: "q", description: "Q: Quirk reset",
			onPress(){if (player.tm.currentTree==1 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==1}}
     ],
});


addLayer("tptc_ss", {
    name: "tptc_ss",
    symbol: "SS",
    position: 3,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		subspace: new Decimal(0),
    }},
    color: "white",
    requires: function(){
		return new Decimal(7);
	},
    resource: "subspace energy",
    baseResource: "space energy", 
    baseAmount() {return player.tptc_s.points},
    type: "static",
	base: 1.14,
    exponent: 1.2,
    row: 3,
	roundUpCost: true,
    hotkeys: [],
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(6)},
	branches: ["tptc_s","tptc_e"],
	effect() {
		let ret = player.tptc_ss.points;
		let base = new Decimal(2);
		if(hasUpgrade("tptc_hs",13))base = base.add(upgradeEffect("tptc_hs",13));
		ret = Decimal.pow(base,ret).mul(ret);
		if(hasUpgrade("tptc_sp",22))ret = ret.mul(upgradeEffect("tptc_sp",22));
		if(player.tptc_i.buyables[11].gte(1))ret = ret.mul(buyableEffect("tptc_s",13));
		if(hasUpgrade("stardust_c",33))ret = ret.mul(buyableEffect("stardust_so",13));
		return ret;
	},
	effectDescription() { // Optional text to describe the effects
           let eff = this.effect();
           return "which are generating "+format(eff)+" Subspace/sec";
       },
	doReset(l){
			if(l=="tptc_p" || l=="tptc_b" || l=="tptc_g" || l=="tptc_t" || l=="tptc_e" || l=="tptc_s" || l=="tptc_sb" || l=="tptc_sg" || l=="tptc_h" || l=="tptc_q" || l=="tptc_hb" || l=="tptc_ss" || !l.startsWith("tptc_")){return;}
			var b=new Decimal(player.tptc_ss.best);
			layerDataReset("tptc_ss",["upgrades","milestones","challenges"]);
			player.tptc_ss.best=b;
		},
	
	milestones: {
            0: {requirementDescription: "1 Subspace Energy",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "You can buy max Space Energy.",
            },
	},
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
                        "milestones",
                        "buyables",
                    ["display-text",
                        function() {return 'You have ' + format(player.tptc_ss.subspace) + ' Subspace, which are raising Space Building effects to a power of '+ format(tmp.tptc_ss.ssEff) },
                        {}]
				],
	ssEff() {
		let ret=player.tptc_ss.subspace;
		ret=ret.add(1).log10();
		ret=ret.add(1).log10();
		return ret.sqrt().div(2).add(1);
	},
	
		update(diff){
			player.tptc_ss.subspace=player.tptc_ss.subspace.add(tmp.tptc_ss.effect.mul(diff)).max(0);
		},
	 canBuyMax(){
		 return player.tptc_hs.best.gte(1);
	 },autoPrestige(){
		 return player.tptc_hs.best.gte(1);
	 },resetsNothing(){
		 return player.tptc_hs.best.gte(1);
	 },
	 hotkeys: [
           {key: "S", description: "Shift+S: Subspace reset",
			onPress(){if (player.tm.currentTree==1 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==1}}
     ],
});


addLayer("tptc_hb", {
    name: "tptc_hb",
    symbol: "HB",
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		subspace: new Decimal(0),
    }},
    color: "#513d94",
    requires: function(){
		return new Decimal(6);
	},
    resource: "hyper boosters",
    baseResource: "super boosters", 
    baseAmount() {return player.tptc_sb.points},
    type: "static",
	base: 1.14,
    exponent: 1.2,
    row: 3,
	roundUpCost: true,
    hotkeys: [],
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(6)},
	branches: ["tptc_sb","tptc_t"],
	effect() {
		let ret = player.tptc_hb.points;
		let base = new Decimal(1.25);
		if(hasUpgrade("tptc_l",11))base=base.add(layers.tptc_l.buyables[11].effect());
		ret = Decimal.pow(base,ret);
		return ret;
	},
	effectDescription() { // Optional text to describe the effects
           let eff = this.effect();
           return "which are multiplying the Super Booster effect base by "+format(eff);
       },
	doReset(l){
			if(l=="tptc_p" || l=="tptc_b" || l=="tptc_g" || l=="tptc_t" || l=="tptc_e" || l=="tptc_s" || l=="tptc_sb" || l=="tptc_sg" || l=="tptc_h" || l=="tptc_q" || l=="tptc_hb" || l=="tptc_ss" || !l.startsWith("tptc_")){return;}
			var b=new Decimal(player.tptc_hb.best);
			layerDataReset("tptc_hb",["upgrades","milestones","challenges"]);
			player.tptc_hb.best=b;
		},
	
	milestones: {
            0: {requirementDescription: "1 Hyper Boosters",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "You can buy max Super Boosters.",
            },
	},
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
                        "milestones"
				],
	 canBuyMax(){
		 return player.tptc_l.best.gte(1);
	 },autoPrestige(){
		 return player.tptc_l.best.gte(1);
	 },resetsNothing(){
		 return player.tptc_l.best.gte(1);
	 },
	 hotkeys: [
           {key: "ctrl+b", description: "Ctrl+B: Hyper-Booster reset",
			onPress(){if (player.tm.currentTree==1 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==1}}
     ],
});


addLayer("tptc_m", {
    name: "tptc_m",
    symbol: "M",
    position: 1,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		hexes: new Decimal(0),
			spellTimes: {
				11: new Decimal(0),
			},
	}},
	color: "#eb34c0",
    requires: function(){
		return new Decimal(1e7);
	},
    resource: "magic",
    baseResource: "hindrance spirit", 
    baseAmount() {return player.tptc_h.points},
    type: "normal",
    exponent: 0.3,
    row: 4,
    hotkeys: [],
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(7)},
	branches: ["tptc_hb","tptc_h","tptc_q"],
	doReset(l){
			if(l=="tptc_p" || l=="tptc_b" || l=="tptc_g" || l=="tptc_t" || l=="tptc_e" || l=="tptc_s" || l=="tptc_sb" || l=="tptc_sg" || l=="tptc_h" || l=="tptc_q" || l=="tptc_hb" || l=="tptc_ss" || l=="tptc_m" || l=="tptc_ba" || l=="tptc_ps" || !l.startsWith("tptc_")){return;}
			var b=new Decimal(player.tptc_m.best);
			layerDataReset("tptc_m",["upgrades","milestones","challenges"]);
			player.tptc_m.best=b;
		},
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
                        "milestones",
					["display-text","Casting a normal spell costs 1 magic. Effect of normal spells are based on your magic and hexes."],
                        "clickables",
                    ["display-text",
                        function() {return 'You have ' + format(player.tptc_m.hexes) + ' Hexes, which are multiplying Hindrance Spirit & Quirk gain by ' + format(tmp.tptc_m.hexEff) },
                        {}],"upgrades"
				],
	
	milestones: {
            0: {requirementDescription: "1 Magic",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy Time Capsules/Super Boosters, Time Capsules/Super Boosters resets nothing. Autobuy Extra Time Capsules.",
            },
	},
	clickables: {
            rows: 1,
            cols: 1,
			11: {
				title: "Spell of Time",
				unlocked(){return true},
				canClick(){return player.tptc_m.points.gte(1) && player.tptc_m.spellTimes[11].lte(0)},
				onClick(){
					player.tptc_m.points=player.tptc_m.points.sub(1);
					player.tptc_m.hexes=player.tptc_m.hexes.add(1);
					player.tptc_m.spellTimes[11]=new Decimal(60);
				},
				effect(){
					if(player.tptc_m.spellTimes[11].lte(0))return new Decimal(1);
					return layers.tptc_m.clickables[11].realEffect();
				},
				realEffect(){
					let ret=Decimal.pow(10,Decimal.log10(player.tptc_m.points.add(1).mul(player.tptc_m.hexes.add(1))).add(2).mul(2).pow(0.9));
					return ret;
				},
				display(){
					return "Multiply Time Energy gain by "+format(layers.tptc_m.clickables[11].realEffect())+"\n\
					Time: "+formatTime(player.tptc_m.spellTimes[11].max(0));
				},
                style: {'height':'160px','width':'200px'},
			},
	},
	
		update(diff){
			for(var i in player.tptc_m.spellTimes){
				player.tptc_m.spellTimes[i]=player.tptc_m.spellTimes[i].sub(diff);
				if(player.tptc_ps.best.gte(1) && player.tptc_m.spellTimes[i].lte(0) && player.tptc_m.points.gte(1) && tmp.tptc_m.clickables[i] && tmp.tptc_m.clickables[i].unlocked){
					player.tptc_m.points=player.tptc_m.points.sub(1);
					player.tptc_m.hexes=player.tptc_m.hexes.add(1);
					player.tptc_m.spellTimes[i]=new Decimal(60);
				}
			}
			if(hasUpgrade("tptc_m",11))player.tptc_m.hexes=player.tptc_m.hexes.add(upgradeEffect("tptc_m",11).mul(diff));
		},
	hexEff() {
		let eff = player.tptc_m.hexes.mul(20).add(1).pow(0.4);
		return eff;
	},
		upgrades: {
            rows: 1,
            cols: 1,
			11: {
				title: "Magic Upgrade 11",
                description(){
					return "Gain hexes based on your magic.";
				},
                cost: new Decimal(1e6),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let ret=player.tptc_m.points.sqrt().add(1);
					ret=ret.mul(tmp.tptc_l.lifePowerEff);
					if(hasUpgrade("tptc_l",12))ret=ret.mul(tmp.tptc_l.buyables[12].effect);
					return ret;
                },
                effectDisplay() { return "+"+format(this.effect())+"/sec" }, // Add formatting to the effect
            },
		},
	 passiveGeneration(){
		 if(player.tptc_l.best.gte(1))return 1;
		 return 0;
	 },
	 hotkeys: [
           {key: "M", description: "Shift+M: Magic reset",
			onPress(){if (player.tm.currentTree==1 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==1}}
     ],
});

addLayer("tptc_ba", {
    name: "tptc_ba",
    symbol: "BA",
    position: 3,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		power: new Decimal(0),
		pos: new Decimal(0),
		neg: new Decimal(0),
	}},
	color: "#ebc88f",
    requires: function(){
		return new Decimal(1e5);
	},
    resource: "balance energy",
    baseResource: "quirks", 
    baseAmount() {return player.tptc_q.points},
    type: "normal",
    exponent: 0.35,
    row: 4,
    hotkeys: [],
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(7)},
	branches: [["tptc_h",2],"tptc_q","tptc_ss"],
	effect() {
		let points1 = player.tptc_ba.points
		if (points1.gte(1e12)) points1 = points1.log10().pow(2).times(1e12/144).min(points1)
		let ret={
			power: points1.pow(0.2),
			pos: player.tptc_ba.points.pow(0.7),
			neg: player.tptc_ba.points.pow(0.65).times(0.4),
		}
		ret.power=ret.power.mul(tmp.tptc_ba.posEff);
		ret.power=ret.power.mul(tmp.tptc_ba.negEff);
		return ret;
	},
	effectDescription() { // Optional text to describe the effects
           let eff = this.effect();
           return "which are generating "+format(eff.power)+" Balance Power, "+format(eff.pos)+" Positivity, and "+format(eff.neg)+" Negativity every second";
       },
	doReset(l){
			if(l=="tptc_p" || l=="tptc_b" || l=="tptc_g" || l=="tptc_t" || l=="tptc_e" || l=="tptc_s" || l=="tptc_sb" || l=="tptc_sg" || l=="tptc_h" || l=="tptc_q" || l=="tptc_hb" || l=="tptc_ss" || l=="tptc_m" || l=="tptc_ba" || l=="tptc_ps" || !l.startsWith("tptc_")){return;}
			var b=new Decimal(player.tptc_ba.best);
			layerDataReset("tptc_ba",["upgrades","milestones","challenges"]);
			player.tptc_ba.best=b;
		},
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
                        "milestones",
                    ["display-text",
                        function() {return 'You have ' + format(player.tptc_ba.power) + ' Balance Power, which are multiplying Hindrance Spirit & Quirk gain by ' + format(tmp.tptc_ba.baEff) },
                        {}],
                    ["display-text",
                        function() {return 'You have ' + format(player.tptc_ba.pos) + ' Positivity, which are multiplying Balance Power gain by ' + format(tmp.tptc_ba.posEff) },
                        {}],
                    ["display-text",
                        function() {return 'You have ' + format(player.tptc_ba.neg) + ' Negativity, which are multiplying Balance Power gain by ' + format(tmp.tptc_ba.negEff) },
                        {}],
				],
	
	milestones: {
            0: {requirementDescription: "1 Balance Energy",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy Space Energy, Space Energy resets nothing. Autobuy Enhancers. Autobuy Space Buildings.",
            },
	},
		update(diff){
			player.tptc_ba.power=player.tptc_ba.power.add(tmp.tptc_ba.effect.power.mul(diff)).max(0);
			player.tptc_ba.pos=player.tptc_ba.pos.add(tmp.tptc_ba.effect.pos.mul(diff)).max(0);
			player.tptc_ba.neg=player.tptc_ba.neg.add(tmp.tptc_ba.effect.neg.mul(diff)).max(0);
		},
	baEff() {
		let eff = player.tptc_ba.power.add(1).pow(0.3);
		return eff;
	},
	posEff() {
		let eff = player.tptc_ba.pos.add(1).log10().add(1).pow(2);
		return eff;
	},
	negEff() {
		let eff = player.tptc_ba.neg.add(1).log10().add(1).pow(2);
		return eff;
	},
	 passiveGeneration(){
		 if(player.tptc_hs.best.gte(1))return 1;
		 return 0;
	 },
	 hotkeys: [
           {key: "a", description: "A: Balance reset",
			onPress(){if (player.tm.currentTree==1 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==1}}
     ],
});


addLayer("tptc_sp", {
    name: "tptc_sp",
    symbol: "SP",
    position: 1,
    startData() { return {
        unlocked: false,
		points: new Decimal(0)
	}},
	color: "#439ea3",
    requires: function(){
		return new Decimal("1e450");
	},
    resource: "super-prestige points",
    baseResource: "prestige points", 
    baseAmount() {return player.tptc_p.points},
    type: "normal",
    exponent: 0.02,
    row: 5,
    hotkeys: [],
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(8)},
	branches: ["tptc_m","tptc_ba"],
	doReset(l){
			if(l=="tptc_p" || l=="tptc_b" || l=="tptc_g" || l=="tptc_t" || l=="tptc_e" || l=="tptc_s" || l=="tptc_sb" || l=="tptc_sg" || l=="tptc_h" || l=="tptc_q" || l=="tptc_hb" || l=="tptc_ss" || l=="tptc_m" || l=="tptc_ba" || l=="tptc_ps" || l=="tptc_sp" || l=="tptc_l" || l=="tptc_hs" || l=="tptc_i" || !l.startsWith("tptc_")){return;}
			var b=new Decimal(player.tptc_sp.best);
			layerDataReset("tptc_sp",["upgrades","milestones","challenges"]);
			player.tptc_sp.best=b;
		},
	milestones: {
            0: {requirementDescription: "1 Super-Prestige Points",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Gain 100% of Hindrance Spirit and Quirks gain per second. Autobuy Super Generators, Super Generators resets nothing, You can buy max Super Generators.",
            },
	},
		upgrades: {
            rows: 2,
            cols: 3,
			11: {
				title: "Super-Prestige Upgrade 11",
                description(){
					return "Prestige Point gain is boosted based on the level of this tree.";
				},
                cost: new Decimal(1),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let ret=Decimal.pow(2,player.tm.buyables[1].pow(2));
					return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			12: {
				title: "Super-Prestige Upgrade 12",
                description(){
					return "Point gain is boosted by your Super-Prestige Points.";
				},
                cost: new Decimal(1),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=1e10;
                    let ret = Decimal.pow(base,Decimal.log10(player.tptc_sp.points.mul(2).add(3)).pow(0.9));
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			13: {
				title: "Super-Prestige Upgrade 13",
                description(){
					return "Unlock a new feature in the Tree Manager.";
				},
                cost: new Decimal(2),
                unlocked() { return true; }, // The upgrade is only visible when this is true
            },
			21: {
				title: "Super-Prestige Upgrade 21",
                description(){
					return "Gain 100% of Super-Prestige points gain per second.";
				},
                cost: new Decimal(1e75),
                unlocked() { return player.tm.buyables[1].gte(11); }, // The upgrade is only visible when this is true
            },
			22: {
				title: "Super-Prestige Upgrade 22",
                description(){
					return "Gain more subspace based on your Super-Prestige Points.";
				},
                cost: new Decimal(1e200),
                unlocked() { return player.tm.buyables[1].gte(12); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=1.1;
                    let ret = Decimal.pow(base,Decimal.log10(player.tptc_sp.points.add(1)).pow(0.75));
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
		},
	 passiveGeneration(){
		 if(hasUpgrade("tptc_sp",21))return 1;
		 return 0;
	 },
});


addLayer("tptc_ps", {
    name: "tptc_ps",
    symbol: "PS",
    position: 2,
    startData() { return {
        unlocked: false,
		points: new Decimal(0)
	}},
	color: "#b38fbf",
    requires: function(){
		return new Decimal("1e50");
	},
    resource: "phantom souls",
    baseResource: "quirk energy", 
    baseAmount() {return player.tptc_q.energy},
    type: "static",
	base: 1e10,
    exponent: 1.5,
    row: 4,
    hotkeys: [],
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(9)},
	branches: [["tptc_h",3],["tptc_q",3]],
	effect() {
		let ret = player.tptc_ps.points;
		let base = new Decimal(4);
		ret = Decimal.pow(base,ret);
		return ret;
	},
	effectDescription() { // Optional text to describe the effects
           let eff = this.effect();
           return "which are multiplying Life Power gain by "+format(eff);
       },
	doReset(l){
			if(l=="tptc_p" || l=="tptc_b" || l=="tptc_g" || l=="tptc_t" || l=="tptc_e" || l=="tptc_s" || l=="tptc_sb" || l=="tptc_sg" || l=="tptc_h" || l=="tptc_q" || l=="tptc_hb" || l=="tptc_ss" || l=="tptc_m" || l=="tptc_ba" || l=="tptc_ps" || !l.startsWith("tptc_")){return;}
			var b=new Decimal(player.tptc_ps.best);
			layerDataReset("tptc_ps",["upgrades","milestones","challenges"]);
			player.tptc_ps.best=b;
		},
	milestones: {
            0: {requirementDescription: "1 Phantom Souls",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Autocast Spells.",
            },
	},
	 hotkeys: [
           {key: "P", description: "Shift+P: Phantom Soul reset",
			onPress(){if (player.tm.currentTree==1 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==1}}
     ],
	 canBuyMax(){
		 return player.tptc_i.best.gte(1);
	 },autoPrestige(){
		 return player.tptc_i.best.gte(1);
	 },resetsNothing(){
		 return player.tptc_i.best.gte(1);
	 },
});


addLayer("tptc_l", {
    name: "tptc_l",
    symbol: "L",
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		power: new Decimal(0)
	}},
	color: "#7fbf7f",
    requires: function(){
		return new Decimal(5e6);
	},
    resource: "life essence",
    baseResource: "hexes", 
    baseAmount() {return player.tptc_m.hexes},
    type: "normal",
    exponent: 0.15,
    row: 5,
    hotkeys: [],
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(9)},
	branches: ["tptc_hb","tptc_m"],
	effect() {
		let ret = player.tptc_l.points;
		ret=ret.mul(tmp.tptc_ps.effect);
		return ret;
	},
	effectDescription() { // Optional text to describe the effects
           let eff = this.effect();
           return "which are generating "+format(eff)+" Life Power/sec";
       },
	doReset(l){
			if(l=="tptc_p" || l=="tptc_b" || l=="tptc_g" || l=="tptc_t" || l=="tptc_e" || l=="tptc_s" || l=="tptc_sb" || l=="tptc_sg" || l=="tptc_h" || l=="tptc_q" || l=="tptc_hb" || l=="tptc_ss" || l=="tptc_m" || l=="tptc_ba" || l=="tptc_ps"  || l=="tptc_sp" || l=="tptc_l" || l=="tptc_hs" || l=="tptc_i" || !l.startsWith("tptc_")){return;}
			var b=new Decimal(player.tptc_ps.best);
			layerDataReset("tptc_ps",["upgrades","milestones","challenges"]);
			player.tptc_ps.best=b;
		},
	milestones: {
            0: {requirementDescription: "1 Life Essence",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy Hyper Boosters, Hyper Boosters resets nothing, you can buy max Hyper Boosters. Gain 100% of Magic gain per second.",
            },
	},
	 update(diff){
		 player.tptc_l.power = player.tptc_l.power.add(tmp.tptc_l.effect.times(diff)).max(0)
		 if(hasUpgrade("tptc_l",11)){
			 if(player.tptc_ps.points.gte(layers.tptc_l.buyables[11].cost())){
				 player.tptc_l.buyables[11]=player.tptc_l.buyables[11].add(1);
			 }
		 }
		 if(hasUpgrade("tptc_l",12)){
			 if(player.tptc_ps.points.gte(layers.tptc_l.buyables[12].cost())){
				 player.tptc_l.buyables[12]=player.tptc_l.buyables[12].add(1);
			 }
		 }
		 if(hasUpgrade("tptc_l",13)){
			 if(player.tptc_ps.points.gte(layers.tptc_l.buyables[13].cost())){
				 player.tptc_l.buyables[13]=player.tptc_l.buyables[13].add(1);
			 }
		 }
	 },
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
                    ["display-text",
                        function() {
							return 'You have ' + format(player.tptc_l.power) + ' Life Power, which multiplies Magic Upgrade 11 by ' + format(tmp.tptc_l.lifePowerEff);
						},
                        {}],
						"milestones",
						"buyables",
						"upgrades",
				],
	lifePowerEff(){
		let ret=player.tptc_l.power.add(1).sqrt();
		return ret;
	},
		upgrades: {
            rows: 2,
            cols: 3,
			11: {
				title: "Life Upgrade 11",
                description: "Unlock a Life Booster.",
                cost: new Decimal(300),
                unlocked() { return player.tm.buyables[1].gte(11); }, // The upgrade is only visible when this is true
            },
			12: {
				title: "Life Upgrade 12",
                description: "Unlock a Life Booster.",
                cost: new Decimal(1000),
                unlocked() { return player.tm.buyables[1].gte(12); }, // The upgrade is only visible when this is true
            },
			13: {
				title: "Life Upgrade 13",
                description: "Unlock a Life Booster.",
                cost: new Decimal(1e8),
                unlocked() { return player.tm.buyables[1].gte(13); }, // The upgrade is only visible when this is true
            },
		},
		
	buyables: {
            rows: 1,
            cols: 3,
            11: {
                title: "Life Booster 1", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x;
					if(!hasUpgrade("tptc_l",11))return Infinity;
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Amount: "+formatWhole(player[this.layer].buyables[this.id])+"<br>"+
					"Next at: "+formatWhole(data.cost)+" Phantom Souls<br>"+
					"Effect: +"+format(data.effect)+" to Hyper Booster base";
                },
				effect(){
					let x=player[this.layer].buyables[this.id].mul(player.tptc_l.power.add(1).log10().add(1));
					return x.pow(0.1).sub(1).div(5).max(0);
				},
                unlocked() { return hasUpgrade("tptc_l",11) }, 
                canAfford() {
					return false;
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px','background-color':'#7fbf7f'},
            },
            12: {
                title: "Life Booster 2", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x.mul(1.5).pow(1.1).floor();
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Amount: "+formatWhole(player[this.layer].buyables[this.id])+"<br>"+
					"Next at: "+formatWhole(data.cost)+" Phantom Souls<br>"+
					"Effect: Gain "+format(data.effect)+"x more Hexes";
                },
				effect(){
					let x=player[this.layer].buyables[this.id].mul(player.tptc_l.power.add(1).log10().add(1));
					return Decimal.pow(50,x.pow(0.5));
				},
                unlocked() { return hasUpgrade("tptc_l",12) }, 
                canAfford() {
					return false;
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px','background-color':'#7fbf7f'},
            },
            13: {
                title: "Life Booster 3", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x.mul(2).pow(1.2).floor();
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Amount: "+formatWhole(player[this.layer].buyables[this.id])+"<br>"+
					"Next at: "+formatWhole(data.cost)+" Phantom Souls<br>"+
					"Effect: Gain "+format(data.effect)+"x more Hyperspace Energy";
                },
				effect(){
					let x=player[this.layer].buyables[this.id].mul(player.tptc_l.power.add(1).log10().add(1));
					return x.add(1).pow(1.5);
				},
                unlocked() { return hasUpgrade("tptc_l",13) }, 
                canAfford() {
					return false;
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px','background-color':'#7fbf7f'},
            },
	}
});

addLayer("tptc_hs", {
    name: "tptc_hs",
    symbol: "HS",
    position: 2,
    startData() { return {
        unlocked: false,
		points: new Decimal(0)
	}},
	color: "white",
    requires: function(){
		return new Decimal(27);
	},
    resource: "hyperspace energy",
    baseResource: "space energy", 
    baseAmount() {return player.tptc_s.points},
    type: "normal",
    exponent: 20,
    row: 5,
    hotkeys: [],
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(10)},
	branches: ["tptc_ss","tptc_ba"],
	gainMult(){
		let ret=new Decimal(1);
		if(hasUpgrade("tptc_l",13))ret=ret.mul(buyableEffect("tptc_l",13));
		return ret;
	},
	doReset(l){
			if(l=="tptc_p" || l=="tptc_b" || l=="tptc_g" || l=="tptc_t" || l=="tptc_e" || l=="tptc_s" || l=="tptc_sb" || l=="tptc_sg" || l=="tptc_h" || l=="tptc_q" || l=="tptc_hb" || l=="tptc_ss" || l=="tptc_m" || l=="tptc_ba" || l=="tptc_ps"  || l=="tptc_sp" || l=="tptc_l" || l=="tptc_hs" || l=="tptc_i" || !l.startsWith("tptc_")){return;}
			var b=new Decimal(player.tptc_ps.best);
			layerDataReset("tptc_ps",["upgrades","milestones","challenges"]);
			player.tptc_ps.best=b;
		},
	milestones: {
            0: {requirementDescription: "1 Hyperspace Energy",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy Subspace Energy, Subspace Energy resets nothing, you can buy max Subspace Energy. Autobuy Quirk Layers. Gain 100% of Balance Energy gain per second.",
            },
	},
		
    usedHS() {
        return player[this.layer].buyables[11].add(player[this.layer].buyables[12]).add(player[this.layer].buyables[13]).add(player[this.layer].buyables[14]);
    },
	realBuildLimit(){
		let ret=new Decimal(player.tm.buyables[1]).sqrt().mul(3).sub(5.6);
		if(hasUpgrade("tptc_hs",11))ret=ret.add(upgradeEffect("tptc_hs",11));
		if(hasUpgrade("tptc_hs",12))ret=ret.add(upgradeEffect("tptc_hs",12));
		return ret;
	},
	buildLimit(){
		let ret=layers.tptc_hs.realBuildLimit().floor();
		return ret;
	},
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
						"milestones",
					["buyable",1],
					["display-text",function(){return "Hyper Building Limit: "+formatWhole(tmp.tptc_hs.buildLimit)+", Progress to next limit upgrade: "+format(tmp.tptc_hs.realBuildLimit.sub(tmp.tptc_hs.buildLimit).mul(100))+"%"}],
					["display-text",function(){return "Upgrade the tree to increase the progress."}],
					["display-text",function(){return "You have "+format(tmp.tptc_hs.usedHS)+" used Hyperspace."}],
					["buyable",2],
						"buyables","upgrades"
				],
				
	buyables: {
            rows: 2,
            cols: 5,
            1: {
                title: "Hyperspace", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.3));
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player.tptc_hs.buyables[1])+" Hyperspace.<br>"+
					"Cost for Next Hyperspace: "+format(data.cost)+" Hyperspace Energy";
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
					return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost);
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player[this.layer].points = player[this.layer].points.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            2: {
                title: "Respec Hyperspace Buildings",
                display() { // Everything else displayed in the buyable button after the title
                    return "";
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
					return true;
				},
                buy() { 
					if(confirm("This will force a Hyperspace reset! Are you sure?")){
						player[this.layer].buyables[11]=new Decimal(0);
						player[this.layer].buyables[12]=new Decimal(0);
						player[this.layer].buyables[13]=new Decimal(0);
						player[this.layer].buyables[14]=new Decimal(0);
						doReset(this.layer,true);
					}
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'60px'},
            },
            11: {
                display() { 
                    let data = tmp[this.layer].buyables[this.id]
                    return "Hyper Building 1<br>"+
					"Level: "+format(player.tptc_hs.buyables[11])+"/"+format(tmp.tptc_hs.buildLimit)+"<br>"+
					"Effect: Space Building 1's effect ^"+format(data.effect)+"<br>";
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
					return layers[this.layer].usedHS().lt(player.tptc_hs.buyables[1]) && player.tptc_hs.buyables[this.id].lt(tmp.tptc_hs.buildLimit);
				},
				effect(){
					let x=player[this.layer].buyables[this.id];
					return x.mul(0.2).add(1);
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player[this.layer].points = player[this.layer].points.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'120px','width':'120px'},
            },
            12: {
                display() { 
                    let data = tmp[this.layer].buyables[this.id]
                    return "Hyper Building 2<br>"+
					"Level: "+format(player.tptc_hs.buyables[12])+"/"+format(tmp.tptc_hs.buildLimit)+"<br>"+
					"Effect: Space Building 2's effect ^"+format(data.effect)+"<br>";
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
					return layers[this.layer].usedHS().lt(player.tptc_hs.buyables[1]) && player.tptc_hs.buyables[this.id].lt(tmp.tptc_hs.buildLimit);
				},
				effect(){
					let x=player[this.layer].buyables[this.id];
					return x.mul(0.2).add(1);
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player[this.layer].points = player[this.layer].points.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'120px','width':'120px'},
            },
            13: {
                display() { 
                    let data = tmp[this.layer].buyables[this.id]
                    return "Hyper Building 3<br>"+
					"Level: "+format(player.tptc_hs.buyables[13])+"/"+format(tmp.tptc_hs.buildLimit)+"<br>"+
					"Effect: Space Building 3's effect ^"+format(data.effect)+"<br>";
                },
                unlocked() { return player[this.layer].unlocked && player.tptc_i.buyables[11].gte(1) }, 
                canAfford() {
					return layers[this.layer].usedHS().lt(player.tptc_hs.buyables[1]) && player.tptc_hs.buyables[this.id].lt(tmp.tptc_hs.buildLimit);
				},
				effect(){
					let x=player[this.layer].buyables[this.id];
					return x.mul(0.2).add(1);
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player[this.layer].points = player[this.layer].points.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'120px','width':'120px'},
            },
            14: {
                display() { 
                    let data = tmp[this.layer].buyables[this.id]
                    return "Hyper Building 4<br>"+
					"Level: "+format(player.tptc_hs.buyables[14])+"/"+format(tmp.tptc_hs.buildLimit)+"<br>"+
					"Effect: Space Building 4's effect ^"+format(data.effect)+"<br>";
                },
                unlocked() { return player[this.layer].unlocked && player.tptc_i.buyables[11].gte(2) }, 
                canAfford() {
					return layers[this.layer].usedHS().lt(player.tptc_hs.buyables[1]) && player.tptc_hs.buyables[this.id].lt(tmp.tptc_hs.buildLimit);
				},
				effect(){
					let x=player[this.layer].buyables[this.id];
					return x.mul(0.2).add(1);
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player[this.layer].points = player[this.layer].points.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'120px','width':'120px'},
            },
	},
	
		upgrades: {
            rows: 2,
            cols: 3,
			11: {
				title: "Hyperspace Upgrade 11",
                description: "Generators add to Hyper Building Limit Upgrade Progress.",
                cost: new Decimal(2e4),
                unlocked() { return player.tm.buyables[1].gte(11); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let ret=Decimal.log10(player.tptc_g.points.add(1)).div(4);
					return ret;
                },
                effectDisplay() { return "+"+format(this.effect().mul(100))+"%" }, // Add formatting to the effect
            },
			12: {
				title: "Hyperspace Upgrade 12",
                description: "Super-Generators add to Hyper Building Limit Upgrade Progress.",
                cost: new Decimal(1e6),
                unlocked() { return player.tm.buyables[1].gte(12); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let ret=Decimal.log10(player.tptc_sg.points.add(1)).pow(2).div(2.5);
					return ret;
                },
                effectDisplay() { return "+"+format(this.effect().mul(100))+"%" }, // Add formatting to the effect
            },
			13: {
				title: "Hyperspace Upgrade 13",
                description: "Hyperspace Energy boost Subspace base.",
                cost: new Decimal(1e15),
                unlocked() { return player.tm.buyables[1].gte(13); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
                    let ret = Decimal.log10(player.tptc_hs.points.add(1)).pow(0.5).div(1.5);
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
                },
                effectDisplay() { return "+"+format(this.effect()) }, // Add formatting to the effect
            },
		},
});

addLayer("tptc_i", {
    name: "tptc_i",
    symbol: "I",
    position: 3,
    startData() { return {
        unlocked: false,
		points: new Decimal(0)
	}},
	color: "#e5dab7",
    requires: function(){
		return new Decimal(1e10);
	},
    resource: "imperium bricks",
    baseResource: "subspace", 
    baseAmount() {return player.tptc_ss.subspace},
    type: "static",
	base: new Decimal(1e10),
    exponent: 1e100,
    row: 5,
    hotkeys: [],
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(13)},
	branches: ["tptc_ss","tptc_sg"],
	doReset(l){
			if(l=="tptc_p" || l=="tptc_b" || l=="tptc_g" || l=="tptc_t" || l=="tptc_e" || l=="tptc_s" || l=="tptc_sb" || l=="tptc_sg" || l=="tptc_h" || l=="tptc_q" || l=="tptc_hb" || l=="tptc_ss" || l=="tptc_m" || l=="tptc_ba" || l=="tptc_ps"  || l=="tptc_sp" || l=="tptc_l" || l=="tptc_hs" || l=="tptc_i" || !l.startsWith("tptc_")){return;}
			var b=new Decimal(player.tptc_ps.best);
			layerDataReset("tptc_ps",["upgrades","milestones","challenges"]);
			player.tptc_ps.best=b;
		},
	milestones: {
            0: {requirementDescription: "1 Imperium Brick",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy Phantom Souls, Phantom Souls resets nothing, you can buy max Phantom Souls.",
            },
	},
		
	buyables: {
            rows: 1,
            cols: 1,
            11: {
                title: "Imperium Building", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(0.5)).ceil();
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Level: "+formatWhole(player.tptc_i.buyables[11])+"<br>"+
					"Cost: "+formatWhole(data.cost)+" Imperium Bricks<br>"+
					"Unlocked "+formatWhole(player.tptc_i.buyables[11])+" new space buildings";
                },
                unlocked() { return true; }, 
                canAfford() {
					return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost);
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player[this.layer].points = player[this.layer].points.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
	},
		upgrades: {
            rows: 1,
            cols: 1,
		},
});

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
            rows: 3,
            cols: 3,
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
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
					if(hasUpgrade("stardust_so",11))ret=ret.pow(2);
					if(hasUpgrade("stardust_n",11))ret=ret.pow(2);
					if(hasUpgrade("stardust_s",31))ret=ret.pow(2);
					if(hasUpgrade("stardust_c",14))ret=ret.pow(2);
					if(hasUpgrade("stardust_c",31))ret=ret.pow(upgradeEffect("stardust_c",31));
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
            cols: 3,
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
                    let ret = Decimal.pow(base,Decimal.log10(player.stardust_so.points.add(1)).pow(0.9));
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
                    let ret = Decimal.pow(base,Decimal.log10(player.stardust_n.points.add(1)).pow(0.9));
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
                unlocked() { return player[this.layer].unlocked }, 
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
                description: "TBD",
                cost(){
					return new Decimal(Infinity);
				},
				currencyDisplayName: "shards",
				currencyInternalName: "shards",
				currencyLayer: "stardust_c",
                unlocked() { return player.tm.buyables[2].gte(12); }, // The upgrade is only visible when this is true
            },
			35: {
				title: "Crystal Upgrade 35",
                description: "TBD",
                cost(){
					return new Decimal(Infinity);
				},
				currencyDisplayName: "shards",
				currencyInternalName: "shards",
				currencyLayer: "stardust_c",
                unlocked() { return player.tm.buyables[2].gte(12); }, // The upgrade is only visible when this is true
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
					["display-text",function(){return "Shards Remaining: "+format(player.stardust_c.shards)+"/"+format(tmp.stardust_c.effect)}],
					["buyable",1],
					"upgrades"
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
		}
});


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
            rows: 4,
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
            rows: 1,
            cols: 3,
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
		}
});


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
            rows: 2,
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
		},
		maxFlameStrength(){
			let ret=new Decimal(1);
			ret=ret.mul(tmp.burning_c.effect);
			return ret;
		},
		update(diff){
			let mult=new Decimal(25);
			if(hasUpgrade("burning_a",13))mult=mult.mul(upgradeEffect("burning_a",13));
			if(hasUpgrade("burning_a",21))mult=mult.mul(upgradeEffect("burning_a",21));
			if(hasUpgrade("burning_a",11)){
				player.burning_a.flameStrength=player.burning_a.flameStrength.min(tmp.burning_a.maxFlameStrength);
				player.modpoints[4]=player.modpoints[4].add(player.burning_a.flameStrength.mul(mult).mul(diff));
				player.burning_a.flameStrength=player.burning_a.flameStrength.sub(tmp.burning_a.flameDecay.mul(diff)).max(0);
			}
		},
		flameDecay(){
			let ret=new Decimal(1);
			if(hasUpgrade("burning_a",12))ret=ret.div(2);
			ret=ret.mul(tmp.burning_c.effect);
			return ret;
		},
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
        return effect
    },

    effectDescription() {
        return "boosting the flame effect by " + format(tmp[this.layer].effect) + "x"
    },
	 branches: ["burning_a"],
});