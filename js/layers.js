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
    hotkeys: [],
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
                    let cost = [new Decimal("1e800"),new Decimal(Infinity)][player[this.layer].buyables[this.id].toNumber()];
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
                    let cost = [new Decimal(0),new Decimal(100),new Decimal(1e6),new Decimal(1e30),new Decimal(1e50),new Decimal(1e150),new Decimal(1e300),new Decimal("1e700"),new Decimal("1e1500"),new Decimal("1e3000"),new Decimal(Infinity)][player[this.layer].buyables[this.id].toNumber()];
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
                    let cost = [new Decimal(0),new Decimal("1e1250"),new Decimal("1e2000"),new Decimal("1e3750"),new Decimal(Infinity)][player[this.layer].buyables[this.id].toNumber()];
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
	},
	update(){
		for(i=1;player.tm.points.gte(i);i++){
			if(player.tm.buyables[i].lt(1))player.tm.buyables[i]=new Decimal(1);
		}
		player.tm.points=player.tm.buyables[0].add(1);
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
    hotkeys: [],
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
    row: 1,
    hotkeys: [],
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
    row: 1,
    hotkeys: [],
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(2)},
	branches: ["tptc_p"],
	effect() {
		let ret = player.tptc_g.points;
		let base = new Decimal(2).mul(tmp.tptc_sg.getSGenPowerEff);
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
		return player[this.layer].buyables[11].add(player[this.layer].buyables[12]);
	},
	
	buyables: {
            rows: 1,
            cols: 2,
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
	 }
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
							return 'You have ' + format(player.tptc_sg.power) + ' Super Generator Power, which multiplies the Generator base by ' + format(tmp.tptc_sg.getSGenPowerEff);
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
		return player.tptc_sg.power.add(1).pow(0.4);
	},
	 canBuyMax(){
		 return player.tptc_sp.best.gte(1);
	 },autoPrestige(){
		 return player.tptc_sp.best.gte(1);
	 },resetsNothing(){
		 return player.tptc_sp.best.gte(1);
	 },
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
		ret = Decimal.pow(base,ret).mul(ret);
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
					return ret;
                },
                effectDisplay() { return "+"+format(this.effect())+"/sec" }, // Add formatting to the effect
            },
		},
	 passiveGeneration(){
		 if(player.tptc_l.best.gte(1))return 1;
		 return 0;
	 },
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
            rows: 1,
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
	 },
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
                    ["display-text",
                        function() {
							return 'You have ' + format(player.tptc_l.power) + ' Life Power, which multiplies Magic Upgrade 11 by ' + format(tmp.tptc_l.lifePowerEff);
						},
                        {}],
						"milestones"
				],
	lifePowerEff(){
		let ret=player.tptc_l.power.add(1).sqrt();
		return ret;
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
        return player[this.layer].buyables[11].add(player[this.layer].buyables[12]);
    },
	buildLimit(){
		let ret= new Decimal(3);
		return ret;
	},
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
						"milestones",
					["buyable",1],
					["display-text",function(){return "You have "+format(tmp.tptc_hs.usedHS)+" used Hyperspace."}],
					["buyable",2],
						"buyables"
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
	}
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
			player.modpoints[2]=player.modpoints[2].add(gain.mul(diff));
		},
		upgrades: {
            rows: 2,
            cols: 3,
			11: {
				title: "Stardust Upgrade 11",
                description(){
					return "Add 1 to base energy gain.";
				},
                cost: new Decimal(0),
                unlocked() { return true; }, // The upgrade is only visible when this is true
            },
			12: {
				title: "Stardust Upgrade 12",
                description(){
					return "Point gain is boosted based on your energy.";
				},
                cost: new Decimal(1),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=20;
                    let ret = Decimal.pow(base,Decimal.log10(player.modpoints[2].mul(10).add(1)).pow(0.9));
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
					if(hasUpgrade("stardust_so",11))ret=ret.pow(2);
					if(hasUpgrade("stardust_n",11))ret=ret.pow(2);
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			13: {
				title: "Stardust Upgrade 13",
                description(){
					return "Energy gain is boosted based on the level of this tree.";
				},
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
                description(){
					return "Points boost energy gain.";
				},
                cost: new Decimal(3e5),
                unlocked() { return player.tm.buyables[2].gte(4); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=1.03;
                    let ret = Decimal.pow(base,Decimal.log10(player.points.add(1)).pow(0.5));
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			22: {
				title: "Stardust Upgrade 22",
                description(){
					return "Stardust boost energy gain.";
				},
                cost: new Decimal(1e6),
                unlocked() { return player.tm.buyables[2].gte(4); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=2;
                    let ret = Decimal.pow(base,Decimal.log10(player.stardust_s.points.add(1)).pow(0.9));
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			23: {
				title: "Stardust Upgrade 23",
                description(){
					return "Unlock a Prestige upgrade in The Prestige Tree Classic.";
				},
                cost: new Decimal(5e7),
                unlocked() { return player.tm.buyables[2].gte(4); }, // The upgrade is only visible when this is true
            },
		},
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
            cols: 1,
			11: {
                title : "Constellation 1", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.4))
					return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = Decimal.pow(3, x.pow(0.9)).mul(x)
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
		},
		upgrades: {
            rows: 1,
            cols: 3,
			11: {
				title: "Star Upgrade 11",
                description(){
					return "Stardust Upgrade 12 is squared.";
				},
                cost: new Decimal(1000),
                unlocked() { return player.tm.buyables[2].gte(4); }, // The upgrade is only visible when this is true
            },
		},
		   branches: [["stardust_s", 5]],
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
			layerDataReset("stardust_so",["upgrades","milestones","challenges"]);
			return;
		},
		
		buyables: {
            rows: 1,
            cols: 1,
			11: {
                title : "Energy Nebulae", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.4))
					return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
                    let eff = Decimal.pow(3, x.pow(0.6))
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
		},
		upgrades: {
            rows: 1,
            cols: 3,
			11: {
				title: "Nebulae Upgrade 11",
                description(){
					return "Stardust Upgrade 12 is squared.";
				},
                cost: new Decimal(100),
                unlocked() { return player.tm.buyables[2].gte(4); }, // The upgrade is only visible when this is true
            },
		},
		   branches: [["stardust_s", 6]],
});