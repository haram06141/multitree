
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
		if(hasUpgrade("tptc_p",32))ret=ret.mul(upgradeEffect("tptc_p",32));
		if(hasUpgrade("tptr_p",21))ret=ret.mul(upgradeEffect("tptr_p",21));
		if(hasUpgrade("tptr_p",23))ret=ret.mul(upgradeEffect("tptr_p",23));
		if(hasUpgrade("tptr_b",11))ret=ret.mul(upgradeEffect("tptr_b",11));
		if(hasUpgrade("tptr_g",11))ret=ret.mul(upgradeEffect("tptr_g",11));
		if (player.tptr_t.unlocked) ret = ret.times(tmp.tptr_t.enEff);
		if(player.tptr_s.unlocked)ret=ret.mul(buyableEffect("tptr_s",11));
		if(player.tptr_e.unlocked)ret=ret.mul(buyableEffect("tptr_e",11).first);
        return ret
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
			if (hasUpgrade("tptr_p", 31))return  new Decimal(1.05);
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.tm.currentTree==7 && hasUpgrade("tm",16)},
		upgrades: {
			rows: 3,
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
					if(hasUpgrade("incrementy_p",34))ret=ret.mul(1e3);
					if (player.tptr_t.unlocked) ret = ret.times(tmp.tptr_t.enEff);
					if(player.tptr_s.unlocked)ret=ret.mul(buyableEffect("tptr_s",11));
                    return ret;
				},
			},
			12: {
				title: "Prestige Boost",
				description: "Prestige Points boost Rewritten Point generation.",
				cost() { return new Decimal(1); },
				effect() {
					let eff = player.tptr_p.points.plus(2).pow(0.5);
					if (hasUpgrade("tptr_g", 14)) eff = eff.pow(1.5);
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
					if (hasUpgrade("tptr_p", 33)) eff = eff.pow(upgradeEffect("tptr_p", 33));
					if (hasUpgrade("tptr_g", 15)) eff = eff.pow(upgradeEffect("tptr_g", 15));
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
					if (hasUpgrade("tptr_p", 32)) eff = eff.pow(2);
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
					if (hasUpgrade("tptr_p", 33)) eff = eff.pow(upgradeEffect("tptr_p", 33));
					if (hasUpgrade("tptr_g", 23)) eff = eff.pow(upgradeEffect("tptr_g", 23));
					return eff;
				},
				unlocked() { return player.tptr_b.best.gte(1)&&hasUpgrade("tptr_p", 13) },
				effectDisplay() { return format(this.effect())+"x" },
			},
			31: {
				title: "WE NEED MORE PRESTIGE",
				description: "Prestige Point gain is raised to the power of 1.05.",
				cost() { return new Decimal(1e45); },
				unlocked() { return player.tm.buyables[7].gte(4); },
			},
			32: {
				title: "Still Useless",
				description: "<b>Upgrade Power</b> is squared.",
				cost() { return new Decimal("1e2800"); },
				unlocked() { return player.tm.buyables[7].gte(4); },
			},
			33: {
				title: "Column Leader",
				description: "Both above upgrades are stronger based on your Total Prestige Points.",
				cost() { return new Decimal("1e2800"); },
				effect() { return player.tptr_p.total.plus(1).log10().plus(1).log10().div(5).plus(1) },
				effectDisplay() { return "^"+format(tmp.tptr_p.upgrades[33].effect) },
				unlocked() { return player.tm.buyables[7].gte(4); },
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
	 passiveGeneration(){
		 if(player.tptr_g.best.gte(10))return 1;
		 return 0;
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
		if (hasUpgrade("tptr_b", 23)) mult = mult.div(upgradeEffect("tptr_b", 23));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	getResetGain() {
		let ret=getResetGain(this.layer,"static").add(player[this.layer].points);
		if(ret.gte(1000))ret=ret.div(12).sqrt().mul(12).div(1225).pow(0.1).mul(1225).max(1000);
		return ret.sub(player[this.layer].points);
	},
	getNextAt(canMax) {
		if (!tmp[this.layer].canBuyMax) canMax = false
		let amt = player[this.layer].points.plus((canMax&&tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt))?tmp[this.layer].resetGain:0)
		if(amt.gte(1000))amt=amt.div(1225).pow(10).mul(1225).div(12).pow(2).mul(12).max(1000);
		let extraCost = Decimal.pow(tmp[this.layer].base, amt.pow(tmp[this.layer].exponent).div(tmp[this.layer].gainExp)).times(tmp[this.layer].gainMult)
		let cost = extraCost.times(tmp[this.layer].requires).max(tmp[this.layer].requires)
		if (tmp[this.layer].roundUpCost) cost = cost.ceil()
		return cost;
	},
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.tm.currentTree==7 && hasUpgrade("tm",17)},
		doReset(l){
			if(l=="tptr_p" || l=="tptr_b" || l=="tptr_g" || !l.startsWith("tptr_")){return;}
			var b=new Decimal(player.tptr_b.best);
			layerDataReset("tptr_b",["upgrades","milestones","challenges"]);
			player.tptr_b.best=b;
			return;
		},
		addToBase() {
			let base = new Decimal(0);
			if (hasUpgrade("tptr_b", 12)) base = base.plus(upgradeEffect("tptr_b", 12));
			if (hasUpgrade("tptr_b", 13)) base = base.plus(upgradeEffect("tptr_b", 13));
			if (hasUpgrade("tptr_t", 11)) base = base.plus(upgradeEffect("tptr_t", 11));
			if(player.tptr_s.unlocked) base = base.plus(buyableEffect("tptr_s",12));
			if(player.tptr_e.unlocked) base = base.plus(buyableEffect("tptr_e",11).second);
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
		let eff2 = player.tptr_b.points.add(1)
		if (hasUpgrade("tptc_b", 13))eff2 = eff2.pow(2)
		let ret = [Decimal.pow(tmp.tptr_b.effectBase, player.tptr_b.points).max(0), eff2];
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
			12: {
				title: "Cross-Contamination",
				description: "Generators add to the Booster effect base.",
				cost() { return new Decimal(7); },
				effect() {
					let ret = player.tptr_g.points.add(1).log10().sqrt().div(3);
					return ret;
				},
				unlocked() { return hasUpgrade("tm",22) },
				effectDisplay() { return "+"+format(tmp.tptr_b.upgrades[12].effect) },
			},
			13: {
				title: "PB Reversal",
				description: "Total Prestige Points add to the Booster effect base.",
				cost() { return new Decimal(8); },
				effect() {
					let ret = player.tptr_p.total.add(1).log10().add(1).log10().div(3);
					return ret;
				},
				unlocked() { return hasUpgrade("tm",22) },
				effectDisplay() { return "+"+format(tmp.tptr_b.upgrades[13].effect) },
			},
			21: {
				title: "Gen Z^2",
				description: "Square the Generator Power effect.",
				cost() { return new Decimal(9);},
				unlocked() { return hasUpgrade("tm",22) },
			},
			22: {
				title: "Up to the Fifth Floor",
				description: "Raise the Generator Power effect ^1.2.",
				cost() { return new Decimal(23); },
				unlocked() { return hasUpgrade("tm",22) },
			},
			23: {
				title: "Discount One",
				description: "Boosters are cheaper based on your Rewritten Points.",
				cost() { return new Decimal(91); },
				effect() { 
					let ret = player.modpoints[7].add(1).log10().add(1).pow(3.2);
					return ret;
				},
				unlocked() { return hasUpgrade("tm",22) },
				effectDisplay() { return "/"+format(tmp.tptr_b.upgrades[23].effect) },
			},
		},
		
		milestones: {
			0: {
				requirementDescription: "7 Boosters",
				done() { return player.tptr_b.best.gte(7) },
				effectDescription: "You can buy max Boosters.",
			},
		},
		canBuyMax() {return player.tptr_b.best.gte(7)},
		resetsNothing() {return player.tptr_t.best.gte(1)},
		autoPrestige() {return player.tptr_t.best.gte(1)},
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
		if (hasUpgrade("tptr_g", 22)) mult = mult.div(upgradeEffect("tptr_g", 22));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	getResetGain() {
		let ret=getResetGain(this.layer,"static").add(player[this.layer].points);
		if(ret.gte(1000))ret=ret.div(12).sqrt().mul(12).div(1225).pow(0.1).mul(1225).max(1000);
		return ret.sub(player[this.layer].points);
	},
	getNextAt(canMax) {
		if (!tmp[this.layer].canBuyMax) canMax = false
		let amt = player[this.layer].points.plus((canMax&&tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt))?tmp[this.layer].resetGain:0)
		if(amt.gte(1000))amt=amt.div(1225).pow(10).mul(1225).div(12).pow(2).mul(12).max(1000);
		let extraCost = Decimal.pow(tmp[this.layer].base, amt.pow(tmp[this.layer].exponent).div(tmp[this.layer].gainExp)).times(tmp[this.layer].gainMult)
		let cost = extraCost.times(tmp[this.layer].requires).max(tmp[this.layer].requires)
		if (tmp[this.layer].roundUpCost) cost = cost.ceil()
		return cost;
	},
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.tm.currentTree==7 && hasUpgrade("tm",18)},
		doReset(l){
			if(l=="tptr_p" || l=="tptr_b" || l=="tptr_g" || !l.startsWith("tptr_")){return;}
			var b=new Decimal(player.tptr_g.best);
			layerDataReset("tptr_g",["upgrades","milestones","challenges"]);
			player.tptr_g.best=b;
			return;
		},
		addToBase() {
			let base = new Decimal(0);
			return base;
		},
		effBase() {
			let base = new Decimal(2);
			
			// ADD
			if (hasUpgrade("tptr_g", 12)) base = base.plus(upgradeEffect("tptr_g", 12));
			if (hasUpgrade("tptr_g", 13)) base = base.plus(upgradeEffect("tptr_g", 13));
			if(player.tptr_s.unlocked) base = base.plus(buyableEffect("tptr_s",12));
			if(player.tptr_e.unlocked) base = base.plus(buyableEffect("tptr_e",11).second);
			
			// MULTIPLY
			
			return base;
		},
		effect() {
			let eff2 = player.tptr_g.points.add(1)
			if (hasUpgrade("tptc_g", 13))eff2 = eff2.pow(2)
			let eff = [Decimal.pow(this.effBase(), player.tptr_g.points).sub(1).max(0), eff2];
			if (hasUpgrade("tptr_g", 21)) eff[0] = eff[0].times(upgradeEffect("tptr_g", 21));
			
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
			if(hasUpgrade("tptr_b",21))exp = exp.mul(2);
			if(hasUpgrade("tptr_b",22))exp = exp.mul(1.2);
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
			12: {
				title: "I Need More!",
				description: "Boosters add to the Generator base.",
				cost() { return new Decimal(7) },
				effect() { 
					let ret = player.tptr_b.points.add(1).log10().sqrt().div(3)
					return ret;
				},
				unlocked() { return hasUpgrade("tm",22) },
				effectDisplay() { return "+"+format(tmp.tptr_g.upgrades[12].effect) },
			},
			13: {
				title: "I Need More II",
				description: "Best Prestige Points add to the Generator base.",
				cost() { return new Decimal(8) },
				effect() { 
					let ret = player.tptr_p.best.add(1).log10().add(1).log10().div(3);
					return ret;
				},
				unlocked() { return hasUpgrade("tm",22) },
				effectDisplay() { return "+"+format(tmp.tptr_g.upgrades[13].effect) },
			},
			14: {
				title: "Boost the Boost",
				description() { return "<b>Prestige Boost</b> is raised to the power of 1.5." },
				cost() { return new Decimal(13) },
				unlocked() { return hasUpgrade("tm",22) },
			},
			15: {
				title: "Outer Synergy",
				description: "<b>Self-Synergy</b> is stronger based on your Generators.",
				cost() { return new Decimal(27) },
				effect() { 
					let eff = player.tptr_g.points.sqrt().add(1);
					if (eff.gte(400)) eff = eff.cbrt().times(Math.pow(400, 2/3))
					return eff;
				},
				unlocked() { return hasUpgrade("tm",22) },
				effectDisplay() { return "^"+format(tmp.tptr_g.upgrades[15].effect) },
			},
			21: {
				title: "I Need More III",
				description: "Generator Power boost its own generation.",
				cost() { return new Decimal(94) },
				effect() { 
					let ret = player.tptr_g.power.add(1).log10().add(1);
					return ret;
				},
				unlocked() { return hasUpgrade("tm",22) },
				effectDisplay() { return format(tmp.tptr_g.upgrades[21].effect)+"x" },
			},
			22: {
				title: "Discount Two",
				description: "Generators are cheaper based on your Prestige Points.",
				cost() { return new Decimal(97) },
				effect() { 
					let eff = player.tptr_p.points.add(1).pow(0.25);
					return eff;
				},
				unlocked() { return hasUpgrade("tm",22) },
				effectDisplay() { return "/"+format(tmp.tptr_g.upgrades[22].effect) },
			},
			23: {
				title: "Double Reversal",
				description: "<b>Reverse Prestige Boost</b> is stronger based on your Boosters.",
				cost() { return new Decimal(117) },
				effect() { return player.tptr_b.points.pow(0.5).add(1) },
				unlocked() { return hasUpgrade("tm",22) },
				effectDisplay() { return "^"+format(tmp.tptr_g.upgrades[23].effect) },
			},
		},
		
		milestones: {
			0: {
				requirementDescription: "7 Generators",
				done() { return player.tptr_g.best.gte(7) },
				effectDescription: "You can buy max Generators.",
			},
			1: {
				requirementDescription: "10 Generators",
				done() { return player.tptr_g.best.gte(10) },
				effectDescription: "You gain 100% of Prestige Point gain every second.",
			},
		},
		canBuyMax() {return player.tptr_g.best.gte(7)},
		resetsNothing() {return player.tptr_s.best.gte(1)},
		autoPrestige() {return player.tptr_s.best.gte(1)},
});


addLayer("tptr_t", {
    name: "tptr_t", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
			energy: new Decimal(0),
    }},
    color: "#006609",
    requires: new Decimal(1e120), // Can be a function that takes requirement increases into account
    resource: "time capsules", // Name of prestige currency
    baseResource: "rewritten points", // Name of resource prestige is based on
    baseAmount() {return player.modpoints[7]}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	branches: ["tptr_b"],
    exponent: 1.85, // Prestige currency exponent
    base: 1e15, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	getResetGain() {
		let ret=getResetGain(this.layer,"static").add(player[this.layer].points);
		if(ret.gte(1000))ret=ret.div(12).sqrt().mul(12).max(1000);
		if(ret.gte(1500))ret=ret.div(1225).pow(0.1).mul(1225).max(1500);
		return ret.sub(player[this.layer].points);
	},
	getNextAt(canMax) {
		if (!tmp[this.layer].canBuyMax) canMax = false
		let amt = player[this.layer].points.plus((canMax&&tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt))?tmp[this.layer].resetGain:0)
		if(amt.gte(1500))amt=amt.div(1225).pow(10).mul(1225).max(1500);
		if(amt.gte(1000))amt=amt.div(12).pow(2).mul(12).max(1000);
		let extraCost = Decimal.pow(tmp[this.layer].base, amt.pow(tmp[this.layer].exponent).div(tmp[this.layer].gainExp)).times(tmp[this.layer].gainMult)
		let cost = extraCost.times(tmp[this.layer].requires).max(tmp[this.layer].requires)
		if (tmp[this.layer].roundUpCost) cost = cost.ceil()
		return cost;
	},
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.tm.currentTree==7 && hasUpgrade("tm",26)},
		doReset(l){
			if(l=="tptr_p" || l=="tptr_b" || l=="tptr_g" || l=="tptr_t" || l=="tptr_e" || l=="tptr_s" || l=="tptr_sb" || l=="tptr_sg" || !l.startsWith("tptr_")){return;}
			var b=new Decimal(player.tptr_t.best);
			layerDataReset("tptr_t",["upgrades","milestones","challenges"]);
			player.tptr_t.best=b;
			return;
		},
		enCapMult() {
			let mult = new Decimal(1);
			if (hasUpgrade("tptr_t", 12)) mult = mult.times(upgradeEffect("tptr_t", 12));
			return mult;
		},
		enGainMult() {
			let mult = new Decimal(1);
			return mult;
		},
		effBaseMult() {
			let mult = new Decimal(1);
			return mult;
		},
		effBasePow() {
			let exp = new Decimal(1);
			return exp;
		},
		effGainBaseMult() {
			let mult = new Decimal(1);
			return mult;
		},
		effLimBaseMult() {
			let mult = new Decimal(1);
			return mult;
		},
		nonExtraTCPow() {
			let pow = new Decimal(1);
			return pow;
		},
		effect() { 
			if(!hasUpgrade("tm",26))return {gain: new Decimal(0), limit: new Decimal(0), tptc_t_boost: new Decimal(1)};
			else return {
				gain: Decimal.pow(tmp.tptr_t.effBaseMult.times(tmp.tptr_t.effGainBaseMult).times(3).pow(tmp.tptr_t.effBasePow), player.tptr_t.points.times(tmp.tptr_t.nonExtraTCPow).plus(player.tptr_t.buyables[11]).plus(tmp.tptr_t.freeExtraTimeCapsules)).sub(1).max(0).times(player.tptr_t.points.times(tmp.tptr_t.nonExtraTCPow).plus(player.tptr_t.buyables[11]).gt(0)?1:0).times(tmp.tptr_t.enGainMult).max(0),
				limit: Decimal.pow(tmp.tptr_t.effBaseMult.times(tmp.tptr_t.effLimBaseMult).times(2).pow(tmp.tptr_t.effBasePow), player.tptr_t.points.times(tmp.tptr_t.nonExtraTCPow).plus(player.tptr_t.buyables[11]).plus(tmp.tptr_t.freeExtraTimeCapsules)).sub(1).max(0).times(100).times(player.tptr_t.points.times(tmp.tptr_t.nonExtraTCPow).plus(player.tptr_t.buyables[11]).gt(0)?1:0).times(tmp.tptr_t.enCapMult).max(0),
				tptc_t_boost: player.tptr_t.points.add(1)
			}
		},
		effectDescription() {
			return "which are generating "+format(tmp.tptr_t.effect.gain)+" Time Energy/sec, but with a limit of "+format(tmp.tptr_t.effect.limit)+" Time Energy.<br>Your non-extra time capsules boosting the base of time capsules in TPTC by "+format(tmp.tptr_t.effect.tptc_t_boost)+"x"
		},
		enEff() {
			if(!hasUpgrade("tm",26))return new Decimal(1);
			let eff = player.tptr_t.energy.add(1).pow(1.2);
			return eff;
		},
		milestones: {
			0: {
				requirementDescription: "1 Time Capsule",
				done() { return player.tptr_t.best.gte(1) },
				effectDescription: "Autobuy Boosters, Boosters resets nothing.",
			},
			1: {
				requirementDescription: "7 Time Capsules",
				done() { return player.tptr_t.best.gte(7) },
				effectDescription: "You can buy max Time Capsules.",
			},
		},
		update(diff) {
			if(hasUpgrade("tm",26))player.tptr_t.energy = player.tptr_t.energy.plus(this.effect().gain.times(diff)).min(this.effect().limit).max(0);
		},tabFormat: ["main-display",
			"prestige-button",
			"blank",
			["display-text",
				function() {return 'You have ' + format(player.tptr_t.energy) + ' Time Energy, which boosts Point & Prestige Point gain by '+format(tmp.tptr_t.enEff)+'x'},
					{}],
			"blank",
			["display-text",
				function() {return 'Your best Time Capsules is ' + formatWhole(player.tptr_t.best)},
					{}],
			"blank",
			"milestones", "blank", "buyables", "blank", "upgrades"],
		buyables: {
			rows: 1,
			cols: 1,
			11: {
				title: "Extra Time Capsules",
				costExp() {
					let exp = new Decimal(1.2);
					return exp;
				},
				cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if (x.gte(25) && tmp[this.layer].buyables[this.id].costScalingEnabled) x = x.pow(2).div(25)
                    let cost = x.times(0.4).pow(tmp[this.layer].buyables[this.id].costExp).add(1).times(10)
                    return cost.floor()
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+formatWhole(player[this.layer].buyables[this.id])+" Extra Time Capsules.\n\
					Cost for Next Extra Time Capsule: " + format(data.cost) + " Boosters";
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return player.tptr_b.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
					if(player.tptr_b.points.lt(tmp[this.layer].buyables[this.id].cost))return;
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                style: {'height':'222px'},
			}
		},
		upgrades: {
			rows: 4,
			cols: 5,
			11: {
				title: "Pseudo-Boost",
				description: "Non-extra Time Capsules add to the Booster base.",
				cost() { return new Decimal(5) },
				unlocked() { return player.tptr_t.unlocked },
				effect() { 
					return player.tptr_t.points.pow(0.6).add(0.5);
				},
				effectDisplay() { return "+"+format(tmp.tptr_t.upgrades[11].effect) },
			},
			12: {
				title: "Limit Stretcher",
				description: "Time Energy cap starts later based on Boosters.",
				cost() { return new Decimal(8) },
				unlocked() { return player.tptr_t.unlocked },
				effect() { 
					return player.tptr_b.points.pow(0.95).add(1)
				},
				effectDisplay() { return format(tmp.tptr_t.upgrades[12].effect)+"x" },
			},
		},
		canBuyMax() {return player.tptr_t.best.gte(7)},
});

addLayer("tptr_e", {
        name: "enhance", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
            unlocked: false,
			points: new Decimal(0),
			best: new Decimal(0),
			total: new Decimal(0),
			first: 0,
			auto: false,
			pseudoUpgs: [],
        }},
        color: "#b82fbd",
        requires() { return new Decimal(1e120); }, // Can be a function that takes requirement increases into account
        resource: "enhance points", // Name of prestige currency
        baseResource: "rewritten points", // Name of resource prestige is based on
        baseAmount() {return player.modpoints[7]}, // Get the current amount of baseResource
        type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent() { return 0.02 }, // Prestige currency exponent
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
			if (hasUpgrade("tptr_e", 24)) mult = mult.times(upgradeEffect("tptr_e", 24));
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
		effectDescription() {
			return "which are boosting enhancer effects in TPTC by ^"+format(tmp.tptr_e.effect);
		},
		effect() { 
			return player.tptr_e.points.add(1).log10().div(100).add(1);
		},
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.tm.currentTree==7 && hasUpgrade("tm",28)},
		doReset(l){
			if(l=="tptr_p" || l=="tptr_b" || l=="tptr_g" || l=="tptr_t" || l=="tptr_e" || l=="tptr_s" || l=="tptr_sb" || l=="tptr_sg" || !l.startsWith("tptr_")){return;}
			var b=new Decimal(player.tptr_s.best);
			layerDataReset("tptr_e",["upgrades","milestones","challenges"]);
			player.tptr_s.best=b;
			return;
		},
		freeEnh() {
			let enh = new Decimal(0);
			if (hasUpgrade("tptr_e", 13)) enh = enh.plus(1);
			if (hasUpgrade("tptr_e", 21)) enh = enh.plus(2);
			if (hasUpgrade("tptr_e", 23)) enh = enh.plus(upgradeEffect("tptr_e", 23));
			return enh;
		},
        branches: ["tptr_b","tptr_g"],
		buyables: {
			rows: 1,
			cols: 1,
			11: {
				title: "Enhancers",
				costScalingEnabled() {
					return true;//!(hasUpgrade("e", 34) && player.i.buyables[12].gte(3));
				},
				cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if (x.gte(25) && tmp[this.layer].buyables[this.id].costScalingEnabled) x = x.pow(2).div(25)
                    let cost = Decimal.pow(2, x.pow(1.5))
                    return cost.floor()
                },
				power() {
					let pow = new Decimal(1);
					//if (hasUpgrade("tptr_e", 33) && player.i.buyables[12].gte(3)) pow = pow.times(1.2);
					return pow;
				},
				effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let power = tmp[this.layer].buyables[this.id].power
					x = x.plus(tmp.tptr_e.freeEnh);
					if (!player[this.layer].unlocked) x = new Decimal(0);
					
                    let eff = {}
                    if (x.gte(0)) eff.first = Decimal.pow(25, x.pow(power.times(1.1)))
                    else eff.first = Decimal.pow(1/25, x.times(-1).pow(power.times(1.1)))
					//if (hasUpgrade("tptr_q", 24)) eff.first = eff.first.pow(7.5);
					//eff.first = softcap("enh1", eff.first)
                
                    if (x.gte(0)) eff.second = x.pow(power.times(0.8))
                    else eff.second = x.times(-1).pow(power.times(0.8)).times(-1)
					//if ((Array.isArray(tmp.ma.mastered))?tmp.ma.mastered.includes(this.layer):false) eff.second = eff.second.pow(50);
                    return eff;
                },
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return (("Cost: " + formatWhole(data.cost) + " Enhance Points"))+"\n\
                    Amount: " + formatWhole(player[this.layer].buyables[this.id])+(tmp.tptr_e.freeEnh.gt(0)?(" + "+formatWhole(tmp.tptr_e.freeEnh)):"") + "\n\
                   "+((" Boosts Prestige Point gain by " + format(data.effect.first) + "x and adds to the Booster/Generator base by " + format(data.effect.second)))
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
					//if (inChallenge("h", 31)) player.h.chall31bought++;
                },
                buyMax() {
					if (!this.canAfford()) return;
					//if (inChallenge("h", 31)) return;
					let tempBuy = player[this.layer].points.max(1).log2().root(1.5)
					if (tempBuy.gte(25) && tmp[this.layer].buyables[this.id].costScalingEnabled) tempBuy = tempBuy.times(25).sqrt();
					let target = tempBuy.plus(1).floor();
					player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(target);
				},
				//autoed() { return player.e.auto && hasMilestone("q", 1) && !inChallenge("h", 31) },
                style: {'height':'222px'},
			},
		},
})

addLayer("tptr_s", {
    name: "tptr_s", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
		spent: new Decimal(0),
    }},
       color: "#dfdfdf",
    requires: new Decimal(1e120), // Can be a function that takes requirement increases into account
    resource: "space energy", // Name of prestige currency
    baseResource: "rewritten points", // Name of resource prestige is based on
    baseAmount() {return player.modpoints[7]}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	branches: ["tptr_g"],
    exponent: 1.85, // Prestige currency exponent
    base: 1e15, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	getResetGain() {
		let ret=getResetGain(this.layer,"static").add(player[this.layer].points);
		if(ret.gte(1000))ret=ret.div(12).sqrt().mul(12).max(1000);
		if(ret.gte(1500))ret=ret.div(1225).pow(0.1).mul(1225).max(1500);
		return ret.sub(player[this.layer].points);
	},
	getNextAt(canMax) {
		if (!tmp[this.layer].canBuyMax) canMax = false
		let amt = player[this.layer].points.plus((canMax&&tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt))?tmp[this.layer].resetGain:0)
		if(amt.gte(1500))amt=amt.div(1225).pow(10).mul(1225).max(1500);
		if(amt.gte(1000))amt=amt.div(12).pow(2).mul(12).max(1000);
		let extraCost = Decimal.pow(tmp[this.layer].base, amt.pow(tmp[this.layer].exponent).div(tmp[this.layer].gainExp)).times(tmp[this.layer].gainMult)
		let cost = extraCost.times(tmp[this.layer].requires).max(tmp[this.layer].requires)
		if (tmp[this.layer].roundUpCost) cost = cost.ceil()
		return cost;
	},
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.tm.currentTree==7 && hasUpgrade("tm",28)},
		doReset(l){
			if(l=="tptr_p" || l=="tptr_b" || l=="tptr_g" || l=="tptr_t" || l=="tptr_e" || l=="tptr_s" || l=="tptr_sb" || l=="tptr_sg" || !l.startsWith("tptr_")){return;}
			var b=new Decimal(player.tptr_s.best);
			layerDataReset("tptr_s",["upgrades","milestones","challenges"]);
			player.tptr_s.best=b;
			return;
		},
		space() {
			let space = player.tptr_s.best.pow(1.1).times(3);
			return space.floor().sub(player.tptr_s.spent).max(0);
		},
		buildingBaseRoot() {
			let root = new Decimal(1);
			if (hasUpgrade("tptr_s", 34) && player.i.buyables[12].gte(5)) root = root.times(upgradeEffect("tptr_s", 34));
			return root;
		},
		effectDescription() {
			return "which are boosting space buildings 1-7 in TPTC by ^"+format(tmp.tptr_s.effect);
		},
		effect() { 
			return player.tptr_s.points.pow(0.5).div(100).add(1)
		},
		buildingBaseCosts() { 
			let rt = tmp.tptr_s.buildingBaseRoot;
			return {
				11: new Decimal(1e3).root(rt),
				12: new Decimal(1e10).root(rt),
				13: new Decimal(1e25).root(rt),
				14: new Decimal(1e48).root(rt),
				15: new Decimal(1e250).root(rt),
				16: new Decimal("e3e7").root(rt),
				17: new Decimal("e4.5e7").root(rt),
				18: new Decimal("e6e7").root(rt),
				19: new Decimal("e3.5e8").root(rt),
				20: new Decimal("e1.5e9").root(rt),
		}},
		freeSpaceBuildings() {
			let x = new Decimal(0);
			if (hasUpgrade("tptr_s", 11)) x = x.plus(1);
			if (hasUpgrade("tptr_s", 22)) x = x.plus(upgradeEffect("tptr_s", 22));
			return x;
		},
		freeSpaceBuildings1to4() {
			let x = new Decimal(0);
			//if (player.tptr_s.unlocked) x = x.plus(buyableEffect("tptr_s", 15));
			return x;
		},
		totalBuildingLevels() {
			let len = Object.keys(player.tptr_s.buyables).length
			if (len==0) return new Decimal(0);
			if (len==1) return Object.values(player.tptr_s.buyables)[0].plus(tmp.tptr_s.freeSpaceBuildings).plus(toNumber(Object.keys(player.tptr_s.buyables))<15?tmp.tptr_s.freeSpaceBuildings1to4:0)
			let l = Object.values(player.tptr_s.buyables).reduce((a,c,i) => Decimal.add(a, c).plus(toNumber(Object.keys(player.tptr_s.buyables)[i])<15?tmp.tptr_s.freeSpaceBuildings1to4:0)).plus(tmp.tptr_s.freeSpaceBuildings.times(len));
			return l;
		},
		manualBuildingLevels() {
			let len = Object.keys(player.tptr_s.buyables).length
			if (len==0) return new Decimal(0);
			if (len==1) return Object.values(player.tptr_s.buyables)[0]
			let l = Object.values(player.tptr_s.buyables).reduce((a,c) => Decimal.add(a, c));
			return l;
		},
		buildingPower() {
			if (!player.tptr_s.unlocked) return new Decimal(0);
			let pow = new Decimal(1);
			if (hasUpgrade("tptr_s", 21)) pow = pow.plus(0.08);
			
			return pow;
		},
		tabFormat: ["main-display",
			"prestige-button",
			"blank",
			["display-text",
				function() {return 'Your best Space Energy is ' + formatWhole(player.tptr_s.best)},
					{}],
			"blank",
			"milestones", "blank", 
			["display-text",
				function() {return 'You have ' + format(player.tptr_g.power) + ' Generator Power'},
					{}],
			["display-text",
				function() {return 'Your Space Energy has provided you with ' + formatWhole(tmp.tptr_s.space) + ' Space'},
					{}],
			["display-text",
				function() {return tmp.tptr_s.buildingPower.eq(1)?"":("Space Building Power: "+format(tmp.tptr_s.buildingPower.times(100))+"%")},
					{}],
			"blank",
			"buyables", "blank", "upgrades"],
		divBuildCosts() {
			let div = new Decimal(1);
			if (hasUpgrade("tptr_s", 23) && player.tptr_t.unlocked) div = div.times(1e20);
			return div;
		},
		buildScalePower() {
			let scale = new Decimal(1);
			if (hasUpgrade("tptr_p", 42)) scale = scale.times(.5);
			return scale;
		},
		buyables: {
			rows: 1,
			cols: 10,
			showRespec() { return player.tptr_s.unlocked },
            respec() { // Optional, reset things and give back your currency. Having this function makes a respec button appear
				player[this.layer].spent = new Decimal(0);
                resetBuyables(this.layer)
                doReset(this.layer, true) // Force a reset
            },
            respecText: "Respec Space Buildings", // Text on Respec button, optional
			11: {
				title: "Primary Space Building",
				costExp() { 
					let exp = 1.35;
					//if (hasUpgrade("s", 31) && player.i.buyables[12].gte(5)) exp -= 0.04*(15-this.id);
					return exp;
				},
				cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					let base = tmp.tptr_s.buildingBaseCosts[this.id];
					if (x.eq(0)) return new Decimal(0);
					return Decimal.pow(base, x.times(tmp.tptr_s.buildScalePower).pow(tmp[this.layer].buyables[this.id].costExp)).times(base).div(tmp.tptr_s.divBuildCosts);
                },
				freeLevels() {
					let levels = tmp.tptr_s.freeSpaceBuildings.plus(tmp.tptr_s.freeSpaceBuildings1to4);
					//if (hasUpgrade("s", 32) && player.i.buyables[12].gte(5)) levels = levels.plus(player.tptr_s.buyables[11+1]||0);
					return levels;
				},
				effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = Decimal.pow(x.plus(1).plus(tmp.tptr_s.freeSpaceBuildings).times(tmp.tptr_s.buildingPower), player.tptr_s.points.sqrt()).times(x.plus(tmp.tptr_s.buyables[this.id].freeLevels).times(tmp.tptr_s.buildingPower).max(1).times(4)).max(1);
					//if (player.hs.unlocked) eff = eff.pow(buyableEffect("hs", 21));
					return eff;
                },
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return (("Cost: " + formatWhole(data.cost) + " Generator Power"))+"\n\
                    Level: " + formatWhole(player[this.layer].buyables[this.id])+(data.freeLevels.gt(0)?(" + "+formatWhole(data.freeLevels)):"") + "\n\
                   "+(" Space Energy boosts Rewritten Point gain & Prestige Point gain by " + format(data.effect) +"x");
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return player.tptr_g.power.gte(tmp[this.layer].buyables[this.id].cost) && layers.tptr_s.space().gt(0)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player.tptr_g.power = player.tptr_g.power.sub(cost)
					player.tptr_s.spent = player.tptr_s.spent.plus(1);
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				target() { return player.tptr_g.power.times(tmp.tptr_s.divBuildCosts).div(tmp.tptr_s.buildingBaseCosts[this.id]).max(1).log(tmp.tptr_s.buildingBaseCosts[this.id]).root(tmp[this.layer].buyables[this.id].costExp).div(tmp.tptr_s.buildScalePower).plus(1).floor().min(player[this.layer].buyables[this.id].plus(layers.tptr_s.space())) }, 
                buyMax() {
					if (!this.canAfford() || !this.unlocked()) return;
					let target = this.target();
					player.tptr_s.spent = player.tptr_s.spent.plus(target.sub(player[this.layer].buyables[this.id]))
					player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(target);
				}, 
                style: {'height':'100px'},
			},
			12: {
				title: "Secondary Space Building",
				costExp() { 
					let exp = 1.35;
					//if (hasUpgrade("s", 31) && player.i.buyables[12].gte(5)) exp -= 0.04*(15-this.id);
					return exp;
				},
				cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					let base = tmp.tptr_s.buildingBaseCosts[this.id];
					return Decimal.pow(base, x.times(tmp.tptr_s.buildScalePower).pow(tmp[this.layer].buyables[this.id].costExp)).times(base).div(tmp.tptr_s.divBuildCosts);
                },
				freeLevels() {
					let levels = tmp.tptr_s.freeSpaceBuildings.plus(tmp.tptr_s.freeSpaceBuildings1to4);
					//if (hasUpgrade("s", 32) && player.i.buyables[12].gte(5)) levels = levels.plus(player.tptr_s.buyables[12+1]||0);
					return levels;
				},
				effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = x.plus(tmp.tptr_s.buyables[this.id].freeLevels).times(tmp.tptr_s.buildingPower).sqrt();
					//if (player.hs.unlocked) eff = eff.pow(buyableEffect("hs", 22));
					return eff;
                },
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return (("Cost: " + formatWhole(data.cost) + " Generator Power"))+"\n\
                    Level: " + formatWhole(player[this.layer].buyables[this.id])+(data.freeLevels.gt(0)?(" + "+formatWhole(data.freeLevels)):"") + "\n\
                    "+(("Adds to base of Booster/Generator effects by +" + format(data.effect)))
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return player.tptr_g.power.gte(tmp[this.layer].buyables[this.id].cost) && layers.tptr_s.space().gt(0)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player.tptr_g.power = player.tptr_g.power.sub(cost)
					player.tptr_s.spent = player.tptr_s.spent.plus(1);
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				target() { return player.tptr_g.power.times(tmp.tptr_s.divBuildCosts).div(tmp.tptr_s.buildingBaseCosts[this.id]).max(1).log(tmp.tptr_s.buildingBaseCosts[this.id]).root(tmp[this.layer].buyables[this.id].costExp).div(tmp.tptr_s.buildScalePower).plus(1).floor().min(player[this.layer].buyables[this.id].plus(layers.tptr_s.space())) }, 
                buyMax() {
					if (!this.canAfford() || !this.unlocked()) return;
					let target = this.target();
					player.tptr_s.spent = player.tptr_s.spent.plus(target.sub(player[this.layer].buyables[this.id]))
					player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(target);
				}, 
                style: {'height':'100px'},
			},
		},
		canBuyMax() {return player.tptr_s.best.gte(7)},
		milestones: {
			0: {
				requirementDescription: "1 Space Energy",
				done() { return player.tptr_s.best.gte(1) },
				effectDescription: "Autobuy Generators, Generators resets nothing.",
			},
			1: {
				requirementDescription: "7 Space Energy",
				done() { return player.tptr_s.best.gte(7) },
				effectDescription: "You can buy max Space Energy.",
			},
		},
});
