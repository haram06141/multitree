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
	tabFormat: {
		"Tree Manager":{
			content(){
				let ret=["main-display"];
				for(i=1;player.tm.points.gte(i);i++){
					ret.push(["row",[["display-text",TREES[i]+" <br>Author: "+TREEAUTHOR[i]+" <br>Version: "+TREEVERS[i][player.tm.buyables[i].toNumber()]],["buyable",i],["clickable",i]]]);
				}
				if(hasUpgrade("tptc_sp",13)){
					ret.push(["buyable",0]);
				}
				return ret;
			}
		},"Multitree Upgrades":{content:["upgrades"],unlocked(){return player.tptc_mb.best.gte(3)}}
		,"Rewrite TPT":{content:[["display-text","Rewrite TPT upgrades counts as Multitree upgrades.<br>Upgrade The Prestige Tree Rewritten to unlock more."]
		,["upgrade",16]
		,["row",[["upgrade",17],["upgrade",18]]]
		],unlocked(){return player.tm.buyables[0].gte(6) && player.tm.buyables[1].gte(20)}}
	},
	
	buyables: {
            0: {
                title: "The Modding Tree", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = [new Decimal("1e800"),new Decimal("1e4000"),new Decimal("1e20000"),new Decimal("1e100000"),new Decimal("1e500000"),new Decimal("e2e7"),new Decimal(Infinity)][player[this.layer].buyables[this.id].toNumber()];
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
                    let cost = [new Decimal(0),new Decimal(100),new Decimal(1e6),new Decimal(1e30),new Decimal(1e50),new Decimal(1e150),new Decimal(1e300),new Decimal("1e700"),new Decimal("1e1500"),new Decimal("1e3000"),new Decimal("1e7000"),new Decimal("1e13000"),new Decimal("1e30000"),new Decimal("1e80000"),new Decimal("1e200000"),new Decimal("1e800000"),new Decimal("e15e5"),new Decimal("e5e6"),new Decimal("e12e6"),new Decimal("e2e7"),new Decimal(Infinity)][player[this.layer].buyables[this.id].toNumber()];
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
					if(player[this.layer].buyables[this.id].gt(8.5))return new Decimal(Infinity);
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
                    if(player[this.layer].buyables[this.id].lt(0.5))return new Decimal(0);
					if(player[this.layer].buyables[this.id].gt(4.5))return new Decimal(Infinity);
					return Decimal.pow(10,player[this.layer].buyables[this.id].pow(2).mul(7000).add(22000).add(player[this.layer].buyables[this.id].mul(3000)));
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
            5: {
                title: "Upgrade", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					if(player[this.layer].buyables[this.id].lt(0.5))return new Decimal(0);
					if(player[this.layer].buyables[this.id].lt(10.5))return Decimal.pow(10,player[this.layer].buyables[this.id].pow(2).mul(10000).add(100000));
					if(player[this.layer].buyables[this.id].gt(16.5))return new Decimal(Infinity);
					return Decimal.pow(10,player[this.layer].buyables[this.id].pow(6));
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
            6: {
                title: "Upgrade", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = [new Decimal(0),new Decimal("1e525000"),new Decimal("1e650000"),new Decimal("1e875000"),new Decimal("e12e5"),new Decimal("e1625e3"),new Decimal("e215e4"),new Decimal("e2775e3"),new Decimal("e35e5"),new Decimal("e4325e3"),new Decimal("e525e4"),new Decimal(Infinity)][player[this.layer].buyables[this.id].toNumber()];
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
            7: {
                title: "Upgrade", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = [new Decimal(0),new Decimal("e215e5")/*,new Decimal("e22e6")*/,new Decimal(Infinity)][player[this.layer].buyables[this.id].toNumber()];
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
            5: {
                title: "Switch to this tree",
                display: "",
                unlocked() { return player[this.layer].points.gte(this.id) && hasUpgrade("tptc_sp",13)}, 
				canClick(){return player[this.layer].points.gte(this.id) && hasUpgrade("tptc_sp",13)},
				onClick(){
					player[this.layer].currentTree=this.id;
				},
                style: {'height':'100px','width':'150px'},
            },
            6: {
                title: "Switch to this tree",
                display: "",
                unlocked() { return player[this.layer].points.gte(this.id) && hasUpgrade("tptc_sp",13)}, 
				canClick(){return player[this.layer].points.gte(this.id) && hasUpgrade("tptc_sp",13)},
				onClick(){
					player[this.layer].currentTree=this.id;
				},
                style: {'height':'100px','width':'150px'},
            },
            7: {
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
				if(!layer.startsWith(["_","tptc_","stardust_","forest_","burning_","incrementy_","gd_"][currentTreeTemp]))continue;
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
	},
	upgrades:{
		rows: 2,
		cols: 5,
		11: {
				title: "Multitree Upgrade 11",
                description: "Unlock some Row 2 upgrades in The Prestige Tree Classic.",
                cost: new Decimal("1e400000"),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				currencyDisplayName: "points",
				currencyInternalName: "points",
            },
		12: {
				title: "Multitree Upgrade 12",
                description: "Unlock some Stardust upgrades in The Stardust Tree.",
                cost: new Decimal("1e700000"),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				currencyDisplayName: "points",
				currencyInternalName: "points",
            },
		13: {
				title: "Multitree Upgrade 13",
                description: "Unlock some Row 2 upgrades in The Burning Tree.",
                cost: new Decimal("e1e6"),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				currencyDisplayName: "points",
				currencyInternalName: "points",
            },
		14: {
				title: "Multitree Upgrade 14",
                description: "Unlock some Particle upgrades in The Prestige Forest.",
                cost: new Decimal("e14e5"),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				currencyDisplayName: "points",
				currencyInternalName: "points",
            },
		15: {
				title: "Multitree Upgrade 15",
                description: "Unlock a Prestige Upgrade in The Prestige Tree Classic.",
                cost: new Decimal("e25e5"),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				currencyDisplayName: "points",
				currencyInternalName: "points",
            },
		21: {
				title: "Multitree Upgrade 21",
                description: "Unlock some Stardust upgrades in The Stardust Tree.",
                cost: new Decimal("e85e5"),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				currencyDisplayName: "points",
				currencyInternalName: "points",
            },
		16: {
				title: "Rewrite Prestige",
				fullDisplay(){
					return "<h2>Rewrite Prestige</h2><br>Unlock Prestige in The Prestige Tree Rewritten.<br>\
					Costs: "+format(new Decimal("e214e5"))+" points<br>\
					"+format(new Decimal("e14e6"))+" prestige points in The Prestige Tree Classic<br>\
					"+format(Decimal.pow(10,2222))+" hours of work in The Game Dev Tree"
				},canAfford(){
					return player.points.gte(new Decimal("e214e5")) && 
					player.tptc_p.points.gte(new Decimal("e14e6")) && 
					player.modpoints[6].gte(Decimal.pow(10,2222));
				},pay(){},
                unlocked() { return player.tm.buyables[7].gte(1); }, // The upgrade is only visible when this is true
				currencyDisplayName: "points",
				currencyInternalName: "points",
				style(){
					let ret={"width":"200px","height":"200px"};
					if(hasUpgrade("tm",this.id))ret.backgroundColor="#31aeb0";
					return ret;
				}
            },
		17: {
				title: "Rewrite Boosters",
				fullDisplay(){
					return "<h2>Rewrite Boosters</h2><br>Unlock Boosters in The Prestige Tree Rewritten.<br>\
					Costs: "+format(new Decimal("e216e5"))+" points<br>\
					"+format(new Decimal(82400))+" boosters in The Prestige Tree Classic<br>\
					"+format(Decimal.pow(10,2223))+" hours of work in The Game Dev Tree"
				},canAfford(){
					return player.points.gte(new Decimal("e216e5")) && 
					player.tptc_b.points.gte(82400) && 
					player.modpoints[6].gte(Decimal.pow(10,2223));
				},pay(){},
                unlocked() { return player.tm.buyables[7].gte(2); }, // The upgrade is only visible when this is true
				currencyDisplayName: "points",
				currencyInternalName: "points",
				style(){
					let ret={"width":"200px","height":"200px"};
					if(hasUpgrade("tm",this.id))ret.backgroundColor="#6e64c4";
					return ret;
				}
            },
		18: {
				title: "Rewrite Generators",
				fullDisplay(){
					return "<h2>Rewrite Generators</h2><br>Unlock Generators in The Prestige Tree Rewritten.<br>\
					Costs: "+format(new Decimal("e218e5"))+" points<br>\
					"+format(new Decimal(82700))+" generators in The Prestige Tree Classic<br>\
					"+format(Decimal.pow(10,2224))+" hours of work in The Game Dev Tree"
				},canAfford(){
					return player.points.gte(new Decimal("e218e5")) && 
					player.tptc_g.points.gte(82700) && 
					player.modpoints[6].gte(Decimal.pow(10,2224));
				},pay(){},
                unlocked() { return player.tm.buyables[7].gte(2); }, // The upgrade is only visible when this is true
				currencyDisplayName: "points",
				currencyInternalName: "points",
				style(){
					let ret={"width":"200px","height":"200px"};
					if(hasUpgrade("tm",this.id))ret.backgroundColor="#a3d9a5";
					return ret;
				}
            },
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
		if(hasUpgrade("tptc_sp",23))mult = mult.mul(upgradeEffect("tptc_sp",23));
		if(inChallenge("tptc_h",12))mult = new Decimal(0);
		if(hasUpgrade("incrementy_q",14))mult = mult.mul(upgradeEffect("incrementy_q",14));
		mult = mult.mul(tmp.tptr_p.effect);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.tm.currentTree==1},
		upgrades: {
            rows: 2,
            cols: 5,
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
			14: {
				title: "Prestige Upgrade 14",
                description: "The base effect of 2nd row of Prestige Upgrades ^1.25",
                cost: new Decimal("1e80000"),
                unlocked() { return player.tm.buyables[1].gte(14); },
            },
			15: {
				title: "Prestige Upgrade 15",
                description: "Boost the base effect of 2nd row of Prestige Upgrades based on Multitree Upgrades bought.",
                cost: new Decimal("e1e6"),
                unlocked() { return hasUpgrade("tm",15); },
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					return 1+(player.tm.upgrades.length||0)*0.05;
                },
                effectDisplay() { return "^"+format(this.effect()) }, // Add formatting to the effect
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
					if(hasUpgrade("tptc_p",14))ret=ret.pow(1.25);
					if(hasUpgrade("tptc_p",15))ret=ret.pow(upgradeEffect("tptc_p",15));
					if(player.tptc_i.buyables[11].gte(3))ret = ret.mul(tmp.tptc_s.buyables[15].effect);
					if(player.tptc_mb.buyables[11].gte(3))ret = ret.mul(tmp.tptc_m.clickables[14].effect);
					if(player.tptc_mb.buyables[12].gte(3))ret = ret.mul(tmp.tptc_l.buyables[17].effect);
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
					if(hasUpgrade("tptc_p",14))ret=ret.pow(1.25);
					if(hasUpgrade("tptc_p",15))ret=ret.pow(upgradeEffect("tptc_p",15));
					if(player.tptc_i.buyables[11].gte(3))ret = ret.mul(tmp.tptc_s.buyables[15].effect);
					if(player.tptc_mb.buyables[11].gte(3))ret = ret.mul(tmp.tptc_m.clickables[14].effect);
					if(player.tptc_mb.buyables[12].gte(3))ret = ret.mul(tmp.tptc_l.buyables[17].effect);
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
					if(hasUpgrade("tptc_p",14))ret=ret.pow(1.25);
					if(hasUpgrade("tptc_p",15))ret=ret.pow(upgradeEffect("tptc_p",15));
					if(player.tptc_i.buyables[11].gte(3))ret = ret.mul(tmp.tptc_s.buyables[15].effect);
					if(player.tptc_mb.buyables[11].gte(3))ret = ret.mul(tmp.tptc_m.clickables[14].effect);
					if(player.tptc_mb.buyables[12].gte(3))ret = ret.mul(tmp.tptc_l.buyables[17].effect);
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			24: {
				title: "Prestige Upgrade 24",
                description(){
					return "Base incrementy gain in The Incrementreeverse is boosted by your Prestige Points.";
				},
                cost: new Decimal("1e24000"),
                unlocked() { return hasUpgrade("incrementy_a",14); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=1.03;
                    let ret = Decimal.pow(base,Decimal.log10(player.tptc_p.points.add(1)).pow(0.5));
					if(hasUpgrade("tptc_p",14))ret=ret.pow(1.25);
					if(hasUpgrade("tptc_p",15))ret=ret.pow(upgradeEffect("tptc_p",15));
					if(player.tptc_i.buyables[11].gte(3))ret = ret.mul(tmp.tptc_s.buyables[15].effect);
					if(player.tptc_mb.buyables[11].gte(3))ret = ret.mul(tmp.tptc_m.clickables[14].effect);
					if(player.tptc_mb.buyables[12].gte(3))ret = ret.mul(tmp.tptc_l.buyables[17].effect);
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			25: {
				title: "Prestige Upgrade 25",
                description(){
					return "Updates in The Game Dev Tree are cheaper based on your Prestige Points.";
				},
                cost: new Decimal("1e50000"),
                unlocked() { return hasUpgrade("gd_u",32); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=1.03;
                    let ret = Decimal.pow(base,Decimal.log10(player.tptc_p.points.add(1)).pow(0.5));
					if(hasUpgrade("tptc_p",14))ret=ret.pow(1.25);
					if(hasUpgrade("tptc_p",15))ret=ret.pow(upgradeEffect("tptc_p",15));
					if(player.tptc_i.buyables[11].gte(3))ret = ret.mul(tmp.tptc_s.buyables[15].effect);
					if(player.tptc_mb.buyables[11].gte(3))ret = ret.mul(tmp.tptc_m.clickables[14].effect);
					if(player.tptc_mb.buyables[12].gte(3))ret = ret.mul(tmp.tptc_l.buyables[17].effect);
                    return ret;
                },
                effectDisplay() { return "/"+format(this.effect()) }, // Add formatting to the effect
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
		if(hasUpgrade("tptc_g",12))mult = mult.div(upgradeEffect("tptc_g",12));
		if(hasUpgrade("forest_p",51))mult = mult.div(upgradeEffect("forest_p",51));
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
		if(hasUpgrade("tptc_b",11))base = base.mul(upgradeEffect("tptc_b",11));
		base = base.mul(tmp.tptr_b.effect[1]);
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
	 upgrades: {
            rows: 1,
            cols: 2,
			11: {
				title: "Booster Upgrade 11",
                description: "Multiply Booster base by your Generators.",
                cost: new Decimal(5625),
                unlocked() { return hasUpgrade("tm",11); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let ret=Decimal.pow(player.tptc_g.points.add(2),0.5);
					return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			12: {
				title: "Booster Upgrade 12",
                description: "Generators are cheaper based on your boosters.",
                cost: new Decimal(7600),
                unlocked() { return hasUpgrade("tm",11); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let ret=Decimal.pow(10,player.tptc_b.points);
					return ret;
                },
                effectDisplay() { return "/"+format(this.effect()) }, // Add formatting to the effect
            },
	 }
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
		if(hasUpgrade("tptc_b",12))mult = mult.div(upgradeEffect("tptc_b",12));
		if(hasUpgrade("forest_p",52))mult = mult.div(upgradeEffect("forest_p",52));
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
		base = base.mul(tmp.tptr_g.effect[1]);
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
						"milestones",
						"upgrades"
				],
	
	getGenPowerEffExp() {
		let exp = new Decimal(0.4)
		if(hasUpgrade("tptc_g",11))exp = exp.mul(2);
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
	 upgrades: {
            rows: 1,
            cols: 2,
			11: {
				title: "Generator Upgrade 11",
                description: "Generator Power Effect is squared.",
                cost: new Decimal(6075),
                unlocked() { return hasUpgrade("tm",11); }, // The upgrade is only visible when this is true
            },
			12: {
				title: "Generator Upgrade 12",
                description: "Boosters are cheaper based on your generators.",
                cost: new Decimal(7600),
                unlocked() { return hasUpgrade("tm",11); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let ret=Decimal.pow(10,player.tptc_g.points);
					return ret;
                },
                effectDisplay() { return "/"+format(this.effect()) }, // Add formatting to the effect
            },
	 }
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
		return player[this.layer].buyables[11].add(player[this.layer].buyables[12]).add(player[this.layer].buyables[13]).add(player[this.layer].buyables[14]).add(player[this.layer].buyables[15]).add(player[this.layer].buyables[16]).add(player[this.layer].buyables[17]).add(player[this.layer].buyables[18]);
	},
	
	buyables: {
            rows: 1,
            cols: 8,
            11: {
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1e4,Decimal.pow(x,1.35))
					if(x.eq(0))return new Decimal(0)
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					x=x.add(layers.tptc_s.buyables[18].effect());
					let eff = Decimal.pow(player.tptc_s.points.add(1),x.mul(3));
					eff=eff.pow(tmp.tptc_ss.ssEff);
					eff=eff.pow(tmp.tptc_hs.buyables[11].effect);
					eff=eff.pow(tmp.tptc_i.buyables[11].effect[this.id]);
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
					x=x.add(layers.tptc_s.buyables[18].effect());
					let eff = Decimal.pow(player.tptc_s.points.add(1),x.mul(3));
					eff=eff.pow(tmp.tptc_ss.ssEff);
					eff=eff.pow(tmp.tptc_hs.buyables[12].effect);
					eff=eff.pow(tmp.tptc_i.buyables[11].effect[this.id]);
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
					x=x.add(layers.tptc_s.buyables[18].effect());
					let eff = x.add(1).mul(player.tptc_s.points.add(1).pow(0.7));
					eff=eff.pow(tmp.tptc_ss.ssEff);
					eff=eff.pow(tmp.tptc_hs.buyables[13].effect);
					eff=eff.pow(tmp.tptc_i.buyables[11].effect[this.id]);
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
					x=x.add(layers.tptc_s.buyables[18].effect());
					let eff = Decimal.pow(player.tptc_s.points.add(1),x.mul(3));
					eff=eff.pow(tmp.tptc_ss.ssEff);
					eff=eff.pow(tmp.tptc_hs.buyables[14].effect);
					eff=eff.pow(tmp.tptc_i.buyables[11].effect[this.id]);
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
            15: {
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1e100,Decimal.pow(x,1.35))
					if(x.eq(0))return new Decimal(0)
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					x=x.add(layers.tptc_s.buyables[18].effect());
					let eff = Decimal.pow(player.tptc_s.points.add(1),x.pow(0.5).mul(0.05));
					eff=eff.pow(tmp.tptc_ss.ssEff);
					eff=eff.pow(tmp.tptc_hs.buyables[15].effect);
					eff=eff.pow(tmp.tptc_i.buyables[11].effect[this.id]);
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Space Building 5\n\
					Cost: " + format(data.cost) + " Generator Power\n\
                    Level: " + format(player[this.layer].buyables[this.id]) + "\n"+
                    "Currently: Multiply 2nd row of Prestige Upgrades by "+format(data.effect)+". (Boosted by your Space Energy)";
                },
                unlocked() { return player.tptc_i.buyables[11].gte(3) }, 
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
            16: {
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1e50,Decimal.pow(x,1.35))
					if(x.eq(0))return new Decimal(0)
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					x=x.add(layers.tptc_s.buyables[18].effect());
					let eff = Decimal.pow(player.tptc_s.points.add(1),x.pow(0.9).mul(0.05));
					eff=eff.pow(tmp.tptc_ss.ssEff);
					eff=eff.pow(tmp.tptc_hs.buyables[16].effect);
					eff=eff.pow(tmp.tptc_i.buyables[11].effect[this.id]);
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Space Building 6\n\
					Cost: " + format(data.cost) + " Generator Power\n\
                    Level: " + format(player[this.layer].buyables[this.id]) + "\n"+
                    "Currently: Divide Phantom Soul Requirement by "+format(data.effect)+". (Boosted by your Space Energy)";
                },
                unlocked() { return player.tptc_i.buyables[11].gte(4) }, 
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
            17: {
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1e40,Decimal.pow(x,1.35))
					if(x.eq(0))return new Decimal(0)
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					x=x.add(layers.tptc_s.buyables[18].effect());
					let eff = Decimal.pow(player.tptc_s.points.add(1),x.pow(0.7).mul(0.05));
					eff=eff.pow(tmp.tptc_ss.ssEff);
					eff=eff.pow(tmp.tptc_hs.buyables[17].effect);
					eff=eff.pow(tmp.tptc_i.buyables[11].effect[this.id]);
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Space Building 7\n\
					Cost: " + format(data.cost) + " Generator Power\n\
                    Level: " + format(player[this.layer].buyables[this.id]) + "\n"+
                    "Currently: Multiply Life Power gain by "+format(data.effect)+". (Boosted by your Space Energy)";
                },
                unlocked() { return player.tptc_i.buyables[11].gte(5) }, 
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
            18: {
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1e100,Decimal.pow(x,2))
					if(x.eq(0))return new Decimal(0)
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = Decimal.log10(player.tptc_s.points.add(10));
					eff=eff.mul(x);
					eff=eff.mul(tmp.tptc_ss.ssEff);
					eff=eff.mul(tmp.tptc_hs.buyables[18].effect);
					eff=eff.mul(tmp.tptc_i.buyables[11].effect[this.id]);
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Space Building 8\n\
					Cost: " + format(data.cost) + " Generator Power\n\
                    Level: " + format(player[this.layer].buyables[this.id]) + "\n"+
                    "Currently: Add "+format(data.effect)+" free levels to Space Buildings 1-7. (Boosted by your Space Energy)";
                },
                unlocked() { return player.tptc_i.buyables[11].gte(6) }, 
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
			if(player.tptc_i.buyables[11].gte(6)){
				var target=pow.add(1).log(1e100).pow(1/2).add(1).floor();
				if(target.gte(tmp.tptc_s.getSpace.add(player.tptc_s.buyables[18])))target=tmp.tptc_s.getSpace.add(player.tptc_s.buyables[17]);
				if(target.gt(player.tptc_s.buyables[18])){
					player.tptc_s.buyables[18]=target;
				}
			}
			if(player.tptc_i.buyables[11].gte(5)){
				var target=pow.add(1).log(1e40).pow(1/1.35).add(1).floor();
				if(target.gte(tmp.tptc_s.getSpace.add(player.tptc_s.buyables[17])))target=tmp.tptc_s.getSpace.add(player.tptc_s.buyables[17]);
				if(target.gt(player.tptc_s.buyables[17])){
					player.tptc_s.buyables[17]=target;
				}
			}
			if(player.tptc_i.buyables[11].gte(4)){
				var target=pow.add(1).log(1e50).pow(1/1.35).add(1).floor();
				if(target.gte(tmp.tptc_s.getSpace.add(player.tptc_s.buyables[16])))target=tmp.tptc_s.getSpace.add(player.tptc_s.buyables[16]);
				if(target.gt(player.tptc_s.buyables[16])){
					player.tptc_s.buyables[16]=target;
				}
			}
			if(player.tptc_i.buyables[11].gte(3)){
				var target=pow.add(1).log(1e100).pow(1/1.35).add(1).floor();
				if(target.gte(tmp.tptc_s.getSpace.add(player.tptc_s.buyables[15])))target=tmp.tptc_s.getSpace.add(player.tptc_s.buyables[15]);
				if(target.gt(player.tptc_s.buyables[15])){
					player.tptc_s.buyables[15]=target;
				}
			}
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
		if(inChallenge("tptc_ge",12))return new Decimal(1);
		let ret = player.tptc_sb.points;
		let base = new Decimal(1.5);
		base = base.mul(tmp.tptc_hb.effect);
		if(player.tptc_ge.challenges[12])base = base.mul(tmp.tptc_ge.challenges[12].rewardEffect);
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
		if(inChallenge("tptc_ge",12))return new Decimal(0);
		let ret = player.tptc_sg.points;
		let base = new Decimal(2);
		base=base.mul(tmp.tptc_m.clickables[13].effect);
		if(player.tptc_ge.challenges[12])base = base.mul(tmp.tptc_ge.challenges[12].rewardEffect);
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
					if(player.tptc_h.challenges[11])return "Time Energy has a limit based on Time Capsules and Extra Time Capsules.";
					return "Time Energy has a limit based on Time Capsules.";
				},
                unlocked() { return true },
                goal: function(){
					return new Decimal(1e48);
				},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardEffect() {
                    let ret = new Decimal(1).add(player.tptc_h.points.add(1).log10().pow(0.5)).mul(player.tm.buyables[1]).div(5);
					if(hasUpgrade("tptc_l",14))ret=ret.mul(buyableEffect("tptc_l",14));
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
					if(inChallenge("tptc_ge",22))return new Decimal(0);
					let base=new Decimal(player.timePlayed);
					base=base.mul(tmp.tptc_m.clickables[12].effect);
					if(player.tptc_ge.challenges[22])base = base.mul(tmp.tptc_ge.challenges[22].rewardEffect);
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
		if(inChallenge("tptc_ge",21))return new Decimal(0);
		let ret = player.tptc_ss.points;
		let base = new Decimal(2);
		if(hasUpgrade("tptc_hs",13))base = base.mul(upgradeEffect("tptc_hs",13));
		if(player.tptc_ge.challenges[21])base = base.mul(tmp.tptc_ge.challenges[21].rewardEffect);
		ret = Decimal.pow(base,ret).mul(ret);
		if(hasUpgrade("tptc_sp",22))ret = ret.mul(upgradeEffect("tptc_sp",22));
		if(player.tptc_i.buyables[11].gte(1))ret = ret.mul(buyableEffect("tptc_s",13));
		if(hasUpgrade("stardust_c",33))ret = ret.mul(buyableEffect("stardust_so",13));
		if(hasUpgrade("tptc_ma",13))ret=ret.mul(upgradeEffect("tptc_ma",13));
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
                        function() {
							if(player.tptc_i.buyables[11].gte(6))return 'You have ' + format(player.tptc_ss.subspace) + ' Subspace, which are raising effects of Space Buildings 1-7 to a power of '+ format(tmp.tptc_ss.ssEff)+', and multiplying Space Building 8\'s effect by '+ format(tmp.tptc_ss.ssEff)
							return 'You have ' + format(player.tptc_ss.subspace) + ' Subspace, which are raising Space Building effects to a power of '+ format(tmp.tptc_ss.ssEff) },
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
				12: new Decimal(0),
				13: new Decimal(0),
				14: new Decimal(0),
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
            cols: 4,
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
					ret=ret.pow(tmp.tptc_mb.buyables[11].effect);
					return ret;
				},
				display(){
					return "Multiply Time Energy gain by "+format(layers.tptc_m.clickables[11].realEffect())+"\n\
					Time: "+formatTime(player.tptc_m.spellTimes[11].max(0));
				},
                style: {'height':'160px','width':'200px'},
			},
			12: {
				title: "Spell of Quirks",
				unlocked(){return player.tptc_mb.buyables[11].gte(1)},
				canClick(){return player.tptc_m.points.gte(1) && player.tptc_m.spellTimes[12].lte(0)},
				onClick(){
					player.tptc_m.points=player.tptc_m.points.sub(1);
					player.tptc_m.hexes=player.tptc_m.hexes.add(1);
					player.tptc_m.spellTimes[12]=new Decimal(60);
				},
				effect(){
					if(player.tptc_m.spellTimes[12].lte(0))return new Decimal(1);
					return layers.tptc_m.clickables[12].realEffect();
				},
				realEffect(){
					let ret=Decimal.pow(1.1,Decimal.log10(player.tptc_m.points.add(1).mul(player.tptc_m.hexes.add(1))).add(2).mul(2).pow(0.5));
					ret=ret.pow(tmp.tptc_mb.buyables[11].effect);
					return ret;
				},
				display(){
					return "Multiply Quirk Layer base by "+format(layers.tptc_m.clickables[12].realEffect())+"\n\
					Time: "+formatTime(player.tptc_m.spellTimes[12].max(0));
				},
                style: {'height':'160px','width':'200px'},
			},
			13: {
				title: "Spell of Super-Generators",
				unlocked(){return player.tptc_mb.buyables[11].gte(2)},
				canClick(){return player.tptc_m.points.gte(1) && player.tptc_m.spellTimes[13].lte(0)},
				onClick(){
					player.tptc_m.points=player.tptc_m.points.sub(1);
					player.tptc_m.hexes=player.tptc_m.hexes.add(1);
					player.tptc_m.spellTimes[13]=new Decimal(60);
				},
				effect(){
					if(player.tptc_m.spellTimes[13].lte(0))return new Decimal(1);
					return layers.tptc_m.clickables[13].realEffect();
				},
				realEffect(){
					let ret=Decimal.pow(1.1,Decimal.log10(player.tptc_m.points.add(1).mul(player.tptc_m.hexes.add(1))).add(2).pow(0.3));
					ret=ret.pow(tmp.tptc_mb.buyables[11].effect);
					return ret;
				},
				display(){
					return "Multiply Super-Generator base by "+format(layers.tptc_m.clickables[13].realEffect())+"\n\
					Time: "+formatTime(player.tptc_m.spellTimes[13].max(0));
				},
                style: {'height':'160px','width':'200px'},
			},
			14: {
				title: "Spell of Multitree A",
				unlocked(){return player.tptc_mb.buyables[11].gte(3)},
				canClick(){return player.tptc_m.points.gte(1) && player.tptc_m.spellTimes[14].lte(0)},
				onClick(){
					player.tptc_m.points=player.tptc_m.points.sub(1);
					player.tptc_m.hexes=player.tptc_m.hexes.add(1);
					player.tptc_m.spellTimes[14]=new Decimal(60);
				},
				effect(){
					if(player.tptc_m.spellTimes[14].lte(0))return new Decimal(1);
					return layers.tptc_m.clickables[14].realEffect();
				},
				realEffect(){
					let ret=Decimal.pow(1.5,Decimal.log10(player.tptc_m.points.add(1).mul(player.tptc_m.hexes.add(1))).add(2).pow(0.4));
					ret=ret.pow(tmp.tptc_mb.buyables[11].effect);
					return ret;
				},
				display(){
					return "Multiply 2nd row of Prestige Upgrades by "+format(layers.tptc_m.clickables[14].realEffect())+"\n\
					Time: "+formatTime(player.tptc_m.spellTimes[14].max(0));
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
		if(player.tptc_mb.buyables[12].gte(1))eff=eff.pow(buyableEffect("tptc_l",15));
		return eff;
	},
	negEff() {
		let eff = player.tptc_ba.neg.add(1).log10().add(1).pow(2);
		if(player.tptc_mb.buyables[12].gte(1))eff=eff.pow(buyableEffect("tptc_l",15));
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
            rows: 3,
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
					if(hasUpgrade("tptc_sp",31))ret=ret.pow(1.2);
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			23: {
				title: "Super-Prestige Upgrade 23",
                description(){
					return "Prestige Point gain is boosted by your Super-Prestige Points.";
				},
                cost: new Decimal("1e1000"),
                unlocked() { return player.tm.buyables[1].gte(13); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=1e10;
                    let ret = Decimal.pow(base,Decimal.log10(player.tptc_sp.points.mul(2).add(3)).pow(0.9));
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			31: {
				title: "Super-Prestige Upgrade 31",
                description: "Super-Prestige Upgrade 22's effect ^1.2",
                cost: new Decimal("1e10000"),
                unlocked() { return player.tm.buyables[1].gte(16); },
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
	gainMult(){
		let ret=new Decimal(1);
		if(player.tptc_i.buyables[11].gte(4))ret=ret.div(tmp.tptc_s.buyables[16].effect);
		if(player.tptc_mb.buyables[12].gte(2))ret=ret.div(tmp.tptc_l.buyables[16].effect);
		if(hasUpgrade("incrementy_g",35))ret=ret.div(upgradeEffect("incrementy_g",35));
		return ret;
	},
	effect() {
		let ret = player.tptc_ps.points;
		let base = new Decimal(4);
		if(player.tptc_ge.challenges[22])base = base.mul(tmp.tptc_ge.challenges[22].rewardEffect);
		base=base.mul(buyableEffect("tptc_mb",12));
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
	gainMult(){
		let ret=new Decimal(1);
		ret=ret.mul(tmp.tptc_mb.effect);
		return ret;
	},
	effect() {
		let ret = player.tptc_l.points;
		ret=ret.mul(tmp.tptc_ps.effect);
		if(player.tptc_i.buyables[11].gte(4))ret=ret.mul(tmp.tptc_s.buyables[17].effect);
		if(player.tptc_ge.challenges[31])ret=ret.mul(tmp.tptc_ge.challenges[31].rewardEffect);
		return ret;
	},
	effectDescription() { // Optional text to describe the effects
           let eff = this.effect();
           return "which are generating "+format(eff)+" Life Power/sec";
       },
	doReset(l){
			if(l=="tptc_p" || l=="tptc_b" || l=="tptc_g" || l=="tptc_t" || l=="tptc_e" || l=="tptc_s" || l=="tptc_sb" || l=="tptc_sg" || l=="tptc_h" || l=="tptc_q" || l=="tptc_hb" || l=="tptc_ss" || l=="tptc_m" || l=="tptc_ba" || l=="tptc_ps"  || l=="tptc_sp" || l=="tptc_l" || l=="tptc_hs" || l=="tptc_i" || !l.startsWith("tptc_")){return;}
			var b=new Decimal(player.tptc_l.best);
			layerDataReset("tptc_l",["upgrades","milestones","challenges"]);
			player.tptc_l.best=b;
		},
	milestones: {
            0: {requirementDescription: "1 Life Essence",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy Hyper Boosters, Hyper Boosters resets nothing, you can buy max Hyper Boosters. Gain 100% of Magic gain per second.",
            },
	},
	 update(diff){
		 player.tptc_l.power = player.tptc_l.power.add(tmp.tptc_l.effect.times(diff)).max(0)
		 let l=0;
		 if(hasUpgrade("tptc_l",11)){
			 while(player.tptc_ps.points.gte(layers.tptc_l.buyables[11].cost())&&l<3000){
				 player.tptc_l.buyables[11]=player.tptc_l.buyables[11].add(1);l++;
			 }
		 }
		 if(hasUpgrade("tptc_l",12)){
			 while(player.tptc_ps.points.gte(layers.tptc_l.buyables[12].cost())&&l<3000){
				 player.tptc_l.buyables[12]=player.tptc_l.buyables[12].add(1);l++;
			 }
		 }
		 if(hasUpgrade("tptc_l",13)){
			 while(player.tptc_ps.points.gte(layers.tptc_l.buyables[13].cost())&&l<3000){
				 player.tptc_l.buyables[13]=player.tptc_l.buyables[13].add(1);l++;
			 }
		 }
		 if(hasUpgrade("tptc_l",14)){
			 while(player.tptc_ps.points.gte(layers.tptc_l.buyables[14].cost())&&l<3000){
				 player.tptc_l.buyables[14]=player.tptc_l.buyables[14].add(1);l++;
			 }
		 }
		 if(player.tptc_mb.buyables[12].gte(1)){
			 while(player.tptc_ps.points.gte(layers.tptc_l.buyables[15].cost())&&l<3000){
				 player.tptc_l.buyables[15]=player.tptc_l.buyables[15].add(1);l++;
			 }
		 }
		 if(player.tptc_mb.buyables[12].gte(2)){
			 while(player.tptc_ps.points.gte(layers.tptc_l.buyables[16].cost())&&l<3000){
				 player.tptc_l.buyables[16]=player.tptc_l.buyables[16].add(1);l++;
			 }
		 }
		 if(player.tptc_mb.buyables[12].gte(3)){
			 while(player.tptc_ps.points.gte(layers.tptc_l.buyables[17].cost())&&l<3000){
				 player.tptc_l.buyables[17]=player.tptc_l.buyables[17].add(1);l++;
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
            rows: 1,
            cols: 5,
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
			14: {
				title: "Life Upgrade 14",
                description: "Unlock a Life Booster.",
                cost: new Decimal(1e13),
                unlocked() { return player.tm.buyables[1].gte(14); }, // The upgrade is only visible when this is true
            },
			15: {
				title: "Life Upgrade 15",
                description: "Gain 100% of Life Essence gain per second.",
                cost: new Decimal(1e30),
                unlocked() { return player.tm.buyables[1].gte(15); }, // The upgrade is only visible when this is true
            },
		},
		
	buyables: {
            rows: 1,
            cols: 7,
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
					if(inChallenge("tptc_ge",31) || !hasUpgrade("tptc_l",11))return new Decimal(0);
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
					if(!hasUpgrade("tptc_l",12))return Infinity;
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Amount: "+formatWhole(player[this.layer].buyables[this.id])+"<br>"+
					"Next at: "+formatWhole(data.cost)+" Phantom Souls<br>"+
					"Effect: Gain "+format(data.effect)+"x more Hexes";
                },
				effect(){
					if(inChallenge("tptc_ge",31) || !hasUpgrade("tptc_l",12))return new Decimal(1);
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
					if(!hasUpgrade("tptc_l",13))return Infinity;
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Amount: "+formatWhole(player[this.layer].buyables[this.id])+"<br>"+
					"Next at: "+formatWhole(data.cost)+" Phantom Souls<br>"+
					"Effect: Gain "+format(data.effect)+"x more Hyperspace Energy";
                },
				effect(){
					if(inChallenge("tptc_ge",31) || !hasUpgrade("tptc_l",13))return new Decimal(1);
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
            14: {
                title: "Life Booster 4", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x.pow(1.2).floor();
					if(!hasUpgrade("tptc_l",14))return Infinity;
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Amount: "+formatWhole(player[this.layer].buyables[this.id])+"<br>"+
					"Next at: "+formatWhole(data.cost)+" Phantom Souls<br>"+
					"Effect: Multiply the reward of H challenge 'Real Prestige Tree' by "+format(data.effect)+"x";
                },
				effect(){
					if(inChallenge("tptc_ge",31) || !hasUpgrade("tptc_l",14))return new Decimal(1);
					let x=player[this.layer].buyables[this.id].mul(player.tptc_l.power.add(1).log10().add(1));
					return x.add(1).pow(0.5);
				},
                unlocked() { return hasUpgrade("tptc_l",14) }, 
                canAfford() {
					return false;
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px','background-color':'#7fbf7f'},
            },
            15: {
                title: "Life Booster 5", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x.mul(2).floor();
					if(!player.tptc_mb.buyables[12].gte(1))return Infinity;
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Amount: "+formatWhole(player[this.layer].buyables[this.id])+"<br>"+
					"Next at: "+formatWhole(data.cost)+" Phantom Souls<br>"+
					"Effect: Positivity & Negativity effects ^"+format(data.effect);
                },
				effect(){
					if(inChallenge("tptc_ge",31) || player.tptc_mb.buyables[12].lt(1))return new Decimal(1);
					let x=player[this.layer].buyables[this.id].mul(player.tptc_l.power.add(1).log10().add(1));
					let ret=x.add(1).pow(0.7);
					if(ret.gte(new Decimal(2,15))){
						ret=ret.log2().div(15).pow(0.8).mul(5).add(10);
						ret=Decimal.pow(2,ret);
					}
					return ret;
				},
                unlocked() { return player.tptc_mb.buyables[12].gte(1) }, 
                canAfford() {
					return false;
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px','background-color':'#7fbf7f'},
            },
            16: {
                title: "Life Booster 6", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x.mul(2).pow(1.4).floor();
					if(!player.tptc_mb.buyables[12].gte(2))return Infinity;
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Amount: "+formatWhole(player[this.layer].buyables[this.id])+"<br>"+
					"Next at: "+formatWhole(data.cost)+" Phantom Souls<br>"+
					"Effect: Phantom Souls are "+format(data.effect)+"x cheaper";
                },
				effect(){
					if(inChallenge("tptc_ge",31) || player.tptc_mb.buyables[12].lt(2))return new Decimal(1);
					let x=player[this.layer].buyables[this.id].mul(player.tptc_l.power.add(1).log10().add(1));
					return Decimal.pow(1e5,x.pow(0.75));
				},
                unlocked() { return player.tptc_mb.buyables[12].gte(2) }, 
                canAfford() {
					return false;
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px','background-color':'#7fbf7f'},
            },
            17: {
                title: "Life Booster 7", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x.pow(1.5).floor();
					if(!player.tptc_mb.buyables[12].gte(3))return Infinity;
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Amount: "+formatWhole(player[this.layer].buyables[this.id])+"<br>"+
					"Next at: "+formatWhole(data.cost)+" Phantom Souls<br>"+
					"Effect: Multiply 2nd row of Prestige Upgrades by "+format(data.effect);
                },
				effect(){
					if(inChallenge("tptc_ge",31) || player.tptc_mb.buyables[12].lt(3))return new Decimal(1);
					let x=player[this.layer].buyables[this.id].mul(player.tptc_l.power.add(1).log10().add(1));
					let ret=Decimal.pow(1.25,x.pow(0.4));
					if(player.tptc_ge.challenges[11])ret=ret.pow(tmp.tptc_ge.challenges[11].rewardEffect);
					return ret;
				},
                unlocked() { return player.tptc_mb.buyables[12].gte(3) }, 
                canAfford() {
					return false;
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px','background-color':'#7fbf7f'},
            },
	},
	passiveGeneration(){
		if(hasUpgrade("tptc_l",15))return 1;
		return 0;
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
		ret=ret.mul(tmp.tptc_mb.effect);
		return ret;
	},
	doReset(l){
			if(l=="tptc_p" || l=="tptc_b" || l=="tptc_g" || l=="tptc_t" || l=="tptc_e" || l=="tptc_s" || l=="tptc_sb" || l=="tptc_sg" || l=="tptc_h" || l=="tptc_q" || l=="tptc_hb" || l=="tptc_ss" || l=="tptc_m" || l=="tptc_ba" || l=="tptc_ps"  || l=="tptc_sp" || l=="tptc_l" || l=="tptc_hs" || l=="tptc_i" || !l.startsWith("tptc_")){return;}
			var b=new Decimal(player.tptc_hs.best);
			if(player.tptc_mb.best.gte(6))layerDataReset("tptc_hs",["upgrades","milestones","challenges","buyables"]);
			else layerDataReset("tptc_hs",["upgrades","milestones","challenges"]);
			player.tptc_hs.best=b;
		},
	milestones: {
            0: {requirementDescription: "1 Hyperspace Energy",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy Subspace Energy, Subspace Energy resets nothing, you can buy max Subspace Energy. Autobuy Quirk Layers. Gain 100% of Balance Energy gain per second.",
            },
	},
		
    usedHS() {
        return player[this.layer].buyables[11].add(player[this.layer].buyables[12]).add(player[this.layer].buyables[13]).add(player[this.layer].buyables[14]).add(player[this.layer].buyables[15]).add(player[this.layer].buyables[16]).add(player[this.layer].buyables[17]).add(player[this.layer].buyables[18]);
    },
	realBuildLimit(){
		let ret=new Decimal(player.tm.buyables[1]).sqrt().mul(3).sub(5.6);
		if(hasUpgrade("tptc_hs",11))ret=ret.add(upgradeEffect("tptc_hs",11));
		if(hasUpgrade("tptc_hs",12))ret=ret.add(upgradeEffect("tptc_hs",12));
		if(hasUpgrade("tptc_i",11))ret=ret.add(upgradeEffect("tptc_i",11));
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
					["display-text",function(){return "You have "+formatWhole(tmp.tptc_hs.usedHS)+" used Hyperspace."}],
					["buyable",2],
						"buyables","upgrades"
				],
				
	buyables: {
            rows: 1,
            cols: 8,
            1: {
                title: "Hyperspace", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.3));
					if(hasUpgrade("tptc_hs",14))cost=cost.pow(0.7);
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
						player[this.layer].buyables[15]=new Decimal(0);
						player[this.layer].buyables[16]=new Decimal(0);
						player[this.layer].buyables[17]=new Decimal(0);
						player[this.layer].buyables[18]=new Decimal(0);
						doReset("tptc_hs",true);
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
					if(inChallenge("tptc_ge",32))return new Decimal(1);
					let x=player[this.layer].buyables[this.id];
					if(player.tptc_ge.challenges[32])x=x.mul(tmp.tptc_ge.challenges[32].rewardEffect);
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
					if(inChallenge("tptc_ge",32))return new Decimal(1);
					let x=player[this.layer].buyables[this.id];
					if(player.tptc_ge.challenges[32])x=x.mul(tmp.tptc_ge.challenges[32].rewardEffect);
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
					if(inChallenge("tptc_ge",32))return new Decimal(1);
					let x=player[this.layer].buyables[this.id];
					if(player.tptc_ge.challenges[32])x=x.mul(tmp.tptc_ge.challenges[32].rewardEffect);
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
					if(inChallenge("tptc_ge",32))return new Decimal(1);
					let x=player[this.layer].buyables[this.id];
					if(player.tptc_ge.challenges[32])x=x.mul(tmp.tptc_ge.challenges[32].rewardEffect);
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
            15: {
                display() { 
                    let data = tmp[this.layer].buyables[this.id]
                    return "Hyper Building 5<br>"+
					"Level: "+format(player.tptc_hs.buyables[15])+"/"+format(tmp.tptc_hs.buildLimit)+"<br>"+
					"Effect: Space Building 5's effect ^"+format(data.effect)+"<br>";
                },
                unlocked() { return player[this.layer].unlocked && player.tptc_i.buyables[11].gte(3) }, 
                canAfford() {
					return layers[this.layer].usedHS().lt(player.tptc_hs.buyables[1]) && player.tptc_hs.buyables[this.id].lt(tmp.tptc_hs.buildLimit);
				},
				effect(){
					if(inChallenge("tptc_ge",32))return new Decimal(1);
					let x=player[this.layer].buyables[this.id];
					if(player.tptc_ge.challenges[32])x=x.mul(tmp.tptc_ge.challenges[32].rewardEffect);
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
            16: {
                display() { 
                    let data = tmp[this.layer].buyables[this.id]
                    return "Hyper Building 6<br>"+
					"Level: "+format(player.tptc_hs.buyables[16])+"/"+format(tmp.tptc_hs.buildLimit)+"<br>"+
					"Effect: Space Building 6's effect ^"+format(data.effect)+"<br>";
                },
                unlocked() { return player[this.layer].unlocked && player.tptc_i.buyables[11].gte(4) }, 
                canAfford() {
					return layers[this.layer].usedHS().lt(player.tptc_hs.buyables[1]) && player.tptc_hs.buyables[this.id].lt(tmp.tptc_hs.buildLimit);
				},
				effect(){
					let x=player[this.layer].buyables[this.id];
					if(player.tptc_ge.challenges[32])x=x.mul(tmp.tptc_ge.challenges[32].rewardEffect);
					return x.mul(0.2).add(1);
				},
                buy() { 
					if(inChallenge("tptc_ge",32))return new Decimal(1);
                    cost = tmp[this.layer].buyables[this.id].cost
					player[this.layer].points = player[this.layer].points.sub(cost)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'120px','width':'120px'},
            },
            17: {
                display() { 
                    let data = tmp[this.layer].buyables[this.id]
                    return "Hyper Building 7<br>"+
					"Level: "+format(player.tptc_hs.buyables[17])+"/"+format(tmp.tptc_hs.buildLimit)+"<br>"+
					"Effect: Space Building 7's effect ^"+format(data.effect)+"<br>";
                },
                unlocked() { return player[this.layer].unlocked && player.tptc_i.buyables[11].gte(5) }, 
                canAfford() {
					return layers[this.layer].usedHS().lt(player.tptc_hs.buyables[1]) && player.tptc_hs.buyables[this.id].lt(tmp.tptc_hs.buildLimit);
				},
				effect(){
					if(inChallenge("tptc_ge",32))return new Decimal(1);
					let x=player[this.layer].buyables[this.id];
					if(player.tptc_ge.challenges[32])x=x.mul(tmp.tptc_ge.challenges[32].rewardEffect);
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
            18: {
                display() { 
                    let data = tmp[this.layer].buyables[this.id]
                    return "Hyper Building 8<br>"+
					"Level: "+format(player.tptc_hs.buyables[18])+"/"+format(tmp.tptc_hs.buildLimit)+"<br>"+
					"Effect: Space Building 8's effect is multiplied by "+format(data.effect)+"<br>";
                },
                unlocked() { return player[this.layer].unlocked && player.tptc_i.buyables[11].gte(6) }, 
                canAfford() {
					return layers[this.layer].usedHS().lt(player.tptc_hs.buyables[1]) && player.tptc_hs.buyables[this.id].lt(tmp.tptc_hs.buildLimit);
				},
				effect(){
					if(inChallenge("tptc_ge",32))return new Decimal(1);
					let x=player[this.layer].buyables[this.id];
					if(player.tptc_ge.challenges[32])x=x.mul(tmp.tptc_ge.challenges[32].rewardEffect);
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
            rows: 1,
            cols: 5,
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
					ret = ret.div(2).add(1);
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			14: {
				title: "Hyperspace Upgrade 14",
                description: "The cost of Hyperspace ^0.7",
                cost: new Decimal(1e18),
                unlocked() { return player.tm.buyables[1].gte(14); }, // The upgrade is only visible when this is true
            },
			15: {
				title: "Hyperspace Upgrade 15",
                description: "Gain 100% of Hyperspace Energy gain per second.",
                cost: new Decimal(1e22),
                unlocked() { return player.tm.buyables[1].gte(15); }, // The upgrade is only visible when this is true
            },
		},
		update(diff){
		if(player.tptc_mb.best.gte(1)){
				var target=player.tptc_hs.points;
				if(hasUpgrade("tptc_hs",14))target=target.pow(1/0.7);
				target=target.add(1).log(2).pow(1/1.3).add(1).floor();
				if(target.gt(player.tptc_hs.buyables[1])){
					player.tptc_hs.buyables[1]=target;
				}
		 }
		},
	passiveGeneration(){
		if(hasUpgrade("tptc_hs",15))return 1;
		return 0;
	}
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
    exponent: 1.45,
    row: 5,
    hotkeys: [],
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(13)},
	branches: ["tptc_ss","tptc_sg"],
	doReset(l){
			if(l=="tptc_p" || l=="tptc_b" || l=="tptc_g" || l=="tptc_t" || l=="tptc_e" || l=="tptc_s" || l=="tptc_sb" || l=="tptc_sg" || l=="tptc_h" || l=="tptc_q" || l=="tptc_hb" || l=="tptc_ss" || l=="tptc_m" || l=="tptc_ba" || l=="tptc_ps"  || l=="tptc_sp" || l=="tptc_l" || l=="tptc_hs" || l=="tptc_i" || !l.startsWith("tptc_")){return;}
			var b=new Decimal(player.tptc_i.best);
			if(player.tptc_mb.best.gte(6))layerDataReset("tptc_i",["upgrades","milestones","challenges","buyables"]);
			else layerDataReset("tptc_i",["upgrades","milestones","challenges"]);
			player.tptc_i.best=b;
		},
	milestones: {
            0: {requirementDescription: "1 Imperium Brick",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy Phantom Souls, Phantom Souls resets nothing, you can buy max Phantom Souls.",
            },
            1: {requirementDescription: "3 Imperium Bricks",
                done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
                effectDescription: "You can buy max Imperium Bricks, Imperium Bricks resets nothing.",
            },
	},
		
	buyables: {
            rows: 1,
            cols: 1,
            11: {
                title: "Imperium Building", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(0.54));
					if(player.tptc_mb.buyables[13].gte(1))cost=cost.div(buyableEffect("tptc_ma",11));
					cost=cost.ceil();
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    let ret="Level: "+formatWhole(player.tptc_i.buyables[11])+"<br>"+
					"Cost: "+formatWhole(data.cost)+" Imperium Bricks<br>"+
					"Unlocked "+formatWhole(player.tptc_i.buyables[11].min(6))+" new space buildings"+(player.tptc_i.buyables[11].gte(6)?" (MAX)":"");
					if(player.tptc_i.buyables[11].gte(6)){
						ret=ret+"<br>Space Building 1's effect ^"+format(tmp.tptc_i.buyables[11].effect[11])+((player.tptc_i.buyables[11].sub(6).toNumber()%8==0)?" (Next Effect)":"");
					}
					if(player.tptc_i.buyables[11].gte(7)){
						ret=ret+"<br>Space Building 2's effect ^"+format(tmp.tptc_i.buyables[11].effect[12])+((player.tptc_i.buyables[11].sub(7).toNumber()%8==0)?" (Next Effect)":"");
					}
					if(player.tptc_i.buyables[11].gte(8)){
						ret=ret+"<br>Space Building 3's effect ^"+format(tmp.tptc_i.buyables[11].effect[13])+((player.tptc_i.buyables[11].sub(8).toNumber()%8==0)?" (Next Effect)":"");
					}
					if(player.tptc_i.buyables[11].gte(9)){
						ret=ret+"<br>Space Building 4's effect ^"+format(tmp.tptc_i.buyables[11].effect[14])+((player.tptc_i.buyables[11].sub(9).toNumber()%8==0)?" (Next Effect)":"");
					}
					if(player.tptc_i.buyables[11].gte(10)){
						ret=ret+"<br>Space Building 5's effect ^"+format(tmp.tptc_i.buyables[11].effect[15])+((player.tptc_i.buyables[11].sub(10).toNumber()%8==0)?" (Next Effect)":"");
					}
					if(player.tptc_i.buyables[11].gte(11)){
						ret=ret+"<br>Space Building 6's effect ^"+format(tmp.tptc_i.buyables[11].effect[16])+((player.tptc_i.buyables[11].sub(11).toNumber()%8==0)?" (Next Effect)":"");
					}
					if(player.tptc_i.buyables[11].gte(12)){
						ret=ret+"<br>Space Building 7's effect ^"+format(tmp.tptc_i.buyables[11].effect[17])+((player.tptc_i.buyables[11].sub(12).toNumber()%8==0)?" (Next Effect)":"");
					}
					if(player.tptc_i.buyables[11].gte(13)){
						ret=ret+"<br>Space Building 8's effect is multiplied by "+format(tmp.tptc_i.buyables[11].effect[18])+((player.tptc_i.buyables[11].sub(13).toNumber()%8==0)?" (Next Effect)":"");
					}
					return ret;
                },
				effect() {
					if(inChallenge("tptc_ge",21))return {
						11: new Decimal(1),
						12: new Decimal(1),
						13: new Decimal(1),
						14: new Decimal(1),
						15: new Decimal(1),
						16: new Decimal(1),
						17: new Decimal(1),
						18: new Decimal(1),
					};
					let ret={
						11: player.tptc_i.buyables[11].add(1).div(8).floor().mul(0.1).add(1),
						12: player.tptc_i.buyables[11].add(0).div(8).floor().mul(0.1).add(1),
						13: player.tptc_i.buyables[11].sub(1).div(8).floor().mul(0.1).add(1),
						14: player.tptc_i.buyables[11].sub(2).div(8).floor().mul(0.1).add(1),
						15: player.tptc_i.buyables[11].sub(3).div(8).floor().mul(0.1).add(1),
						16: player.tptc_i.buyables[11].sub(4).div(8).floor().mul(0.1).add(1),
						17: player.tptc_i.buyables[11].sub(5).div(8).floor().mul(0.1).add(1),
						18: player.tptc_i.buyables[11].sub(6).div(8).floor().mul(0.1).add(1),
					};
					return ret;
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
                style: {'height':function(){
						if(player.tptc_i.buyables[11].gte(13))return '372px';
						if(player.tptc_i.buyables[11].gte(12))return '342px';
						if(player.tptc_i.buyables[11].gte(11))return '312px';
						if(player.tptc_i.buyables[11].gte(10))return '282px';
						if(player.tptc_i.buyables[11].gte(9))return '252px';
						return '222px';
					}
				},
            },
	},
		upgrades: {
            rows: 1,
            cols: 5,
			11: {
				title: "Imperium Upgrade 11",
                description: "Imperium Bricks add to Hyper Building Limit Upgrade Progress.",
                cost: new Decimal(7),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let ret=Decimal.log10(player.tptc_i.points.add(1)).pow(2);
					return ret;
                },
                effectDisplay() { return "+"+format(this.effect().mul(100))+"%" }, // Add formatting to the effect
            },
		},
	 canBuyMax(){
		 return player.tptc_i.best.gte(3);
	 },autoPrestige(){
		 return player.tptc_mb.best.gte(1);
	 },resetsNothing(){
		 return player.tptc_i.best.gte(3);
	 },
});


addLayer("tptc_mb", {
    name: "tptc_mb",
    symbol: "MB",
    position: 1,
    startData() { return {
        unlocked: false,
		points: new Decimal(0)
	}},
	color: "#ff9f7f",
	nodeStyle() {return {
			"background": (player.tptc_mb.unlocked||canReset("tptc_mb"))?("radial-gradient(circle, rgba(255,100,100,1) 0%, rgba(255,159,127,1) 50%)"):"#bf8f8f" ,
        }},
    requires: function(){
		return new Decimal(10);
	},
    resource: "mastery bricks",
    baseResource: "phantom souls", 
    baseAmount() {return player.tptc_ps.points},
    type: "static",
	base: new Decimal(1.2),
    exponent: new Decimal(0.85),
    row: 6,
    hotkeys: [],
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(15)},
	branches: ["tptc_l",["tptc_ps",2]],
	effect() {
		let ret = Decimal.pow(100,player.tptc_mb.points);
		return ret;
	},
	effectDescription() { // Optional text to describe the effects
           let eff = this.effect();
           return "which multiplies life essence and hyperspace energy gain by "+format(eff);
       },
	doReset(l){
	if(l=="tptc_p" || l=="tptc_b" || l=="tptc_g" || l=="tptc_t" || l=="tptc_e" || l=="tptc_s" || l=="tptc_sb" || l=="tptc_sg" || l=="tptc_h" || l=="tptc_q" || l=="tptc_hb" || l=="tptc_ss" || l=="tptc_m" || l=="tptc_ba" || l=="tptc_ps"  || l=="tptc_sp" || l=="tptc_l" || l=="tptc_hs" || l=="tptc_i" || l=="tptc_mb" || l=="tptc_ge" || l=="tptc_ma" || !l.startsWith("tptc_")){return;}
			var b=new Decimal(player.tptc_mb.best);
			layerDataReset("tptc_mb",["upgrades","milestones","challenges"]);
			player.tptc_mb.best=b;
		},
		roundUpCost:true,
		
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
						"milestones",
					["display-text",function(){if(player.tptc_mb.best.gte(33))return "";return "Mastery bricks remaining: "+formatWhole(player.tptc_mb.points.sub(tmp.tptc_mb.usedMB))+"/"+formatWhole(player.tptc_mb.points)}],
					["buyable",2],
						"buyables","upgrades"
				],
	milestones: {
            0: {requirementDescription: "1 Mastery Brick",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy Hyperspace. Autobuy Imperium Bricks.",
            },
            1: {requirementDescription: "3 Mastery Bricks",
                done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
                effectDescription: "Unlock a new feature in the Tree Manager.",
            },
            2: {requirementDescription: "6 Mastery Bricks",
                done() {return player[this.layer].best.gte(6)}, // Used to determine when to give the milestone
                effectDescription: "Hyper Buildings and Imperium Buildings don't reset.",
            },
            3: {requirementDescription: "15 Mastery Bricks",
                done() {return player[this.layer].best.gte(15)}, // Used to determine when to give the milestone
                effectDescription: "Mastery Building 1 doesn't use any mastery bricks.",
            },
            4: {requirementDescription: "33 Mastery Bricks",
                done() {return player[this.layer].best.gte(33)}, // Used to determine when to give the milestone
                effectDescription: "Mastery Building 2 doesn't use any mastery bricks.",
            },
            5: {requirementDescription: "40 Mastery Bricks",
                done() {return player[this.layer].best.gte(40)}, // Used to determine when to give the milestone
                effectDescription: "Mastery bricks resets nothing, you can buy max mastery bricks.",
            },
            6: {requirementDescription: "TPTC Level 20 & TMT Level 6",
                done() {return player.tm.buyables[0].gte(6) && player.tm.buyables[1].gte(20)}, // Used to determine when to give the milestone
                effectDescription: "A new feature in the Tree Manager?",
            },
	},
	buyables: {
            rows: 1,
            cols: 3,
            2: {
                title: "Respec Mastery Buildings",
                display() { // Everything else displayed in the buyable button after the title
                    return "";
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
					return true;
				},
                buy() { 
					if(confirm("This will force a Mastery reset! Are you sure?")){
						player[this.layer].buyables[11]=new Decimal(0);
						player[this.layer].buyables[12]=new Decimal(0);
						player[this.layer].buyables[13]=new Decimal(0);
						doReset("tptc_mb",true);
					}
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'60px'},
            },
            11: {
                title: "Mastery Building 1", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x.plus(1);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    let ret="Level: "+formatWhole(player.tptc_mb.buyables[11])+"<br>"+
					"Cost: "+formatWhole(data.cost)+" unused mastery bricks<br>"+
					"Unlocked "+formatWhole(player.tptc_mb.buyables[11].min(3))+" new spells"+(player.tptc_mb.buyables[11].gte(3)?" (MAX)":" (Next at "+formatWhole(data.nextat)+")");
					if(player[this.layer].best.gte(15))ret="Level: "+formatWhole(player.tptc_mb.buyables[11])+"<br>"+
					"Req: "+formatWhole(data.cost)+" mastery bricks<br>"+
					"Unlocked "+formatWhole(player.tptc_mb.buyables[11].min(3))+" new spells"+(player.tptc_mb.buyables[11].gte(3)?" (MAX)":" (Next at "+formatWhole(data.nextat)+")");
					if(player.tptc_mb.buyables[11].gte(3)){
						ret=ret+"<br>Spell Effects ^"+format(data.effect);
					}
					return ret;
                },
				effect() {
					let ret=player.tptc_mb.buyables[11].sub(3).max(0).mul(0.01).add(1);
					return ret;
                },
				nextat() {
					let ret=player.tptc_mb.buyables[11].add(1);
					if(ret.gte(4))return new Decimal(9999);
					return ret;
                },
                unlocked() { return true; }, 
                canAfford() {
					if(player[this.layer].best.gte(15))return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost());
					return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost().add(layers[this.layer].usedMB()));
				},
                buy() { 
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            12: {
                title: "Mastery Building 2", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x.mul(2).plus(3);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    let ret="Level: "+formatWhole(player.tptc_mb.buyables[12])+"<br>"+
					"Cost: "+formatWhole(data.cost)+" unused mastery bricks<br>"+
					"Unlocked "+formatWhole(player.tptc_mb.buyables[12].min(3))+" new life boosters"+(player.tptc_mb.buyables[12].gte(3)?" (MAX)":" (Next at "+formatWhole(data.nextat)+")");
					if(player[this.layer].best.gte(33))ret="Level: "+formatWhole(player.tptc_mb.buyables[12])+"<br>"+
					"Req: "+formatWhole(data.cost)+" mastery bricks<br>"+
					"Unlocked "+formatWhole(player.tptc_mb.buyables[12].min(3))+" new life boosters"+(player.tptc_mb.buyables[12].gte(3)?" (MAX)":" (Next at "+formatWhole(data.nextat)+")");
					if(player.tptc_mb.buyables[12].gte(3)){
						ret=ret+"<br>Phantom Soul base is multiplied by "+format(data.effect);
					}
					return ret;
                },
				effect() {
					let ret=player.tptc_mb.buyables[12].sub(3).max(0).pow(0.2).add(1);
					return ret;
                },
				nextat() {
					let ret=player.tptc_mb.buyables[12].add(1);
					if(ret.gte(4))return new Decimal(9999);
					return ret;
                },
                unlocked() { return player.tm.buyables[1].gte(16); }, 
                canAfford() {
					if(player[this.layer].best.gte(33))return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost());
					return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost().add(layers[this.layer].usedMB()));
				},
                buy() { 
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            13: {
                title: "Mastery Building 3", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x.mul(999).plus(36);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    let ret="Level: "+formatWhole(player.tptc_mb.buyables[13])+"<br>"+
					"Req: "+formatWhole(data.cost)+" mastery bricks<br>"+
					"Unlocked "+formatWhole(player.tptc_mb.buyables[13].min(3))+" new machines"+(player.tptc_mb.buyables[13].gte(3)?" (MAX)":" (Next at "+formatWhole(data.nextat)+")");
					return ret;
                },
				nextat() {
					let ret=player.tptc_mb.buyables[13].add(1);
					if(ret.gte(4))return new Decimal(9999);
					return ret;
                },
                unlocked() { return player.tm.buyables[1].gte(19); }, 
                canAfford() {
					return player[this.layer].points.gte(layers[this.layer].buyables[this.id].cost());
				},
                buy() { 
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
	},
    usedMB() {
        let ret=player[this.layer].buyables[11].mul(player[this.layer].buyables[11].add(1)).div(2);
		if(player[this.layer].best.gte(15))ret=new Decimal(0);
		ret=ret.add(player[this.layer].buyables[12].mul(player[this.layer].buyables[12].add(2)));
		if(player[this.layer].best.gte(33))ret=new Decimal(0);
		return ret;
    },
	 canBuyMax(){
		 return player.tptc_mb.best.gte(40);
	 },autoPrestige(){
		 return false;
	 },resetsNothing(){
		 return player.tptc_mb.best.gte(40);
	 },
});

var getMechanicalChallenges=function() {
		let mechanicalChallenges={
			rows: 11,
    		cols: 2,
		    11: {
                name: "Mechanical Challenge A",
                completionLimit: 1,
			    challengeDescription() {
					if(player.tm.buyables[1].gte(19)){
						return "Effects of point gain multiplier upgrades and buyables from other trees ^"+format(tmp.tptc_ge.c11pow,3);
					}
				},
                unlocked() { return player.tptc_ge.unlocked },
                goal: new Decimal("1e200000"),
                currencyDisplayName: "prestige points",
                currencyInternalName: "points",
				currencyLayer: "tptc_p",
                rewardEffect() {
                    let ret = player.tptc_ge.points.add(1).log10().add(1).log10().pow(0.75).mul(3);
                    let pcs=player.tptc_ge.challenges[41]+player.tptc_ge.challenges[42]+player.tptc_ge.challenges[52]+player.tptc_ge.challenges[71]+player.tptc_ge.challenges[91];
                    ret=ret.mul(pcs*0.2+player.tptc_ge.challenges[112]*0.4+1).add(1);
					return ret;
                },
                rewardDisplay() { 
					return "Life Booster 7's Effect ^"+format(this.rewardEffect()); 
				},
                rewardDescription() { 
					return "Gears boost Life Booster 7."
				},
            },
		    12: {
                name: "Mechanical Challenge B",
                completionLimit: 1,
			    challengeDescription() {
					return "Super-Boosters and Super-Generators do nothing.";
				},
                unlocked() { return player.tptc_ge.unlocked },
                goal: new Decimal("1e391400"),
                currencyDisplayName: "prestige points",
                currencyInternalName: "points",
				currencyLayer: "tptc_p",
                rewardEffect() {
					let ret=player.tptc_ge.points.add(1).log10().add(1).log10().pow(0.5).mul(0.5);
					let pcs=player.tptc_ge.challenges[41]+player.tptc_ge.challenges[51]+player.tptc_ge.challenges[61]+player.tptc_ge.challenges[72]+player.tptc_ge.challenges[92];
                    ret=ret.mul(pcs*0.05+player.tptc_ge.challenges[112]*0.1+1).add(1);
                    return ret;
                },
                rewardDisplay() { 
					return "SB/SG effect base is multiplied by "+format(this.rewardEffect()); 
				},
                rewardDescription() { 
					return "Gears boost SB/SG effect base."
				},
            },
		    21: {
                name: "Mechanical Challenge C",
                completionLimit: 1,
			    challengeDescription() {
					return "You can't gain subspace. Imperium Building levels past 6 do nothing.";
				},
                unlocked() { return player.tptc_ge.unlocked },
                goal: new Decimal("1e990000"),
                currencyDisplayName: "prestige points",
                currencyInternalName: "points",
				currencyLayer: "tptc_p",
                rewardEffect() {
                    let ret = new Decimal(1).add(player.tptc_ge.points.add(1).log10().add(1).log10()).mul(player.tptc_i.points.add(1).log10());
                    let pcs=player.tptc_ge.challenges[42]+player.tptc_ge.challenges[51]+player.tptc_ge.challenges[62]+player.tptc_ge.challenges[81]+player.tptc_ge.challenges[101];
                    ret=ret.pow(pcs*6+player.tptc_ge.challenges[112]*12+6).add(1);
                    return ret;
                },
                rewardDisplay() { 
					return "Subspace effect base is multiplied by "+format(this.rewardEffect()); 
				},
                rewardDescription() { 
					return "Gears and Imperium bricks boost Subspace effect base."
				},
            },
		    22: {
                name: "Mechanical Challenge D",
                completionLimit: 1,
			    challengeDescription() {
					return "Quirk Layers do nothing.";
				},
                unlocked() { return player.tptc_ge.unlocked },
                goal: new Decimal("1e1355000"),
                currencyDisplayName: "prestige points",
                currencyInternalName: "points",
				currencyLayer: "tptc_p",
                rewardEffect() {
                    let ret=player.tptc_ge.points.add(1).log10().add(1).log10().pow(0.5).mul(0.5);
					let pcs=player.tptc_ge.challenges[52]+player.tptc_ge.challenges[61]+player.tptc_ge.challenges[62]+player.tptc_ge.challenges[82]+player.tptc_ge.challenges[102];
                    ret=ret.mul(pcs*0.5+player.tptc_ge.challenges[112]+1).add(1);
                    return ret;
                },
                rewardDisplay() { 
					return "Quirk Layer & Phantom Soul bases are multiplied by "+format(this.rewardEffect()); 
				},
                rewardDescription() { 
					return "Gears boost Quirk Layer & Phantom Soul bases."
				},
            },
		    31: {
                name: "Mechanical Challenge E",
                completionLimit: 1,
			    challengeDescription() {
					return "Life Boosters do nothing.";
				},
                unlocked() { return player.tptc_ge.unlocked },
                goal: new Decimal("1e1585000"),
                currencyDisplayName: "prestige points",
                currencyInternalName: "points",
				currencyLayer: "tptc_p",
                rewardEffect() {
                    let ret = player.tptc_ge.points.add(1).pow(2);
                    let pcs=player.tptc_ge.challenges[71]+player.tptc_ge.challenges[72]+player.tptc_ge.challenges[81]+player.tptc_ge.challenges[82]+player.tptc_ge.challenges[111];
                    ret=ret.pow(pcs*0.1+player.tptc_ge.challenges[112]*0.2+1);
                    return ret;
                },
                rewardDisplay() { 
					return "Life Power gain is multiplied by "+format(this.rewardEffect()); 
				},
                rewardDescription() { 
					return "Gears boost Life Power gain."
				},
            },
		    32: {
                name: "Mechanical Challenge F",
                completionLimit: 1,
			    challengeDescription() {
					return "Hyper Buildings do nothing.";
				},
                unlocked() { return player.tptc_ge.unlocked },
                goal: new Decimal("1e1800000"),
                currencyDisplayName: "prestige points",
                currencyInternalName: "points",
				currencyLayer: "tptc_p",
                rewardEffect() {
                    let ret = player.tptc_ge.points.add(1).log10().add(1).log10().pow(0.5).mul(0.1);
                    let pcs=player.tptc_ge.challenges[91]+player.tptc_ge.challenges[92]+player.tptc_ge.challenges[101]+player.tptc_ge.challenges[102]+player.tptc_ge.challenges[111];
                    ret=ret.mul(pcs*0.05+player.tptc_ge.challenges[112]*0.1+1).add(1);
                    return ret;
                },
                rewardDisplay() { 
					return "Hyper Buildings are "+format(this.rewardEffect())+"x stronger"; 
				},
                rewardDescription() { 
					return "Gears boost Hyper Buildings."
				},
            },
		    112: {
                name: "Meta Mechanical Challenge",
                completionLimit: 1,
				challengeDescription: "All Mechanical Challenges are applied at once.",
                unlocked() { return player.tm.buyables[1].gte(18);},
                goal: new Decimal("1e810000"),
                currencyDisplayName: "prestige points",
                currencyInternalName: "points",
				currencyLayer: "tptc_p",
				rewardDescription: "Boost the reward for all mechanical challenges.",
				countsAs: [11,12,21,22,31,32]
            }
		};
		let getPairedMechanicalChallenge=function(a,b){
			let ids=[[11,"A"],[12,"B"],[21,"C"],[22,"D"],[31,"E"],[32,"F"]];
			let ida=ids[a];
			let idb=ids[b];
			return {
				name: "Paired Mechanical Challenge "+ida[1]+idb[1],
                completionLimit: 1,
				challengeDescription: "Mechanical Challenges "+ida[1]+" and "+idb[1]+" are applied at once.",
				unlocked(){return player.tm.buyables[1].gte(18);},
				goal: mechanicalChallenges[ida[0]].goal.mul(mechanicalChallenges[idb[0]].goal),
                currencyDisplayName: "prestige points",
                currencyInternalName: "points",
				currencyLayer: "tptc_p",
				rewardDescription: "Boost the reward for these sub-challenges.",
				countsAs: [ida[0],idb[0]]
			};
		}
		mechanicalChallenges[41]=getPairedMechanicalChallenge(0,1);
		mechanicalChallenges[42]=getPairedMechanicalChallenge(0,2);
		mechanicalChallenges[51]=getPairedMechanicalChallenge(1,2);
		mechanicalChallenges[52]=getPairedMechanicalChallenge(0,3);
		mechanicalChallenges[61]=getPairedMechanicalChallenge(1,3);
		mechanicalChallenges[62]=getPairedMechanicalChallenge(2,3);
		mechanicalChallenges[71]=getPairedMechanicalChallenge(0,4);
		mechanicalChallenges[72]=getPairedMechanicalChallenge(1,4);
		mechanicalChallenges[81]=getPairedMechanicalChallenge(2,4);
		mechanicalChallenges[82]=getPairedMechanicalChallenge(3,4);
		mechanicalChallenges[91]=getPairedMechanicalChallenge(0,5);
		mechanicalChallenges[92]=getPairedMechanicalChallenge(1,5);
		mechanicalChallenges[101]=getPairedMechanicalChallenge(2,5);
		mechanicalChallenges[102]=getPairedMechanicalChallenge(3,5);
		mechanicalChallenges[111]=getPairedMechanicalChallenge(4,5);
		return mechanicalChallenges;
}
			


addLayer("tptc_ge", {
    name: "tptc_ge",
    symbol: "GE",
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0)
	}},
	color: "#bfbfbf",
	nodeStyle() {return {
			"background": (player.tptc_ge.unlocked||canReset("tptc_ge"))?("radial-gradient(circle, rgba(191,191,191,1) 0%, rgba(131,133,134,1) 100%)"):"#bf8f8f" ,
        }},
    requires: function(){
		return new Decimal("1e18000");
	},
	gainMult(){
		let ret=new Decimal(1);
		if(hasUpgrade("tptc_ma",12))ret=ret.mul(upgradeEffect("tptc_ma",12));
		return ret;
	},
    resource: "gears",
    baseResource: "super-prestige points", 
    baseAmount() {return player.tptc_sp.points},
    type: "normal",
    exponent: 0.002,
    row: 6,
    hotkeys: [],
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(17)},
	branches: [["tptc_sp",2]],
	doReset(l){
			if(l=="tptc_p" || l=="tptc_b" || l=="tptc_g" || l=="tptc_t" || l=="tptc_e" || l=="tptc_s" || l=="tptc_sb" || l=="tptc_sg" || l=="tptc_h" || l=="tptc_q" || l=="tptc_hb" || l=="tptc_ss" || l=="tptc_m" || l=="tptc_ba" || l=="tptc_ps" || l=="tptc_sp" || l=="tptc_l" || l=="tptc_hs" || l=="tptc_i" || l=="tptc_mb" || l=="tptc_ge" || l=="tptc_ma" || !l.startsWith("tptc_")){return;}
			var b=new Decimal(player.tptc_ge.best);
			layerDataReset("tptc_ge",["upgrades","milestones","challenges"]);
			player.tptc_ge.best=b;
		},
	
	challenges:getMechanicalChallenges(),
	
	milestones: {
            0: {requirementDescription: "TPTC Level 19",
                done() {return player.tm.buyables[1].gte(19)}, // Used to determine when to give the milestone
                effectDescription: "Gain 1000% of gear gain per second. Unlock Gear Upgrades.",
            },
	},
	passiveGeneration(){
		if(player.tm.buyables[1].gte(19))return 10;
		return 0;
	},
	c11pow(){
		if(!hasUpgrade("tptc_ma",11))return new Decimal(0.001);
		return layers.tptc_ma.upgrades[11].effect();
	},
	
		upgrades: {
            rows: 1,
            cols: 5,
			11: {
				title: "Gear Upgrade 11",
                description: "Machine Power gain is boosted by your gears.",
                cost: new Decimal("1e417"),
                unlocked() { return player.tm.buyables[1].gte(19) },
				effect(){
					let b=player.tptc_ge.points.add(1).log10();
					if(hasUpgrade("tptc_ge",12))b=b.pow(2);
					if(hasUpgrade("tptc_ge",13))b=b.pow(2);
					return b;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			12: {
				title: "Gear Upgrade 12",
                description: "Gear Upgrade 11's effect ^2",
                cost: new Decimal("1e438"),
                unlocked() { return player.tm.buyables[1].gte(19) },
            },
			13: {
				title: "Gear Upgrade 13",
                description: "Gear Upgrade 11's effect ^2",
                cost: new Decimal("1e470"),
                unlocked() { return player.tm.buyables[1].gte(19) },
            },
		},
});


addLayer("tptc_ma", {
    name: "tptc_ma",
    symbol: "MA",
    position: 2,
    startData() { return {
        unlocked: false,
		points: new Decimal(0)
	}},
	color: "#9f9f9f",
	nodeStyle() {return {
			"background": (player.tptc_ge.unlocked||canReset("tptc_ge"))?("radial-gradient(circle, rgba(112,109,109,1) 0%, rgba(159,159,159,1) 100%)"):"#bf8f8f" ,
        }},
    requires: function(){
		return new Decimal("1e100");
	},
	gainMult(){
		let ret=new Decimal(1);
		if(hasUpgrade("tptc_ge",11))ret=ret.mul(upgradeEffect("tptc_ge",11));
		return ret;
	},
    resource: "machine power",
    baseResource: "hyperspace energy", 
    baseAmount() {return player.tptc_hs.points},
    type: "normal",
    exponent: 0.01,
    row: 6,
    hotkeys: [],
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(19)},
	branches: ["tptc_hs","tptc_i"],
	doReset(l){
			if(l=="tptc_p" || l=="tptc_b" || l=="tptc_g" || l=="tptc_t" || l=="tptc_e" || l=="tptc_s" || l=="tptc_sb" || l=="tptc_sg" || l=="tptc_h" || l=="tptc_q" || l=="tptc_hb" || l=="tptc_ss" || l=="tptc_m" || l=="tptc_ba" || l=="tptc_ps" || l=="tptc_sp" || l=="tptc_l" || l=="tptc_hs" || l=="tptc_i" || l=="tptc_mb" || l=="tptc_ge" || l=="tptc_ma" || !l.startsWith("tptc_")){return;}
			var b=new Decimal(player.tptc_ge.best);
			layerDataReset("tptc_ma",["upgrades","milestones","challenges"]);
			player.tptc_ma.best=b;
		},
	
		upgrades: {
            rows: 1,
            cols: 5,
			11: {
				title: "Machine Power Upgrade 11",
                description: "Mechanical Challenge A's nerf is nerfed by machine power.",
                cost: new Decimal(10),
                unlocked() { return true; },
				effect(){
					if(player.tptc_ma.points.lte(0))return new Decimal(0.01);
					let b=player.tptc_ma.points.add(1).log10().add(1).log10().add(1).log10().add(1).recip();
					return Decimal.sub(1,b).pow(1.2);
				},
                effectDisplay() { return "^0.001 -> ^"+format(this.effect(),3) }, // Add formatting to the effect
            },
			12: {
				title: "Machine Power Upgrade 12",
                description: "Gear gain is boosted by Machine Power.",
                cost: new Decimal(1e4),
                unlocked() { return true; },
				effect(){
					let ret=player.tptc_ma.points.add(1).pow(0.5);
					ret=ret.mul(Decimal.pow(1.0003,player.tptc_ma.points).min(1e20));
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			13: {
				title: "Machine Power Upgrade 13",
                description: "Subspace gain is boosted by Machine Power.",
                cost: new Decimal(5e6),
                unlocked() { return true; },
				effect(){
					let ret=player.tptc_ma.points.add(1).pow(2.5);
					ret=ret.mul(Decimal.pow(1.00002,player.tptc_ma.points).min(1e100));
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
		},
	buyables: {
            rows: 1,
            cols: 3,
            11: {
                title: "Machine 1", // Optional, displayed at the top in a larger font
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Imperium Building is "+format(data.effect)+"x cheaper";
                },
				effect(){
					if(player.tptc_mb.buyables[13].lt(1))return new Decimal(1);
					let x=player.tptc_ma.points.add(1).log10().add(1);
					return x.pow(0.2);
				},
                unlocked() { return player.tptc_mb.buyables[13].gte(1) }, 
                canAfford() {
					return false;
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px','background-color':'#9f9f9f'},
            },
	},
	
	milestones: {
            0: {requirementDescription: "TPTC Level 20",
                done() {return player.tm.buyables[1].gte(20)}, // Used to determine when to give the milestone
                effectDescription: "Gain 1000% of machine power gain per second.",
            },
	},
	passiveGeneration(){
		if(player.tm.buyables[1].gte(20))return 10;
		return 0;
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
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
					if(hasUpgrade("stardust_so",11))ret=ret.pow(2);
					if(hasUpgrade("stardust_n",11))ret=ret.pow(2);
					if(hasUpgrade("stardust_s",31))ret=ret.pow(2);
					if(hasUpgrade("stardust_c",14))ret=ret.pow(2);
					if(hasUpgrade("stardust_c",31))ret=ret.pow(upgradeEffect("stardust_c",31));
					if(hasUpgrade("stardust_s",14))ret=ret.pow(2);
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
					if(hasUpgrade("stardust_s",34))eff=eff.pow(3);
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
		if(hasUpgrade("stardust_c",34))mult = mult.div(upgradeEffect("stardust_c",34));
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
	},
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
		allocation: [0,0,0,0],
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
        }
    },
				clickables: {
        rows: 3,
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
    },
	totalAllocation(){
		return player[this.layer].allocation[0] + player[this.layer].allocation[1] + player[this.layer].allocation[2] + player[this.layer].allocation[3]
	},
	maxAllocation(){
		let base=10;
		if(hasUpgrade("burning_e",11))base=5;
		let ret=Decimal.log(player[this.layer].points.add(base-1),base);
		return Math.floor(ret.min(1e10).toNumber());
	},
	maxAllocationNext(){
		let base=10;
		if(hasUpgrade("burning_e",11))base=5;
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
		tmp[this.layer].effect.mul(Decimal.pow(2,player[this.layer].allocation[3]**layers[this.layer].allocationPower()).sub(1)).div(1e8).add(1).log10().pow(0.5).div(10).add(1)
		];
		return ret;
	},
	allocationPower(){
		let ret=1;
		if(hasUpgrade("burning_e",21))ret=ret+0.3;
		if(hasUpgrade("burning_e",22))ret=ret+0.3;
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
		},
		passiveGeneration(){
			if(hasUpgrade("burning_e",14))return 1;
			return 0;
		}
});


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
		ret=ret.log10().div(6).sqrt().sub(10);
		ret=Decimal.pow(10,ret).mul(layers.incrementy_a.gainMult()).floor();
		return ret;
	},
	getNextAt() {
		let ret=tmp.incrementy_a.getResetGain.plus(1);
		ret=ret.div(layers.incrementy_a.gainMult()).max(1).log10();
		ret=ret.add(10).pow(2).mul(6);
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
			layerDataReset("incrementy_m",["upgrades","milestones","challenges"]);
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
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        mult = new Decimal(1)
		if(hasUpgrade("incrementy_n",24))mult = mult.mul(1.5);
		if(hasUpgrade("incrementy_g",14))mult = mult.mul(upgradeEffect("incrementy_g",14));
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
			layerDataReset("incrementy_m",["upgrades","milestones","challenges"]);
			return;
		},
		
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
						"milestones",
					["display-text",function(){if(hasUpgrade("incrementy_n",23))return "";return "Particle Cap: "+format(tmp.incrementy_p.getResetGainReal.mul(60))+" (based on your incrementy)"}],
					"upgrades"
				],
	 resetsNothing: true,
	passiveGeneration(){
		if(hasUpgrade("incrementy_p",11))return 1;
		return 0;
	},
	
	 upgrades: {
            rows: 2,
            cols: 5,
			11: {
				title: "Particle Upgrade 11",
                description: "Gain 100% of particle gain per second.",
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
		if(hasUpgrade("incrementy_n",11))return 1;
		return 0;
	},
	
	 upgrades: {
            rows: 2,
            cols: 5,
			11: {
				title: "Neutrino Upgrade 11",
                description: "Gain 100% of Neutrino gain per second.",
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
					return Decimal.pow(base,player[this.layer].buyables[this.id].add(layers[this.layer].buyables[this.id].free()));
				},
				free(){
					let ret=player.incrementy_n.buyables[12];
					ret=ret.add(layers.incrementy_n.buyables[12].free());
					ret=ret.add(player.incrementy_n.buyables[21]);
					ret=ret.add(layers.incrementy_n.buyables[21].free());
					if(hasUpgrade("incrementy_p",23))ret=ret.add(player.incrementy_p.upgrades.length||0);
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
		return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.tm.currentTree==5 && player.tm.buyables[5].gte(14);},
		doReset(l){
			if(l=="incrementy_i" || l=="incrementy_am" || l=="incrementy_m" || !l.startsWith("incrementy_")){return;}
			layerDataReset("incrementy_n",["upgrades","milestones","challenges"]);
			return;
		},
		
	 resetsNothing: true,
	passiveGeneration(){
		if(hasUpgrade("incrementy_g",11))return 1;
		return 0;
	},
	
	 upgrades: {
            rows: 3,
            cols: 5,
			11: {
				title: "Gluon Upgrade 11",
                description: "Gain 100% of Gluon gain per second.",
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
		return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.tm.currentTree==5 && player.tm.buyables[5].gte(16);},
		doReset(l){
			if(l=="incrementy_i" || l=="incrementy_am" || l=="incrementy_m" || !l.startsWith("incrementy_")){return;}
			layerDataReset("incrementy_n",["upgrades","milestones","challenges"]);
			return;
		},
		
	 resetsNothing: true,
	passiveGeneration(){
		if(hasUpgrade("incrementy_q",11))return 1;
		return 0;
	},
	
	 upgrades: {
            rows: 2,
            cols: 5,
			11: {
				title: "Quark Upgrade 11",
                description: "Gain 100% of Quark gain per second.",
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
		},
		
        getChallGoalExp(){
                let q = player.incrementy_q.points
                if (q.gt(100)) q = q.log10().times(50)
                if (q.gt(1e4)) q = q.log10().times(2.5).pow(4)
                if (q.gt(1e10)) q = q.log10().pow(10)
                return q.plus(10).log10().plus(9).log10().pow(-1)
        },
});







addLayer("gd_u", {
    name: "gd_u", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "U", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0)
    }},
    color: "#4BDC13",
    requires: new Decimal(5), // Can be a function that takes requirement increases into account
    resource: "updates", // Name of prestige currency
    baseResource: "hours of work", // Name of resource prestige is based on
    baseAmount() {return player.modpoints[6]}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	base: 5,
    exponent: 0.5, // Prestige currency exponent
    resetDescription: "Release new build for ",
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(hasUpgrade("gd_e",11))mult=mult.div(upgradeEffect("gd_e",11));
		mult = mult.div(tmp.gd_f.buyables[14].effect);
		if(hasUpgrade("tptc_p",25))mult=mult.div(upgradeEffect("tptc_p",25));
		return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown(){return player.tm.currentTree==6 && player.tm.buyables[6].gte(1);},
		
		doReset(l){
			if(l=="gd_u" || !l.startsWith("gd_")){return;}
			layerDataReset("gd_u",["upgrades","milestones","challenges"]);
			return;
		},
		
    hotkeys: [
        {key: "u", description: "Press U to release a new build",
			onPress(){if (player.tm.currentTree==6 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==6}}
    ],
	
	 upgrades: {
            rows: 3,
            cols: 5,
			11: {
				title: "Update Upgrade 11",
                description(){
					return "Start developing your own mod. Gain "+format(upgradeEffect("gd_u",11))+" hours of work per second."
				},
                cost: new Decimal(0),
				effect() {
                    let ret = tmp.gd_u.upgrades[11].realEffect;
					if(player.modpoints[6].gte(tmp.gd_u.scstart))ret=ret.div(player.modpoints[6]).mul(tmp.gd_u.scstart);
                    return ret;
				},
				realEffect() {
                    let ret = new Decimal(1);
					if(hasUpgrade("gd_u",12))ret = ret.mul(3);
					if(hasUpgrade("gd_u",14))ret = ret.mul(upgradeEffect("gd_u",14));
					if(hasUpgrade("gd_u",15))ret = ret.mul(upgradeEffect("gd_u",15));
					if(hasUpgrade("gd_e",12))ret = ret.mul(upgradeEffect("gd_e",12));
					if(hasUpgrade("gd_c",11))ret = ret.mul(upgradeEffect("gd_c",11));
					ret = ret.mul(buyableEffect("gd_r",11)[0]);
					ret = ret.mul(buyableEffect("gd_c",11));
					ret = ret.mul(tmp.gd_f.fansEffect);
					if(hasUpgrade("gd_a",11) && hasUpgrade("gd_r",14))ret = ret.mul(tmp.gd_r.effect);
					ret = ret.mul(tmp.gd_a.buyables[12].effect);
                    return ret;
				},
			},
			12: {
				title: "Update Upgrade 12",
                description: "Triple your productivity.",
                cost: new Decimal(1),
			},
			13: {
				title: "Update Upgrade 13",
                description: "Productivity slowdown starts later based on your updates.",
                cost: new Decimal(1),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
                    let ret = new Decimal(3).add(player.gd_u.points.pow(2).mul(4));
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			14: {
				title: "Update Upgrade 14",
                description: "Your experience in other mods inspired yourself. Points boost your productivity.",
                cost: new Decimal(3),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
                    let base=1.005;
                    let ret = Decimal.pow(base,Decimal.log10(player.points.add(1)).pow(0.5));
					if(hasUpgrade("gd_u",22))ret=ret.pow(2);
					if(hasUpgrade("gd_g",11)&&hasUpgrade("gd_f",12))ret=ret.pow(2);
					if(hasUpgrade("gd_u",35))ret=ret.pow(2);
					if(hasUpgrade("gd_g",15)&&hasUpgrade("gd_f",22))ret=ret.pow(2);
                    return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			15: {
				title: "Update Upgrade 15",
                description: "Updates boost your productivity.",
                cost: new Decimal(10),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
                    let ret = new Decimal(3).add(player.gd_u.points.mul(2));
					if(hasUpgrade("gd_a",11)&&hasUpgrade("gd_r",15))ret=ret.pow(2);
					if(hasUpgrade("gd_u",34))ret=ret.pow(2);
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			21: {
				title: "Update Upgrade 21",
                description: "Point gain is boosted based on your hours of work.",
                cost: new Decimal(100),
                unlocked() { return player.tm.buyables[6].gte(2); }, // The upgrade is only visible when this is true
				effect() {
                    let base=1e60;
                    let ret = Decimal.pow(base,Decimal.log10(player.modpoints[6].mul(10).add(1)).pow(0.9));
					if(hasUpgrade("gd_u",25))ret=ret.pow(2);
					if(hasUpgrade("gd_u",33))ret=ret.pow(2);
                    return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			22: {
				title: "Update Upgrade 22",
                description: "Update Upgrade 14 is squared.",
                cost: new Decimal(200),
                unlocked() { return player.tm.buyables[6].gte(2); },
			},
			23: {
				title: "Update Upgrade 23",
                description: "Add Donate link to your mod. Gain 1% of cash gain per second.",
                cost: new Decimal(300),
                unlocked() { return player.tm.buyables[6].gte(2); },
			},
			24: {
				title: "Update Upgrade 24",
                description: "Multiply cash exponent by 1.5",
                cost: new Decimal(400),
                unlocked() { return player.tm.buyables[6].gte(2); },
			},
			25: {
				title: "Update Upgrade 25",
                description: "Update Upgrade 21 is squared.",
                cost: new Decimal(500),
                unlocked() { return player.tm.buyables[6].gte(2); },
			},
			31: {
				title: "Update Upgrade 31",
                description: "Add a donate message to your Discord server. Gain 99% of cash gain per second.",
                cost: new Decimal(1650),
                unlocked() { return player.gd_f.best.gte(4); },
			},
			32: {
				title: "Update Upgrade 32",
                description: "Unlock a Prestige Upgrade in The Prestige Tree Classic.",
                cost: new Decimal(19e4),
                unlocked() { return player.tm.buyables[6].gte(8); },
			},
			33: {
				title: "Update Upgrade 33",
                description: "Update Upgrade 21 is squared.",
                cost: new Decimal(33e4),
                unlocked() { return player.tm.buyables[6].gte(8); },
			},
			34: {
				title: "Update Upgrade 34",
                description: "Update Upgrade 15 is squared.",
                cost: new Decimal(375e3),
                unlocked() { return player.tm.buyables[6].gte(8); },
			},
			35: {
				title: "Update Upgrade 35",
                description: "Update Upgrade 14 is squared.",
                cost: new Decimal(4e5),
                unlocked() { return player.tm.buyables[6].gte(8); },
			},
	 },
	 update(diff){
		if(hasUpgrade("gd_u",11)){
			function f1(p,ss){
				if(p.lte(ss))return p;
				return p.sub(ss).div(ss).add(1).pow(2).sub(1).div(2).mul(ss).add(ss);
			}
			function f2(t,ss){
				if(t.lte(ss))return t;
				return t.sub(ss).div(ss).mul(2).add(1).root(2).sub(1).mul(ss).add(ss);
			}
			if(player.gd_r.best.gte(10)){
				player.modpoints[6]=f2(f1(player.modpoints[6],layers.gd_u.scstart()).add(tmp.gd_u.upgrades[11].realEffect.mul(diff)),layers.gd_u.scstart());
				player.gd_r.refactored=f2(f1(player.gd_r.refactored,layers.gd_u.scstart()).add(tmp.gd_u.upgrades[11].realEffect.mul(diff).mul(tmp.gd_a.buyables[11].effect)),layers.gd_u.scstart());
				player.gd_r.buyables[11]=new Decimal(1);
			}else if(player.gd_r.buyables[11].lt(1))player.modpoints[6]=f2(f1(player.modpoints[6],layers.gd_u.scstart()).add(tmp.gd_u.upgrades[11].realEffect.mul(diff)),layers.gd_u.scstart());
			else player.gd_r.refactored=f2(f1(player.gd_r.refactored,layers.gd_u.scstart()).add(tmp.gd_u.upgrades[11].realEffect.mul(diff).mul(tmp.gd_a.buyables[11].effect)),layers.gd_u.scstart());
		}
	},
	scstart(){
		let ret=new Decimal(1);
		if(hasUpgrade("gd_u",13))ret = ret.mul(upgradeEffect("gd_u",13));
		ret = ret.mul(tmp.gd_e.effect);
		if(hasUpgrade("gd_c",14))ret = ret.mul(10);
		ret = ret.mul(tmp.gd_r.effect);
		ret = ret.mul(tmp.gd_s.buyables[12].effect);
		return ret;
	},
	
	layers(){
		let ret=Decimal.log10(player.gd_u.points.add(1)).pow(1.5).mul(7).floor();
		return ret;
	},
	rows(){
		let ret=Decimal.log10(layers.gd_u.layers().add(1)).pow(1.5).mul(7).floor().min(layers.gd_u.layers());
		return ret;
	},
		canBuyMax() {return hasUpgrade("gd_c",12)},
	 autoPrestige(){
		 return hasUpgrade("gd_c",12);
	 },resetsNothing(){
		 return hasUpgrade("gd_c",12);
	 },
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
                    ["display-text",
                        function() {
							return 'Your TMT mod has ' + formatWhole(tmp.gd_u.layers) + ' layers (based on updates)';
						},
                        {}],
                    ["display-text",
                        function() {
							return 'Your TMT mod has ' + formatWhole(tmp.gd_u.rows) + ' rows (based on layers in your mod)';
						},
                        {}],
						"milestones",
						"upgrades"
				],
});

addLayer("gd_e", {
    name: "gd_e", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0)
    }},
    color: "#FF5642",
    requires: new Decimal(20), // Can be a function that takes requirement increases into account
    resource: "experience", // Name of prestige currency
    baseResource: "updates", // Name of resource prestige is based on
    baseAmount() {return player.gd_u.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent(){
		ret = new Decimal(3)
		if(hasUpgrade("gd_e",15))ret = ret.mul(1.1);
		if(player.gd_r.best.gte(10))ret = ret.mul((buyableEffect("gd_r",11)[1]||new Decimal(1)).max(1));
		if(hasUpgrade("gd_a",11) && hasUpgrade("gd_r",11))ret = ret.mul(upgradeEffect("gd_r",11));
		return ret
	}, // Prestige currency exponent
    resetDescription: "Start Over for ",
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(hasUpgrade("gd_c",13))mult = mult.mul(upgradeEffect("gd_c",13));
		if(hasUpgrade("gd_e",14))mult = mult.mul(upgradeEffect("gd_e",14));
		mult = mult.mul(tmp.gd_f.buyables[13].effect);
		if(player.gd_s.best.gte(10))mult = mult.mul(buyableEffect("gd_s",21));
		if(player.gd_r.best.gte(30))mult = mult.mul((buyableEffect("gd_r",11)[3]||new Decimal(1)).max(1));
		return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
        effect(){
                let ret = player.gd_e.points.add(1).pow(0.75);
				if(player.gd_s.best.gte(1))ret=ret.pow(buyableEffect("gd_s",11));
                return ret
        },
        effectDescription(){
                return "which delays productivity slowdown by " + format(layers.gd_e.effect()) + "x"
        },
    branches: ["gd_u"],
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown(){return player.tm.currentTree==6 && player.tm.buyables[6].gte(2);},
		
		doReset(l){
			if(l=="gd_u" || l=="gd_c" || l=="gd_e" || l=="gd_f" || l=="gd_g" || !l.startsWith("gd_")){return;}
			layerDataReset("gd_e",["upgrades","milestones","challenges"]);
			return;
		},
		
    hotkeys: [
        {key: "e", description: "Press E to scrap your game and start over",
			onPress(){if (player.tm.currentTree==6 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==6}}
    ],
	
	 upgrades: {
            rows: 3,
            cols: 5,
			11: {
				title: "Experience Upgrade 11",
                description: "Updates are cheaper based on your experience.",
                cost: new Decimal(3),
				effect() {
					let ret = player.gd_e.points.add(1).pow(0.5);
					return ret
				},
                effectDisplay() { return "/"+format(this.effect()) }, // Add formatting to the effect
			},
			12: {
				title: "Experience Upgrade 12",
                description: "Productivity is boosted by your experience.",
                cost: new Decimal(400),
				effect() {
					let ret = player.gd_e.points.add(1).pow(0.3);
					if(hasUpgrade("gd_s",12))ret = ret.pow(buyableEffect("gd_s",11));
					return ret
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			13: {
				title: "Experience Upgrade 13",
                description: "Cash gain is boosted by your experience.",
                cost: new Decimal(20000),
				effect() {
					let ret = player.gd_e.points.add(1).pow(0.1);
					if(hasUpgrade("gd_a",11) && hasUpgrade("gd_r",12))ret = ret.pow(2);
					if(hasUpgrade("gd_s",14))ret = ret.pow(1.1);
					if(hasUpgrade("gd_a",12) && hasUpgrade("gd_r",22))ret = ret.pow(1.2);
					return ret
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			14: {
				title: "Experience Upgrade 14",
                description: "Experience gain is boosted by your hours of work.",
                cost: new Decimal(2e5),
				effect() {
					let ret = player.modpoints[6].add(10).log10();
					return ret
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			15: {
				title: "Experience Upgrade 15",
                description: "Experience exponent is multiplied by 1.1.",
                cost: new Decimal(2e7),
			},
	 },
	passiveGeneration(){
		let ret=0;
		if(player.gd_s.best.gte(1))ret=1;
		return ret;
	},
});

addLayer("gd_c", {
    name: "gd_c", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0)
    }},
    color: "#F5A833",
    requires: new Decimal(30), // Can be a function that takes requirement increases into account
    resource: "cash", // Name of prestige currency
    baseResource: "updates", // Name of resource prestige is based on
    baseAmount() {return player.gd_u.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent(){
		ret = new Decimal(1.5)
		if(hasUpgrade("gd_u",24))ret = ret.mul(1.5)
		if(hasUpgrade("gd_g",11) && hasUpgrade("gd_f",11))ret = ret.mul(upgradeEffect("gd_f",11));
		return ret
	}, // Prestige currency exponent
    resetDescription: "Sell mod to publisher for ",
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(100)
		if(hasUpgrade("gd_e",13))mult = mult.mul(upgradeEffect("gd_e",13));
		mult = mult.mul(tmp.gd_f.buyables[12].effect);
		if(hasUpgrade("gd_g",14))mult = mult.mul(upgradeEffect("gd_g",14));
		if(hasUpgrade("gd_g",11) && hasUpgrade("gd_f",14))mult = mult.mul(upgradeEffect("gd_f",14));
		return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    branches: ["gd_u"],
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown(){return player.tm.currentTree==6 && player.tm.buyables[6].gte(2);},
		
		doReset(l){
			if(l=="gd_u" || l=="gd_c" || l=="gd_e" || l=="gd_r" || l=="gd_a" || !l.startsWith("gd_")){return;}
			layerDataReset("gd_c",["upgrades","milestones","challenges"]);
			return;
		},
		
    hotkeys: [
        {key: "c", description: "Press C to sell your mod to a publisher",
			onPress(){if (player.tm.currentTree==6 && canReset(this.layer)) doReset(this.layer)}, unlocked(){return player.tm.currentTree==6}}
    ],
	
	 upgrades: {
            rows: 3,
            cols: 5,
			11: {
				title: "Cash Upgrade 11",
                description: "Purchase a text editor. Productivity is boosted by your cash.",
                cost: new Decimal(50),
				effect() {
					let ret = player.gd_c.points.add(1).pow(0.5);
					return ret
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			12: {
				title: "Cash Upgrade 12",
                description: "Purchase an auto-releaser. Auto-release updates, you can bulk-release updates, and updates resets nothing.",
                cost: new Decimal(400),
			},
			13: {
				title: "Cash Upgrade 13",
                description: "Purchase an online programming lesson. Experience gain is boosted by your cash.",
                cost: new Decimal(20000),
				effect() {
					let ret = player.gd_c.points.add(1).pow(0.1);
					if(hasUpgrade("gd_g",11) && hasUpgrade("gd_f",13))ret = ret.pow(2);
					if(hasUpgrade("gd_s",14))ret = ret.pow(1.1);
					if(hasUpgrade("gd_g",15) && hasUpgrade("gd_f",23))ret = ret.pow(1.2);
					return ret
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			14: {
				title: "Cash Upgrade 14",
                description: "Purchase an expensive IDE. Delay productivity slowdown by 10x.",
                cost: new Decimal(1e6),
			},
			15: {
				title: "Cash Upgrade 15",
                description: "Purchase a hardware upgrader. Unlock a cash buyable.",
                cost: new Decimal(1e8),
			},
	 },
	passiveGeneration(){
		let ret=0;
		if(hasUpgrade("gd_u",23))ret=ret+0.01;
		if(hasUpgrade("gd_u",31))ret=ret+0.99;
		if(hasUpgrade("gd_g",13))ret=ret+upgradeEffect("gd_g",13);
		return ret;
	},
	
	buyables: {
            rows: 1,
            cols: 1,
            11: {
                title: "Upgrade Hardware", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2,x).mul(1e7);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Level: "+player[this.layer].buyables[this.id]+"\n\
					Cost: " + format(data.cost) + " Cash\n\
					Effect: " + format(data.effect) + "x productivity";
                },
                unlocked() { return hasUpgrade("gd_c",15) }, 
                canAfford() {
                    return player.gd_c.points.gte(tmp[this.layer].buyables[this.id].cost)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player.gd_c.points = player.gd_c.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                effect(x=player[this.layer].buyables[this.id]) {
                    let ret = Decimal.pow(2,x);
					if(player.gd_s.best.gte(20))ret=ret.pow(buyableEffect("gd_s",22));
                    return ret
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
	},
	 update(diff){
		 if(player.gd_s.best.gte(20)){
			var target=player.gd_c.points.add(1).div(1e7).log(2).pow(1).add(1).floor();
			if(target.gt(player.gd_c.buyables[11])){
				player.gd_c.buyables[11]=target;
			}
		 }
	 }
});


addLayer("gd_r", {
    name: "gd_r", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		refactored: new Decimal(0),
    }},
    color: "#4CABF5",
    requires: new Decimal(1e7), // Can be a function that takes requirement increases into account
    resource: "refactors", // Name of prestige currency
    baseResource: "experience", // Name of resource prestige is based on
    baseAmount() {return player.gd_e.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	base: 3,
    exponent(){
		ret = new Decimal(1.25)
		return ret
	}, // Prestige currency exponent
    resetDescription: "Re-design your TMT for ",
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(hasMilestone("gd_d",2))mult=mult.div(1e8);
		return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
        effect(){
			let base=new Decimal(5);
			if(player.gd_r.best.gte(20))base = base.add((buyableEffect("gd_r",11)[2]||new Decimal(1)).max(1));
                let ret = Decimal.pow(base,player.gd_r.points);
                return ret
        },
        effectDescription(){
				if(hasUpgrade("gd_a",11) && hasUpgrade("gd_r",14))return "which delays productivity slowdown by " + format(layers.gd_r.effect()) + "x and multiplies productivity by " + format(layers.gd_r.effect()) + "x";
                return "which delays productivity slowdown by " + format(layers.gd_r.effect()) + "x"
        },
    branches: ["gd_e"],
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown(){return player.tm.currentTree==6 && player.tm.buyables[6].gte(3);},
		
		doReset(l){
			if(l=="gd_u" || l=="gd_c" || l=="gd_e" || l=="gd_r" || l=="gd_s" || l=="gd_f" || l=="gd_l" || l=="gd_g" || !l.startsWith("gd_")){return;}
			var b=new Decimal(player.gd_r.best);
			layerDataReset("gd_r",["upgrades","milestones","challenges"]);
			player.gd_r.best=b;
			return;
		},
	milestones: {
            0: {requirementDescription: "10 Refactors",
                done() {return player[this.layer].best.gte(10)}, // Used to determine when to give the milestone
                effectDescription: "Refactoring is permanently enabled. Unlock another effect of refactored work.",
            },
            1: {requirementDescription: "20 Refactors",
                done() {return player[this.layer].best.gte(20)}, // Used to determine when to give the milestone
                effectDescription: "Unlock another effect of refactored work.",
            },
            2: {requirementDescription: "30 Refactors",
                done() {return player[this.layer].best.gte(30)}, // Used to determine when to give the milestone
                effectDescription: "Unlock another effect of refactored work.",
            },
	},
		
		
	buyables: {
            rows: 1,
            cols: 1,
            11: {
                title: "Refactoring", // Optional, displayed at the top in a larger font
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    let ret = "Refactoring is "+(player[this.layer].buyables[11].lt(1)?"disabled":"enabled")+".\n\
					Refactored work: "+formatWhole(player[this.layer].refactored)+" hours of work\n\
					Effect: " + format(data.effect[0]) + "x productivity";
					if(player[this.layer].best.gte(10))ret=ret+"<br>" + format(data.effect[1]) + "x experience exponent";
					if(player[this.layer].best.gte(20))ret=ret+"<br>+" + format(data.effect[2]) + " to refactor base";
					if(player[this.layer].best.gte(30))ret=ret+"<br>" + format(data.effect[3]) + "x experience gain";
						return ret;
                },
                unlocked() { return true; }, 
                canAfford() {
                    return player.gd_r.points.gte(1);
				},
                buy() { 
					if(player[this.layer].buyables[11].lt(1))player[this.layer].buyables[this.id] = new Decimal(1);
                    else player[this.layer].buyables[this.id] = new Decimal(0)
                },
				effect(){
					let ret=player[this.layer].refactored.add(10).log10().pow(player.gd_r.points.mul(0.1).add(1));
					let ret2=player[this.layer].refactored.add(10).log10().add(1).log10().add(1).log10().mul(0.5).add(1);
					let ret3=player[this.layer].refactored.add(10).log10();
					let ret4=player[this.layer].refactored.add(10).log10().pow(player.gd_r.points.mul(0.1).add(1).mul(0.3));
					return [ret, ret2, ret3, ret4];
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
	},
		canBuyMax() {return hasMilestone("gd_a",0)},
	 autoPrestige(){
		 return hasMilestone("gd_a",0);
	 },resetsNothing(){
		 return hasMilestone("gd_a",0);
	 },
	 
	 
	 upgrades: {
            rows: 2,
            cols: 5,
			11: {
				title: "Refactor Upgrade 11",
                description: "Refactors boost experience exponent.",
                cost: new Decimal(24),
				effect() {
					let ret = player.gd_r.points.add(1).log10().add(1).log10().mul(0.5).add(1);
					if(hasUpgrade("gd_a",12) && hasUpgrade("gd_r",21))ret=ret.pow(2);
					return ret
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
				unlocked(){return hasUpgrade("gd_a",11);}
			},
			12: {
				title: "Refactor Upgrade 12",
                description: "Experience Upgrade 13 is squared.",
                cost: new Decimal(26),
				unlocked(){return hasUpgrade("gd_a",11);}
			},
			13: {
				title: "Refactor Upgrade 13",
                description: "Unlock an API buyable.",
                cost: new Decimal(32),
				unlocked(){return hasUpgrade("gd_a",11);}
			},
			14: {
				title: "Refactor Upgrade 14",
                description: "Refactor effect boost productivity.",
                cost: new Decimal(36),
				unlocked(){return hasUpgrade("gd_a",11);}
			},
			15: {
				title: "Refactor Upgrade 15",
                description: "Update Upgrade 15 is squared.",
                cost: new Decimal(40),
				unlocked(){return hasUpgrade("gd_a",11);}
			},
			21: {
				title: "Refactor Upgrade 21",
                description: "Refactor Upgrade 11 is squared.",
                cost: new Decimal(75),
				unlocked(){return hasUpgrade("gd_a",12);}
			},
			22: {
				title: "Refactor Upgrade 22",
                description: "Experience Upgrade 13's effect ^1.2",
                cost: new Decimal(85),
				unlocked(){return hasUpgrade("gd_a",12);}
			},
			23: {
				title: "Refactor Upgrade 23",
                description: "Unlock an API buyable.",
                cost: new Decimal(105),
				unlocked(){return hasUpgrade("gd_a",12);}
			},
			24: {
				title: "Refactor Upgrade 24",
                description: "Endpoints are cheaper.",
                cost: new Decimal(125),
				unlocked(){return hasUpgrade("gd_a",12);}
			},
	 },
});

addLayer("gd_f", {
    name: "gd_f", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "F", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		best: new Decimal(0),
		fans: new Decimal(1),
    }},
    color: "#F564E7",
    requires: new Decimal(1e7), // Can be a function that takes requirement increases into account
    resource: "fame", // Name of prestige currency
    baseResource: "cash", // Name of resource prestige is based on
    baseAmount() {return player.gd_c.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	base: 4,
    exponent(){
		ret = new Decimal(1.25)
		return ret
	}, // Prestige currency exponent
    resetDescription: "Elevate your social status by ",
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
        effect(){
                let ret = Decimal.pow(5,player.gd_r.points);
                return ret
        },
    branches: ["gd_c"],
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown(){return player.tm.currentTree==6 && player.tm.buyables[6].gte(4);},
		
		doReset(l){
			if(l=="gd_u" || l=="gd_c" || l=="gd_e" || l=="gd_r" || l=="gd_s" || l=="gd_f" || l=="gd_a" || l=="gd_t" || !l.startsWith("gd_")){return;}
			layerDataReset("gd_f",["upgrades","milestones","challenges"]);
			return;
		},
		
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
                    ["display-text",
                        function() {
							return 'You have ' + format(player.gd_f.fans) + ' fans, which are boosting your productivity by ' + format(tmp.gd_f.fansEffect);
						},
                        {}],
                    ["display-text",
                        function() {
							return 'Fans are capped by your points.';
						},
                        {}],
                    ["display-text",
                        function() {
							return 'Your best fame are multiplying your fans by ' + format(tmp.gd_f.fansGain) + ' per second';
						},
                        {}],
						"milestones",
						"buyables",
						"upgrades"
				],
		
		fansGain(){
			let ret=new Decimal(1.02).pow(player.gd_f.best);
			ret=ret.pow(tmp.gd_f.buyables[11].effect);
			ret=ret.pow(layers.gd_g.effect()[0]);
			return ret;
		},
		fansEffect(){
			let ret=player.gd_f.fans.add(9).log10();
			if(hasUpgrade("gd_f",15))ret=ret.add(layers.gd_f.fansGain().pow(0.01).add(9).log10());
			if(hasUpgrade("gd_g",12))ret=ret.pow(layers.gd_g.effect()[1]);
			return ret;
		},
	buyables: {
            rows: 1,
            cols: 5,
            11: {
                title: "Discord", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					let cost=x.add(1);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Fans boost its gain speed.\n\
					Accounts: "+formatWhole(player[this.layer].buyables[this.id])+"\n\
					Cost: "+formatWhole(data.cost)+" fame\n\
					Effect: " + format(data.effect) + "x fans gain speed";
                },
                unlocked() { return true; }, 
                canAfford() {
                    return player.gd_f.points.gte(tmp[this.layer].buyables[this.id].cost)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player.gd_f.points = player.gd_f.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				effect(){
					return player.gd_f.fans.add(9).log10().pow(player[this.layer].buyables[this.id].sqrt().mul(0.1)).pow(layers.gd_g.effect()[1]);
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            12: {
                title: "Patreon", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					let cost=x.mul(2).add(2);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Fans boost cash gain.\n\
					Accounts: "+formatWhole(player[this.layer].buyables[this.id])+"\n\
					Cost: "+formatWhole(data.cost)+" fame\n\
					Effect: " + format(data.effect) + "x cash gain";
                },
                unlocked() { return true; }, 
                canAfford() {
                    return player.gd_f.points.gte(tmp[this.layer].buyables[this.id].cost)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player.gd_f.points = player.gd_f.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				effect(){
					return player.gd_f.fans.add(9).log10().pow(player[this.layer].buyables[this.id].sqrt().mul(0.4)).pow(layers.gd_g.effect()[1]);
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            13: {
                title: "Twitch", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					let cost=x.mul(2).add(3);
					if(player.gd_g.best.gte(4))cost=x.mul(2).add(2);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Fans boost experience gain.\n\
					Accounts: "+formatWhole(player[this.layer].buyables[this.id])+"\n\
					Cost: "+formatWhole(data.cost)+" fame\n\
					Effect: " + format(data.effect) + "x experience gain";
                },
                unlocked() { return true; }, 
                canAfford() {
                    return player.gd_f.points.gte(tmp[this.layer].buyables[this.id].cost)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player.gd_f.points = player.gd_f.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				effect(){
					return player.gd_f.fans.add(9).log10().pow(player[this.layer].buyables[this.id].sqrt().mul(0.25)).pow(layers.gd_g.effect()[1]);
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            14: {
                title: "Github", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					let cost=x.mul(3).add(4);
					if(player.gd_g.best.gte(4))cost=x.mul(3).add(3);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Updates are cheaper based on your fans.\n\
					Accounts: "+formatWhole(player[this.layer].buyables[this.id])+"\n\
					Cost: "+formatWhole(data.cost)+" fame\n\
					Effect:  Update requirement /" + format(data.effect) + "";
                },
                unlocked() { return true; }, 
                canAfford() {
                    return player.gd_f.points.gte(tmp[this.layer].buyables[this.id].cost)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player.gd_f.points = player.gd_f.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				effect(){
					return player.gd_f.fans.add(9).log10().pow(player[this.layer].buyables[this.id].sqrt().mul(0.3)).pow(layers.gd_g.effect()[1]);
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            15: {
                title: "Point Boost", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					let cost=Decimal.pow(1.2,x).mul(10).ceil();
					if(player.gd_g.best.gte(4))cost=Decimal.pow(1.15,x).mul(5).ceil();
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Point gain is boosted based on your fans.\n\
					Level: "+formatWhole(player[this.layer].buyables[this.id])+"\n\
					Cost: "+formatWhole(data.cost)+" fame\n\
					Effect:  Point gain is multiplied by " + format(data.effect) + "";
                },
                unlocked() { return true; }, 
                canAfford() {
                    return player.gd_f.points.gte(tmp[this.layer].buyables[this.id].cost)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player.gd_f.points = player.gd_f.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				effect(){
					let base=10;
                    let ret = Decimal.pow(base,Decimal.log10(player.gd_f.fans.add(10)).pow(0.55));
                    //if (ret.gte("1e20000000")) ret = ret.sqrt().times("1e10000000")
                    return ret.pow(player[this.layer].buyables[this.id].pow(0.9)).pow(layers.gd_g.effect()[1]);
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
	},
	 update(diff){
		player.gd_f.fans=player.gd_f.fans.mul(tmp.gd_f.fansGain.pow(diff)).min(player.points).max(player.gd_f.fans);
		if(player.gd_g.points.gte(4)){
			player.gd_f.buyables[11]=player.gd_f.buyables[11].max(player.gd_f.points);
			player.gd_f.buyables[12]=player.gd_f.buyables[12].max(player.gd_f.points.div(2).floor());
			player.gd_f.buyables[13]=player.gd_f.buyables[13].max(player.gd_f.points.div(2).floor());
			player.gd_f.buyables[14]=player.gd_f.buyables[14].max(player.gd_f.points.div(3).floor());
			player.gd_f.buyables[15]=player.gd_f.buyables[15].max(player.gd_f.points.max(1).div(5).log(1.15).add(1).floor());
		}
	},
	 
	 upgrades: {
            rows: 3,
            cols: 5,
			11: {
				title: "Fame Upgrade 11",
                description: "Fame boost cash exponent.",
                cost: new Decimal(8),
				effect() {
					let ret = player.gd_f.points.add(1).log10().add(1).log10().mul(0.5).add(1);
					if(hasUpgrade("gd_g",15) && hasUpgrade("gd_f",21))ret=ret.pow(2);
					return ret
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
				unlocked(){return hasUpgrade("gd_g",11);}
			},
			12: {
				title: "Fame Upgrade 12",
                description: "Update Upgrade 14 is squared.",
                cost: new Decimal(16),
				unlocked(){return hasUpgrade("gd_g",11);}
			},
			13: {
				title: "Fame Upgrade 13",
                description: "Cash Upgrade 13 is squared.",
                cost: new Decimal(24),
				unlocked(){return hasUpgrade("gd_g",11);}
			},
			14: {
				title: "Fame Upgrade 14",
                description: "Cash gain is boosted by your fame.",
                cost: new Decimal(28),
				effect() {
					let ret = Decimal.pow(1.15,player.gd_f.points);
					if(hasUpgrade("gd_g",15) && hasUpgrade("gd_f",24))ret=ret.pow(5);
					return ret
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
				unlocked(){return hasUpgrade("gd_g",11);}
			},
			15: {
				title: "Fame Upgrade 15",
                description: "Boost fans effect based on fans gaining speed.",
                cost: new Decimal(32),
				unlocked(){return hasUpgrade("gd_g",11);}
			},
			21: {
				title: "Fame Upgrade 21",
                description: "Fame Upgrade 11 is squared.",
                cost: new Decimal(50),
				unlocked(){return hasUpgrade("gd_g",15);}
			},
			22: {
				title: "Fame Upgrade 22",
                description: "Update Upgrade 14 is squared.",
                cost: new Decimal(60),
				unlocked(){return hasUpgrade("gd_g",15);}
			},
			23: {
				title: "Fame Upgrade 23",
                description: "Cash Upgrade 13's effect ^1.2",
                cost: new Decimal(72),
				unlocked(){return hasUpgrade("gd_g",15);}
			},
			24: {
				title: "Fame Upgrade 24",
                description: "Fame Upgrade 14's effect ^5",
                cost: new Decimal(80),
				unlocked(){return hasUpgrade("gd_g",15);}
			},
	 },
	milestones: {
            0: {requirementDescription: "4 Fame",
                done() {return player[this.layer].best.gte(4)}, // Used to determine when to give the milestone
                effectDescription: "You can buy max fame, fame doesn't reset anything, and unlock an update upgrade.",
            },
	},
		canBuyMax() {return hasMilestone("gd_f",0)},
	 autoPrestige(){
		 return hasMilestone("gd_g",0);
	 },resetsNothing(){
		 return hasMilestone("gd_f",0);
	 },
});


addLayer("gd_s", {
    name: "gd_s", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#917567",
    requires: new Decimal(1e9), // Can be a function that takes requirement increases into account
    resource: "enrollments", // Name of prestige currency
    baseResource: "experience", // Name of resource prestige is based on
    baseAmount() {return player.gd_e.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	base: 10,
    exponent(){
		ret = new Decimal(1.25)
		return ret
	}, // Prestige currency exponent
    resetDescription: "Apply to another college for ",
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    branches: ["gd_e","gd_c"],
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown(){return player.tm.currentTree==6 && player.tm.buyables[6].gte(5);},
		
		doReset(l){
			if(l=="gd_u" || l=="gd_c" || l=="gd_e" || l=="gd_r" || l=="gd_s" || l=="gd_f" || l=="gd_a" || l=="gd_g" || !l.startsWith("gd_")){return;}
			var b=new Decimal(player.gd_s.best);
			layerDataReset("gd_s",["upgrades","milestones","challenges"]);
			player.gd_s.best=b;
			return;
		},
		
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
						"milestones",
						"buyables",
						"upgrades",
				],
		
	milestones: {
            0: {requirementDescription: "1 Enrollments",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Unlock a class. Gain 100% of experience gain per second.",
            },
            1: {requirementDescription: "4 Enrollments",
                done() {return player[this.layer].best.gte(4)}, // Used to determine when to give the milestone
                effectDescription: "Unlock a class.",
            },
            2: {requirementDescription: "10 Enrollments",
                done() {return player[this.layer].best.gte(10)}, // Used to determine when to give the milestone
                effectDescription: "Unlock a class.",
            },
            3: {requirementDescription: "20 Enrollments",
                done() {return player[this.layer].best.gte(20)}, // Used to determine when to give the milestone
                effectDescription: "Unlock a class. Auto-Upgrade Hardware.",
            },
	},
	buyables: {
            rows: 2,
            cols: 2,
            11: {
                title: "CS 1337 Computer Science", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					let cost=Decimal.pow(2,x.pow(1.2)).mul(1e8);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Boost experience effect.\n\
					Classes: "+formatWhole(player[this.layer].buyables[this.id])+(player.gd_d.best.gt(0)?("+"+formatWhole(layers.gd_d.effect())):"")+"\n\
					Cost: "+formatWhole(data.cost)+" cash\n\
					Effect: ^" + format(data.effect)+" (Boosted by your enrollments)";
                },
                unlocked() { return player.gd_s.best.gte(1); }, 
                canAfford() {
                    return player.gd_c.points.gte(tmp[this.layer].buyables[this.id].cost)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player.gd_c.points = player.gd_c.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				effect(){
					return player.gd_s.buyables[11].add(layers.gd_d.effect()).mul(player.gd_s.points.mul(0.1).add(1)).pow(0.5).mul(0.1).add(1);
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            12: {
                title: "CS 2305 Discrete Math", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					let cost=Decimal.pow(5,x.pow(1.2)).mul(1e8);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Delay productivity slowdown.\n\
					Classes: "+formatWhole(player[this.layer].buyables[this.id])+(player.gd_d.best.gt(0)?("+"+formatWhole(layers.gd_d.effect())):"")+"\n\
					Cost: "+formatWhole(data.cost)+" cash\n\
					Effect: " + format(data.effect)+"x (Boosted by your enrollments)";
                },
                unlocked() { return player.gd_s.best.gte(4); }, 
                canAfford() {
                    return player.gd_c.points.gte(tmp[this.layer].buyables[this.id].cost)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player.gd_c.points = player.gd_c.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				effect(){
					let ret=Decimal.pow(1.5,player.gd_s.buyables[12].add(layers.gd_d.effect()).mul(player.gd_s.points.mul(0.1).add(1)));
					if(hasUpgrade("gd_s",15))ret=ret.pow(2);
					return ret;
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            21: {
                title: "CS 3354 Software Engineering", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					let cost=Decimal.pow(10,x.pow(1.2)).mul(1e15);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Multiply experience gain.\n\
					Classes: "+formatWhole(player[this.layer].buyables[this.id])+(player.gd_d.best.gt(0)?("+"+formatWhole(data.free)):"")+"\n\
					Cost: "+formatWhole(data.cost)+" cash\n\
					Effect: " + format(data.effect)+"x (Boosted by your enrollments)";
                },
                unlocked() { return player.gd_s.best.gte(10); }, 
                canAfford() {
                    return player.gd_c.points.gte(tmp[this.layer].buyables[this.id].cost)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player.gd_c.points = player.gd_c.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				effect(){
					let ret=Decimal.pow(1.5,player.gd_s.buyables[21].add(layers.gd_s.buyables[21].free()).mul(player.gd_s.points.mul(0.1).add(1)));
					if(ret.gte(1e200))ret=ret.log10().div(2).pow(100);
					return ret;
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
				free(){
					let ret=layers.gd_d.effect();
					if(hasUpgrade("gd_s",11))ret=ret.add(10);
					return ret;
				},
            },
            22: {
                title: "CS 4352 Human Computer Interactions", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					let cost=Decimal.pow(1e4,x.pow(1.5)).mul(1e40);
					if(hasUpgrade("gd_s",13))cost=Decimal.pow(100,x.pow(1.2)).mul(1e20);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Boost the effect of upgrading hardware.\n\
					Classes: "+formatWhole(player[this.layer].buyables[this.id])+(player.gd_d.best.gt(0)?("+"+formatWhole(layers.gd_d.effect())):"")+"\n\
					Cost: "+formatWhole(data.cost)+" cash\n\
					Effect: ^" + format(data.effect)+" (Boosted by your enrollments)";
                },
                unlocked() { return player.gd_s.best.gte(20); }, 
                canAfford() {
                    return player.gd_c.points.gte(tmp[this.layer].buyables[this.id].cost)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player.gd_c.points = player.gd_c.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				effect(){
					return player.gd_s.buyables[22].add(layers.gd_d.effect()).mul(player.gd_s.points.mul(0.1).add(1)).pow(0.5).mul(0.05).add(1);
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
	},
		canBuyMax() {return hasMilestone("gd_d",0)},
	 autoPrestige(){
		 return hasMilestone("gd_d",0);
	 },resetsNothing(){
		 return hasMilestone("gd_d",0);
	 },
		upgrades: {
            rows: 1,
            cols: 5,
			11: {
				title: "Enrollment Upgrade 11",
                description: "Add 10 free levels to 'CS 3354 Software Engineering'.",
                cost: new Decimal(28),
                unlocked() { return player.tm.buyables[6].gte(9); }, // The upgrade is only visible when this is true
            },
			12: {
				title: "Enrollment Upgrade 12",
                description: "'CS 1337 Computer Science' boost Experience Upgrade 12.",
                cost: new Decimal(32),
                unlocked() { return player.tm.buyables[6].gte(9); }, // The upgrade is only visible when this is true
            },
			13: {
				title: "Enrollment Upgrade 13",
                description: "'CS 4352 Human Computer Interactions' is cheaper.",
                cost: new Decimal(34),
                unlocked() { return player.tm.buyables[6].gte(9); }, // The upgrade is only visible when this is true
            },
			14: {
				title: "Enrollment Upgrade 14",
                description: "Effects of Experience Upgrade 13 and Cash Upgrade 13 ^1.1",
                cost: new Decimal(35),
                unlocked() { return player.tm.buyables[6].gte(9); }, // The upgrade is only visible when this is true
            },
			15: {
				title: "Enrollment Upgrade 15",
                description: "Effect of 'CS 2305 Discrete Math' is squared.",
                cost: new Decimal(36),
                unlocked() { return player.tm.buyables[6].gte(9); }, // The upgrade is only visible when this is true
            },
		},
	 update(diff){
		if(player.gd_d.points.gte(2)){
			player.gd_s.buyables[11]=player.gd_s.buyables[11].max(player.gd_c.points.div(1e8).add(1).log(2).pow(1/1.2).add(1).floor());
			player.gd_s.buyables[12]=player.gd_s.buyables[12].max(player.gd_c.points.div(1e8).add(1).log(5).pow(1/1.2).add(1).floor());
			player.gd_s.buyables[21]=player.gd_s.buyables[21].max(player.gd_c.points.div(1e15).add(1).log(10).pow(1/1.2).add(1).floor());
			player.gd_s.buyables[22]=player.gd_s.buyables[22].max(player.gd_c.points.div(1e40).add(1).log(1e4).pow(1/1.5).add(1).floor());
			if(hasUpgrade("gd_s",13))player.gd_s.buyables[22]=player.gd_s.buyables[22].max(player.gd_c.points.div(1e20).add(1).log(100).pow(1/1.2).add(1).floor());
		}
	},
});


addLayer("gd_g", {
    name: "gd_g", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		unused: new Decimal(0),
    }},
    color: "#156B25",
    requires: new Decimal(6), // Can be a function that takes requirement increases into account
    resource: "good will", // Name of prestige currency
    baseResource: "fame", // Name of resource prestige is based on
    baseAmount() {return player.gd_f.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	base: 1.5,
    exponent(){
		ret = new Decimal(1.25)
		return ret
	}, // Prestige currency exponent
	roundUpCost: true,
        effect(){
				if(inChallenge("gd_d",11)||inChallenge("gd_d",21)||inChallenge("gd_d",22))return [new Decimal(1), new Decimal(1)];
                let ret = player.gd_g.points.mul(3).add(1).mul(player.gd_f.best.pow(player.gd_g.points.pow(0.3).mul(0.5))).max(1);
                let ret2 = player.gd_g.points.pow(0.3).mul(0.5).add(1);
                return [ret, ret2];
        },
        effectDescription(){
                return "which are multiplying your fans gain speed by " + format(layers.gd_g.effect()[0]) + "x (based on your best fame)"
        },
    resetDescription: "Get acknowledged as trustworthy by your fans for ",
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    branches: ["gd_f"],
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown(){return player.tm.currentTree==6 && player.tm.buyables[6].gte(6);},
		
		doReset(l){
			if(l=="gd_u" || l=="gd_c" || l=="gd_e" || l=="gd_r" || l=="gd_s" || l=="gd_f" || l=="gd_a" || l=="gd_t" || l=="gd_d" || l=="gd_l" || l=="gd_g" || !l.startsWith("gd_")){return;}
			var b=new Decimal(player.gd_g.best);
			layerDataReset("gd_g",["upgrades","milestones","challenges"]);
			player.gd_g.best=b;
			return;
		},
		
	 tabFormat: ["main-display",
                    ["display-text",
                        function() {
							return 'Your good will are raising fame buyable effects to the power of '+format(layers.gd_g.effect()[1]);
						},
                        {}],
                    "prestige-button", "resource-display",
						"milestones",
                    ["blank", "5px"],
					["display-text",function(){return "Good Will Remaining: "+formatWhole(player.gd_g.unused)+"/"+formatWhole(player.gd_g.points)}],
                    ["blank", "5px"],
					["buyable",1],
						"upgrades"
				],
			
		usedGW(){
			var ret=new Decimal(0);
			for(var i in player.gd_g.upgrades){
				ret=tmp.gd_g.upgrades[player.gd_g.upgrades[i]].cost.add(ret);
			}
			return ret;
		},
		update(diff){
			player.gd_g.unused=player.gd_g.points.sub(layers.gd_g.usedGW());
		},
		
		buyables: {
            1: {
                title: "Respec Good Will Upgrades",
                display: "",
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
					return true;
				},
                buy() { 
					if(confirm("This will force a Good Will reset! Are you sure?")){
						player[this.layer].upgrades=[];
						doReset(this.layer,true);
					}
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'60px'},
            },
		},
		upgrades: {
            rows: 1,
            cols: 5,
			11: {
				title: "Good Will Upgrade 11",
                description: "Unlock fame upgrades.",
                cost: new Decimal(1),
				currencyDisplayName: "unused good will",
				currencyInternalName: "unused",
				currencyLayer: "gd_g",
                unlocked() { return player[this.layer].best.gte(1); }, // The upgrade is only visible when this is true
            },
			12: {
				title: "Good Will Upgrade 12",
                description: "Second good will effect also affects fans effect.",
                cost: new Decimal(1),
				currencyDisplayName: "unused good will",
				currencyInternalName: "unused",
				currencyLayer: "gd_g",
				effect() {
					let ret = tmp.gd_g.effect[1];
					return ret
				},
                effectDisplay() { return "^"+format(this.effect()) }, // Add formatting to the effect
                unlocked() { return player[this.layer].best.gte(1); }, // The upgrade is only visible when this is true
            },
			13: {
				title: "Good Will Upgrade 13",
                description(){
					return "More Good Will = More Donation. Gain "+format(upgradeEffect("gd_g",13)*100)+"% of cash gain per second.";
				},
                cost: new Decimal(1),
				currencyDisplayName: "unused good will",
				currencyInternalName: "unused",
				currencyLayer: "gd_g",
				effect() {
					if(inChallenge("gd_d",11)||inChallenge("gd_d",21)||inChallenge("gd_d",22))return 0;
					if(player.gd_g.points.lte(0))return 0;
					if(player.gd_g.points.gte(100))return 1e10;
					let ret = player.gd_g.points.mul(5).mul(Decimal.pow(1.5,player.gd_g.points)).recip().add(1e-10).recip().toNumber();
					return ret;
				},
                unlocked() { return player[this.layer].best.gte(1); }, // The upgrade is only visible when this is true
            },
			14: {
				title: "Good Will Upgrade 14",
                description: "First good will effect also affects cash gain.",
                cost: new Decimal(1),
				currencyDisplayName: "unused good will",
				currencyInternalName: "unused",
				currencyLayer: "gd_g",
				effect() {
					let ret = tmp.gd_g.effect[0];
					return ret
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
                unlocked() { return player[this.layer].best.gte(1); }, // The upgrade is only visible when this is true
            },
			15: {
				title: "Good Will Upgrade 15",
                description: "Unlock a new row of fame upgrades.",
                cost: new Decimal(1),
				currencyDisplayName: "unused good will",
				currencyInternalName: "unused",
				currencyLayer: "gd_g",
                unlocked() { return hasUpgrade("gd_g",11) && player.gd_d.challenges[12]; }, // The upgrade is only visible when this is true
            },
		},
	milestones: {
            0: {requirementDescription: "3 good will",
                done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy fame.",
            },
            1: {requirementDescription: "4 good will",
                done() {return player[this.layer].best.gte(4)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy fame buyables, fame buyables are cheaper.",
            },
	},
});


addLayer("gd_a", {
    name: "gd_a", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		unused: new Decimal(0),
    }},
    color: "#AADB60",
    requires: new Decimal(20), // Can be a function that takes requirement increases into account
    resource: "endpoints", // Name of prestige currency
    baseResource: "refactors", // Name of resource prestige is based on
    baseAmount() {return player.gd_r.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	base(){
		ret = new Decimal(1.5)
		if(hasUpgrade("gd_a",12) && hasUpgrade("gd_r",24))ret = new Decimal(1.2)
		return ret
	},
    exponent(){
		ret = new Decimal(1.1)
		return ret
	}, // Prestige currency exponent
	roundUpCost: true,
    resetDescription: "Design ",
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    branches: ["gd_r"],
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown(){return player.tm.currentTree==6 && player.tm.buyables[6].gte(7);},
		
		doReset(l){
			if(l=="gd_u" || l=="gd_c" || l=="gd_e" || l=="gd_r" || l=="gd_s" || l=="gd_f" || l=="gd_a" || l=="gd_t" || l=="gd_d" || l=="gd_l" || l=="gd_g" || !l.startsWith("gd_")){return;}
			var b=new Decimal(player.gd_g.best);
			layerDataReset("gd_g",["upgrades","milestones","challenges"]);
			player.gd_g.best=b;
			return;
		},
		
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
						"milestones",
                    ["blank", "5px"],
					["display-text",function(){return "Endpoints Remaining: "+formatWhole(player.gd_a.unused)+"/"+formatWhole(player.gd_a.points)}],
                    ["blank", "5px"],
					["buyable",1],
						"buyables",
						"upgrades"
				],
			
		usedEndpoints(){
			var ret=new Decimal(0);
			for(var i in player.gd_a.upgrades){
				ret=tmp.gd_a.upgrades[player.gd_a.upgrades[i]].cost.add(ret);
			}
			for(var i in player.gd_a.buyables){
				if(i!=1)ret=player.gd_a.buyables[i].add(ret);
			}
			return ret;
		},
		update(diff){
			player.gd_a.unused=player.gd_a.points.sub(layers.gd_a.usedEndpoints());
		},
		upgrades: {
            rows: 1,
            cols: 4,
			11: {
				title: "API Upgrade 11",
                description: "Unlock refactor upgrades.",
                cost: new Decimal(1),
				currencyDisplayName: "unused endpoints",
				currencyInternalName: "unused",
				currencyLayer: "gd_a",
                unlocked() { return player[this.layer].best.gte(1); }, // The upgrade is only visible when this is true
            },
			12: {
				title: "API Upgrade 12",
                description: "Unlock a new row of refactor upgrades.",
                cost: new Decimal(1),
				currencyDisplayName: "unused endpoints",
				currencyInternalName: "unused",
				currencyLayer: "gd_a",
                unlocked() { return hasUpgrade("gd_a",11) && player.gd_d.challenges[11]; }, // The upgrade is only visible when this is true
            },
		},
	milestones: {
            0: {requirementDescription: "1 Endpoints",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy refactors, you can buy max refactors, refactors doesn't reset anything.",
            },
	},
	
	buyables: {
            1: {
                title: "Re-design API",
                display: "",
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
					return true;
				},
                buy() { 
					if(confirm("This will force an API reset! Are you sure?")){
						player[this.layer].upgrades=[];
						player[this.layer].buyables={11:new Decimal(0),12:new Decimal(0)};
						doReset(this.layer,true);
					}
                },
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'60px'},
            },
            rows: 2,
            cols: 2,
            11: {
                title: "/refactoring/boost", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					let cost=new Decimal(1);
                    return cost
                },
				req(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					let cost=Decimal.pow(4,x).mul(3e4);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Boost refactored work gain.\n\
					Endpoints: "+formatWhole(player[this.layer].buyables[this.id])+"\n\
					Cost: "+formatWhole(data.cost)+" unused endpoints\n\
					Req: "+formatWhole(data.req)+" updates\n\
					Effect: " + format(data.effect)+"x (Boosted by your total endpoints)";
                },
                unlocked() { return hasUpgrade("gd_a",11) && hasUpgrade("gd_r",13); }, 
                canAfford() {
                    return player.gd_a.unused.gte(tmp[this.layer].buyables[this.id].cost) && player.gd_u.points.gte(tmp[this.layer].buyables[this.id].req)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				effect(){
					if(inChallenge("gd_d",12)||inChallenge("gd_d",21)||inChallenge("gd_d",22))return new Decimal(1);
					return Decimal.pow(1e5,player.gd_a.buyables[11].mul(player.gd_a.points.mul(0.1).add(1)).pow(0.5));
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            12: {
                title: "/productivity/boost", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					let cost=new Decimal(1);
                    return cost
                },
				req(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					let cost=Decimal.pow(4,x).mul(3e4);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Boost productivity.\n\
					Endpoints: "+formatWhole(player[this.layer].buyables[this.id])+"\n\
					Cost: "+formatWhole(data.cost)+" unused endpoints\n\
					Req: "+formatWhole(data.req)+" updates\n\
					Effect: " + format(data.effect)+"x (Boosted by your total endpoints)";
                },
                unlocked() { return hasUpgrade("gd_a",12) && hasUpgrade("gd_r",23); }, 
                canAfford() {
                    return player.gd_a.unused.gte(tmp[this.layer].buyables[this.id].cost) && player.gd_u.points.gte(tmp[this.layer].buyables[this.id].req)
				},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				effect(){
					if(inChallenge("gd_d",12)||inChallenge("gd_d",21)||inChallenge("gd_d",22))return new Decimal(1);
					return Decimal.pow(1e5,player.gd_a.buyables[12].mul(player.gd_a.points.mul(0.1).add(1)).pow(0.5));
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
	},
});



addLayer("gd_d", {
    name: "gd_d", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		unused: new Decimal(0),
    }},
    color: "#6212FA",
    requires: new Decimal(25), // Can be a function that takes requirement increases into account
    resource: "diplomas", // Name of prestige currency
    baseResource: "enrollments", // Name of resource prestige is based on
    baseAmount() {return player.gd_s.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	base: 1.2,
    exponent(){
		ret = new Decimal(1.1)
		return ret
	}, // Prestige currency exponent
	roundUpCost: true,
    resetDescription: "Graduate for ",
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    branches: ["gd_r","gd_s","gd_f"],
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown(){return player.tm.currentTree==6 && player.tm.buyables[6].gte(8);},
		
		doReset(l){
			if(l=="gd_u" || l=="gd_c" || l=="gd_e" || l=="gd_r" || l=="gd_s" || l=="gd_f" || l=="gd_a" || l=="gd_t" || l=="gd_d" || l=="gd_l" || l=="gd_g" || !l.startsWith("gd_")){return;}
			var b=new Decimal(player.gd_g.best);
			layerDataReset("gd_g",["upgrades","milestones","challenges"]);
			player.gd_g.best=b;
			return;
		},
		
	milestones: {
            0: {requirementDescription: "1 diploma",
                done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy enrollments, you can buy max enrollments, enrollments doesn't reset anything.",
            },
			1: {requirementDescription: "2 diplomas",
                done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy classes (enrollment buyables).",
            },
			2: {requirementDescription: "3 diplomas",
                done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
                effectDescription: "Refactors are 1e8x cheaper.",
            }
	},
        effect(){
                let ret = player.gd_d.points.mul(player.gd_d.points.div(2).add(3)).floor();
				return ret;
        },
        effectDescription(){
                return "which are adding " + format(layers.gd_d.effect()) + " free levels to each class.";
        },
	
    challenges: {
        rows: 2,
        cols: 2,
        11: {
            name: "B.S. in Computer Science",
            challengeDescription: "Demonstrate your subject mastery by causing a Diploma reset, and disabling all benefits from row 4 layers except for Diplomas and API. (Fame upgrades still work)",
            rewardDescription: "Unlock an API upgrade.",
            goal: new Decimal(22),
            currencyDisplayName: "enrollments",
            currencyInternalName: "points",
            currencyLayer: "gd_s",
            unlocked() { return player.tm.buyables[6].gte(10); },
            style: { width: "400px", height: "320px" }
        },
        12: {
            name: "B.A. in Marketing",
            challengeDescription: "Demonstrate your subject mastery by causing a Diploma reset, and disabling all benefits from row 4 layers except for Diplomas and Good Will. (Refactor upgrades still work)",
            rewardDescription: "Unlock an Good Will upgrade.",
            goal: new Decimal(55),
            currencyDisplayName: "enrollments",
            currencyInternalName: "points",
            currencyLayer: "gd_s",
            unlocked() { return player.tm.buyables[6].gte(11); },
            style: { width: "400px", height: "320px" }
        },
	},
});



















addLayer("tptr_p", {
    name: "tptr_p", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#31aeb0",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "rewritten points", // Name of resource prestige is based on
    baseAmount() {return player.modpoints[7]}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        ret = new Decimal(1)
		if(hasUpgrade("tptr_p",21))ret=ret.mul(upgradeEffect("tptr_p",21));
		if(hasUpgrade("tptr_p",23))ret=ret.mul(upgradeEffect("tptr_p",23));
		if(hasUpgrade("tptr_b",11))ret=ret.mul(upgradeEffect("tptr_b",11));
		if(hasUpgrade("tptr_g",11))ret=ret.mul(upgradeEffect("tptr_g",11));
        return ret
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.tm.currentTree==7 && hasUpgrade("tm",16)},
		upgrades: {
			rows: 2,
			cols: 3,
			11: {
				title: "Begin",
				description(){
					return "Generate "+format(upgradeEffect("tptr_p",11))+" Rewritten Points every second."
				},
				cost() { return new Decimal(0); },
				effect() {
                    let ret = new Decimal(1);
					if(hasUpgrade("tptr_p",12))ret=ret.mul(upgradeEffect("tptr_p",12));
					if(hasUpgrade("tptr_p",13))ret=ret.mul(upgradeEffect("tptr_p",13));
					if(hasUpgrade("tptr_p",22))ret=ret.mul(upgradeEffect("tptr_p",22));
					ret=ret.mul(tmp.tptr_b.effect[0]);
					ret=ret.mul(tmp.tptr_g.powerEff);
                    return ret;
				},
			},
			12: {
				title: "Prestige Boost",
				description: "Prestige Points boost Rewritten Point generation.",
				cost() { return new Decimal(1); },
				effect() {
					let eff = player.tptr_p.points.plus(2).pow(0.5);
					eff = eff.min("1e3500");
					return eff;
				},
				unlocked() { return hasUpgrade("tptr_p", 11) },
				effectDisplay() { return format(this.effect())+"x" },
			},
			13: {
				title: "Self-Synergy",
				description: "Rewritten Points boost their own generation.",
				cost() { return new Decimal(5); },
				effect() { 
					let eff = player.modpoints[7].plus(1).log10().pow(0.75).plus(1);
					return eff;
				},
				unlocked() { return hasUpgrade("tptr_p", 12) },
				effectDisplay() { return format(this.effect())+"x" },
			},
			21: {
				title: "More Prestige",
				description() { return "Prestige Point gain is increased by 80%." },
				cost() { return new Decimal(20); },
				effect() {
                    let ret = new Decimal(1.8);
                    return ret;
				},
				unlocked() { return player.tptr_b.best.gte(1)&&hasUpgrade("tptr_p", 11) },
			},
			22: {
				title: "Upgrade Power",
				description: "Rewritten Point generation is faster based on your Prestige Upgrades bought.",
				cost() { return new Decimal(75); },
				effect() {
					let eff = Decimal.pow(1.4, player.tptr_p.upgrades.length);
					return eff;
				},
				unlocked() { return player.tptr_b.best.gte(1)&&hasUpgrade("tptr_p", 12) },
				effectDisplay() { return format(this.effect())+"x" },
			},
			23: {
				title: "Reverse Prestige Boost",
				description: "Prestige Point gain is boosted by your Rewritten Points.",
				cost() { return new Decimal(5e3); },
				effect() {
					let eff = player.modpoints[7].plus(1).log10().cbrt().plus(1);
					return eff;
				},
				unlocked() { return player.tptr_b.best.gte(1)&&hasUpgrade("tptr_p", 13) },
				effectDisplay() { return format(this.effect())+"x" },
			},
		},
		doReset(l){
			if(l=="tptr_p" || !l.startsWith("tptr_")){return;}
			layerDataReset("tptr_p",["upgrades","milestones","challenges"]);
			return;
		},
	effect() {
		let ret = player.tptr_p.points.add(1).pow(1000).mul("e1e5").min(Decimal.pow(2,player.tptr_p.points));
		return ret;
	},
	effectDescription() { // Optional text to describe the effects
           let eff = this.effect();
           return "which are boosting your prestige point gain in TPTC by "+format(eff)+"x"
       },
		update(diff){
			if(hasUpgrade("tptr_p",11))player.modpoints[7]=player.modpoints[7].add(upgradeEffect("tptr_p",11).mul(diff));
		},
});


addLayer("tptr_b", {
    name: "tptr_b", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#6e64c4",
    requires: new Decimal(200), // Can be a function that takes requirement increases into account
    resource: "boosters", // Name of prestige currency
    baseResource: "rewritten points", // Name of resource prestige is based on
    baseAmount() {return player.modpoints[7]}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	branches: ["tptr_p"],
    exponent: 1.25, // Prestige currency exponent
    base: 5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.tm.currentTree==7 && hasUpgrade("tm",17)},
		upgrades: {
		},
		doReset(l){
			if(l=="tptr_p" || l=="tptr_b" || l=="tptr_g" || !l.startsWith("tptr_")){return;}
			var b=new Decimal(player.tptr_b.best);
			layerDataReset("tptr_b",["upgrades","milestones","challenges"]);
			player.tptr_b.best=b;
			return;
		},
		addToBase() {
			let base = new Decimal(0);
			return base;
		},
		effectBase() {
			let base = new Decimal(2);
			
			// ADD
			base = base.plus(layers.tptr_b.addToBase());
			
			// MULTIPLY
			
			return base.pow(tmp.tptr_b.power);
		},
		power() {
			let power = new Decimal(1);
			return power;
		},
	effect() {
		let ret = [Decimal.pow(tmp.tptr_b.effectBase, player.tptr_b.points).max(0), player.tptr_b.points.add(1)];
		return ret;
	},
	effectDescription() { // Optional text to describe the effects
           let eff = this.effect();
           return "which are boosting Rewritten Point generation by "+format(eff[0])+"x and are boosting your booster base in TPTC by "+format(eff[1])+"x"
       },
		update(diff){
		},
		
		upgrades: {
			rows: 3,
			cols: 4,
			11: {
				title: "BP Combo",
				description: "Best Boosters boost Prestige Point gain.",
				cost() { return new Decimal(3);},
				effect() { 
					let ret = player.tptr_b.best.sqrt().plus(1);
					return ret;
				},
				unlocked() { return player.tptr_b.best.gte(1) },
				effectDisplay() { return format(this.effect())+"x" },
			},
		}
});


addLayer("tptr_g", {
    name: "tptr_g", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "G", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
			power: new Decimal(0),
    }},
    color: "#a3d9a5",
    requires: new Decimal(200), // Can be a function that takes requirement increases into account
    resource: "generators", // Name of prestige currency
    baseResource: "rewritten points", // Name of resource prestige is based on
    baseAmount() {return player.modpoints[7]}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	branches: ["tptr_p"],
    exponent: 1.25, // Prestige currency exponent
    base: 5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.tm.currentTree==7 && hasUpgrade("tm",18)},
		upgrades: {
		},
		doReset(l){
			if(l=="tptr_p" || l=="tptr_b" || l=="tptr_g" || !l.startsWith("tptr_")){return;}
			var b=new Decimal(player.tptr_g.best);
			layerDataReset("tptr_g",["upgrades","milestones","challenges"]);
			player.tptr_g.best=g;
			return;
		},
		addToBase() {
			let base = new Decimal(0);
			return base;
		},
		effBase() {
			let base = new Decimal(2);
			
			// ADD
			
			// MULTIPLY
			
			return base;
		},
		effect() {
			let eff = [Decimal.pow(this.effBase(), player.tptr_g.points).sub(1).max(0), player.tptr_g.points.add(1)];
			return eff;
		},
		effectDescription() {
			return "which are generating "+format(tmp.tptr_g.effect[0])+" Generator Power/sec\n ("+format(tmp.tptr_g.effBase)+"x each) and are boosting your generator base in TPTC by "+format(tmp.tptr_g.effect[1])+"x"
		},
		update(diff){
			
			if (player.tptr_g.unlocked) player.tptr_g.power = player.tptr_g.power.plus(tmp.tptr_g.effect[0].times(diff));
		},
		powerExp() {
			let exp = new Decimal(1/3);
			return exp;
		},
		powerEff() {
			return player.tptr_g.power.plus(1).pow(this.powerExp());
		},
		tabFormat: ["main-display",
			"prestige-button",
			"blank",
			["display-text",
				function() {return 'You have ' + format(player.tptr_g.power) + ' Generator Power, which boosts Rewritten Point generation by '+format(tmp.tptr_g.powerEff)+'x'},
					{}],
			"blank",
			["display-text",
				function() {return 'Your best Generators is ' + formatWhole(player.tptr_g.best) + '<br>You have made a total of '+formatWhole(player.tptr_g.total)+" Generators."},
					{}],
			"blank",
			"milestones", "blank", "blank", "upgrades"],
		upgrades: {
			rows: 3,
			cols: 5,
			11: {
				title: "GP Combo",
				description: "Best Generators boost Prestige Point gain.",
				cost() { return new Decimal(3) },
				effect() { return player.tptr_g.best.sqrt().plus(1) },
				unlocked() { return player.tptr_g.best.gte(1) },
				effectDisplay() { return format(tmp.tptr_g.upgrades[11].effect)+"x" },
			},
		}
});
