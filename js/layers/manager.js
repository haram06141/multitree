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
		,["row",[["upgrade",26],["upgrade",27],["upgrade",28]]]
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
					if(player[this.layer].buyables[this.id].gt(18.5))return new Decimal(Infinity);
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
                    let cost = [new Decimal(0),new Decimal("e215e5"),new Decimal("e25e6"),new Decimal("e305e5"),Infinity/*new Decimal("e38e6"),Infinity*/][player[this.layer].buyables[this.id].toNumber()];
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
		22: {
				title: "Multitree Upgrade 22",
                description: "Unlock some Row 2 upgrades in The Prestige Tree Classic and Rewritten.",
                cost: new Decimal("e223e5"),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				currencyDisplayName: "points",
				currencyInternalName: "points",
            },
		23: {
				title: "Multitree Upgrade 23",
                description: "Unlock some upgrades in The Prestige Tree Classic.",
                cost: new Decimal("e268e5"),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				currencyDisplayName: "points",
				currencyInternalName: "points",
            },
		24: {
				title: "Multitree Upgrade 24",
                description: "Unlock some Row 2 upgrades in The Burning Tree.",
                cost: new Decimal("e33333333"),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				currencyDisplayName: "points",
				currencyInternalName: "points",
            },
		25: {
				title: "Multitree Upgrade 25",
                description: "Unlock some Row 2 upgrades in The Game Dev Tree.",
                cost: new Decimal("e376e5"),
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
		26: {
				title: "Rewrite Time Capsules",
				fullDisplay(){
					return "<h2>Rewrite Time Capsules</h2><br>Unlock Time Capsules in The Prestige Tree Rewritten.<br>\
					Costs: "+format(new Decimal("e257e5"))+" points<br>\
					"+format(new Decimal(2500))+" Time Capsules in The Prestige Tree Classic<br>\
					"+format(Decimal.pow(10,2350))+" hours of work in The Game Dev Tree"
				},canAfford(){
					return player.points.gte(new Decimal("e257e5")) && 
					player.tptc_t.points.gte(2500) && 
					player.modpoints[6].gte(Decimal.pow(10,2350));
				},pay(){},
                unlocked() { return player.tm.buyables[7].gte(3); }, // The upgrade is only visible when this is true
				currencyDisplayName: "points",
				currencyInternalName: "points",
				style(){
					let ret={"width":"200px","height":"200px"};
					if(hasUpgrade("tm",this.id))ret.backgroundColor="#006609";
					return ret;
				}
            },
		27: {
				title: "Rewrite Enhance",
				fullDisplay(){
					return "<h2>Rewrite Enhance</h2><br>Unlock Enhance in The Prestige Tree Rewritten.<br>\
					Costs: "+format(new Decimal("e3e7"))+" points<br>\
					"+format(new Decimal("e3e6"))+" Enhance Points in The Prestige Tree Classic<br>\
					"+format(Decimal.pow(10,2450))+" hours of work in The Game Dev Tree"
				},canAfford(){
					return player.points.gte(new Decimal("e3e7")) && 
					player.tptc_e.points.gte(new Decimal("e3e6")) && 
					player.modpoints[6].gte(Decimal.pow(10,2450));
				},pay(){},
                unlocked() { return player.tm.buyables[7].gte(4); }, // The upgrade is only visible when this is true
				currencyDisplayName: "points",
				currencyInternalName: "points",
				style(){
					let ret={"width":"200px","height":"200px"};
					if(hasUpgrade("tm",this.id))ret.backgroundColor="#b82fbd";
					return ret;
				}
            },
		28: {
				title: "Rewrite Space Energy",
				fullDisplay(){
					return "<h2>Rewrite Space Energy</h2><br>Unlock Space Energy in The Prestige Tree Rewritten.<br>\
					Costs: "+format(new Decimal("e275e5"))+" points<br>\
					"+format(new Decimal(2600))+" Space Energy in The Prestige Tree Classic<br>\
					"+format(Decimal.pow(10,2400))+" hours of work in The Game Dev Tree"
				},canAfford(){
					return player.points.gte(new Decimal("e275e5")) && 
					player.tptc_t.points.gte(2600) && 
					player.modpoints[6].gte(Decimal.pow(10,2400));
				},pay(){},
                unlocked() { return player.tm.buyables[7].gte(3); }, // The upgrade is only visible when this is true
				currencyDisplayName: "points",
				currencyInternalName: "points",
				style(){
					let ret={"width":"200px","height":"200px"};
					if(hasUpgrade("tm",this.id))ret.backgroundColor="#dfdfdf";
					return ret;
				}
            },
	}
});
