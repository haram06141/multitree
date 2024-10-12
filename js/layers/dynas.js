
addLayer("dynas_c", {
    name: "dynas_c", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		total: new Decimal(0),
		best: new Decimal(0),
    }},
    color: "#FFFF00",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "coins", // Name of prestige currency
    baseResource: "dynas points", // Name of resource prestige is based on
    baseAmount() {return player.modpoints[9]}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		mult=mult.mul(tmp.dynas_b.effect);
		mult=mult.mul(tmp.dynas_m.effect);
		if(hasUpgrade("tptc_p",51))mult=mult.mul(upgradeEffect("tptc_p",51));
		if(hasUpgrade("incrementy_pi",14))mult=mult.mul(upgradeEffect("incrementy_pi",14));
		return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown(){return player.tm.currentTree==9;},
		
		doReset(l){
			if(!l.startsWith("dynas_")){return;}
			for(var i in tmp.dynas_c.upgrades){
				tmp.dynas_c.upgrades[i].effect=new Decimal(1);
			}
			if(l=="dynas_c" || !l.startsWith("dynas_")){return;}
			layerDataReset("dynas_c",["upgrades","milestones","challenges"]);
			return;
		},
		upgrades: {
            rows: 4,
            cols: 5,
			11: {
				title: "Coin Upgrade 11",
                description() {
					return "Gain "+format(this.effect())+" Dynas Points per second."
				},
                cost: new Decimal(0),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
					let ret = new Decimal(1);
					if(hasUpgrade("dynas_c",12))ret=ret.mul(upgradeEffect("dynas_c",12));
					if(hasUpgrade("dynas_c",21))ret=ret.mul(upgradeEffect("dynas_c",21));
					if(hasUpgrade("dynas_c",31))ret=ret.mul(upgradeEffect("dynas_c",31));
					ret=ret.mul(tmp.dynas_w.effect);
		ret=ret.mul(tmp.dynas_m.effect);
					ret=ret.mul(tmp.dynas_wf.effect2[0]);
					ret = ret.mul(buyableEffect("dynas_b",11));
					ret = ret.mul(buyableEffect("dynas_b",12));
					ret = ret.mul(buyableEffect("dynas_b",13));
		if (player.dynas_b.banking & 1) ret = ret.pow(0.5)
	if (player.dynas_b.banking & 2) ret = ret.root(3)
	if (player.dynas_b.banking & 4) ret = ret.pow(0.1)
	if (player.dynas_b.banking & 8) ret = player.dynas_c.points.pow(0.1).sub(1)
	if (player.dynas_b.banking & 16) ret = ret.pow(Decimal.pow(player.dynas_b.bankTime, 2).add(1).recip())  

                    return ret;
                },
			},
			12: {
				title: "Coin Upgrade 12",
                description() {
					return "Coin Upgrade 11 is boosted by your coin amount."
				},
                cost: new Decimal(1),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
                    let base=2;
                    let ret = Decimal.pow(base,Decimal.log10(player.dynas_c.points.add(10)).pow(0.9));
					if(hasUpgrade("dynas_w",12))ret=ret.pow(upgradeEffect("dynas_w",12));
					if(hasUpgrade("dynas_c",13))ret=ret.mul(upgradeEffect("dynas_c",13));
					if(hasUpgrade("dynas_c",21))ret=ret.mul(upgradeEffect("dynas_c",21));
					ret=ret.mul(tmp.dynas_wf.effect2[0]);
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			13: {
				title: "Coin Upgrade 13",
                description() {
					return "Coin Upgrade 12 is boosted by your points."
				},
                cost: new Decimal(1),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
					if (player.dynas_b.banking & 2)return new Decimal(1);
                    let base=1.1;
                    let ret = Decimal.pow(base,Decimal.log10(player.points.add(1)).pow(hasUpgrade("dynas_w",15)?0.225:hasUpgrade("dynas_w",13)?0.2:hasUpgrade("dynas_c",35)?0.175:hasUpgrade("dynas_c",32)?0.15:hasUpgrade("dynas_c",24)?0.125:0.1));
					if(hasUpgrade("dynas_c",14))ret=ret.mul(upgradeEffect("dynas_c",14));
					if(hasUpgrade("dynas_c",21))ret=ret.mul(upgradeEffect("dynas_c",21));
					ret=ret.mul(tmp.dynas_wf.effect2[0]);
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			14: {
				title: "Coin Upgrade 14",
                description() {
					return "Coin Upgrade 13 is boosted by your dynas points."
				},
                cost: new Decimal(5),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
					if (player.dynas_b.banking & 2)return new Decimal(1);
                    let base=1.5;
                    let ret = Decimal.pow(base,Decimal.log10(player.modpoints[9].add(1)).pow(0.9));
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			15: {
				title: "Coin Upgrade 15",
                description() {
					return "Boost your point gain based on your dynas points."
				},
                cost: new Decimal(10),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
					if (player.dynas_b.banking & 2)return new Decimal(1);
					let ret=player.modpoints[9];
					if(ret.gte('1e1000'))ret = ret.pow(0.5).mul('1e500');
					if(hasUpgrade("dynas_c",41))ret=ret.add(1).pow(3.5e8);
					else ret=ret.add(1).pow(3.5e6);
					return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			21: {
				title: "Coin Upgrade 21",
                description() {
					return "Coin Upgrades 11-13 are boosted by your dynas points."
				},
                cost: new Decimal(20),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
					if (player.dynas_b.banking & 2)return new Decimal(1);
                    let base=1.5;
					if(hasUpgrade("dynas_c",33))base+=0.1;
                    let ret = Decimal.pow(base,Decimal.log10(player.modpoints[9].add(1)).pow(0.9));
					if(hasUpgrade("dynas_c",42))ret=ret.pow(1.1);
					if(hasUpgrade("dynas_c",22))ret=ret.mul(upgradeEffect("dynas_c",22));
					if(hasUpgrade("dynas_c",31))ret=ret.mul(upgradeEffect("dynas_c",31));
					ret=ret.mul(tmp.dynas_wf.effect2[0]);
					if(hasUpgrade("dynas_w",11))ret=ret.pow(upgradeEffect("dynas_w",11));
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			22: {
				title: "Coin Upgrade 22",
                description() {
					return "Coin Upgrade 21 is boosted by your coin amount."
				},
                cost: new Decimal(100),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
					if (player.dynas_b.banking & 2)return new Decimal(1);
                    let base=1.2;
                    let ret = Decimal.pow(base,Decimal.log10(player.dynas_c.points.add(1)).pow(0.9));
					if(hasUpgrade("dynas_c",23))ret=ret.mul(upgradeEffect("dynas_c",23));
					ret=ret.mul(tmp.dynas_wf.effect2[0]);
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			23: {
				title: "Coin Upgrade 23",
                description() {
					return "Coin Upgrade 22 is boosted by your coin amount."
				},
                cost: new Decimal(1000),
                unlocked() { return true; }, // The upgrade is only visible when this is true
				effect() {
					if (player.dynas_b.banking & 2)return new Decimal(1);
                    let base=1.1;
                    let ret = Decimal.pow(base,Decimal.log10(player.dynas_c.points.add(1)).pow(0.9));
					ret=ret.mul(tmp.dynas_wf.effect2[0]);
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			24: {
				title: "Coin Upgrade 24",
                description() {
					return "Coin Upgrade 13 is better."
				},
                cost: new Decimal(5000),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			25: {
				title: "Coin Upgrade 25",
                description() {
					return "Super-Generators in TPTC are cheaper."
				},
                cost: new Decimal(100000),
                unlocked() { return true; }, // The upgrade is only visible when this is true
			},
			31: {
				title: "Coin Upgrade 31",
                description() {
					return "Boost Coin Upgrades 11 & 21 based on your best worker count."
				},
                cost: new Decimal(1e7),
                unlocked() { return hasMilestone("dynas_w",0); }, // The upgrade is only visible when this is true
				effect() {
					if (player.dynas_b.banking & 2)return new Decimal(1);
					let ret=player.dynas_w.best.pow(1/3).div(2).add(1);
					if(hasUpgrade("dynas_w",11))ret=ret.pow(upgradeEffect("dynas_w",11));
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			32: {
				title: "Coin Upgrade 32",
                description() {
					return "Coin Upgrade 13 is better."
				},
                cost: new Decimal(1e8),
                unlocked() { return hasMilestone("dynas_w",0); }, // The upgrade is only visible when this is true
			},
			33: {
				title: "Coin Upgrade 33",
                description() {
					return "Coin Upgrade 21 is better."
				},
                cost: new Decimal(1e11),
                unlocked() { return hasMilestone("dynas_w",0); }, // The upgrade is only visible when this is true
			},
			34: {
				title: "Coin Upgrade 34",
                description() {
					return "Unlock a new prestige upgrade in TPTC."
				},
                cost: new Decimal(1e14),
                unlocked() { return hasMilestone("dynas_w",0); }, // The upgrade is only visible when this is true
			},
			35: {
				title: "Coin Upgrade 35",
                description() {
					return "Coin Upgrade 13 is better."
				},
                cost: new Decimal(1e18),
                unlocked() { return hasMilestone("dynas_w",0); }, // The upgrade is only visible when this is true
			},
			41: {
				title: "Coin Upgrade 41",
                description() {
					return "Coin Upgrade 15 is better."
				},
                cost: new Decimal(1e27),
                unlocked() { return hasMilestone("dynas_w",1); }, // The upgrade is only visible when this is true
			},
			42: {
				title: "Coin Upgrade 42",
                description() {
					return "Base effect of Coin Upgrade 21 boost itself."
				},
                cost: new Decimal(1e50),
                unlocked() { return hasMilestone("dynas_w",1); }, // The upgrade is only visible when this is true
			},
		},
		update(diff){
			if(hasUpgrade("dynas_c",11))player.modpoints[9]=player.modpoints[9].add(upgradeEffect("dynas_c",11).mul(diff));
		},
	passiveGeneration(){
		if(hasMilestone("dynas_m",0))return 100;
		if(hasMilestone("dynas_wf",0))return 10;
		return 0;
	}
});


addLayer("dynas_wf", {
    name: "dynas_wf", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "WF", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		workUndone: new Decimal(0),
		workDone: new Decimal(0),
    }},
    color: "#555555",
    requires: new Decimal(1e20), // Can be a function that takes requirement increases into account
    resource: "workfinders", // Name of prestige currency
    baseResource: "coins", // Name of resource prestige is based on
    baseAmount() {return player.dynas_c.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	base: 5000,
    exponent: 0.6, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown(){return player.tm.currentTree==9 && player.tm.buyables[9].gte(3);},
		
	effect() {
		let eff = player.dynas_wf.points.pow(1.25);
		if(hasUpgrade("dynas_wf",23))eff = eff.mul(5);
		return eff
	},
	effect2() {
		let wd=player.dynas_wf.workDone;
		let wu=player.dynas_wf.workUndone;
		
		let wue = wu.add(1).log(1e10).add(1).cbrt().recip();//.pow(tmp.buyables.dynas_wf[23].effect)

		let wde = wd.add(1).pow(0.1).pow(wue)//.pow(tmp.buyables.dynas_wf[22].effect)
		if(hasUpgrade("dynas_wf",21))wde = wde.mul(wue.pow(3).add(1));
		if (player.dynas_b.banking & 1) wde = wde.pow(0.5)
		return [wde,wue]
	},
	effectDescription() {
		let eff=this.effect();
		return "which are generating " + format(eff) + " unfinished work per second.";
	},



	branches: [["dynas_c", 1]],

		doReset(l){
			if(l=="dynas_c" || l=="dynas_wf"  || l=="dynas_b" || !l.startsWith("dynas_")){return;}
			layerDataReset("dynas_wf",["upgrades","milestones","challenges"]);
			return;
		},
		update(diff){
			player.dynas_wf.workUndone = player.dynas_wf.workUndone.add(this.effect().mul(diff));
			let w=layers.dynas_w.effect2().mul(diff).min(player.dynas_wf.workUndone);
			player.dynas_wf.workDone = player.dynas_wf.workDone.add(w);
			player.dynas_wf.workUndone = player.dynas_wf.workUndone.sub(w);
		},
	
	
	milestones: {
		0: {
			requirementDescription: () => "1 Workfinder",
			done() { return player.dynas_wf.best.gte(1) },
			effectDescription: () => "Gain 1000% of coin gain per second."
		},
	},
	
	
	upgrades: {
		rows: 2,
		cols: 5,
		11: {
				title: "Workfinder Upgrade 11",
				description: "Finish work faster based on unfinished work count.",
				cost: new Decimal(250),
				unlocked() { return player.tm.buyables[9].gte(4) },
				effect() {
					let ret = new Decimal(1).add(player.dynas_wf.workUndone).max(1).log(100).add(1)
					return ret;
				},
				effectDisplay() { return "x" + format(this.effect()) },
		},
		12: {
				title: "Workfinder Upgrade 12",
				description: "Finish work faster based on finished work's effect.",
				cost: new Decimal(500),
				unlocked() { return player.tm.buyables[9].gte(4) },
				effect() {
					let ret = Decimal.log(new Decimal(1).add(tmp.dynas_wf.effect2[0]).max(1), 10).add(1)
					return ret;
				},
				effectDisplay() { return "x" + format(this.effect()) },
		},
		13: {
				title: "Workfinder Upgrade 13",
				description: "Finish work faster based on workfinders.",
				cost: new Decimal(750),
				unlocked() { return player.tm.buyables[9].gte(4) },
				effect() {
					let ret = player.dynas_wf.points.pow(hasUpgrade("dynas_wf",22)?0.2:hasUpgrade("dynas_wf",15)?0.08:hasUpgrade("dynas_wf",14)?0.06:0.05).add(1);
					return ret;
				},
				effectDisplay() { return "x" + format(this.effect()) },
		},
		14: {
				title: "Workfinder Upgrade 14",
				description: "Previous upgrade is better.",
				cost: new Decimal(1000),
				unlocked() { return player.tm.buyables[9].gte(4) },
		},
		15: {
				title: "Workfinder Upgrade 15",
				description: "Previous upgrade is better.",
				cost: new Decimal(1250),
				unlocked() { return player.tm.buyables[9].gte(4) },
		},
		21: {
				title: "Workfinder Upgrade 21",
			description: "Multiplier to finished work's effect based on unfinished work's effect.",
				cost: new Decimal(10000),
			effect() {
				let ret = Decimal.pow(player.dynas_wf.workUndone.add(1).log(1e10).add(1).cbrt().recip(),3).add(1)
				return ret;
			},
				effectDisplay() { return "x" + format(this.effect()) },
				unlocked() { return player.tm.buyables[9].gte(6) },
		},
		22: {
				title: "Workfinder Upgrade 22",
			description: "Workfinder Upgrade 13 is better",
				cost: new Decimal(15000),
				unlocked() { return player.tm.buyables[9].gte(6) },
		},
		23: {
				title: "Workfinder Upgrade 23",
			description: "Find work 5 times faster.",
				cost: new Decimal(24000),
				unlocked() { return player.tm.buyables[9].gte(8) },
		},
		24: {
				title: "Workfinder Upgrade 24",
			description: "Unlock a button to clear works.",
				cost: new Decimal(27000),
				unlocked() { return player.tm.buyables[9].gte(9) },
		},
	},


	buyables: {
		rows: 2,
		cols: 3,
		11: {
			title: () => "Increase workers' strength",
			cost(x=player.dynas_wf.buyables[11]) {
				if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(10, x).mul(1000)
				return cost.floor()
			},
			effect(x=player.dynas_wf.buyables[11]) { // Effects of owning x of the items, x is a decimal
				if (!tmp[this.layer].buyables[12]) return Decimal.pow(1.35, x)

				let eff = new Decimal(1)
				if (tmp[this.layer].buyables[12].effect.add)
					eff = Decimal.pow(tmp[this.layer].buyables[12].effect.add(1.35), x)
				if (tmp[this.layer].buyables[13])
					eff = eff.pow(tmp[this.layer].buyables[13].effect)

				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return "Level " + player[this.layer].buyables[this.id] + "\n\
				Cost: " + format(data.cost) + " finished work\n\
				Increases work finishing speed by ×" + format(tmp[this.layer].buyables[12].effect.add ? tmp[this.layer].buyables[12].effect.add(1.35) : 1.35) + " per level.\n\
				Currently: ×" + format(data.effect)
			},
			unlocked() { return player.tm.buyables[9].gte(8) },
			canAfford() {
				return player[this.layer].workDone.gte && player[this.layer].workDone.gte(tmp[this.layer].buyables[this.id].cost)
			},
			buy() {
				cost = tmp[this.layer].buyables[this.id].cost
				player[this.layer].workDone = player[this.layer].workDone.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
		},
		12: {
			title: () => "Increase workers' dexterity",
			cost(x=player.dynas_wf.buyables[12]) {
				if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(10, x).mul(2000)
				return cost.floor()
			},
			effect(x=player.dynas_wf.buyables[12]) { // Effects of owning x of the items, x is a decimal
				let eff = x.mul(0.01)
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return "Level " + player[this.layer].buyables[this.id] + "\n\
				Cost: " + format(data.cost) + " finished work\n\
				Increases the previous increase upgrade by +0.01 per level per level.\n\
				Currently: +" + format(data.effect)
			},
			unlocked() { return player.tm.buyables[9].gte(9) },
			canAfford() {
				return player[this.layer].workDone.gte && player[this.layer].workDone.gte(tmp[this.layer].buyables[this.id].cost)
			},
			buy() {
				cost = tmp[this.layer].buyables[this.id].cost
				player[this.layer].workDone = player[this.layer].workDone.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
		},/*
		13: {
			title: () => "Increase workers' collaborativeness",
			cost(x) {
				if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(20, x).mul(5000)
				return cost.floor()
			},
			effect(x) { // Effects of owning x of the items, x is a decimal
				let eff = x.mul(0.01).add(1)
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "Level " + player[this.layer].buyables[this.id] + "\n\
				Cost: " + format(data.cost) + " finished work\n\
				Increases the first upgrade's effect by ^+0.01 per level. Levels on this upgrade stack additively.\n\
				Currently: ^" + format(data.effect)
			},
			unl() { return player[this.layer].unl },
			canAfford() {
				return player[this.layer].workDone.gte && player[this.layer].workDone.gte(tmp.buyables[this.layer][this.id].cost)
			},
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost
				player[this.layer].workDone = player[this.layer].workDone.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
		},
		21: {
			title: () => "Promote workfinders to part-time workers",
			cost(x) {
				if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(x.add(1), 1.5).mul(6)
				return cost.floor()
			},
			effect(x) { // Effects of owning x of the items, x is a decimal
				let eff = x.mul(10).cbrt()
				if (hasMilestone("m", 0) && hasMilestone("w", 3)) eff = eff.mul(5)
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "Level " + player[this.layer].buyables[this.id] + "\n\
				Cost: " + format(data.cost) + " workfinders\n\
				Workfinders also finish works at reduced workers' capacity.\n\
				Currently: " + format(data.effect) + "%"
			},
			unl() { return player[this.layer].unl },
			canAfford() {
				return player[this.layer].points.gte(tmp.buyables[this.layer][this.id].cost)
			},
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost
				player[this.layer].points = player[this.layer].points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
		},
		22: {
			title: () => "Increase work quality",
			cost(x) {
				if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(1e6, x).mul(1e29)
				return cost.floor()
			},
			effect(x) { // Effects of owning x of the items, x is a decimal
				let eff = x.mul(0.4).add(1).cbrt()
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "Level " + player[this.layer].buyables[this.id] + "\n\
				Cost: " + format(data.cost) + " coins\n\
				Boosts the finished work's effect.\n\
				Currently: ^" + format(data.effect)
			},
			unl() { return player[this.layer].unl },
			canAfford() {
				return player.c.points.gte(tmp.buyables[this.layer][this.id].cost)
			},
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost
				player.c.points = player.c.points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
		},
		23: {
			title: () => "Increase work planning skills",
			cost(x) {
				if (x.gte(10)) x = x.pow(x.div(10))
				let cost = Decimal.pow(1e10, x).mul(1e40)
				return cost.floor()
			},
			effect(x) { // Effects of owning x of the items, x is a decimal
				let eff = x.mul(0.02).add(1).recip()
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "Level " + player[this.layer].buyables[this.id] + "\n\
				Cost: " + format(data.cost) + " coins\n\
				Reduces the unfinished work penalty.\n\
				Currently: ^" + format(data.effect, 3)
			},
			unl() { return player[this.layer].unl },
			canAfford() {
				return player.c.points.gte(tmp.buyables[this.layer][this.id].cost)
			},
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost
				player.c.points = player.c.points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
		},*/
	},

	clickables: {
            1: {
                title: "Reset Work", // Optional, displayed at the top in a larger font
                display: "Reset Finished & Unfinished Work",
                unlocked() {return hasUpgrade("dynas_wf",24);}, 
				canClick: true,
				onClick(){
					player[this.layer].workDone=new Decimal(0);
					player[this.layer].workUndone=new Decimal(0);
				},
                style: {'height':'100px','width':'150px'},
            },
	},

canBuyMax: true,
resetsNothing: () => hasMilestone("dynas_w",2),
autoPrestige: () => hasMilestone("dynas_w",2),


	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
                    ["display-text",
                        function() {
							return 'You have '+format(player.dynas_wf.workDone)+' finished work, which are multiplying Coin Upgrades 11-13 and 21-23 by '+format(tmp.dynas_wf.effect2[0])+'.';
						},
                        {}],
                    ["display-text",
                        function() {
							return 'You have '+format(player.dynas_wf.workUndone)+' unfinished work, which are raising finished work\'s effect by ^'+format(tmp.dynas_wf.effect2[1])+'.';
						},
                        {}],
			["display-text",
				function () { if(player.tm.buyables[9].lt(9))return "More Buyable at The Dynas Tree Level 9";if(player.tm.buyables[9].lt(8))return "More Buyable at The Dynas Tree Level 8";return "" }],
						"milestones",
						["clickable",1],
						"buyables",
						"upgrades"
				],
});


addLayer("dynas_w", {
    name: "dynas_w", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "W", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#FFFFFF",
    requires: new Decimal(1e6), // Can be a function that takes requirement increases into account
    resource: "workers", // Name of prestige currency
    baseResource: "coins", // Name of resource prestige is based on
    baseAmount() {return player.dynas_c.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	base: 15000,
    exponent: 1.35, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown(){return player.tm.currentTree==9 && player.tm.buyables[9].gte(2);},
		
	effect() {
		let eff = Decimal.pow(player.dynas_w.points.add(1), 2)
		if(hasMilestone("dynas_w",3))eff = eff.pow(3)
		if(hasMilestone("dynas_w",4))eff = eff.pow(3)
		if (player.dynas_b.banking & 1) eff = eff.pow(0.5)

		return eff
	},
	effectDescription() {
		let eff=this.effect();
		if(player.tm.buyables[9].gte(3))return "which are boosting your dynas point gains by ×" + format(eff) +" and finishing "+format(this.effect2())+" work per second.";
		return "which are boosting your dynas point gains by ×" + format(eff)
	},

effect2(){
	let eff = Decimal.pow(player.dynas_w.points, 1.25).mul(10);
	
					if (hasUpgrade("dynas_wf", 11)) eff = eff.mul(upgradeEffect("dynas_wf", 11));
					if (hasUpgrade("dynas_wf", 12)) eff = eff.mul(upgradeEffect("dynas_wf", 12));
					if (hasUpgrade("dynas_wf", 13)) eff = eff.mul(upgradeEffect("dynas_wf", 13));
					eff = eff.mul(buyableEffect("dynas_wf", 11));
	return eff;
},


	branches: [["dynas_c", 1],["dynas_b", 1],["dynas_wf", 1]],
		doReset(l){
			if(l=="dynas_c" || l=="dynas_w" || l=="dynas_wf"  || l=="dynas_b" || !l.startsWith("dynas_")){return;}
			layerDataReset("dynas_w",["upgrades","milestones","challenges"]);
			return;
		},
		upgrades: {
			rows: 2,
			cols: 5,
			11: {
				title: "Worker Upgrade 11",
				description: "Boost Coin Upgrades 21 & 31 based on your best worker count.",
				cost: new Decimal(3),
				unlocked() { return hasMilestone("dynas_w", 1) },
				effect() {
					let ret = player[this.layer].best.div(20).add(1);
					if (hasUpgrade(this.layer, 14)) ret = ret.add(player[this.layer].points.div(30));
					
					if (ret.gte(2.3))ret = ret.mul(2.3).sqrt();
					if (ret.gte(2.9))ret = ret.mul(2.9).sqrt();
					return ret.sqrt();
				},
				effectDisplay() { return "^" + format(this.effect()) },
			},
			12: {
				title: "Worker Upgrade 12",
				description: "Boost base effect of Coin Upgrade 12 based on your best worker count.",
				cost: new Decimal(4),
				unlocked() { return hasMilestone("dynas_w", 1) },
				effect() {
					let ret = player[this.layer].best.div(20).add(1);
					if (ret.gte(4))ret = ret.mul(4).sqrt();
					return ret.pow(1/6);
				},
				effectDisplay() { return "^" + format(this.effect()) },
			},
			13: {
				title: "Worker Upgrade 13",
				description: "Coin Upgrade 13 is better.",
				cost: new Decimal(5),
				unlocked() { return hasMilestone("dynas_w", 1) },
			},
			14: {
				title: "Worker Upgrade 14",
				description: "The current worker count also contibutes to the first upgrade's formula.",
				cost: new Decimal(9),
				unlocked() { return hasMilestone("dynas_w", 1) },
			},
			15: {
				title: "Worker Upgrade 15",
				description: "Coin Upgrade 13 is better.",
				cost: new Decimal(53),
				unlocked() { return hasMilestone("dynas_w", 1) },
			},
		},
		update(diff){
			
		},
	
	
	milestones: {
		0: {
			requirementDescription: () => "1 Worker",
			done() { return player[this.layer].best.gte(1) },
			effectDescription: () => "Unlocks a new row of coin upgrades."
		},
		1: {
			requirementDescription: () => "3 Workers",
			done() { return player[this.layer].best.gte(3) },
			effectDescription: () => "Unlocks worker upgrades.",
		},
		2: {
			requirementDescription: () => "13 Workers",
			done() { return player[this.layer].best.gte(13) },
			effectDescription: () => "Hiring workfinders no longer resets anything. Auto-Hire workfinders.",
		},
		3: {
			requirementDescription: () => "22 Workers",
			done() { return player[this.layer].best.gte(22) },
			effectDescription: () => "The workers' effect gets cubed.",
		},
		4: {
			requirementDescription: () => "27 Workers",
			done() { return player[this.layer].best.gte(27) },
			effectDescription: () => "The workers' effect gets cubed again. Yay!",
		},
		5: {
			requirementDescription: () => "30 Workers",
			done() { return player[this.layer].best.gte(30) },
			effectDescription: () => "Banks no longer resets anything, Auto-build banks",
		},
		6: {
			requirementDescription: () => "35 Workers",
			done() { return player[this.layer].best.gte(35) },
			effectDescription: () => "You can buy max workers",
		},
	},

canBuyMax: () => hasMilestone("dynas_w",6),
autoPrestige: () => hasMilestone("dynas_m",0),
resetsNothing: () => hasMilestone("dynas_m",0),
});


addLayer("dynas_b", {
	startData() {
		return {
			unlocked: false,
			points: new Decimal(0),
			best: new Decimal(0),
			total: new Decimal(0),
			banking: 0,
			bankTime: new Decimal(0),
			speed: new Decimal(0),
		}
	},
    symbol: "B", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order

    layerShown(){return player.tm.currentTree==9 && player.tm.buyables[9].gte(4);},

	color: () => "#00FF00",
	resource: "banks",
	row: 1,

	baseResource: "dynas points",
	baseAmount() { return player.modpoints[9] },

	requires: () => new Decimal('1e600'),

	type: "static",
	base: 50000,
	exponent: 1.25,
canBuyMax: () => hasMilestone("dynas_w",5),
resetsNothing: () => (hasMilestone("dynas_w",5) && player.dynas_b.banking==0),
autoPrestige: () => hasMilestone("dynas_w",5),

	effect() {
		var eff = Decimal.pow(16, player.dynas_b.points)
		if (player.dynas_b.banking & 1) eff = eff.pow(0.5)
		return eff
	},
	effectDescription() {
		var eff = this.effect();
		return "which are boosting your coin gains by ×" + format(eff)
	},

	gainMult() {
		return new Decimal(1)
	},
	gainExp() {
		return new Decimal(1)
	},
		doReset(l){
			if(l=="dynas_c" || l=="dynas_wf"  || l=="dynas_b" || !l.startsWith("dynas_")){return;}
			layerDataReset("dynas_b",["upgrades","milestones","challenges"]);
			return;
		},
	buyables: {
		rows: 3,
		cols: 3,
		11: {
			title: () => "Coin Banking",
			cost(x) {
				return new Decimal(0)
			},
			effect(x) {
				var eff = player[this.layer].buyables[this.id].add(1).pow(0.15)
				//if (tmp.buyables.b[21]) eff = eff.mul(tmp.buyables.b[21].effect)
				//if (tmp.buyables.b[22]) eff = eff.mul(tmp.buyables.b[22].effect)
				//if (tmp.buyables.b[23]) eff = eff.mul(tmp.buyables.b[23].effect)
				//if (tmp.buyables.b[31]) eff = eff.mul(tmp.buyables.b[31].effect)
				//if (hasMilestone("m", 0) && hasMilestone("w", 9)) eff = eff.mul(25)
				//if (hasUpg("w", 25)) eff = eff.pow(layers.w.upgrades[25].effect())
				//if (hasUpg("wi", 22)) eff = eff.mul(layers.wi.upgrades[22].effect())
				var softcap = new Decimal(1e45)
				//if (player.sp.buyables[30].gt(0)) softcap = softcap.mul(tmp.buyables.sp[30].effect)
				if (eff.gte(softcap)) eff = eff.mul(softcap).sqrt()
				//if (player.sp.buyables[28].gt(0) && tmp.buyables.sp[28].effect.sqrt) eff = eff.mul(tmp.buyables.sp[28].effect.sqrt())
				return eff
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return data.canAfford
					? "You have " + format(player[this.layer].buyables[this.id]) + " banked coins, which are boosting the dynas point generation speed by ×" + format(data.effect) + ".\n\n\
						Banking is currently " + (player.dynas_b.banking == 1 ? "enabled.\n\
						Click here to disable banking and gain " + format(player.dynas_c.points.sub(player.dynas_b.buyables[11]).max(0)) + " banked coins." : "disabled.\n\
						Click here to enable banking, which will square root all of your dynas point generation speed, workers' effect, finished works' effects, banks' effects.")
					: (player.dynas_b.banking > 0 ? "Please disable the current active banking before you can activate another one." : "You need to build at least 2 banks before you can use this function.")
			},
			unlocked() { return player.tm.buyables[9].gte(7) },
			canAfford() { return (player[this.layer].best.gte(2) /*|| player[this.layer].buyables[33].gt(0)*/) && (player[this.layer].banking == 0 || player[this.layer].banking == 1) },
			buy() {
				if (player.dynas_b.banking == 1) player.dynas_b.buyables[11] = player.dynas_b.buyables[11].max(player.dynas_c.points)
				player.dynas_b.banking = player.dynas_b.banking == 1 ? 0 : 1
			tmp[this.layer].resetsNothing=false
				doReset(this.layer, true)
			},
		},
		12: {
			title: () => "Dynas Point Banking",
			cost(x) {
				return new Decimal(0)
			},
			effect(x) {
				var eff = player[this.layer].buyables[this.id].add(1).pow(0.15)
				//if (tmp.buyables.b[21]) eff = eff.mul(tmp.buyables.b[21].effect)
				//if (tmp.buyables.b[22]) eff = eff.mul(tmp.buyables.b[22].effect)
				//if (tmp.buyables.b[23]) eff = eff.mul(tmp.buyables.b[23].effect)
				//if (tmp.buyables.b[31]) eff = eff.mul(tmp.buyables.b[31].effect)
				//if (hasMilestone("m", 0) && hasMilestone("w", 9)) eff = eff.mul(25)
				//if (hasUpg("w", 25)) eff = eff.pow(layers.w.upgrades[25].effect())
				//if (hasUpg("wi", 22)) eff = eff.mul(layers.wi.upgrades[22].effect())
				var softcap = new Decimal(1e45)
				//if (player.sp.buyables[30].gt(0)) softcap = softcap.mul(tmp.buyables.sp[30].effect)
				if (eff.gte(softcap)) eff = eff.mul(softcap).sqrt()
				//if (player.sp.buyables[28].gt(0) && tmp.buyables.sp[28].effect.sqrt) eff = eff.mul(tmp.buyables.sp[28].effect.sqrt())
				return eff
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return data.canAfford
					? "You have " + format(player[this.layer].buyables[this.id]) + " banked dynas points, which are boosting the dynas point generation speed by ×" + format(data.effect) + ".\n\n\
						Banking is currently " + (player.dynas_b.banking == 2 ? "enabled.\n\
						Click here to disable banking and gain " + format(player.modpoints[9].sub(player.dynas_b.buyables[12]).max(0)) + " banked dynas points." : "disabled.\n\
						Click here to enable banking, which will cube root your dynas point generation speed and coin upgrades are disabled except first two.")
					: (player.dynas_b.banking > 0 ? "Please disable the current active banking before you can activate another one." : "You need to build at least 4 banks before you can use this function.")
			},
			unlocked() { return player.tm.buyables[9].gte(7) },
			canAfford() { return (player[this.layer].best.gte(4) /*|| player[this.layer].buyables[33].gt(0)*/) && (player[this.layer].banking == 0 || player[this.layer].banking == 2) },
			buy() {
				if (player.dynas_b.banking == 2) player.dynas_b.buyables[12] = player.dynas_b.buyables[12].max(player.modpoints[9])
				player.dynas_b.banking = player.dynas_b.banking == 2 ? 0 : 2
			tmp[this.layer].resetsNothing=false
				doReset(this.layer, true)
			},
		},
		13: {
			title: () => "Time Banking",
			cost(x) {
				return new Decimal(0)
			},
			effect(x) {
				var eff = player[this.layer].buyables[this.id].add(1).pow(0.15)
				//if (tmp.buyables.b[21]) eff = eff.mul(tmp.buyables.b[21].effect)
				//if (tmp.buyables.b[22]) eff = eff.mul(tmp.buyables.b[22].effect)
				//if (tmp.buyables.b[23]) eff = eff.mul(tmp.buyables.b[23].effect)
				//if (tmp.buyables.b[31]) eff = eff.mul(tmp.buyables.b[31].effect)
				//if (hasMilestone("m", 0) && hasMilestone("w", 9)) eff = eff.mul(25)
				//if (hasUpg("w", 25)) eff = eff.pow(layers.w.upgrades[25].effect())
				//if (hasUpg("wi", 22)) eff = eff.mul(layers.wi.upgrades[22].effect())
				var softcap = new Decimal(1e45)
				//if (player.sp.buyables[30].gt(0)) softcap = softcap.mul(tmp.buyables.sp[30].effect)
				if (eff.gte(softcap)) eff = eff.mul(softcap).sqrt()
				//if (player.sp.buyables[28].gt(0) && tmp.buyables.sp[28].effect.sqrt) eff = eff.mul(tmp.buyables.sp[28].effect.sqrt())
				return eff
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return data.canAfford
					? "You have " + format(player[this.layer].buyables[this.id]) + " banked time, which are boosting the dynas point generation speed by ×" + format(data.effect) + ".\n\n\
						Banking is currently " + (player.dynas_b.banking == 3 ? "enabled.\n\
						Click here to disable banking and gain " + format(Decimal.sub(upgradeEffect("dynas_c",11), player.dynas_b.buyables[13]).max(0)) + " banked time." : "disabled.\n\
						Click here to enable banking, which will activate all of the previous banking debuffs at once. The thing you are banking here is your dynas points generated per second.")
					: (player.dynas_b.banking > 0 ? "Please disable the current active banking before you can activate another one." : "You need to build at least 6 banks before you can use this function.")
			},
			unlocked() { return player.tm.buyables[9].gte(9) },
			canAfford() { return (player[this.layer].best.gte(6) /*|| player[this.layer].buyables[33].gt(0)*/) && (player[this.layer].banking == 0 || player[this.layer].banking == 3) },
			buy() {
				if (player.dynas_b.banking == 3) player.dynas_b.buyables[13] = player.dynas_b.buyables[13].max(upgradeEffect("dynas_c",11))
				player.dynas_b.banking = player.dynas_b.banking == 3 ? 0 : 3
			tmp[this.layer].resetsNothing=false
				doReset(this.layer, true)
			},
		},
/*
		21: {
			title: () => "Metacoin Banking",
			cost(x) {
				return new Decimal(0)
			},
			effect(x) {
				var eff = player[this.layer].buyables[this.id].mul(2.5).add(1).pow(0.4)
				if (tmp.buyables.b[22]) eff = eff.mul(tmp.buyables.b[22].effect)
				if (tmp.buyables.b[23]) eff = eff.mul(tmp.buyables.b[23].effect)
				if (tmp.buyables.b[31]) eff = eff.mul(tmp.buyables.b[31].effect)
				var softcap = new Decimal(1e15)
				if (player.sp.buyables[30].gt(0)) softcap = softcap.mul(tmp.buyables.sp[30].effect)
				if (eff.gte(softcap)) eff = eff.mul(softcap).sqrt()
				if (player.sp.buyables[28].gt(0) && tmp.buyables.sp[28].effect.sqrt) eff = eff.mul(tmp.buyables.sp[28].effect.sqrt())
				return eff
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return data.canAfford
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " banked metacoins, which are boosting all previous bankings' buffs by ×" + format(data.effect) + ".\n\n\
						Banking is currently " + (player.b.banking == 4 ? "enabled.\n\
						Click here to disable banking and gain " + format(Decimal.sub(tmp.resetGain ? tmp.resetGain["c"] : 0, player.b.buyables[21]).max(0), 0) + " banked metacoins." : "disabled.\n\
						Click here to enable banking, which will tenth root your point generation and coin gains. The thing you are banking here is your coins gain on coin reset.")
					: (player.b.banking > 0 ? "Please disable the current active banking before you can activate another one." : "You need to build at least 12 banks before you can use this function.")
			},
			unl() { return hasMilestone("w", 10) },
			canAfford() { return (player[this.layer].best.gte(12) || player.b.buyables[33].gt(0)) && (player.b.banking == 0 || player.b.banking == 4) },
			buy() {
				if (player.b.banking == 4) player.b.buyables[21] = player.b.buyables[21].max(tmp.resetGain["c"])
				player.b.banking = player.b.banking == 4 ? 0 : 4
				doReset(this.layer, true)
			},
		},
		22: {
			title: () => "Metapoint Banking",
			cost(x) {
				return new Decimal(0)
			},
			effect(x) {
				var eff = player[this.layer].buyables[this.id].mul(2.5).add(1).pow(0.5)
				if (tmp.buyables.b[23]) eff = eff.mul(tmp.buyables.b[23].effect)
				if (tmp.buyables.b[31]) eff = eff.mul(tmp.buyables.b[31].effect)
				var softcap = new Decimal(1e15)
				if (player.sp.buyables[30].gt(0)) softcap = softcap.mul(tmp.buyables.sp[30].effect)
				if (eff.gte(softcap)) eff = eff.mul(softcap).sqrt()
				if (player.sp.buyables[28].gt(0) && tmp.buyables.sp[28].effect.sqrt) eff = eff.mul(tmp.buyables.sp[28].effect.sqrt())
				return eff
			},
			display() {
				let data = tmp.buyables[this.layer][this.id]
				return data.canAfford
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " banked metapoints, which are boosting all previous bankings' buffs by ×" + format(data.effect) + ".\n\n\
						Banking is currently " + (player.b.banking == 8 ? "enabled.\n\
						Click here to disable banking and gain " + format(Decimal.sub(tmp.pointGen, player.b.buyables[22]).max(0), 0) + " banked metapoints." : "disabled.\n\
						Click here to enable banking, which will override the point generation speed and make it stronger based on your current coin count ((coins^0.1)-1). You also bank point generated per second on this one.")
					: (player.b.banking > 0 ? "Please disable the current active banking before you can activate another one." : "You need to build at least 15 banks before you can use this function.")
			},
			unl() { return hasMilestone("w", 10) },
			canAfford() { return (player[this.layer].best.gte(15) || player.b.buyables[33].gt(0)) && (player.b.banking == 0 || player.b.banking == 8) },
			buy() {
				if (player.b.banking == 8) player.b.buyables[22] = player.b.buyables[22].max(tmp.pointGen)
				player.b.banking = player.b.banking == 8 ? 0 : 8
				doReset(this.layer, true)
			},
		},
		23: {
			title: () => "Work Banking",
			cost(x) {
				return new Decimal(0)
			},
			effect(x) {
				var eff = player[this.layer].buyables[this.id].mul(2.5).add(1).pow(0.6)
				if (tmp.buyables.b[31]) eff = eff.mul(tmp.buyables.b[31].effect)
				var softcap = new Decimal(1e15)
				if (player.sp.buyables[30].gt(0)) softcap = softcap.mul(tmp.buyables.sp[30].effect)
				if (eff.gte(softcap)) eff = eff.mul(softcap).sqrt()
				if (player.sp.buyables[28].gt(0) && tmp.buyables.sp[28].effect.sqrt) eff = eff.mul(tmp.buyables.sp[28].effect.sqrt())
				return eff
			},
			display() {
				let data = tmp.buyables[this.layer][this.id]
				return data.canAfford
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " banked work, which are which are boosting all previous bankings' buffs by ×" + format(data.effect) + ".\n\n\
						Banking is currently " + (player.b.banking == 15 ? "enabled.\n\
						Click here to disable banking and gain " + format(Decimal.sub(player.wf.workDone, player.b.buyables[23]).max(0), 0) + " banked work." : "disabled.\n\
						Click here to enable banking, which will activate all the previous bankings' debuffs at once. Your current finished and unfinished work are also resetted, and the finished work's speed is overriden and depends on your current point count ((points^0.2)-1). The thing you're banking here is your current finished work count.")
					: (player.b.banking > 0 ? "Please disable the current active banking before you can activate another one." : "You need to build at least 19 banks before you can use this function.")
			},
			unl() { return hasMilestone("w", 10) },
			canAfford() { return (player[this.layer].best.gte(19) || player.b.buyables[33].gt(0)) && (player.b.banking == 0 || player.b.banking == 15) },
			buy() {
				if (player.b.banking == 15) player.b.buyables[23] = player.b.buyables[23].max(player.wf.workDone)
				player.b.banking = player.b.banking == 15 ? 0 : 15
				player.wf.workDone = new Decimal(0)
				player.wf.workUndone = new Decimal(0)
				doReset(this.layer, true)
			},
		},	
		31: {	
			title:() => "Speed Banking",	
			cost(x) {	
				return new Decimal(0)	
			},	
			effect(x) { 	
				var eff = player[this.layer].buyables[this.id].add(1).pow(0.6)	
				if (player.sp.buyables[28].gt(0) && tmp.buyables.sp[28].effect.sqrt) eff = eff.mul(tmp.buyables.sp[28].effect.sqrt())
				return eff	
			},	
			display() { 	
				let data = tmp.buyables[this.layer][this.id]	
				return data.canAfford 	
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " banked speed, which are boosting all previous bankings' buffs by ×" + format(data.effect) + ".\n\n\
						Banking is currently " + (player.b.banking == 16 ? "enabled.\n\
						Click here to disable banking and gain " + format(Decimal.sub(player.b.speed, player.b.buyables[31]).max(0), 0) + " banked speed." : "disabled.\n\
						Click here to enable banking, which will make your point generation worse over time. You will also lose 99.999% of your points every second. In return, you will start gaining speed if your points generated per second is greater than 1e10 and will be converted into banked speed on banking disable.")	
					: (player.b.banking > 0 ? "Please disable the current active banking before you can activate another one." : "You need to build at least 60 banks before you can use this function.")	
			},	
			unl() { return hasChall("t", 21) }, 	
			canAfford() { return (player[this.layer].best.gte(60) || player.b.buyables[33].gt(0)) && (player.b.banking == 0 || player.b.banking == 16) },	
			buy() { 	
				if (player.b.banking == 16) player.b.buyables[31] = player.b.buyables[31].max(player.b.speed)	
				player.b.banking = player.b.banking == 16 ? 0 : 16	
                doReset(this.layer, true)	
			},	
		},
		32: {	
			title:() => "Production Banking",	
			cost(x) {	
				return new Decimal(0)	
			},	
			effect(x) { 	
				return new Decimal(1)
			},	
			display() { 	
				let data = tmp.buyables[this.layer][this.id]	
				return data.canAfford 	
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " banked production.\n\n\
						Banking is currently " + (player.b.banking == 19 ? "enabled.\n\
						Click here to disable banking and gain " + format(Decimal.sub(player.b.speed, player.b.buyables[32]).max(0), 0) + " banked speed." : "disabled.\n\
						Click here to enable banking, which will apply “Speed Banking” and “Time Banking” at once. This banking has no more purposes than just to produce banked speed.")	
					: (player.b.banking > 0 ? "Please disable the current active banking before you can activate another one." : "You need to build at least 80 banks before you can use this function.")	
			},	
			unl() { return hasChall("t", 21) }, 	
			canAfford() { return (player[this.layer].best.gte(80) || player.b.buyables[33].gt(0)) && (player.b.banking == 0 || player.b.banking == 19) },	
			buy() { 	
				if (player.b.banking == 19) player.b.buyables[32] = player.b.buyables[32].max(player.b.speed)	
				player.b.banking = player.b.banking == 19 ? 0 : 19	
                doReset(this.layer, true)	
			},	
		},
		33: {	
			title:() => "Generation Banking",	
			cost(x) {	
				return new Decimal(0)	
			},	
			effect(x) { 	
				var eff = player[this.layer].buyables[this.id].add(1).pow(0.5)	
				return eff	
			},	
			display() { 	
				let data = tmp.buyables[this.layer][this.id]	
				return data.canAfford 	
					? "You have " + format(player[this.layer].buyables[this.id], 0) + " banked generation, which are speeding the banking generation speed by ×" + format(data.effect) + ".\n\n\
						This one isn't much of a banking. Instead, this “banking” allows you to reset your banks for a boost in banking generation. This will not reset your bankings and does not produce banked production. Click here to gain " + format(Decimal.sub(player.b.points, player.b.buyables[33]).max(0), 0) + " banked generation."	
					: "You need to build at least 125 banks before you can use this function."
			},	
			unl() { return hasUpg("wi", 23) }, 	
			canAfford() { return player[this.layer].best.gte(125) || player.b.buyables[33].gt(0) },	
			buy() { 	
				player.b.buyables[33] = player.b.buyables[33].max(player.b.points)	
				player.b.points = new Decimal(0)
                doReset(this.layer, true)	
			},	
		},
*/
	},
	update(diff) {
		if (player.dynas_b.banking == 0) player.dynas_b.bankTime = new Decimal(0)
		else player.dynas_b.bankTime = Decimal.add(player.dynas_b.bankTime, diff) /*
		if (player.b.banking & 16) {
			if (new Decimal(1e10).lt(tmp.pointGen)) {
				let delta = new Decimal(1)
				player.b.speed = player.b.speed.add(delta.mul(diff))
			}
			player.points = player.points.mul(Decimal.pow(0.00001, diff))
		} else {
			player.b.speed = new Decimal(0)
		}*/
		
		/*if (hasMilestone("m", 5)) {
			let mults = [1e75, 1e50, 1e20, 1e8, 1e5, 5, 1]
			let curr = 11;
			for (var a = 1; a <= mults.length; a++) {
				let layer = Math.floor(a / 3 + 1) * 10 + ((a % 3) + 1)
				let realMult = tmp.buyables.b[33].effect.mul(mults[a-1])
				if (player.sp.buyables[28].gt(0)) realMult = realMult.mul(tmp.buyables.sp[28].effect)
				if (tmp.buyables.wi[12]) realMult = realMult.mul(tmp.buyables.wi[12].effect.pow(Math.pow(0.7, a-1)))
				
				player.b.buyables[curr] = player.b.buyables[curr].add(Decimal.mul(player.b.buyables[layer], diff).mul(realMult))
				curr = layer
			}
		}*/
		
		//if (inChallenge("t", 31)) player.b.banking = 3
		//if (inChallenge("t", 32)) player.b.banking = 4
	},

	tabFormat:
		["main-display",
			["prestige-button", function () { return "Build " }],
			["blank", "5px"],
			["display-text",
				function () { return "You have at best " + format(player.dynas_b.best, 0) + " " + " banks." }],
			["display-text",
				function () { return player.dynas_b.banking > 0 ? ("You have been banking for " + formatTime(player.dynas_b.bankTime.toNumber()) + (".")) : "" }],
			["display-text",
				function () { if(player.tm.buyables[9].lt(9))return "More Banking at The Dynas Tree Level 9";if(player.tm.buyables[9].lt(7))return "More Banking at The Dynas Tree Level 7";return player.dynas_b.banking & 16 ? ("You have " + format(player.dynas_b.speed) + " speed.") : "" }],
			["blank", "5px"],/*
			["display-text",
				function () { return "<h3>Bankings</h3><br/><h5>Note: Enabling/Disabling bankings will force a bank reset.<br/>Total multiplier to point generation: ×" + format(tmp.buyables.dynas_b[11].effect.mul(tmp.buyables.dynas_b[12].effect).mul(tmp.buyables.dynas_b[13].effect)) + "</h5>" }],*/
			"buyables", ["blank", "5px"]
			, "milestones", "upgrades"],
/*
	hotkeys: [
		{ key: "b", desc: "B: Build banks", onPress() { doReset(this.layer) } },
	],*/

})

addLayer("dynas_m", {
	startData() {
		return {
			unlocked: false,
			points: new Decimal(0),
			best: new Decimal(0),
			total: new Decimal(0),
			autoWorkerReset: false,
			autoWorkfinderReset: false,
			allocated: 0,
			landsAvailable: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			landsAllocated: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		}
	},

    layerShown(){return player.tm.currentTree==9 && player.tm.buyables[9].gte(5);},

	name: "manager",
	color: () => "#77FFFF",
	resource: "managers",
	row: 4,
	symbol: "M",

	baseResource: "banks",
	baseAmount() { return player["dynas_b"].points },
	branches: [["dynas_w", 1], ["dynas_b", 1]],

	requires: () => new Decimal(50),

	type: "static",
	base: 1.22727,
	exponent: 1.01,
	canBuyMax: () => false,
	resetsNothing: () => false,
	
	effect() {
		var eff = Decimal.pow(64, player.dynas_m.points).pow(2)
		//eff = eff.pow(tmp.buyables.wi[14].effect.second)
		return eff
	},
	effectDescription() {
		eff = this.effect()
		return "which are boosting your coin and dynas point gains by ×" + format(eff)
	},

	gainMult() {
		return new Decimal(1)
	},
	gainExp() {
		return new Decimal(1)
	},
		doReset(l){
			if(l=="dynas_c" || l=="dynas_wf"  || l=="dynas_b" || l=="dynas_w" || l=="dynas_m" || !l.startsWith("dynas_")){return;}
			layerDataReset("dynas_b",["upgrades","milestones","challenges"]);
			return;
		},
	milestones: {
		0: {
			requirementDescription: () => "1 Manager",
			done() { return player[this.layer].best.gte(1) },
			effectDescription: () => "You can bulk hire workers, workfinders and banks, workers and workfinders unlocks immediately, gain 10,000% of your coins gain on coin reset every second, and coin reset no longer reset anything. Auto-hire workers. Workers resets nothing."
		},
/*
		1: {
			requirementDesc: () => "2 Managers",
			done() { return player[this.layer].best.gte(2) },
			effectDesc: () => "Unlocks builders, which can build structures to boost your production."
		},
		2: {
			requirementDesc: () => "3 Managers",
			done() { return player[this.layer].best.gte(3) },
			effectDesc: () => "Hiring workers no longer resets anything and you can choose to automate finding workers. Also you unlock a new structure.",
			toggles: [["m", "autoWorkerReset"]]
		},
		3: {
			requirementDesc: () => "4 Managers",
			done() { return player[this.layer].best.gte(4) },
			effectDesc: () => "You can choose to automate finding workfinders. Also you unlock an another new structure. This one might be hard.",
			toggles: [["m", "autoWorkfinderReset"]]
		},
		4: {
			requirementDesc: () => "5 Managers",
			done() { return player[this.layer].best.gte(5) },
			effectDesc: () => "Unlocks an another new structure. This one is probably easier.",
		},
		5: {
			requirementDesc: () => "6 Managers",
			done() { return player[this.layer].best.gte(6) },
			effectDesc: () => "Each banking produces the banking before it. This will boost your builders' speed by a lot. You'll still need to manually do bankings sometimes though.",
		},
		6: {
			requirementDesc: () => "7 Managers",
			done() { return player[this.layer].best.gte(7) },
			effectDesc: () => "Unlocks an another new structure. This one is very important.",
		},
		7: {
			requirementDesc: () => "8 Managers",
			done() { return player[this.layer].best.gte(8) },
			effectDesc: () => "Unlocks an another new structure. This one is also important.",
		},
		8: {
			requirementDesc: () => "10 Managers",
			done() { return player[this.layer].best.gte(10) },
			effectDesc: () => "Managers now have the ability to manage jobs and lands.",
		},
		9: {
			requirementDesc: () => "Not available yet",
			done() { return false },
			effectDesc: () => "To be continued...",
		},*/
	},
	/*
	buyables: {
		respec() { 
			player.m.allocated = 0
			player.m.landsAllocated = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			resetBuyables(this.layer)
			doReset(this.layer, true)
		},
		respecText:() => "Respec Land & Jobs Allocation",
		rows: 1,
		cols: 10,
		11: {
			title: () => "Farmlands",
			cost(x) {
				return Decimal.add(8, Decimal.pow(1.2, x)).ceil()
			},
			effect(x) {
				return Decimal.pow(x.add(1), 12 * Math.E)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "You have " + format(player[this.layer].buyables[this.id], 0) + " farmlands, which are boosting point generation by ×" + format(data.effect) + "." + "\nAllocation cost: " + formatWhole(data.cost) + " grasslands tiles and 1 managing power"
			},
			unl() { return true },
			canAfford() { return (!player.m.landsUndoMode && Decimal.gte(player.m.landsAvailable[1] - player.m.landsAllocated[1], tmp.buyables.m[11].cost) && player.m.points.mul(2).sub(player.m.allocated).gte(1)) || (player.m.landsUndoMode && player.m.buyables[11].gte(1)) },
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost.toNumber()
				player.m.landsAllocated[1] += cost;
				player.m.allocated++;
				player.m.buyables[11] = player.m.buyables[11].add(1)
			},
			style() {
				return {
					"height": "200px",
				}
			}
		},
		12: {
			title: () => "Sheep Farm",
			cost(x) {
				return Decimal.add(5, Decimal.pow(1.2, x)).ceil()
			},
			effect(x) {
				return Decimal.pow(x.add(1), 15 * Math.E)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "You have " + format(player[this.layer].buyables[this.id], 0) + " sheep farms, which are boosting point generation by ×" + format(data.effect) + "." + "\nAllocation cost: " + formatWhole(data.cost) + " tundra tiles and 1 managing power"
			},
			unl() { return true },
			canAfford() { return (!player.m.landsUndoMode && Decimal.gte(player.m.landsAvailable[5] - player.m.landsAllocated[5], tmp.buyables.m[12].cost) && player.m.points.mul(2).sub(player.m.allocated).gte(1)) || (player.m.landsUndoMode && player.m.buyables[12].gte(1)) },
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost.toNumber()
				player.m.landsAllocated[5] += cost;
				player.m.allocated++;
				player.m.buyables[12] = player.m.buyables[12].add(1)
			},
			style() {
				return {
					"height": "200px",
				}
			}
		},
		13: {
			title: () => "Mine",
			cost(x) {
				return Decimal.add(3, Decimal.pow(1.2, x)).ceil()
			},
			effect(x) {
				return Decimal.pow(x.add(1), 20 * Math.E)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "You have " + format(player[this.layer].buyables[this.id], 0) + " mines, which are boosting point generation by ×" + format(data.effect) + "." + "\nAllocation cost: " + formatWhole(data.cost) + " mountain tiles and 1 managing power"
			},
			unl() { return true },
			canAfford() { return (!player.m.landsUndoMode && Decimal.gte(player.m.landsAvailable[2] - player.m.landsAllocated[2], tmp.buyables.m[13].cost) && player.m.points.mul(2).sub(player.m.allocated).gte(1)) || (player.m.landsUndoMode && player.m.buyables[13].gte(1)) },
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost.toNumber()
				player.m.landsAllocated[2] += cost;
				player.m.allocated++;
				player.m.buyables[13] = player.m.buyables[13].add(1)
			},
			style() {
				return {
					"height": "200px",
				}
			}
		},
		14: {
			title: () => "Large Mine",
			cost(x) {
				return Decimal.add(1, Decimal.pow(1.2, x)).ceil()
			},
			effect(x) {
				return Decimal.pow(x.add(1), 30 * Math.E)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "You have " + format(player[this.layer].buyables[this.id], 0) + " large mines, which are boosting point generation by ×" + format(data.effect) + "." + "\nAllocation cost: " + formatWhole(data.cost) + " tall mountain tiles and 1 managing power"
			},
			unl() { return true },
			canAfford() { return (!player.m.landsUndoMode && Decimal.gte(player.m.landsAvailable[3] - player.m.landsAllocated[3], tmp.buyables.m[14].cost) && player.m.points.mul(2).sub(player.m.allocated).gte(1)) || (player.m.landsUndoMode && player.m.buyables[14].gte(1)) },
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost.toNumber()
				player.m.landsAllocated[3] += cost;
				player.m.allocated++;
				player.m.buyables[14] = player.m.buyables[14].add(1)
			},
			style() {
				return {
					"height": "200px",
				}
			}
		},
		15: {
			title: () => "Wood Workshop",
			cost(x) {
				return Decimal.add(5, Decimal.pow(1.2, x)).ceil()
			},
			effect(x) {
				return Decimal.pow(x.add(1), 16 * Math.E)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "You have " + format(player[this.layer].buyables[this.id], 0) + " wood workshops, which are boosting point generation by ×" + format(data.effect) + "." + "\nAllocation cost: " + formatWhole(data.cost) + " forest tiles and 1 managing power"
			},
			unl() { return true },
			canAfford() { return (!player.m.landsUndoMode && Decimal.gte(player.m.landsAvailable[6] - player.m.landsAllocated[6], tmp.buyables.m[15].cost) && player.m.points.mul(2).sub(player.m.allocated).gte(1)) || (player.m.landsUndoMode && player.m.buyables[15].gte(1)) },
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost.toNumber()
				player.m.landsAllocated[6] += cost;
				player.m.allocated++;
				player.m.buyables[15] = player.m.buyables[15].add(1)
			},
			style() {
				return {
					"height": "200px",
				}
			}
		},
		16: {
			title: () => "Large Wood Workshop",
			cost(x) {
				return Decimal.add(5, Decimal.pow(1.2, x)).ceil()
			},
			effect(x) {
				return Decimal.pow(x.add(1), 18 * Math.E)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "You have " + format(player[this.layer].buyables[this.id], 0) + " large wood workshops, which are boosting point generation by ×" + format(data.effect) + "." + "\nAllocation cost: " + formatWhole(data.cost) + " rainforest tiles and 1 managing power"
			},
			unl() { return true },
			canAfford() { return (!player.m.landsUndoMode && Decimal.gte(player.m.landsAvailable[8] - player.m.landsAllocated[8], tmp.buyables.m[16].cost) && player.m.points.mul(2).sub(player.m.allocated).gte(1)) || (player.m.landsUndoMode && player.m.buyables[16].gte(1)) },
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost.toNumber()
				player.m.landsAllocated[8] += cost;
				player.m.allocated++;
				player.m.buyables[16] = player.m.buyables[16].add(1)
			},
			style() {
				return {
					"height": "200px",
				}
			}
		},
		17: {
			title: () => "Savanna Transportation",
			cost(x) {
				return Decimal.add(5, Decimal.pow(1.2, x)).ceil()
			},
			effect(x) {
				return Decimal.pow(x.add(1), 15 * Math.E)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "You have " + format(player[this.layer].buyables[this.id], 0) + " savanna transportations, which are boosting point generation by ×" + format(data.effect) + "." + "\nAllocation cost: " + formatWhole(data.cost) + " savanna tiles and 1 managing power"
			},
			unl() { return true },
			canAfford() { return (!player.m.landsUndoMode && Decimal.gte(player.m.landsAvailable[7] - player.m.landsAllocated[7], tmp.buyables.m[17].cost) && player.m.points.mul(2).sub(player.m.allocated).gte(1)) || (player.m.landsUndoMode && player.m.buyables[17].gte(1)) },
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost.toNumber()
				player.m.landsAllocated[7] += cost;
				player.m.allocated++;
				player.m.buyables[17] = player.m.buyables[17].add(1)
			},
			style() {
				return {
					"height": "200px",
				}
			}
		},
		18: {
			title: () => "Desert Transportation",
			cost(x) {
				return Decimal.add(5, Decimal.pow(1.2, x)).ceil()
			},
			effect(x) {
				return Decimal.pow(x.add(1), 18 * Math.E)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "You have " + format(player[this.layer].buyables[this.id], 0) + " desert transportations, which are boosting point generation by ×" + format(data.effect) + "." + "\nAllocation cost: " + formatWhole(data.cost) + " desert tiles and 1 managing power"
			},
			unl() { return true },
			canAfford() { return (!player.m.landsUndoMode && Decimal.gte(player.m.landsAvailable[4] - player.m.landsAllocated[4], tmp.buyables.m[18].cost) && player.m.points.mul(2).sub(player.m.allocated).gte(1)) || (player.m.landsUndoMode && player.m.buyables[18].gte(1)) },
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost.toNumber()
				player.m.landsAllocated[4] += cost;
				player.m.allocated++;
				player.m.buyables[18] = player.m.buyables[18].add(1)
			},
			style() {
				return {
					"height": "200px",
				}
			}
		},
		19: {
			title: () => "Fish Farm",
			cost(x) {
				return Decimal.add(1, Decimal.pow(1.2, x)).ceil()
			},
			effect(x) {
				return Decimal.pow(x.add(1), 100 * Math.E)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "You have " + format(player[this.layer].buyables[this.id], 0) + " fish farms, which are boosting point generation by ×" + format(data.effect) + "." + "\nAllocation cost: " + formatWhole(data.cost) + " waters tiles and 1 managing power"
			},
			unl() { return true },
			canAfford() { return (!player.m.landsUndoMode && Decimal.gte(player.m.landsAvailable[0] - player.m.landsAllocated[0], tmp.buyables.m[19].cost) && player.m.points.mul(2).sub(player.m.allocated).gte(1)) || (player.m.landsUndoMode && player.m.buyables[19].gte(1)) },
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost.toNumber()
				player.m.landsAllocated[0] += cost;
				player.m.allocated++;
				player.m.buyables[19] = player.m.buyables[19].add(1)
			},
			style() {
				return {
					"height": "200px",
				}
			}
		},
		20: {
			title: () => "Ice Farm",
			cost(x) {
				return Decimal.add(1, Decimal.pow(1.2, x)).ceil()
			},
			effect(x) {
				return Decimal.pow(x.add(1), 250 * Math.E)
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp.buyables[this.layer][this.id]
				return "You have " + format(player[this.layer].buyables[this.id], 0) + " ice farms, which are boosting point generation by ×" + format(data.effect) + "." + "\nAllocation cost: " + formatWhole(data.cost) + " iced waters tiles and 1 managing power"
			},
			unl() { return true },
			canAfford() { return (!player.m.landsUndoMode && Decimal.gte(player.m.landsAvailable[9] - player.m.landsAllocated[9], tmp.buyables.m[20].cost) && player.m.points.mul(2).sub(player.m.allocated).gte(1)) || (player.m.landsUndoMode && player.m.buyables[20].gte(1)) },
			buy() {
				cost = tmp.buyables[this.layer][this.id].cost.toNumber()
				player.m.landsAllocated[9] += cost;
				player.m.allocated++;
				player.m.buyables[20] = player.m.buyables[20].add(1)
			},
			style() {
				return {
					"height": "200px",
				}
			}
		},
	},
*/
	
	microtabs: {
		stuff: {
			milestones: { title: () => "Milestones",  content: [
				"milestones"
			]},/*
			lands: { title: () => "Land & Jobs Management", unl: () => hasMilestone("m", 8), content: [
				["display-text",
					function () { return "You have allocated " + format(player.m.allocated, 0) + " / " + format(player.m.points.mul(2), 0) + ` managing power.<h5>Each manager gives 2 managing power.<br/>Total land multiplier to point generation: ×` + format(tmp.landMul) }],
				["blank", "5px"],
				"respec-button",
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#7FFF00'>;;;</span>] Grasslands</h3><h5>" + formatWhole(player.m.landsAllocated[1]) + " / " + formatWhole(player.m.landsAvailable[1]) + " allocated</h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 11]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#FFFFFF'>:::</span>] Tundra</h3><h5>" + formatWhole(player.m.landsAllocated[5]) + " / " + formatWhole(player.m.landsAvailable[5]) + " allocated</h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 12]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#7FFF00'>^^^</span>] Mountains</h3><h5>" + formatWhole(player.m.landsAllocated[2]) + " / " + formatWhole(player.m.landsAvailable[2]) + " allocated</h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 13]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#FFFFFF'>AAA</span>] Tall Mountains</h3><h5>" + formatWhole(player.m.landsAllocated[3]) + " / " + formatWhole(player.m.landsAvailable[3]) + " allocated</h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 14]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#00FF00'>TTT</span>] Forest</h3><h5>" + formatWhole(player.m.landsAllocated[6]) + " / " + formatWhole(player.m.landsAvailable[6]) + " allocated</h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 15]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#007F00'>♠♠♠</span>] Rainforest</h3><h5>" + formatWhole(player.m.landsAllocated[8]) + " / " + formatWhole(player.m.landsAvailable[8]) + " allocated</h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 16]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#FFFF7F'>,,,</span>] Savanna</h3><h5>" + formatWhole(player.m.landsAllocated[7]) + " / " + formatWhole(player.m.landsAvailable[7]) + " allocated</h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 17]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#FFFF7F'>...</span>] Desert</h3><h5>" + formatWhole(player.m.landsAllocated[4]) + " / " + formatWhole(player.m.landsAvailable[4]) + " allocated</h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 18]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#0000FF'>~~~</span>] Waters</h3><h5>" + formatWhole(player.m.landsAllocated[0]) + " / " + formatWhole(player.m.landsAvailable[0]) + " allocated</h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 19]]],
				["blank", "5px"],
				["display-text",
					function () { return "<h3>[<span style='color:#7F7FFF'>~~~</span>] Iced Waters</h3><h5>" + formatWhole(player.m.landsAllocated[9]) + " / " + formatWhole(player.m.landsAvailable[9]) + " allocated</h5>" + "<br/><p style='color:transparent; font-size:0.001px'>" + format(player.time) + "</p>" }],
				["row", [["buyable", 20]]],
				["blank", "5px"],
			]},*/
		}
	},
	tabFormat:
		["main-display",
			["prestige-button", function () { return "Hire " }],
			["blank", "5px"],
			["display-text",
				function () { return "You have at best " + format(player.dynas_m.best, 0) + " " + " managers." }],
			["blank", "5px"], ["microtabs", "stuff"],
		],
/*
	hotkeys: [
		{ key: "m", desc: "M: Hire managers", onPress() { doReset(this.layer) } },
	],
*/
})