
addLayer("tptr_p", {
    name: "tptr_p", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#31aeb0",
    requires(){
		if(hasUpgrade("tptc_p",34))return new Decimal(1);
		return new Decimal(10);
	},
    resource: "prestige points", // Name of prestige currency
    baseResource: "rewritten points", // Name of resource prestige is based on
    baseAmount() {return player.modpoints[7]}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
		if(inChallenge("tptr_h",12))return new Decimal(0);
        ret = new Decimal(1)
		if(hasUpgrade("tptc_p",32))ret=ret.mul(upgradeEffect("tptc_p",32));
		if(player.tm.buyables[8].gte(1))ret=ret.mul(tmp.milestone_m.powerEffect[0]);
		
		if(hasUpgrade("tptr_p",21))ret=ret.mul(upgradeEffect("tptr_p",21));
		if(hasUpgrade("tptr_p",23))ret=ret.mul(upgradeEffect("tptr_p",23));
		if(hasUpgrade("tptr_b",11))ret=ret.mul(upgradeEffect("tptr_b",11));
		if(hasUpgrade("tptr_g",11))ret=ret.mul(upgradeEffect("tptr_g",11));
		if(hasUpgrade("tptr_e",12))ret=ret.mul(upgradeEffect("tptr_e",12));
		if (player.tptr_t.unlocked) ret = ret.times(tmp.tptr_t.enEff);
		if(player.tptr_s.unlocked)ret=ret.mul(buyableEffect("tptr_s",11));
		if(player.tptr_e.unlocked)ret=ret.mul(buyableEffect("tptr_e",11).first);
			if (hasUpgrade("tptr_b", 31)) ret = ret.times(upgradeEffect("tptr_b", 31));
        return ret
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
			if (hasUpgrade("tptr_p", 31))return  new Decimal(1.05);
        return new Decimal(1)
    },
	getResetGain() {
		if (tmp[this.layer].baseAmount.lt(tmp[this.layer].requires)) return new Decimal(0)
		let gain = tmp[this.layer].baseAmount.div(tmp[this.layer].requires).pow(tmp[this.layer].exponent).times(tmp[this.layer].gainMult).pow(tmp[this.layer].gainExp)
		
		// softcap processing
		
		if (gain.gte(Decimal.pow(10,7e7/3))){
			let mult2 = tmp[this.layer].gainMult;let mult3 = new Decimal(1);
			if(player.tm.buyables[8].gte(1))mult2=mult2.div(tmp.milestone_m.powerEffect[0]);
			if(player.tm.buyables[8].gte(1))mult3=mult3.mul(tmp.milestone_m.powerEffect[0]);
			let gain2 = tmp[this.layer].baseAmount.div(tmp[this.layer].requires).pow(tmp[this.layer].exponent).times(mult2).pow(tmp[this.layer].gainExp);
			if(gain2.gte("ee7"))gain2 = gain2.mul("ee7").sqrt();
			gain2 = gain2.mul(mult3);
			gain = Decimal.max(Decimal.pow(10,7e7/3),gain2);
		}
		
		return gain.floor().max(0);
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
					if(player.tptc_mb.buyables[13].gte(5))ret=ret.mul(buyableEffect("tptc_ma",15));
					
					
					if(hasUpgrade("tptr_p",12))ret=ret.mul(upgradeEffect("tptr_p",12));
					if(hasUpgrade("tptr_p",13))ret=ret.mul(upgradeEffect("tptr_p",13));
					if(hasUpgrade("tptr_p",22))ret=ret.mul(upgradeEffect("tptr_p",22));
					ret=ret.mul(tmp.tptr_b.effect[0]);
					ret=ret.mul(tmp.tptr_g.powerEff);
					if(hasUpgrade("incrementy_p",34))ret=ret.mul(1e3);
					if (player.tptr_t.unlocked) ret = ret.times(tmp.tptr_t.enEff);
					if(player.tptr_s.unlocked)ret=ret.mul(buyableEffect("tptr_s",11));
					if(player.tptr_q.unlocked)ret=ret.mul(tmp.tptr_q.enEff);
					
					if(player.milestone_m.best.gte(7))ret=ret.mul((tmp.milestone_m.powerEffect[0]||new Decimal(1)).pow(player.tm.buyables[8].gte(10)?1:player.tm.buyables[8].gte(8)?0.7:player.milestone_m.best.gte(28)?0.6:player.milestone_m.best.gte(26)?0.5:player.tm.buyables[8].gte(6)?0.42:player.milestone_m.best.gte(20)?0.4:player.milestone_m.best.gte(19)?0.35:player.tm.buyables[8].gte(4)?(1/3):player.milestone_m.best.gte(15)?0.3:player.milestone_m.best.gte(9)?0.25:player.milestone_m.best.gte(8)?0.2:0.1));
					
					
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
					if (hasUpgrade("tptr_g", 24)) eff = eff.pow(1.4666667);
					if(hasChallenge("tptr_h", 22) && eff.gte("1e3500"))eff = Decimal.pow(10, eff.log10().root(2).times(new Decimal("1e3500").log10().pow(Decimal.sub(1, new Decimal(2).pow(-1)))));
					else eff = eff.min("1e3500");
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
    requires(){
		if(hasUpgrade("tptc_p",34))return new Decimal(1);
		return new Decimal(200);
	},
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
		if (player.tptr_s.unlocked) mult = mult.div(buyableEffect("tptr_s", 13));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	getSc1(){
		let sc1=new Decimal(12);
		if(hasUpgrade("tptr_q",31))sc1=sc1.add(upgradeEffect("tptr_q",31));
		return sc1;
	},
	getResetGain() {
		let ret=getResetGain(this.layer,"static").add(player[this.layer].points);
		let sc1=layers[this.layer].getSc1();
		if(ret.gte(1000))ret=ret.div(sc1).sqrt().mul(sc1).div(1225).pow(0.1).mul(1225).floor().max(1000);
		return ret.sub(player[this.layer].points).max(1);
	},
	getNextAt(canMax) {
		if (!tmp[this.layer].canBuyMax) canMax = false
		let amt = player[this.layer].points.plus((canMax&&tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt))?tmp[this.layer].resetGain:0);
		let sc1=layers[this.layer].getSc1();
		if(amt.gte(1000))amt=amt.div(1225).pow(10).mul(1225).div(sc1).pow(2).mul(sc1).max(1000).ceil();
		let extraCost = Decimal.pow(tmp[this.layer].base, amt.pow(tmp[this.layer].exponent).div(tmp[this.layer].gainExp)).times(tmp[this.layer].gainMult)
		let cost = extraCost.times(tmp[this.layer].requires).max(tmp[this.layer].requires)
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
			if (hasUpgrade("tptr_e", 11)) base = base.plus(upgradeEffect("tptr_e", 11).b);
			if (player.tptr_e.unlocked) base = base.plus(buyableEffect("tptr_e",11).second);
			if (player.tptr_s.unlocked) base = base.plus(buyableEffect("tptr_s",12));
			if (hasUpgrade("tptr_t", 25)) base = base.plus(upgradeEffect("tptr_t", 25));
			return base;
		},
		effectBase() {
			let base = new Decimal(2);
			
			// ADD
			base = base.plus(layers.tptr_b.addToBase());
			
			// MULTIPLY
			if (player.tptr_sb.unlocked) base = base.times(tmp.tptr_sb.effect[0]);
			if (hasUpgrade("tptr_q", 12)) base = base.times(upgradeEffect("tptr_q", 12))
			if (hasUpgrade("tptr_q", 34)) base = base.times(upgradeEffect("tptr_q", 34))
			
			if (player.tptr_m.unlocked) base = base.times(tmp.tptr_m.clickables[11].effect);
			return base.pow(tmp.tptr_b.power);
		},
		power() {
			let power = new Decimal(1);
			if (player.tptr_m.spellTimes[11].gt(0)) power = power.times(1.05);
			return power;
		},
	effect() {
		if(inChallenge("tptr_h",41))return [new Decimal(1),new Decimal(1)];
		let eff2 = player.tptr_b.points.add(1)
		if(hasChallenge("tptr_h",41))eff2 = Decimal.pow(1.03,player.tptr_b.points);
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
					if (hasUpgrade("tptr_b", 32)) ret = Decimal.pow(1.125, player.tptr_b.best).times(ret);
					if (hasUpgrade("tptr_s", 15)) ret = ret.pow(buyableEffect("tptr_s", 14).root(2.7));
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
					let ret = player.tptr_g.points.add(1).log10().sqrt().div(3).times(hasUpgrade("tptr_e", 14)?upgradeEffect("tptr_e", 14):1);
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
					let ret = player.tptr_p.total.add(1).log10().add(1).log10().div(3).times(hasUpgrade("tptr_e", 14)?upgradeEffect("tptr_e", 14):1);
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
					if (hasUpgrade("tptr_s",14)) ret = ret.pow(buyableEffect("tptr_s", 14));
					return ret;
				},
				unlocked() { return hasUpgrade("tm",22) },
				effectDisplay() { return "/"+format(tmp.tptr_b.upgrades[23].effect) },
			},
			31: {
				title: "Worse BP Combo",
				description: "Super Boosters boost Prestige Point gain.",
				cost() { return new Decimal(1079) },
				unlocked() { return player.tm.buyables[7].gte(13) },
				effect() { 
					let exp = 1
					return Decimal.pow(1e20, player.tptr_sb.points.pow(1.5)).pow(exp); 
				},
				effectDisplay() { return format(tmp.tptr_b.upgrades[31].effect)+"x" }
			},
			32: {
				title: "Better BP Combo",
				description() { return "<b>BP Combo</b> uses a better formula." },
				cost() { return new Decimal(1080) },
				unlocked() { return player.tm.buyables[7].gte(13) },
			},
			33: {
				title: "Even More Additions",
				description: "<b>More Additions</b> is stronger based on your Super Boosters.",
				cost() { return new Decimal(1079) },
				unlocked() { return player.tm.buyables[7].gte(13) },
				effect() { return player.tptr_sb.points.times(player.tptr_sb.points.gte(4)?2.6:2).plus(1).pow(1) },
				effectDisplay() { return format(tmp.tptr_b.upgrades[33].effect)+"x" },
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
    requires(){
		if(hasUpgrade("tptc_p",34))return new Decimal(1);
		return new Decimal(200);
	},
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
		if (player.tptr_s.unlocked) mult = mult.div(buyableEffect("tptr_s", 13));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	getSc1(){
		let sc1=new Decimal(12);
		if(hasUpgrade("tptr_q",31))sc1=sc1.add(upgradeEffect("tptr_q",31));
		return sc1;
	},
	getResetGain() {
		let ret=getResetGain(this.layer,"static").add(player[this.layer].points);
		let sc1=layers[this.layer].getSc1();
		if(ret.gte(1000))ret=ret.div(sc1).sqrt().mul(sc1).div(1225).pow(0.1).mul(1225).floor().max(1000);
		return ret.sub(player[this.layer].points).max(1);
	},
	getNextAt(canMax) {
		if (!tmp[this.layer].canBuyMax) canMax = false
		let amt = player[this.layer].points.plus((canMax&&tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt))?tmp[this.layer].resetGain:0);
		let sc1=layers[this.layer].getSc1();
		if(amt.gte(1000))amt=amt.div(1225).pow(10).mul(1225).div(sc1).pow(2).mul(sc1).max(1000).ceil();
		let extraCost = Decimal.pow(tmp[this.layer].base, amt.pow(tmp[this.layer].exponent).div(tmp[this.layer].gainExp)).times(tmp[this.layer].gainMult)
		let cost = extraCost.times(tmp[this.layer].requires).max(tmp[this.layer].requires)
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
			if (hasUpgrade("tptr_e", 11)) base = base.plus(upgradeEffect("tptr_e", 11).g);
			if (player.tptr_e.unlocked) base = base.plus(buyableEffect("tptr_e",11).second);
			if (player.tptr_s.unlocked) base = base.plus(buyableEffect("tptr_s",12));
			
			// MULTIPLY
			
			if (hasUpgrade("tm", 47)) base = base.times(tmp.tptr_sg.enEff)
			if (hasUpgrade("tptr_q", 12)) base = base.times(upgradeEffect("tptr_q", 12))
				
			return base;
		},
		effect() {
		if(inChallenge("tptr_h",41))return [new Decimal(0),new Decimal(1)];
		
			let eff2 = player.tptr_g.points.add(1)
		if(hasChallenge("tptr_h",41))eff2 = Decimal.pow(1.03,player.tptr_g.points);
			if (hasUpgrade("tptc_g", 13))eff2 = eff2.pow(2)
			
			
			let eff = [Decimal.pow(this.effBase(), player.tptr_g.points).sub(1).max(0), eff2];
			if (hasUpgrade("tptr_g", 21)) eff[0] = eff[0].times(upgradeEffect("tptr_g", 21));
			if (hasUpgrade("tptr_g", 25)) eff[0] = eff[0].times(upgradeEffect("tptr_g", 25));
			if (hasUpgrade("tptr_t", 15)) eff[0] = eff[0].times(tmp.tptr_t.enEff);
			if (hasUpgrade("tptr_s", 12)) eff[0] = eff[0].times(upgradeEffect("tptr_s", 12));
			if (hasUpgrade("tptr_s", 13)) eff[0] = eff[0].times(upgradeEffect("tptr_s", 13));
			if(player.tptr_q.unlocked) eff[0] = eff[0].times(tmp.tptr_q.enEff);
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
			if(hasUpgrade("tptr_q",13))exp = exp.mul(1.25);
			return exp;
		},
		powerEff() {
			return player.tptr_g.power.plus(1).pow(this.powerExp());
		},
		tabFormat: ["main-display",
			"prestige-button", "resource-display",
			"blank",
			["display-text",
				function() {return 'You have ' + format(player.tptr_g.power) + ' Generator Power, which boosts Rewritten Point generation by '+format(tmp.tptr_g.powerEff)+'x'},
					{}],
			"milestones", "upgrades"],
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
					let ret = player.tptr_b.points.add(1).log10().sqrt().div(3).times(hasUpgrade("tptr_e", 14)?upgradeEffect("tptr_e", 14):1);
					if (hasUpgrade("tptr_s", 24)) ret = ret.times(upgradeEffect("tptr_s", 24));
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
					let ret = player.tptr_p.best.add(1).log10().add(1).log10().div(3).times(hasUpgrade("tptr_e", 14)?upgradeEffect("tptr_e", 14):1);
					if (hasUpgrade("tptr_s", 24)) ret = ret.times(upgradeEffect("tptr_s", 24));
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
					if (hasUpgrade("tptr_s", 24)) ret = ret.pow(upgradeEffect("tptr_s", 24));
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
			24: {
				title: "Boost the Boost Again",
				description: "<b>Prestige Boost</b> is raised to the power of 1.467.",
				cost() { return new Decimal(1000) },
				unlocked() { return player.tm.buyables[7].gte(5) },
			},
			25: {
				title: "I Need More IV",
				description: "Prestige Points boost Generator Power gain.",
				cost() { return new Decimal(1000) },
				effect() { 
					let ret = player.tptr_p.points.add(1).log10().pow(3).add(1);
					if (hasUpgrade("tptr_s", 24)) ret = ret.pow(upgradeEffect("tptr_s", 24));
					return ret;
				},
				unlocked() { return player.tm.buyables[7].gte(5) },
				effectDisplay() { return format(tmp.tptr_g.upgrades[25].effect)+"x" },
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
        requires() { if(hasUpgrade("tptr_t",23))return new Decimal(1);return new Decimal(1e120); }, // Can be a function that takes requirement increases into account
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
	getSc1(){
		let sc1=new Decimal(12);
		return sc1;
	},
	getResetGain() {
		let ret=getResetGain(this.layer,"static").add(player[this.layer].points);
		let sc1=layers[this.layer].getSc1();
		if(ret.gte(1000))ret=ret.div(sc1).sqrt().mul(sc1).div(1225).pow(0.1).mul(1225).floor().max(1000);
		return ret.sub(player[this.layer].points).max(1);
	},
	getNextAt(canMax) {
		if (!tmp[this.layer].canBuyMax) canMax = false
		let amt = player[this.layer].points.plus((canMax&&tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt))?tmp[this.layer].resetGain:0);
		let sc1=layers[this.layer].getSc1();
		if(amt.gte(1000))amt=amt.div(1225).pow(10).mul(1225).div(sc1).pow(2).mul(sc1).max(1000).ceil();
		let extraCost = Decimal.pow(tmp[this.layer].base, amt.pow(tmp[this.layer].exponent).div(tmp[this.layer].gainExp)).times(tmp[this.layer].gainMult)
		let cost = extraCost.times(tmp[this.layer].requires).max(tmp[this.layer].requires)
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
			if (hasUpgrade("tptr_t", 21)) mult = mult.times(100);
			if (hasUpgrade("tptr_t", 22)) mult = mult.times(upgradeEffect("tptr_t", 22));
			if (player.tptr_h.unlocked) mult = mult.times(tmp.tptr_h.effect[0]);
			if (player.tptr_o.unlocked) mult = mult.times(tmp.tptr_o.solEnEff2);
			return mult;
		},
		enGainMult() {
			let mult = new Decimal(1);
			if (hasUpgrade("tptr_t", 22)) mult = mult.times(upgradeEffect("tptr_t", 22));
			if (player.tptr_h.unlocked) mult = mult.times(tmp.tptr_h.effect[0]);
			return mult;
		},
		effBaseMult() {
			let mult = new Decimal(1);
			if (player.tptr_o.unlocked) mult = mult.times(buyableEffect("tptr_o", 13));
			if (player.tptr_ba.unlocked) mult = mult.times(tmp.tptr_ba.posBuff);
			if (player.tptr_m.unlocked) mult = mult.times(tmp.tptr_m.clickables[12].effect);
			return mult;
		},
		effBasePow() {
			let exp = new Decimal(1);
			if (player.tptr_m.spellTimes[12].gt(0)) exp = exp.times(1.1);
			return exp;
		},
		effGainBaseMult() {
			let mult = new Decimal(1);
			if (player.tptr_ps.unlocked) mult = mult.times(challengeEffect("tptr_h", 32));
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
				gain: Decimal.pow(tmp.tptr_t.effBaseMult.times(tmp.tptr_t.effGainBaseMult).times(3).pow(tmp.tptr_t.effBasePow), player.tptr_t.points.times(tmp.tptr_t.nonExtraTCPow).plus(player.tptr_t.buyables[11].mul(inChallenge("tptr_h",31)?0:1)).plus(tmp.tptr_t.freeExtraTimeCapsules)).sub(1).max(0).times(player.tptr_t.points.times(tmp.tptr_t.nonExtraTCPow).plus(player.tptr_t.buyables[11].mul(inChallenge("tptr_h",31)?0:1)).gt(0)?1:0).times(tmp.tptr_t.enGainMult).mul(inChallenge("tptr_h",32)?0:1).max(0),
				limit: Decimal.pow(tmp.tptr_t.effBaseMult.times(tmp.tptr_t.effLimBaseMult).times(2).pow(tmp.tptr_t.effBasePow), player.tptr_t.points.times(tmp.tptr_t.nonExtraTCPow).plus(player.tptr_t.buyables[11].mul(inChallenge("tptr_h",31)?0:1)).plus(tmp.tptr_t.freeExtraTimeCapsules)).sub(1).max(0).times(100).times(player.tptr_t.points.times(tmp.tptr_t.nonExtraTCPow).plus(player.tptr_t.buyables[11].mul(inChallenge("tptr_h",31)?0:1)).gt(0)?1:0).times(tmp.tptr_t.enCapMult).max(0),
				tptc_t_boost: player.tptr_t.points.pow(hasUpgrade("tptc_t",11)?3:1).pow(hasUpgrade("tptc_t",12)?3:1).pow(hasUpgrade("tptc_t",13)?20/9:1).add(1)
			}
		},
		effectDescription() {
			return "which are generating "+format(tmp.tptr_t.effect.gain)+" Time Energy/sec, but with a limit of "+format(tmp.tptr_t.effect.limit)+" Time Energy.<br>Your non-extra time capsules boosting the base of time capsules in TPTC by "+format(tmp.tptr_t.effect.tptc_t_boost)+"x"
		},
		enEff() {
			if(!hasUpgrade("tm",26))return new Decimal(1);
			let eff = player.tptr_t.energy.add(1).pow(1.2);
			if (hasUpgrade("tptr_t", 14)) eff = eff.pow(1.3);
			if (hasUpgrade("tptr_q", 24)) eff = eff.pow(7.5);
			return eff;
		},
		enEff2() {
			if (!hasUpgrade("tptr_t", 24)) return new Decimal(0);
			let exp = 5/9
			let eff = player.tptr_t.energy.max(0).plus(1).log10().pow(exp);
			if(eff.gte(1.4e6))eff = eff.sqrt().mul(new Decimal(1.4e6).sqrt());
			return eff.floor();
		},
		nextEnEff2() {
			if (!hasUpgrade("tptr_t", 24)) return new Decimal(1/0);
			let ret=tmp.tptr_t.enEff2.plus(1);
			if(ret.gte(1.4e6))ret = ret.pow(2).div(1.4e6);
			let next = Decimal.pow(10, ret.pow(1.8));
			return next;
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
			if(player.tptr_h.best.gte(1))layers.tptr_t.buyables[11].buyMax();
		},tabFormat: ["main-display",
			"prestige-button", "resource-display",
			"blank",
                        "milestones",
			["display-text",
				function() {return 'You have ' + format(player.tptr_t.energy) + ' Time Energy, which boosts Point & Prestige Point gain by '+format(tmp.tptr_t.enEff)+'x'+(hasUpgrade("tptr_t", 24)?(", and provides "+formatWhole(tmp.tptr_t.enEff2)+" free Extra Time Capsules (next at "+format(tmp.tptr_t.nextEnEff2)+")."):"")},
					{}],"buyables", "upgrades"],
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
					let e = tmp.tptr_t.freeExtraTimeCapsules;
                    return "You have "+formatWhole(player[this.layer].buyables[this.id])+(e.gt(0)?("+"+formatWhole(e)):"")+" Extra Time Capsules.\n\
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
                buyMax() {
					if (!this.canAfford()) return;
					let b = player.tptr_b.points.plus(1);
					//if ((Array.isArray(tmp.ma.mastered))?tmp.ma.mastered.includes(this.layer):false) b = b.root(.9);
					let tempBuy = b.div(10).sub(1).max(0).root(tmp[this.layer].buyables[this.id].costExp).div(0.4);
					if (tempBuy.gte(25) && tmp[this.layer].buyables[this.id].costScalingEnabled) tempBuy = tempBuy.times(25).sqrt();
					let target = tempBuy.plus(1).floor();
					player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(target);
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
					return player.tptr_t.points.pow(player.tm.buyables[7].gte(9)?0.9:0.6).add(0.5).plus(hasUpgrade("tptr_t", 13)?upgradeEffect("tptr_t", 13):0);
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
			13: {
				title: "Pseudo-Pseudo-Boost",
				description: "Extra Time Capsules add to the <b>Pseudo-Boost</b>'s effect.",
				cost() { return new Decimal(32) },
				unlocked() { return hasUpgrade("tm", 34) },
				effect() { 
					return player.tptr_t.buyables[11].add(tmp.tptr_t.freeExtraTimeCapsules).pow(0.95);
				},
				effectDisplay() { return "+"+format(tmp.tptr_t.upgrades[13].effect) },
			},
			14: {
				title: "More Time",
				description: "The Time Energy effect is raised to the power of 1.3.",
				cost() { return new Decimal(33) },
				unlocked() { return hasUpgrade("tptr_t", 13) },
			},
			15: {
				title: "Time Potency",
				description: "Time Energy affects Generator Power gain.",
				cost() { return new Decimal(38) },
				unlocked() { return hasUpgrade("tptr_t", 13) },
			},
			21: {
				title: "Weakened Chains",
				description: "The Time Energy limit is multiplied by 100.",
				cost() { return new Decimal(40) },
				unlocked() { return player.tm.buyables[7].gte(11) },
			},
			22: {
				title: "Enhanced Time",
				description: "Enhance Points boost Time Energy's generation and limit.",
				cost() { return new Decimal(40) },
				unlocked() { return player.tm.buyables[7].gte(11) },
				effect() { 
					return player.tptr_e.points.plus(1).root(10);
				},
				effectDisplay() { return format(tmp.tptr_t.upgrades[22].effect)+"x" },
			},
			23: {
				title: "Reverting Time",
				description: "Time capsule's base requirement in TPTC and TPTR are reduced to 1.",
				cost() { return new Decimal(42) },
				unlocked() { return player.tm.buyables[7].gte(11) },
			},
			24: {
				title: "Time Dilation",
				description: "Unlock a new Time Energy effect.",
				cost() { return new Decimal(41) },
				unlocked() { return player.tm.buyables[7].gte(11) },
			},
			25: {
				title: "Basic",
				description: "Time Energy adds to the Booster base.",
				cost() { return new Decimal(41) },
				unlocked() { return player.tm.buyables[7].gte(11) },
				effect() { return player.tptr_t.energy.plus(1).log10().div(1.2); },
				effectDisplay() { return "+"+format(tmp.tptr_t.upgrades[25].effect) },
			},
		},
		freeExtraTimeCapsules() {
			let free = new Decimal(0);
			if (hasUpgrade("tptr_t", 24)) free = free.plus(tmp.tptr_t.enEff2);
			if (hasUpgrade("tptr_q", 22)) free = free.plus(upgradeEffect("tptr_q", 22));
			return free;
		},
		canBuyMax() {return player.tptr_t.best.gte(7)},
		resetsNothing() {return player.tptr_h.best.gte(1)},
		autoPrestige() {return player.tptr_h.best.gte(1)},
});

addLayer("tptr_e", {
        name: "tptr_e", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "E", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
            unlocked: false,
			points: new Decimal(0),
        }},
        color: "#b82fbd",
        requires() { if(hasUpgrade("tptr_e",22))return new Decimal(1);return new Decimal(1e120); }, // Can be a function that takes requirement increases into account
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
			let ret=player.tptr_e.points.add(1).log10().div(100).add(1);
			if(ret.gte(100))ret = ret.sqrt().mul(10).sqrt().mul(10);
			return ret;
		},
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.tm.currentTree==7 && hasUpgrade("tm",27)},
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
			if (hasUpgrade("tptr_q", 22)) enh = enh.plus(upgradeEffect("tptr_q", 22));
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
					if (hasUpgrade("tptr_q", 24)) eff.first = eff.first.pow(7.5);
					if (eff.first.gte("e5e9"))eff.first = Decimal.pow(10,eff.first.log10().cbrt().mul(Decimal.pow(5e9,2/3)));
                
                    if (x.gte(0)) eff.second = x.pow(power.times(0.8))
                    else eff.second = x.times(-1).pow(power.times(0.8)).times(-1)
					//if ((Array.isArray(tmp.ma.mastered))?tmp.ma.mastered.includes(this.layer):false) eff.second = eff.second.pow(50);
					
					if(inChallenge("tptr_h",31))return {first:new Decimal(1),second:new Decimal(1)};
                    return eff;
                },
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+formatWhole(player[this.layer].buyables[this.id])+(tmp.tptr_e.freeEnh.gt(0)?("+"+formatWhole(tmp.tptr_e.freeEnh)):"")+" Enhancers.\n\
					They are multiplying Prestige Point gain by "+format(data.effect.first)+"\n\
					They are adding Booster/Generator bases by "+format(data.effect.second)+"\n\
					Cost for Next Enhancer: " + format(data.cost) + " Enhance Points";
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
		upgrades: {
			rows: 4,
			cols: 4,
			11: {
				title: "Row 2 Synergy",
				description: "Boosters & Generators boost each other.",
				cost() { return new Decimal(1e128) },
				unlocked() { return player.tm.buyables[7].gte(5) },
				effect() { 
					let exp = 1
					return {g: player.tptr_b.points.add(1).log10().pow(exp), b: player.tptr_g.points.add(1).log10().pow(exp)} 
				},
				effectDisplay() { return "+"+format(tmp.tptr_e.upgrades[11].effect.g)+" to Generator base, +"+format(tmp.tptr_e.upgrades[11].effect.b)+" to Booster base" },
			},
			12: {
				title: "Enhanced Prestige",
				description: "Total Enhance Points boost Prestige Point gain.",
				cost() { return new Decimal(3e129) },
				unlocked() { return player.tm.buyables[7].gte(5) },
				effect() { 
					let ret = player.tptr_e.total.add(1).pow(1.5) 
					if(ret.gte("1e1500"))ret = ret.sqrt().mul("1e750");
					return ret
				},
				effectDisplay() { return format(tmp.tptr_e.upgrades[12].effect)+"x" },
			},
			13: {
				title: "Enhance Plus",
				description: "Get a free Enhancer.",
				cost() { return new Decimal(3e189) },
				unlocked() { return hasUpgrade("tm", 34) },
			},
			14: {
				title: "More Additions",
				description: "Any Booster/Generator Upgrades that add to the Booster/Generator base are quadrupled.",
				cost() { return new Decimal(1e240) },
				unlocked() { return player.tm.buyables[7].gte(10) },
				effect() {
					let e = new Decimal(4)
					if (hasUpgrade("tptr_b", 33)) e = e.times(upgradeEffect("tptr_b", 33))
					return e;
				},
				effectDisplay() { return format(tmp.tptr_e.upgrades[14].effect)+"x" },
			},
			21: {
				title: "Enhance Plus Plus",
				description: "Get another two free Enhancers",
				cost() { return new Decimal(1e264) },
				unlocked() { return player.tm.buyables[7].gte(11) },
			},
			22: {
				title: "Enhanced Reversion",
				description: "Enhance layer's requirement in TPTC and TPTR are reduced to 1.",
				cost() { return new Decimal("1e316") },
				unlocked() { return player.tm.buyables[7].gte(11) },
			},
			23: {
				title: "Enter the E-Space",
				description: "Space Energy provides free Enhancers.",
				cost() { return new Decimal(1e267) },
				unlocked() { return player.tm.buyables[7].gte(11) },
				effect() {
					let eff = player.tptr_s.points.pow(2).div(25);
					return eff.floor();
				},
				effectDisplay() { return "+"+formatWhole(tmp.tptr_e.upgrades[23].effect) },
			},
			24: {
				title: "Monstrous Growth",
				description: "Boosters & Generators boost Enhance Point gain.",
				cost() { return new Decimal(1e275) },
				unlocked() { return player.tm.buyables[7].gte(11) },
				effect() { return Decimal.pow(1.1, player.tptr_b.points.plus(player.tptr_g.points).pow(0.9)) },
				effectDisplay() { return format(tmp.tptr_e.upgrades[24].effect)+"x" },
			},
		},
		update(){
			if(player.tptr_q.best.gte(1))layers.tptr_e.buyables[11].buyMax();
		},
	 passiveGeneration(){
		 if(player.tptr_q.best.gte(1))return 1;
		 return 0;
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
        requires() { if(hasUpgrade("tptr_s",23))return new Decimal(1);return new Decimal(1e120); }, // Can be a function that takes requirement increases into account
    resource: "space energy", // Name of prestige currency
    baseResource: "rewritten points", // Name of resource prestige is based on
    baseAmount() {return player.modpoints[7]}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	branches: ["tptr_g"],
    exponent: 1.85, // Prestige currency exponent
        base() { return (hasUpgrade("tptr_ss", 11)?1e10:1e15) },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	getSc1(){
		let sc1=new Decimal(12);
		return sc1;
	},
	getResetGain() {
		let ret=getResetGain(this.layer,"static").add(player[this.layer].points);
		let sc1=layers[this.layer].getSc1();
		if(ret.gte(1000))ret=ret.div(sc1).sqrt().mul(sc1).div(1225).pow(0.1).mul(1225).floor().max(1000);
		return ret.sub(player[this.layer].points).max(1);
	},
	getNextAt(canMax) {
		if (!tmp[this.layer].canBuyMax) canMax = false
		let amt = player[this.layer].points.plus((canMax&&tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt))?tmp[this.layer].resetGain:0);
		let sc1=layers[this.layer].getSc1();
		if(amt.gte(1000))amt=amt.div(1225).pow(10).mul(1225).div(sc1).pow(2).mul(sc1).max(1000).ceil();
		let extraCost = Decimal.pow(tmp[this.layer].base, amt.pow(tmp[this.layer].exponent).div(tmp[this.layer].gainExp)).times(tmp[this.layer].gainMult)
		let cost = extraCost.times(tmp[this.layer].requires).max(tmp[this.layer].requires)
		return cost;
	},
    row: 2, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.tm.currentTree==7 && hasUpgrade("tm",28)},
		doReset(l){
			if(l=="tptr_p" || l=="tptr_b" || l=="tptr_g" || l=="tptr_t" || l=="tptr_e" || l=="tptr_s" || l=="tptr_sb" || l=="tptr_sg" || !l.startsWith("tptr_")){return;}
			var b=new Decimal(player.tptr_s.best);
			if(player.tptr_ss.best.gte(4))layerDataReset("tptr_s",["upgrades","milestones","challenges","buyables"]);
			else layerDataReset("tptr_s",["upgrades","milestones","challenges"]);
			player.tptr_s.best=b;
			return;
		},
		space() {
			let space = player.tptr_s.best.pow(1.1).times(3);
			if (hasUpgrade("tptr_s", 13)) space = space.plus(2);
			if (player.tptr_ss.unlocked) space = space.plus(tmp.tptr_ss.eff1);
			if(player.tptr_ss.best.gte(10))return space.floor();
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
			if (hasUpgrade("tptr_q", 22)) x = x.plus(upgradeEffect("tptr_q", 22));
			if (hasUpgrade("tptr_ss", 31)) x = x.plus(upgradeEffect("tptr_ss", 31));
			return x;
		},
		freeSpaceBuildings1to4() {
			let x = new Decimal(0);
			if (player.tptr_s.unlocked) x = x.plus(buyableEffect("tptr_s", 15));
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
			if (!player.tptr_s.unlocked || inChallenge("tptr_h", 21)) return new Decimal(0);
			let pow = new Decimal(1);
			if (hasUpgrade("tptr_s", 21)) pow = pow.plus(0.08);
			if (hasChallenge("tptr_h", 21)) pow = pow.plus(challengeEffect("tptr_h", 21).div(100));
			if (player.tptr_ss.unlocked) pow = pow.plus(layers.tptr_ss.eff2());
			if (hasUpgrade("tptr_ss", 42)) pow = pow.plus(1);
			if (hasUpgrade("tptr_ba", 12)) pow = pow.plus(upgradeEffect("tptr_ba", 12));
			
			pow = pow.plus(tmp.tptc_s.buyables[19].effect.sub(1));
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
			if (hasUpgrade("tptr_s", 23)) div = div.times(1e20);
			if (player.tptr_ss.unlocked) div = div.times(tmp.tptr_ss.eff3);
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
			13: {
				title: "Tertiary Space Building",
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
					//if (hasUpgrade("s", 32) && player.i.buyables[12].gte(5)) levels = levels.plus(player.s.buyables[13+1]||0);
					return levels;
				},
				effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = Decimal.pow(1e18, x.plus(tmp.tptr_s.buyables[this.id].freeLevels).times(tmp.tptr_s.buildingPower).pow(0.9))
					//if (player.hs.unlocked) eff = eff.pow(buyableEffect("hs", 23));
					//eff = softcap("spaceBuilding3", eff);
					if(eff.gte(new Decimal("e1e12"))){
						return Decimal.pow(10, eff.log10().root(3).times(new Decimal("e1e12").log10().pow(2/3)));
					}
					return eff;
                },
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return (("Cost: " + formatWhole(data.cost) + " Generator Power"))+"\n\
                    Level: " + formatWhole(player[this.layer].buyables[this.id])+(data.freeLevels.gt(0)?(" + "+formatWhole(data.freeLevels)):"") + "\n\
                    "+(("Divide Booster/Generator cost by " + format(data.effect)))
                },
                unlocked() { return player[this.layer].unlocked && player.tm.buyables[7].gte(5) }, 
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
			14: {
				title: "Quaternary Space Building",
				costExp() { 
					let exp = 1.35;
					//if (hasUpgrade("s", 31) && player.i.buyables[12].gte(5)) exp -= 0.04*(15-this.id);
					return exp;
				},
				cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					let base = tmp.tptr_s.buildingBaseCosts[this.id];
					let cost = Decimal.pow(base, x.times(tmp.tptr_s.buildScalePower).pow(tmp[this.layer].buyables[this.id].costExp)).times(base);
					if (hasUpgrade("tptr_s", 15)) cost = cost.root(3);
					return cost.div(tmp.tptr_s.divBuildCosts);
                },
				freeLevels() {
					let levels = tmp.tptr_s.freeSpaceBuildings.plus(tmp.tptr_s.freeSpaceBuildings1to4);
					//if (hasUpgrade("s", 32) && player.i.buyables[12].gte(5)) levels = levels.plus(player.s.buyables[14+1]||0);
					return levels;
				},
				effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let ret = x.plus(tmp.tptr_s.buyables[this.id].freeLevels).times(tmp.tptr_s.buildingPower).times((hasUpgrade("tptr_s", 15))?3:1).add(1).pow(1.25);
					//ret = softcap("spaceBuilding4", ret);
					//if (player.hs.unlocked) ret = ret.times(buyableEffect("hs", 24));
					if(ret.gte(1e6))return ret.log10().pow(1).times(new Decimal(1e6).div(new Decimal(1e6).log10().pow(1)));
					return ret
				},
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return ("Cost: " + formatWhole(data.cost) + " Generator Power")+"\n\
                    Level: " + formatWhole(player[this.layer].buyables[this.id])+(data.freeLevels.gt(0)?(" + "+formatWhole(data.freeLevels)):"") + "\n\
					"+("<b>Discount One</b> is raised to the power of " + format(data.effect))
                },
                unlocked() { return player[this.layer].unlocked&&hasUpgrade("tptr_s", 14) }, 
                canAfford() {
                    return player.tptr_g.power.gte(tmp[this.layer].buyables[this.id].cost) && layers.tptr_s.space().gt(0)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player.tptr_g.power = player.tptr_g.power.sub(cost)
					player.tptr_s.spent = player.tptr_s.spent.plus(1);
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
				target() { return player.tptr_g.power.times(tmp.tptr_s.divBuildCosts).pow(hasUpgrade("tptr_s", 15)?3:1).div(tmp.tptr_s.buildingBaseCosts[this.id]).max(1).log(tmp.tptr_s.buildingBaseCosts[this.id]).root(tmp[this.layer].buyables[this.id].costExp).div(tmp.tptr_s.buildScalePower).plus(1).floor().min(player[this.layer].buyables[this.id].plus(layers.tptr_s.space())) }, 
                buyMax() {
					if (!this.canAfford() || !this.unlocked()) return;
					let target = this.target();
					player.tptr_s.spent = player.tptr_s.spent.plus(target.sub(player[this.layer].buyables[this.id]))
					player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(target);
				}, 
                style: {'height':'100px'},
			},
			15: {
				title: "Quinary Space Building",
				cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					let base = tmp.tptr_s.buildingBaseCosts[this.id];
					let cost = Decimal.pow(base, x.times(tmp.tptr_s.buildScalePower).pow(1.35)).times(base);
					return cost.div(tmp.tptr_s.divBuildCosts);
                },
				freeLevels() {
					let levels = tmp.tptr_s.freeSpaceBuildings;
					//if (hasUpgrade("s", 32) && player.i.buyables[12].gte(5)) levels = levels.plus(player.s.buyables[15+1]||0);
					return levels;
				},
				effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let ret = x.plus(tmp.tptr_s.buyables[this.id].freeLevels).times(tmp.tptr_s.buildingPower).div(2);
					if (hasUpgrade("tptr_q", 32)) ret = ret.times(2);
					//if (player.hs.unlocked) ret = ret.times(buyableEffect("hs", 25));
					return ret.floor();
                },
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return ("Cost: " + formatWhole(data.cost) + " Generator Power")+"\n\
                    Level: " + formatWhole(player[this.layer].buyables[this.id])+(data.freeLevels.gt(0)?(" + "+formatWhole(data.freeLevels)):"") + "\n\
					"+("Add " + formatWhole(data.effect)+" levels to all previous Space Buildings.")
                },
                unlocked() { return player[this.layer].unlocked&&hasUpgrade("tptr_s", 25) }, 
                canAfford() {
                    return player.tptr_g.power.gte(tmp[this.layer].buyables[this.id].cost) && layers.tptr_s.space().gt(0)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player.tptr_g.power = player.tptr_g.power.sub(cost)
					player.tptr_s.spent = player.tptr_s.spent.plus(1);
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                target() { return player.tptr_g.power.times(tmp.tptr_s.divBuildCosts).div(tmp.tptr_s.buildingBaseCosts[this.id]).max(1).log(tmp.tptr_s.buildingBaseCosts[this.id]).root(1.35).div(tmp.tptr_s.buildScalePower).plus(1).floor().min(player[this.layer].buyables[this.id].plus(layers.tptr_s.space())) }, 
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
		resetsNothing() {return player.tptr_ss.best.gte(1)},
		autoPrestige() {return player.tptr_ss.best.gte(1)},
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
		upgrades: {
			rows: 3,
			cols: 5,
			11: {
				title: "Space X",
				description: "Add a free level to all Space Buildings.",
				cost() { return new Decimal(2) },
				unlocked() { return player.tm.buyables[7].gte(5) }
			},
			12: {
				title: "Generator Generator",
				description: "Generator Power boosts its own generation.",
				cost() { return new Decimal(3) },
				unlocked() { return hasUpgrade("tptr_s", 11) },
				effect() { return player.tptr_g.power.add(1).log10().add(1) },
				effectDisplay() { return format(tmp.tptr_s.upgrades[12].effect)+"x" },
			},
			13: {
				title: "Shipped Away",
				description: "Space Building Levels boost Generator Power gain, and you get 2 extra Space.",
				cost() { return new Decimal(32) },
				unlocked() { return hasUpgrade("tm", 34) },
				effect() { let eff=Decimal.pow(20, tmp.tptr_s.totalBuildingLevels);
					if(eff.gte(new Decimal("e1.5e11"))){
						return Decimal.pow(10, eff.log10().root(5).times(new Decimal("e1.5e11").log10().pow(4/5)));
					}
					return eff;
				},
				effectDisplay() { return format(tmp.tptr_s.upgrades[13].effect)+"x" },
			},
			14: {
				title: "Into The Repeated",
				description: "Unlock the <b>Quaternary Space Building</b>.",
				cost() { return new Decimal(33) },
				unlocked() { return hasUpgrade("tm", 34) }
			},
			15: {
				title: "Four Square",
				description: "The <b>Quaternary Space Building</b> cost is cube rooted, is 3x as strong, and also affects <b>BP Combo</b> (brought to the 2.7th root).",
				cost() { return new Decimal(44) },
				unlocked() { return hasUpgrade("tptr_s", 14) },
			},
			21: {
				title: "Spacious",
				description: "All Space Buildings are 8% stronger.",
				cost() { return new Decimal(50) },
				unlocked() { return player.tm.buyables[7].gte(11) },
			},
			22: {
				title: "Spacetime Anomaly",
				description: "Non-extra Time Capsules provide free Space Buildings.",
				cost() { return new Decimal(51) },
				unlocked() { return player.tm.buyables[7].gte(11) },
				effect() { return player.tptr_t.points.cbrt().floor() },
				effectDisplay() { return "+"+formatWhole(tmp.tptr_s.upgrades[22].effect) },
			},
			23: {
				title: "Revert Space",
				description: "Space layer's requirement in TPTC and TPTR are reduced to 1, and all Space Building costs are divided by 1e20.",
				cost() { return new Decimal(52) },
				unlocked() { return player.tm.buyables[7].gte(11) },
			},
			24: {
				title: "Want More?",
				description: "All four of the <b>I Need More</b> upgrades are stronger based on your Total Space Buildings.",
				cost() { return new Decimal(54) },
				unlocked() { return player.tm.buyables[7].gte(11) },
				effect() {
					return tmp.tptr_s.totalBuildingLevels.sqrt().div(5).plus(1);
				},
				effectDisplay() { return format(tmp.tptr_s.upgrades[24].effect.sub(1).times(100))+"% stronger" },
			},
			25: {
				title: "Another One?",
				description: "Unlock the Quinary Space Building.",
				cost() { return new Decimal(54) },
				unlocked() { return player.tm.buyables[7].gte(13) },
			},
		},
});

addLayer("tptr_sb", {
        name: "tptr_sb", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "SB", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        color: "#504899",
        requires(){
			let ret=new Decimal(1000);
			if(hasUpgrade("tptc_p",35))ret = ret.sub(125);
			if(hasUpgrade("tptc_p",45))ret = ret.sub(100);
			if(hasChallenge("tptr_h",11))ret = ret.sub(50);
			if(hasUpgrade("tptc_sb",12))ret = ret.sub(50);
			if(player.tm.buyables[7].gte(12))ret = ret.sub(25);
			if(player.tm.buyables[7].gte(13))ret = ret.sub(50);
			if(player.tm.buyables[7].gte(14))ret = ret.sub(75);
			if(player.tm.buyables[7].gte(15))ret = ret.sub(50);
			if(player.tm.buyables[7].gte(19))ret = ret.sub(75);
			if(hasChallenge("tptc_h",31))ret = ret.sub(100);
			return ret
		}, // Can be a function that takes requirement increases into account
        resource: "super boosters", // Name of prestige currency
        baseResource: "boosters", // Name of resource prestige is based on
        baseAmount() {return player.tptr_b.points}, // Get the current amount of baseResource
		roundUpCost: true,
        type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
		branches: ["tptr_b"],
        exponent() { return 1.25 }, // Prestige currency exponent
		base() { return 1.05 },
		gainMult() { 
			let mult = new Decimal(1);
			if (hasUpgrade("tptr_ss", 21)) mult = mult.div(1.2);
			return mult;
		},
        row: 2, // Row the layer is in on the tree (0 is the first row)
        layerShown(){return player.tm.currentTree==7 && hasUpgrade("tm",36)},
		doReset(l){
			if(l=="tptr_p" || l=="tptr_b" || l=="tptr_g" || l=="tptr_t" || l=="tptr_e" || l=="tptr_s" || l=="tptr_sb" || l=="tptr_sg" || !l.startsWith("tptr_")){return;}
			var b=new Decimal(player.tptr_sb.best);
			layerDataReset("tptr_sb",["upgrades","milestones","challenges"]);
			player.tptr_sb.best=b;
			return;
		},
		effectBase() {
			let base = new Decimal(5);
			if (hasChallenge("tptr_h", 12)) base = base.plus(.25);
			//if (hasUpgrade("e", 31) && player.i.buyables[12].gte(3)) base = base.plus(buyableEffect("e", 11).second);
			
			if (player.tptr_o.unlocked) base = base.times(buyableEffect("tptr_o", 12));/*
			if (((Array.isArray(tmp.ma.mastered))?tmp.ma.mastered.includes('b'):false) && hasUpgrade("b", 12)) base = base.times(upgradeEffect("b", 12).max(1));
			if (((Array.isArray(tmp.ma.mastered))?tmp.ma.mastered.includes('b'):false) && hasUpgrade("b", 13)) base = base.times(upgradeEffect("b", 13).max(1));
			base = base.times(tmp.n.dustEffs.blue);
			if (((Array.isArray(tmp.ma.mastered))?tmp.ma.mastered.includes("h"):false) && hasChallenge("h", 12)) base = base.times(player.hs.points.plus(1));
			if (player.en.unlocked) base = base.pow(tmp.en.swEff);
			if (player.c.unlocked && tmp.c) base = base.pow(tmp.c.eff5);*/
			return base
		},
		effect() {
			//if (!unl(this.layer)) return new Decimal(1);
			return [Decimal.pow(this.effectBase(), player.tptr_sb.points).max(0),player.tptr_sb.points.add(1).pow(hasUpgrade("tptc_sb",14)?2:hasUpgrade("tptc_sb",11)?1.15:1)];
		},
		effectDescription() {
			return "which are multiplying the Booster base by "+format(tmp.tptr_sb.effect[0])+"x and are boosting your super booster base in TPTC by "+format(tmp.tptr_sb.effect[1])+"x";
		},
		tabFormat: ["main-display",
			"prestige-button",
			"blank",
		],
		startData() { return {
        unlocked: false,
		points: new Decimal(0),
		best: new Decimal(0),
    }},
		canBuyMax() {return player.tptr_o.best.gte(1)},
		resetsNothing() {return player.tptr_o.best.gte(1)},
		autoPrestige() {return player.tptr_o.best.gte(1)},
})


addLayer("tptr_sg", {
        name: "tptr_sg", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "SG", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 4, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        color: "#248239",
        requires(){
			let ret=new Decimal(966);
			if(hasUpgrade("tptc_sg",11))ret = ret.sub(56);
			if(hasUpgrade("tptc_sg",12))ret = ret.sub(80);
			if(player.tm.buyables[7].gte(13))ret = ret.sub(60);
			if(player.tm.buyables[7].gte(14))ret = ret.sub(70);
			if(player.tm.buyables[7].gte(19))ret = ret.sub(50);
			if(hasUpgrade("tptr_q",33))ret = ret.sub(150);
			if(hasChallenge("tptc_h",31))ret = ret.sub(100);
			return ret
		}, // Can be a function that takes requirement increases into account
        resource: "super generators", // Name of prestige currency
        baseResource: "generators", // Name of resource prestige is based on
        baseAmount() {return player.tptr_g.points}, // Get the current amount of baseResource
		roundUpCost: true,
        type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
		branches: ["tptr_g"],
        exponent() { return 1.25 }, // Prestige currency exponent
		base() { return 1.05 },
		gainMult() { 
			let mult = new Decimal(1);
			if (hasUpgrade("tptr_ss", 21)) mult = mult.div(1.2);
			return mult;
		},
        row: 2, // Row the layer is in on the tree (0 is the first row)
        layerShown(){return player.tm.currentTree==7 && hasUpgrade("tm",37)},
		update(diff) {
			player.tptr_sg.power = player.tptr_sg.power.plus(tmp.tptr_sg.effect[0].times(diff));
			player.tptr_sg.time = player.tptr_sg.time.plus(diff);
		},
		doReset(l){
			if(l=="tptr_p" || l=="tptr_b" || l=="tptr_g" || l=="tptr_t" || l=="tptr_e" || l=="tptr_s" || l=="tptr_sb" || l=="tptr_sg" || !l.startsWith("tptr_")){return;}
			var b=new Decimal(player.tptr_sg.best);
			layerDataReset("tptr_sg",["upgrades","milestones","challenges"]);
			player.tptr_sg.best=b;
			return;
		},
		effectBase() {
			let base = new Decimal(5);
			if (hasUpgrade("tptr_ss", 32)) base = base.plus(upgradeEffect("tptr_ss", 32));
			
			
			if (hasUpgrade("tptr_ba", 32)) base = base.times(upgradeEffect("tptr_ba", 32));

			return base;
		},
		effect() {
			let eff = Decimal.pow(this.effectBase(), player.tptr_sg.points).sub(1).max(0);
			if (player.tm.buyables[7].gte(20)) eff = eff.times(challengeEffect("tptr_h", 31));
			return [eff,player.tptr_sg.points.add(1)];
		},
		effectDescription() {
			return "which are generating "+format(tmp.tptr_sg.effect[0])+" Super Generator Power/sec and are boosting your super generator base in TPTC by "+format(tmp.tptr_sg.effect[1])+"x"
		},
		enEff() {
			//if (!unl(this.layer)) return new Decimal(1);
			let eff = player.tptr_sg.power.plus(1).sqrt();
			return eff;
		},
		tabFormat: ["main-display",
			"prestige-button",
			"blank",
			["display-text",
				function() {return 'You have ' + format(player.tptr_sg.power) + ' Super Generator Power, which multiplies the Generator base by '+format(tmp.tptr_sg.enEff)+'x'},
					{}],
			"blank",
		],
		startData() { return {
			unlocked: false,
			points: new Decimal(0),
			best: new Decimal(0),
			power: new Decimal(0),
			first: 0,
			auto: false,
			time: new Decimal(0),
		}},
		canBuyMax() {return player.tptr_ss.best.gte(8)},
		resetsNothing() {return player.tptr_ss.best.gte(8)},
		autoPrestige() {return player.tptr_ss.best.gte(8)},
})


addLayer("tptr_h", {
        name: "tptr_h", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "H", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
            unlocked: false,
			points: new Decimal(0),
			best: new Decimal(0),
			chall31bought: 0,
			first: 0,
			auto: false,
        }},
        color: "#a14040",
        requires: new Decimal(1e30), // Can be a function that takes requirement increases into account
        resource: "hindrance spirit", // Name of prestige currency
        baseResource: "time energy", // Name of resource prestige is based on
        baseAmount() {return player.tptr_t.energy}, // Get the current amount of baseResource
        type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent() { return 0.125 }, // Prestige currency exponent
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
			if (hasUpgrade("tptr_q", 14)) mult = mult.times(upgradeEffect("tptr_q", 14).h);
			if (player.tptr_m.unlocked) mult = mult.times(tmp.tptr_m.hexEff);
			if (hasUpgrade("tptr_ba", 22)) mult = mult.times(tmp.tptr_ba.negBuff);
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        row: 3, // Row the layer is in on the tree (0 is the first row)
		doReset(l){
			if(l=="tptr_p" || l=="tptr_b" || l=="tptr_g" || l=="tptr_t" || l=="tptr_e" || l=="tptr_s" || l=="tptr_sb" || l=="tptr_sg" || l=="tptr_o" || l=="tptr_h" || l=="tptr_q" || l=="tptr_ss" || !l.startsWith("tptr_")){return;}
			var b=new Decimal(player.tptr_h.best);
			layerDataReset("tptr_h",["upgrades","milestones","challenges"]);
			player.tptr_h.best=b;
			return;
		},
        layerShown(){return player.tm.currentTree==7 && hasUpgrade("tm",46)},
        branches: ["tptr_t"],
		effect() { 
			if (!player[this.layer].unlocked) return [new Decimal(1),new Decimal(1)];
			let h = player.tptr_h.points.times(player.modpoints[7].plus(1).log("1e1000").plus(1));
			
			if(h.gte(15e4)){
				h=Decimal.pow(10, h.log10().root(4).times(new Decimal(15e4).log10().pow(3/4)));
			}
			
			let eff = h.plus(1).pow(3).pow(hasChallenge("tptr_h", 11)?1.2:1).pow(hasUpgrade("tptr_ba", 21)?8:1);
			if(hasUpgrade("tptr_ba", 21))return [eff,eff];
			return [eff,new Decimal(1)];
		},
		effectDescription() {
			if(hasUpgrade("tptr_ba", 21))return "which are multiplying Rewritten Point gain, Time Energy gain, Time Energy cap in TPTR and Real Prestige Tree (H challenge) effect in TPTC by "+format(tmp.tptr_h.effect[0])+" (boosted by Rewritten Points)"
			return "which are multiplying Rewritten Point gain, Time Energy gain, & the Time Energy cap by "+format(tmp.tptr_h.effect[0])+" (boosted by Rewritten Points)"
		},
		milestones: {
			0: {
				requirementDescription: "1 Hindrance Spirit",
				done() { return player.tptr_h.best.gte(1) },
				effectDescription: "Autobuy Time Capsules, Time Capsules resets nothing. Autobuy Extra Time Capsules.",
			},
		},
		challenges: {
			rows: 4,
			cols: 2,
			11: {
				name: "Real Prestige Tree Mk.II",
				completionLimit: 1,
				challengeDescription: "Force a Row 7 reset in TPTC. You're trapped in 'Real Prestige Tree' in TPTC.",
				unlocked() { return player.tptr_h.unlocked },
				goal() { return new Decimal("e574e5") },
				currencyDisplayName: "points",
				currencyInternalName: "points",
				rewardDescription: "The Hindrance Spirit effect is raised to the power of 1.2. Super-Boosters are cheaper. Unlock a new challenge in the H layer of TPTC.",
			},
			12: {
				name: "No Prestige Mk.II",
				completionLimit: 1,
				challengeDescription: "Force a Row 7 reset in TPTC. You're trapped in 'No Prestige' in TPTC. Also, Prestige Point gain in TPTR is 0.",
				unlocked() { return player.tm.buyables[7].gte(8) },
				goal() { return new Decimal("e522e5") },
				currencyDisplayName: "points",
				currencyInternalName: "points",
				rewardDescription() { return "Add 0.25 to the Super Booster base. Unlock a new challenge in the H layer of TPTC." },
			},
			21: {
				name: "Out of Room",
				completionLimit: 1,
				challengeDescription: "Force a Row 7 reset in TPTC. Space Buildings in TPTC & TPTR are disabled.",
				unlocked() { return player.tm.buyables[7].gte(15) },
				goal() { return new Decimal("e212e6") },
				currencyDisplayName: "points",
				currencyInternalName: "points",
				rewardDescription: "Space Energy boosts the strength of Space Buildings.",
				rewardEffect() { return player.tptr_s.points.div(2).times(1) },
				rewardDisplay() { return format(this.rewardEffect())+"% stronger (additive)" },
			},
			22: {
				name: "Descension",
				completionLimit: 1,
				challengeDescription: "Force a Row 7 reset in TPTC. The only thing that boost Point generation is point gain multiplier upgrades and buyables from trees except TPTC and TPTR.",
				unlocked() { return player.tm.buyables[7].gte(16) },
				goal() { return new Decimal("ee8") },
				currencyDisplayName: "points",
				currencyInternalName: "points",
				rewardDescription: "<b>Prestige Boost</b>'s hardcap is now a softcap.",
			},
			31: {
				name: "Timeless",
				scalePower() {
					let power = new Decimal(1);
					//if (tmp.m.buyables[15].unlocked) power = power.times(Decimal.sub(1, buyableEffect("m", 15)));
					return power;
				},
				completionLimit() { 
					let lim = 10
					if (hasUpgrade("tptr_ss", 23)) lim += 10;
					if (player.tm.buyables[7].gte(23)) lim += 10;
					//if ((Array.isArray(tmp.ma.mastered))?tmp.ma.mastered.includes("h"):false) lim = Infinity;
					return lim
				},
				challengeDescription() {
					let lim = this.completionLimit();
					let infLim = !isFinite(lim);
					return "Force a Row 7 reset in TPTC. Enhancers & Extra Time Capsules in TPTC & TPTR has no effect.<br>Completions: "+formatWhole(challengeCompletions("tptr_h", 31))+(infLim?"":("/"+lim));
				},
				unlocked() { return player.tm.buyables[7].gte(20) },
				goal() { 
					let comps = Decimal.mul(challengeCompletions("tptr_h", 31), tmp.tptr_h.challenges[this.id].scalePower);
					//if (comps.gte(20)) comps = Decimal.pow(comps.sub(19), 1.95).plus(19);
					return Decimal.pow("e1e7", Decimal.pow(comps, 2)).times("e51e7") 
				},
				completeInBulk() {
					return;
					if (!inChallenge("tptr_h", 31)) return;
					if (challengeCompletions("tptr_h", 31)>=tmp[this.layer].challenges[this.id].completionLimit) return;
					let target = player.points.div("1e5325").max(1).log("1e50").root(2.5)
					if (target.gte(20)) target = target.sub(19).root(1.95).plus(19);
					target = target.div(tmp.tptr_h.challenges[this.id].scalePower).plus(1).floor();
					player.tptr_h.challenges[this.id] = Math.min(Math.max(player.tptr_h.challenges[this.id], target.toNumber()), tmp[this.layer].challenges[this.id].completionLimit);
					if (isNaN(player.tptr_h.challenges[this.id])) player.tptr_h.challenges[this.id] = 0;
				},
				currencyDisplayName: "points",
				currencyInternalName: "points",
				rewardDescription() { return "<b>Timeless</b> completions boost Super Generator Power gain based on your time playing this game." },
				rewardEffect() { 
					let eff = Decimal.mul(9, Decimal.add(player.timePlayed, 1).cbrt()).plus(1).pow(challengeCompletions("tptr_h", 31));
					if (!eff.eq(eff)) eff = new Decimal(1);
					return eff;
				},
				rewardDisplay() { return format(this.rewardEffect())+"x" },
			},
			32: {
				name: "Option D",
				scalePower() {
					let power = new Decimal(1);
					//if (tmp.m.buyables[15].unlocked) power = power.times(Decimal.sub(1, buyableEffect("m", 15)));
					return power;
				},
				completionLimit() { 
					let lim = 10;
					//if ((Array.isArray(tmp.ma.mastered))?tmp.ma.mastered.includes("h"):false) lim = Infinity;
					return lim;
				},
				challengeDescription() { 
					let lim = this.completionLimit();
					let infLim = !isFinite(lim);
					return 'Force a Row 7 reset in TPTC. Boosters, Generators, Time Capsules, Enhancers and Space Buildings has no effect in TPTC & TPTR.<br>Completions: '+formatWhole(challengeCompletions("tptr_h", 32))+(infLim?"":('/'+lim))
				},
				goal() {
					let comps = Decimal.mul(challengeCompletions("tptr_h", 32), tmp.tptr_h.challenges[this.id].scalePower);
					return Decimal.pow("e5e10", Decimal.pow(comps, 3)).times("e4e11");
				},
				completeInBulk() {
					return;
					if (challengeCompletions("h", 32)>=tmp[this.layer].challenges[this.id].completionLimit) return;
					let target = player.points.div("1e9000").max(1).log("1e1000").cbrt();
					if (target.gte(3.04)) target = target.div(1.425);
					if (target.gte(3)) target = target.plus(.96);
					target = target.div(tmp.h.challenges[this.id].scalePower).plus(1).floor();
					player.h.challenges[this.id] = Math.min(Math.max(player.h.challenges[this.id], target.toNumber()), tmp[this.layer].challenges[this.id].completionLimit);
					if (isNaN(player.h.challenges[this.id])) player.h.challenges[this.id] = 0;
				},
				currencyDisplayName: "points",
				currencyInternalName: "points",
				rewardDescription: "<b>Option D</b> completions multiply the Time Energy gain base.",
				rewardEffect() { 
					let eff = Decimal.pow(100, Decimal.pow(challengeCompletions("tptr_h", 32), 2));
					if(eff.gte(1e33))eff = Decimal.pow(10,eff.log10().div(33).cbrt().mul(33));
					/*.times(tmp.n.realDustEffs2?tmp.n.realDustEffs2.blueOrange:new Decimal(1))*/;
					if (!eff.eq(eff)) eff = new Decimal(1);
					return eff;
				},
				rewardDisplay() { return format(tmp.tptr_h.challenges[32].rewardEffect)+"x" },
				unlocked() { return (tmp.tptr_ps.buyables[11].effects.hindr||0)>=1 },
				countsAs: [21,31,41]
			},
			41: {
				name: "No Boosters/Generators Mk.II",
				completionLimit: 1,
				challengeDescription: "Force a Row 7 reset in TPTC. Boosters and Generators has no effect in TPTC & TPTR.",
				unlocked() { return player.tm.buyables[7].gte(24) },
				goal() { return new Decimal("e115e8") },
				currencyDisplayName: "points",
				currencyInternalName: "points",
				rewardDescription: "Second effect of Boosters and Generators is better. Unlock a new challenge in the H layer of TPTC.",
			},
		},
		milestones: {
			1: {
				requirementDescription: "TPTR Level 23",
				unlocked() { return player.tm.buyables[7].gte(20) },
				done() { return player.tm.buyables[7].gte(23) },
				effectDescription: "Gain 100% of Hindrance Spirit gain per second, and +10 max Timeless completions.",
			},
		},
	 passiveGeneration(){
		 if(player.tm.buyables[7].gte(23))return 1;
		 return 0;
	 },
})


addLayer("tptr_q", {
        name: "tptr_q", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "Q", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
            unlocked: false,
			points: new Decimal(0),
			best: new Decimal(0),
			total: new Decimal(0),
			energy: new Decimal(0),
			time: new Decimal(0),
			auto: false,
			first: 0,
			pseudoUpgs: [],
        }},
        color: "#c20282",
        requires(){
			if(player.tm.buyables[7].gte(10))return new Decimal("1e512");
			if(player.tm.buyables[7].gte(9))return new Decimal("1e1000");
			return new Decimal("1e1500");
		}, // Can be a function that takes requirement increases into account
        resource: "quirks", // Name of prestige currency
        baseResource: "generator power", // Name of resource prestige is based on
        baseAmount() {return player.tptr_g.power}, // Get the current amount of baseResource
        type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent() { return 0.0075; }, // Prestige currency exponent
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
			if (hasUpgrade("tptr_q", 14)) mult = mult.times(upgradeEffect("tptr_q", 14).q);
			if (player.tptr_m.unlocked) mult = mult.times(tmp.tptr_m.hexEff);
			mult = mult.times(tmp.tptr_q.impr[33].effect);
			if (hasUpgrade("tptr_ba", 22)) mult = mult.times(tmp.tptr_ba.negBuff);
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
        row: 3, // Row the layer is in on the tree (0 is the first row)
        layerShown(){return player.tm.currentTree==7 && hasUpgrade("tm",47)},
		doReset(l){
			if(l=="tptr_p" || l=="tptr_b" || l=="tptr_g" || l=="tptr_t" || l=="tptr_e" || l=="tptr_s" || l=="tptr_sb" || l=="tptr_sg" || l=="tptr_o" || l=="tptr_h" || l=="tptr_q" || l=="tptr_ss" || !l.startsWith("tptr_")){return;}
			var b=new Decimal(player.tptr_q.best);
			layerDataReset("tptr_q",["upgrades","milestones","challenges"]);
			player.tptr_q.best=b;
			return;
		},
        branches: ["tptr_e"],
		enGainMult() {
			let mult = new Decimal(1);
			if (hasUpgrade("tptr_q", 11)) mult = mult.times(upgradeEffect("tptr_q", 11));
			if (hasUpgrade("tptr_q", 21)) mult = mult.times(upgradeEffect("tptr_q", 21));
			if (player.tptr_o.unlocked) mult = mult.times(buyableEffect("tptr_o", 12));
			if (player.tptr_ba.unlocked) mult = mult.times(tmp.tptr_ba.negBuff);
			return mult;
		},
		enGainExp() {
			let exp = player.tptr_q.buyables[11].plus(tmp.tptr_q.freeLayers).sub(1);
			return exp;
		},
		enEff() {
			let eff = player.tptr_q.energy.plus(1).pow(2);
			if (hasUpgrade("tptr_q", 23)) eff = eff.pow(3);
			eff = eff.times(tmp.tptr_q.impr[23].effect)
			if(eff.gte(new Decimal("e1800000")))eff = Decimal.pow(10,eff.log10().mul(1800000).sqrt());
			return eff;
		},
		update(diff) {
			player.tptr_q.time = player.tptr_q.time.plus(diff);
			if (tmp.tptr_q.enGainExp.gte(0)) player.tptr_q.energy = player.tptr_q.energy.plus(new Decimal(player.timePlayed).times(tmp.tptr_q.enGainMult).pow(tmp.tptr_q.enGainExp).times(diff));
			if (player.tptr_ba.best.gte(1)) layers.tptr_q.buyables[11].buyMax();
		},
	effect() {
		let ret = player.tptr_q.points.add(1);
		return ret;
	},
	effectDescription() { // Optional text to describe the effects
           let eff = this.effect();
           return "which are boosting your quirk layer base in TPTC by "+format(eff)+"x"
       },
		//passiveGeneration() { return (hasMilestone("ba", 0)&&player.ma.current!="q")?1:0 },
		tabFormat: [
					"main-display",
					"prestige-button",
					"blank",
					["display-text",
						function() {return 'You have ' + formatWhole(player.tptr_g.power)+' Generator Power'},
							{}],
					"blank",
					["display-text",
						function() {return 'You have ' + formatWhole(player.tptr_q.energy)+' Quirk Energy, which multiplies Rewritten Point and Generator Power gain by ' + format(tmp.tptr_q.enEff)},
							{}],
					"blank",
					"milestones", "blank",
					"blank",
					"buyables", "blank",
					["display-text",
						function() {if(!hasUpgrade("tptr_q", 41))return "";return 'You have ' + layers.tptr_q.getImprovements(11)+' Central Improvements (Next at '+format(layers.tptr_q.impr.nextAt(11))+' Quirk Energy), <b>Quirk Central</b>\'s effect ^' + format(tmp.tptr_q.impr[11].effect)},{}],
					["display-text",
						function() {if(!hasUpgrade("tptr_q", 41))return "";return 'You have ' + layers.tptr_q.getImprovements(12)+' Secondary Improvements (Next at '+format(layers.tptr_q.impr.nextAt(12))+' Quirk Energy), <b>Back to Row 2</b>\'s effect x' + format(tmp.tptr_q.impr[12].effect)},{}],
					["display-text",
						function() {if(!hasUpgrade("tptr_q", 41))return "";return 'You have ' + layers.tptr_q.getImprovements(13)+' Level 4 Improvements (Next at '+format(layers.tptr_q.impr.nextAt(13))+' Quirk Energy), <b>Row 4 Synergy</b>\'s effect ^' + format(tmp.tptr_q.impr[13].effect)},{}],
						["display-text",
						function() {if(!hasUpgrade("tptr_q", 42))return "";return 'You have ' + layers.tptr_q.getImprovements(21)+' Developmental Improvements (Next at '+format(layers.tptr_q.impr.nextAt(21))+' Quirk Energy), <b>Quirk City</b>\'s effect ^' + format(tmp.tptr_q.impr[21].effect)},{}],
					["display-text",
						function() {if(!hasUpgrade("tptr_q", 42))return "";return 'You have ' + layers.tptr_q.getImprovements(22)+' Transfinite Improvements (Next at '+format(layers.tptr_q.impr.nextAt(22))+' Quirk Energy), <b>Infinite Possibilities</b>\'s effect x' + format(tmp.tptr_q.impr[22].effect)},{}],
					["display-text",
						function() {if(!hasUpgrade("tptr_q", 42))return "";return 'You have ' + layers.tptr_q.getImprovements(23)+' Energy Improvements (Next at '+format(layers.tptr_q.impr.nextAt(23))+' Quirk Energy), Quirk Energy effect x' + format(tmp.tptr_q.impr[23].effect)},{}],
						["display-text",
						function() {if(!hasUpgrade("tptr_q", 44))return "";return 'You have ' + layers.tptr_q.getImprovements(31)+' Scale Improvements (Next at '+format(layers.tptr_q.impr.nextAt(31))+' Quirk Energy), <b>Scale Softening</b>\'s effect x' + format(tmp.tptr_q.impr[31].effect)},{}],
					["display-text",
						function() {if(!hasUpgrade("tptr_q", 44))return "";return 'You have ' + layers.tptr_q.getImprovements(32)+' Booster Improvements (Next at '+format(layers.tptr_q.impr.nextAt(32))+' Quirk Energy), <b>Booster Madness</b>\'s effect x' + format(tmp.tptr_q.impr[32].effect)},{}],
					["display-text",
						function() {if(!hasUpgrade("tptr_q", 44))return "";return 'You have ' + layers.tptr_q.getImprovements(33)+' Quirk Improvements (Next at '+format(layers.tptr_q.impr.nextAt(33))+' Quirk Energy), Quirk gain x' + format(tmp.tptr_q.impr[33].effect)},{}],
					["display-text",
						function() {if((tmp.tptr_ps.buyables[11].effects.quirkImpr||0)<1)return "";return 'You have ' + layers.tptr_q.getImprovements(41)+' Solar Improvements (Next at '+format(layers.tptr_q.impr.nextAt(41))+' Quirk Energy), Solar Energy gain x' + format(tmp.tptr_q.impr[41].effect)},{}],
					"upgrades",
							
		],
		freeLayers() {
			let l = new Decimal(0);
			if (player.tm.buyables[7].gte(28)) l = l.plus(tmp.tptr_m.clickables[13].effect);
			//if (tmp.q.impr[43].unlocked) l = l.plus(improvementEffect("q", 43));
			//if (player.i.buyables[11].gte(3)) l = l.plus(buyableEffect("s", 18));
			return l;
		},
		
		impr: {
			scaleSlow() {
				let slow = new Decimal(1);
				//if (tmp.ps.impr[22].unlocked) slow = slow.times(tmp.ps.impr[22].effect);
				//if (hasUpgrade("q", 35) && player.i.buyables[12].gte(6)) slow = slow.times(upgradeEffect("q", 35));
				return slow;
			},
			baseReq() { 
				let req = new Decimal(1e128);
				if (player.tptr_ps.unlocked) req = req.div(tmp.tptr_ps.soulEff);
				return req;
			},
			amount() { 
				let amt = player.tptr_q.energy.div(this.baseReq()).plus(1).log10().div(2).root(layers.tptr_q.impr.scaleSlow().pow(-1).plus(1)).max(0);
				if (amt.gte(270)) amt = amt.log10().times(270/Math.log10(270));
				return amt.floor();
			},
			overallNextImpr() { 
				let impr = tmp.tptr_q.impr.amount.plus(1);
				if (impr.gte(270)) impr = Decimal.pow(10, impr.div(270/Math.log10(270)));
				return Decimal.pow(10, impr.pow(layers.tptr_q.impr.scaleSlow().pow(-1).plus(1)).times(2)).sub(1).times(this.baseReq());
			},
			nextAt(id=11) { 
				let impr = layers.tptr_q.getImprovements(id).times(9).add(tmp.tptr_q.impr[id].num);
				if (impr.gte(270)) impr = Decimal.pow(10, impr.div(270/Math.log10(270)));
				return Decimal.pow(10, impr.pow(layers.tptr_q.impr.scaleSlow().pow(-1).plus(1)).times(2)).sub(1).times(this.baseReq());
			},
			free() {
				let free = new Decimal(0);
				//if ((Array.isArray(tmp.ma.mastered))?tmp.ma.mastered.includes('q'):false) free = free.plus(Decimal.div(player.s.buyables[20]||0, 4));
				return free.floor();
			},
			11: {
				num: 1,
				title: "Central Improvement",
				description: "<b>Quirk Central</b> is stronger.",
				unlocked() { return hasUpgrade("tptr_q", 41) },
				effect() { return Decimal.mul(0.1, layers.tptr_q.getImprovements(11).plus(tmp.tptr_q.impr.free)).plus(1) },
			},
			12: {
				num: 2,
				title: "Secondary Improvement",
				description: "<b>Back to Row 2</b> is stronger.",
				unlocked() { return hasUpgrade("tptr_q", 41) },
				effect() { return Decimal.mul(0.05, layers.tptr_q.getImprovements(12).plus(tmp.tptr_q.impr.free)).plus(1) },
			},
			13: {
				num: 3,
				title: "Level 4 Improvement",
				description: "<b>Row 4 Synergy</b> is stronger.",
				unlocked() { return hasUpgrade("tptr_q", 41) },
				effect() { return Decimal.mul(0.25, layers.tptr_q.getImprovements(13).plus(tmp.tptr_q.impr.free)).plus(1) },
			},
			21: {
				num: 4,
				title: "Developmental Improvement",
				description: "<b>Quirk City</b> is stronger.",
				unlocked() { return hasUpgrade("tptr_q", 42) },
				effect() { return Decimal.mul(1.5, layers.tptr_q.getImprovements(21).plus(tmp.tptr_q.impr.free)).plus(1) },
			},
			22: {
				num: 5,
				title: "Transfinite Improvement",
				description: "<b>Infinite Possibilities</b> is stronger.",
				unlocked() { return hasUpgrade("tptr_q", 42) },
				effect() { return Decimal.mul(0.2, layers.tptr_q.getImprovements(22).plus(tmp.tptr_q.impr.free)).plus(1) },
			},
			23: {
				num: 6,
				title: "Energy Improvement",
				description: "The Quirk Energy effect is stronger.",
				unlocked() { return hasUpgrade("tptr_q", 42) },
				effect() { return Decimal.pow(1e25, Decimal.pow(layers.tptr_q.getImprovements(23).plus(tmp.tptr_q.impr.free), 1.5)) },
			},
			31: {
				num: 7,
				title: "Scale Improvement",
				description: "<b>Scale Softening</b> is stronger.",
				unlocked() { return hasUpgrade("tptr_q", 44) },
				effect() { return Decimal.mul(0.5, layers.tptr_q.getImprovements(31).plus(tmp.tptr_q.impr.free)).plus(1) },
			},
			32: {
				num: 8,
				title: "Booster Improvement",
				description: "<b>Booster Madness</b> is stronger.",
				unlocked() { return hasUpgrade("tptr_q", 44) },
				effect() { return Decimal.mul(0.2, layers.tptr_q.getImprovements(32).plus(tmp.tptr_q.impr.free)).plus(1) },
			},
			33: {
				num: 9,
				title: "Quirk Improvement",
				description: "Quirk gain is stronger.",
				unlocked() { return hasUpgrade("tptr_q", 44) },
				effect() { return Decimal.pow(1e8, Decimal.pow(layers.tptr_q.getImprovements(33).plus(tmp.tptr_q.impr.free), 1.2)) },
			},
			41: {
				num: 271,
				title: "Solar Improvement",
				description: "Solar Energy gain is stronger.",
				unlocked() { return (tmp.tptr_ps.buyables[11].effects.quirkImpr||0)>=1 },
				effect() { return Decimal.pow("1e400", Decimal.pow(layers.tptr_q.getImprovements(41).plus(tmp.tptr_q.impr.free), 0.9)) },
			},
		},
		getImprovements(id=11) {
			if (!player[this.layer].unlocked) return new Decimal(0);
			return tmp[this.layer].impr[id].unlocked?(tmp[this.layer].impr.amount.sub(tmp[this.layer].impr[id].num).div(9).plus(1).floor().max(0)):new Decimal(0);
		},
		buyables: {
			rows: 1,
			cols: 1,
			11: {
				title: "Quirk Layers",
				costBase() {
					let base = new Decimal(2);
					if (hasUpgrade("tptr_q", 43)) base = base.sub(.25);
					//if (hasChallenge("h", 42)) base = base.sub(((Array.isArray(tmp.ma.mastered))?tmp.ma.mastered.includes("h"):false)?.2:.15);
					//if (hasAchievement("a", 101)) base = base.sub(.2);
					//if (hasUpgrade("q", 25) && player.i.buyables[12].gte(6)) base = base.root(upgradeEffect("q", 25));
					//if ((Array.isArray(tmp.ma.mastered))?tmp.ma.mastered.includes(this.layer):false) base = base.pow(.75);
					return base;
				},
				cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					let base = this.costBase();
                    let cost = Decimal.pow(base, Decimal.pow(base, x).sub(1));
                    return cost.floor()
                },
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+format(player[this.layer].buyables[this.id])+(tmp.tptr_q.freeLayers?(tmp.tptr_q.freeLayers.gt(0)?("+"+format(tmp.tptr_q.freeLayers)):""):"")+" Quirk Layers.<br>"+
                    "They are producing "+format(new Decimal(player.timePlayed).times(tmp.tptr_q.enGainMult).pow(tmp.tptr_q.enGainExp))+" Quirk Energy per second.<br>"+
					"Cost for next Quirk Layer: " + format(data.cost) + " Quirks";
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return player.tptr_q.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player.tptr_q.points = player.tptr_q.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {
					if (!this.unlocked || !this.canAfford()) return;
					let base = this.costBase();
					let target = player.tptr_q.points.max(1).log(base).plus(1).log(base);
					target = target.plus(1).floor();
					player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(target);
				},
                style: {'height':'222px'},
				//autoed() { return hasMilestone("ba", 1) && player.q.auto },
			},
		},
		milestones: {
			0: {
				requirementDescription: "1 Quirks",
				done() { return player.tptr_q.best.gte(1) },
				effectDescription: "Gain 100% of Enhance Point gain every second. Autobuy Enhancers.",
			},
			1: {
				requirementDescription: "TPTR Level 23",
				done() { return player.tm.buyables[7].gte(23) },
				effectDescription: "Gain 100% of Quirk gain per second.",
			},
		},
		upgrades: {
			rows: 4,
			cols: 5, 
			11: {
				title: "Quirk Central",
				description: "Total Quirks multiply each Quirk Layer's production (boosted by Quirk Upgrades bought).",
				cost() { return new Decimal(1e50) },
				unlocked() { return player.tm.buyables[7].gte(14) },
				effect() { return player.tptr_q.total.plus(1).log10().plus(1).pow(player.tptr_q.upgrades.length).pow(tmp.tptr_q.impr[11].effect); },
				effectDisplay() { return format(tmp.tptr_q.upgrades[11].effect)+"x" },
			},
			12: {
				title: "Back To Row 2",
				description: "Total Quirks multiply the Booster/Generator bases.",
				cost() { return new Decimal(1e60) },
				unlocked() { return player.tm.buyables[7].gte(14) },
				effect() { return player.tptr_q.total.plus(1).log10().plus(1).pow(1.25).times(tmp.tptr_q.impr[12].effect) },
				effectDisplay() { return format(tmp.tptr_q.upgrades[12].effect)+"x" },
			},
			13: {
				title: "Skip the Skip the Second",
				description: "The Generator Power effect is raised to the power of 1.25.",
				cost() { return new Decimal(1e80) },
				unlocked() { return player.tm.buyables[7].gte(14) },
			},
			14: {
				title: "Row 4 Synergy",
				description: "Hindrance Spirit & Quirks boost each other's gain.",
				cost() { return new Decimal(1e85) },
				unlocked() { return player.tm.buyables[7].gte(14) },
				effect() { 
					let q = player.tptr_q.points;
					let h = player.tptr_h.points;
					if(q.gte("1e1100"))q = Decimal.log10(q).pow(1100/3);
					if(h.gte("1e1000"))h = Decimal.log10(h).pow(1000/3);
					return {
						h: q.plus(1).cbrt().pow(tmp.tptr_q.impr[13].effect),
						q: h.plus(1).root(4).pow(tmp.tptr_q.impr[13].effect),
					};
				},
				effectDisplay() { return "H: "+format(tmp.tptr_q.upgrades[14].effect.h)+"x, Q: "+format(tmp.tptr_q.upgrades[14].effect.q)+"x" },
			},
			21: {
				title: "Quirk City",
				description: "Super Boosters multiply each Quirk Layer's production.",
				cost() { return new Decimal(1e100) },
				unlocked() { return player.tm.buyables[7].gte(14) },
				effect() { return Decimal.pow(1.25, player.tptr_sb.points).pow(tmp.tptr_q.impr[21].effect) },
				effectDisplay() { return format(tmp.tptr_q.upgrades[21].effect)+"x" },
			},
			22: {
				title: "Infinite Possibilities",
				description: "Total Quirks provide free Extra Time Capsules, Enhancers, & Space Buildings.",
				cost() { return new Decimal(1e110) },
				unlocked() { return player.tm.buyables[7].gte(14) },
				effect() { return player.tptr_q.total.plus(1).log10().sqrt().times(tmp.tptr_q.impr[22].effect).floor() },
				effectDisplay() { return "+"+formatWhole(tmp.tptr_q.upgrades[22].effect) },
			},
			23: {
				title: "The Waiting Game",
				description: "The Quirk Energy effect is cubed.",
				cost() { return new Decimal(1e115) },
				unlocked() { return player.tm.buyables[7].gte(14) },
			},
			24: {
				title: "Exponential Madness",
				description: "The first Time Energy effect & the first Enhancer effect are raised ^7.5.",
				cost() { return new Decimal(1e125) },
				unlocked() { return player.tm.buyables[7].gte(14) },
			},
			31: {
				title: "Scale Softening",
				description: "Post-1000 scaling for static layers in rows 2-3 starts later based on your Quirk Layers.",
				cost() { return new Decimal(1e250) },
				unlocked() { return player.tm.buyables[7].gte(20) },
				effect() { return player.tptr_q.buyables[11].sqrt().times(0.4).times(tmp.tptr_q.impr[31].effect) },
			},
			32: {
				title: "Quinary Superspace",
				description: "The Quinary Space Building's effect is twice as strong.",
				cost() { return new Decimal(1e290) },
				unlocked() { return player.tm.buyables[7].gte(20) },
			},
			33: {
				title: "Generated Progression",
				description: "Super Generators are cheaper.",
				cost() { return new Decimal(1e300) },
				unlocked() { return player.tm.buyables[7].gte(20) },
			},
			34: {
				title: "Booster Madness",
				description: "Anything that adds to the Booster base also multiplies it at a reduced rate.",
				cost() { return new Decimal("1e310") },
				unlocked() { return player.tm.buyables[7].gte(20) },
				effect() { return tmp.tptr_b.addToBase.plus(1).root(2.5).times(tmp.tptr_q.impr[32].effect) },
				effectDisplay() { return format(tmp.tptr_q.upgrades[34].effect)+"x" },
			},
			41: {
				title: "Quirkier",
				description: "Unlock Quirk Improvements.",
				cost() { return new Decimal("1e400") },
				unlocked() { return player.tm.buyables[7].gte(21) },
			},
			42: {
				title: "Improvement Boost",
				description: "Unlock 3 more Quirk Improvements.",
				cost() { return new Decimal("1e600") },
				unlocked() { return player.tm.buyables[7].gte(21) },
			},
			43: {
				title: "More Layers",
				description: "Quirk Layers cost scale 25% slower.",
				cost() { return new Decimal("1e650") },
				unlocked() { return player.tm.buyables[7].gte(21) },
			},
			44: {
				title: "Improvements Galore",
				description: "Unlock another 3 Quirk Improvements.",
				cost() { return new Decimal("1e800") },
				unlocked() { return player.tm.buyables[7].gte(21) },
			},
		},
	 passiveGeneration(){
		 if(player.tm.buyables[7].gte(23))return 1;
		 return 0;
	 },
})




addLayer("tptr_o", {
	name: "tptr_o", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "O", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
            unlocked: false,
			points: new Decimal(0),
			energy: new Decimal(0),
			first: 0,
        }},
        color: "#ffcd00",
		nodeStyle() {return {
			"background": "radial-gradient(#ffcd00, #ff4300)" 
        }},
		componentStyles: {
			"prestige-button": "radial-gradient(#ffcd00, #ff4300)"
		},
        requires() { 
			let req = new Decimal(10);
			if (hasUpgrade("tptr_ba", 23)) req = req.div(tmp.tptr_ba.posBuff.max(1));
			return req;
		},
        resource: "solarity", // Name of prestige currency
        baseResource: "super boosters", // Name of resource prestige is based on
        baseAmount() {return player.tptr_sb.points}, // Get the current amount of baseResource
        type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
		exponent() { 
			let exp = new Decimal(10);
			return exp;
		}, // Prestige currency exponent
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = buyableEffect("tptr_o", 11);
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1);
        },
        row: 3, // Row the layer is in on the tree (0 is the first row)
        layerShown(){return player.tm.currentTree==7 && hasUpgrade("tm",38)},
		doReset(l){
			if(l=="tptr_p" || l=="tptr_b" || l=="tptr_g" || l=="tptr_t" || l=="tptr_e" || l=="tptr_s" || l=="tptr_sb" || l=="tptr_sg" || l=="tptr_o" || l=="tptr_h" || l=="tptr_q" || l=="tptr_ss" || !l.startsWith("tptr_")){return;}
			var b=new Decimal(player.tptr_o.best);
			layerDataReset("tptr_o",["upgrades","milestones","challenges"]);
			player.tptr_o.best=b;
			return;
		},
        branches: ["tptr_sb", "tptr_t"],
		effect() { 
			let eff = player.tptr_o.points.plus(1).log10().mul(4).sqrt();
			let cap = 0.1;
			if (eff.gt(10)) eff = eff.log10().times(3).plus(7)
			return eff.div(100).min(cap);
		},
		effect2() { if(!player.tptr_o.unlocked)return new Decimal(0);return player.tptr_o.points.div(1e20).plus(1).sqrt(); },
		effect3() { if(!player.tptr_o.unlocked)return new Decimal(1);return player.tptr_o.points.add(1).log10().add(1).log10().add(1).log10().add(1); },
		solEnGain() { 
			let gain = player.tptr_t.energy.max(1).pow(tmp.tptr_o.effect).times(tmp.tptr_o.effect2);
			if (player.tptr_m.unlocked) gain = gain.times(tmp.tptr_m.hexEff);
			gain = gain.times(tmp.tptr_q.impr[41].effect);
			if(!player.tptr_ba.unlocked)gain = gain.min(1e100);
			return gain;
		},
		effectDescription() { return "which are generating "+format(tmp.tptr_o.solEnGain)+" Solar Energy "+(player.tptr_ba.unlocked?"":"(Max: 1e100)")+" every second and are adding Hyper Booster Base in TPTC by "+format(tmp.tptr_o.effect3.sub(1)); },
		update(diff) {
			player.tptr_o.energy = player.tptr_o.energy.plus(tmp.tptr_o.solEnGain.times(diff));
		 if(player.tm.buyables[7].gte(22)){
			 player.tptr_o.buyables[11]=player.tptr_o.buyables[11].add(layers.tptr_o.buyables[11].gain().mul(diff));
			 player.tptr_o.buyables[12]=player.tptr_o.buyables[12].add(layers.tptr_o.buyables[12].gain().mul(diff));
			 player.tptr_o.buyables[13]=player.tptr_o.buyables[13].add(layers.tptr_o.buyables[13].gain().mul(diff));
		 }
		 if(player.tm.buyables[7].gte(26)){
			 player.tptr_o.buyables[21]=player.tptr_o.buyables[21].add(layers.tptr_o.buyables[21].gain().mul(diff));
		 }
		},
		solEnEff2() { return player.tptr_o.energy.plus(1).pow(2) },
		tabFormat: ["main-display",
			"prestige-button",
			"resource-display",
			"blank",
			["display-text",
				function() {return 'You have ' + format(player.tptr_o.energy) + ' Solar Energy, which multiplies the Time Energy limit by '+format(tmp.tptr_o.solEnEff2)+'.'},
					{}],
			"blank",
			"milestones",
			"blank",
			["display-text",
				function() { return "<b>Solar Power: "+format(tmp.tptr_o.solPow.times(100))+"%</b><br>" },
					{}],
			"buyables",
			"blank"
		],
		solPow() {
			let pow = new Decimal(1);
			if (hasUpgrade("tptr_ss", 33)) pow = pow.plus(upgradeEffect("tptr_ss", 33));
			if (hasUpgrade("tptr_ss", 41)) pow = pow.plus(buyableEffect("tptr_o", 21));
			if (hasUpgrade("tptr_ba", 11)) pow = pow.plus(upgradeEffect("tptr_ba", 11));
			if(pow.gte(32))return pow.div(32).cbrt().mul(32);
			return pow;
		},
		multiplyBuyables() {
			let mult = new Decimal(1);
			return mult;
		},
		buyableGainExp() {
			let exp = new Decimal(1);
			return exp;
		},
		buyables: {
			rows: 3,
			cols: 3,
			11: {
				title: "Solar Cores",
				gain() { return player.tptr_o.points.div(2).root(1.5).pow(tmp.tptr_o.buyableGainExp).floor() },
				effect() { 
					let amt = player[this.layer].buyables[this.id].times(tmp.tptr_o.multiplyBuyables);
					if(amt.gte(5e4))amt=Decimal.pow(10,amt.log10().sqrt().mul(new Decimal(5e4).log10().sqrt()));
					if(amt.gte(4.75453173647236e21))amt=amt.log10().pow(3).mul(4.75453173647236e21).div(new Decimal(4.75453173647236e21).log10().pow(3));
					return Decimal.pow(hasUpgrade("tptr_ss", 22)?(amt.plus(1).pow(tmp.tptr_o.solPow).cbrt()):(amt.plus(1).pow(tmp.tptr_o.solPow).log10().plus(1)), 1)
				},
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    let display = ("Sacrifice all of your Solarity for "+formatWhole(tmp[this.layer].buyables[this.id].gain)+" Solar Cores\n"+
					"Req: 2 Solarity\n"+
					"Amount: " + formatWhole(player[this.layer].buyables[this.id])+((tmp.tptr_o.multiplyBuyables||new Decimal(1)).eq(1)?"":(" x "+format(tmp.tptr_o.multiplyBuyables))))+"\n"+
					(("Effect: Multiplies Solarity gain by "+format(tmp[this.layer].buyables[this.id].effect)))
					return display;
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() { return player.tptr_o.points.gte(2) },
                buy() { 
                    player.tptr_o.points = new Decimal(0);
					player.tptr_o.buyables[this.id] = player.tptr_o.buyables[this.id].plus(tmp[this.layer].buyables[this.id].gain);
                },
                style: {'height':'140px', 'width':'140px'},
			},
			12: {
				title: "Tachoclinal Plasma",
				gain() { return player.tptr_o.points.div(100).times(player.tptr_o.energy.div(2500)).root(3.5).pow(tmp.tptr_o.buyableGainExp).floor() },
				effect() { return Decimal.pow(hasUpgrade("tptr_p", 24)?Decimal.pow(10, player[this.layer].buyables[this.id].times(tmp.tptr_o.multiplyBuyables).plus(1).log10().cbrt()):(player[this.layer].buyables[this.id].times(tmp.tptr_o.multiplyBuyables).plus(1).pow(tmp.tptr_o.solPow).log10().plus(1).log10().times(10).plus(1)), 1) },
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    let display = ("Sacrifice all of your Solarity & Solar Energy for "+formatWhole(tmp[this.layer].buyables[this.id].gain)+" Tachoclinal Plasma\n"+
					"Req: 100 Solarity & 2,500 Solar Energy\n"+
					"Amount: " + formatWhole(player[this.layer].buyables[this.id])+((tmp.tptr_o.multiplyBuyables||new Decimal(1)).eq(1)?"":(" x "+format(tmp.tptr_o.multiplyBuyables))))+"\n"+
					(("Effect: Multiplies the Super Booster base and each Quirk Layer by "+format(tmp[this.layer].buyables[this.id].effect)))
					return display;
                },
                unlocked() { return player.tm.buyables[7].gte(17) }, 
                canAfford() { return player.tptr_o.points.gte(100)&&player.tptr_o.energy.gte(2500) },
                buy() { 
                    player.tptr_o.points = new Decimal(0);
					player.tptr_o.energy = new Decimal(0);
					player.tptr_o.buyables[this.id] = player.tptr_o.buyables[this.id].plus(tmp[this.layer].buyables[this.id].gain);
                },
                style: {'height':'140px', 'width':'140px', 'font-size':'9px'},
			},
			13: {
				title: "Convectional Energy",
				gain() { return player.tptr_o.points.div(1e3).times(player.tptr_o.energy.div(2e5)).times(player.tptr_ss.subspace.div(10)).root(6.5).pow(tmp.tptr_o.buyableGainExp).floor() },
				effect() { return player[this.layer].buyables[this.id].times(tmp.tptr_o.multiplyBuyables).plus(1).pow(tmp.tptr_o.solPow).log10().plus(1).pow(2.5).pow(1) },
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    let display = ("Sacrifice all of your Solarity, Solar Energy, & Subspace for "+formatWhole(tmp[this.layer].buyables[this.id].gain)+" Convectional Energy\n"+
					"Req: 1,000 Solarity, 200,000 Solar Energy, & 10 Subspace\n"+
					"Amount: " + formatWhole(player[this.layer].buyables[this.id])+((tmp.tptr_o.multiplyBuyables||new Decimal(1)).eq(1)?"":(" x "+format(tmp.tptr_o.multiplyBuyables))))+"\n"+
					(("Effect: Multiplies the Time Capsule base and Subspace gain by "+format(tmp[this.layer].buyables[this.id].effect)))
					return display;
                },
                unlocked() { return player.tm.buyables[7].gte(18) }, 
                canAfford() { return player.tptr_o.points.gte(1e3)&&player.tptr_o.energy.gte(2e5)&&player.tptr_ss.subspace.gte(10) },
                buy() { 
                    player.tptr_o.points = new Decimal(0);
					player.tptr_o.energy = new Decimal(0);
					player.tptr_ss.subspace = new Decimal(0);
					player.tptr_o.buyables[this.id] = player.tptr_o.buyables[this.id].plus(tmp[this.layer].buyables[this.id].gain);
                },
                style: {'height':'140px', 'width':'140px', 'font-size':'9px'},
			},
			21: {
				title: "Coronal Waves",
				gain() { return player.tptr_o.points.div(1e5).root(5).times(player.tptr_o.energy.div(1e30).root(30)).times(player.tptr_ss.subspace.div(1e8).root(8)).times(player.tptr_q.energy.div("1e675").root(675)).pow(tmp.tptr_o.buyableGainExp).floor() },
				effect() { 
					let eff = player[this.layer].buyables[this.id].times(tmp.tptr_o.multiplyBuyables).plus(1).pow(tmp.tptr_o.solPow).log10().plus(1).log10();
					if(eff.gte(4))eff = Decimal.pow(10,eff.log10().div(Math.log10(4)).sqrt().mul(Math.log10(4)));
					//if (hasUpgrade("hn", 24)) eff = eff.times(2);
					//if ((Array.isArray(tmp.ma.mastered))?tmp.ma.mastered.includes(this.layer):false) eff = eff.times(1.4);
					return eff;
				},
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    let display = ("Sacrifice all of your Solarity, Solar Energy, Subspace, & Quirk Energy for "+formatWhole(tmp[this.layer].buyables[this.id].gain)+" Coronal Waves\n"+
					"Req: 100,000 Solarity, 1e30 Solar Energy, 500,000,000 Subspace, & 1e675 Quirk Energy\n"+
					"Amount: " + formatWhole(player[this.layer].buyables[this.id])+((tmp.tptr_o.multiplyBuyables||new Decimal(1)).eq(1)?"":(" x "+format(tmp.tptr_o.multiplyBuyables))))+"\n"+
					(("Effect: +"+format(tmp[this.layer].buyables[this.id].effect)+" to Subspace base & +"+format(tmp[this.layer].buyables[this.id].effect.times(100))+"% Solar Power"))
					return display;
                },
                unlocked() { return player[this.layer].unlocked&&hasUpgrade("tptr_ss", 41) }, 
                canAfford() { return player.tptr_o.points.gte(1e5)&&player.tptr_o.energy.gte(1e30)&&player.tptr_ss.subspace.gte(1e8)&&player.tptr_q.energy.gte("1e675") },
                buy() { 
                    player.tptr_o.points = new Decimal(0);
					player.tptr_o.energy = new Decimal(0);
					player.tptr_ss.subspace = new Decimal(0);
					player.tptr_q.energy = new Decimal(0);
					player.tptr_o.buyables[this.id] = player.tptr_o.buyables[this.id].plus(tmp[this.layer].buyables[this.id].gain);
                },
                style: {'height':'140px', 'width':'140px', 'font-size':'9px'},
			},
		},
		milestones: {
			0: {
				requirementDescription: "1 Solarity",
				done() { return player.tptr_o.best.gte(1) },
				effectDescription: "Autobuy Super Boosters, Super Boosters resets nothing. You can buy max Super Boosters.",
			},
			1: {
				requirementDescription: "TPTR Level 21",
				done() { return player.tm.buyables[7].gte(21) },
				effectDescription: "Gain 100% of Solarity gain per second.",
			},
			2: {
				requirementDescription: "TPTR Level 22",
				done() { return player.tm.buyables[7].gte(22) },
				effectDescription: "Gain 100% of first 3 Solarity Buyables gain per second.",
			},
			3: {
				requirementDescription: "TPTR Level 26",
				unlocked() { return player.tm.buyables[7].gte(25) },
				done() { return player.tm.buyables[7].gte(26) },
				effectDescription: "Gain 100% of Coronal Waves gain per second.",
			},
		},
	 passiveGeneration(){
		 if(player.tm.buyables[7].gte(21))return 1;
		 return 0;
	 }
});



addLayer("tptr_ss", {
        name: "tptr_ss", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "SS", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
            unlocked: false,
			points: new Decimal(0),
			best: new Decimal(0),
			subspace: new Decimal(0),
			auto: false,
			first: 0,
        }},
        color: "#e8ffff",
        requires() { return new Decimal(28) }, // Can be a function that takes requirement increases into account
		roundUpCost: true,
        resource: "subspace energy", // Name of prestige currency
        baseResource: "space energy", // Name of resource prestige is based on
        baseAmount() {return player.tptr_s.points}, // Get the current amount of baseResource
        type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent() { return new Decimal(1.1) }, // Prestige currency exponent
		base() { return new Decimal(1.15) },
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
		effBase() {
			let base = new Decimal(2);
			if (hasUpgrade("tptr_ss", 32)) base = base.plus(upgradeEffect("tptr_ss", 32));
			if (hasUpgrade("tptr_ss", 41)) base = base.plus(buyableEffect("tptr_o", 21));
			
			if (player.tptr_ba.unlocked) base = base.times(tmp.tptr_ba.posBuff);
			return base;
		},
		effect() { 
			let gain = Decimal.pow(tmp.tptr_ss.effBase, player.tptr_ss.points).sub(1);
			if (hasUpgrade("tptr_ss", 13)) gain = gain.times(upgradeEffect("tptr_ss", 13));
			if (player.tptr_o.unlocked) gain = gain.times(buyableEffect("tptr_o", 13));
			if (player.tptr_m.unlocked) gain = gain.times(tmp.tptr_m.hexEff);
			return [gain,player.tptr_ss.points.add(1)];
		},
		effectDescription() {
			return "which are generating "+format(tmp.tptr_ss.effect[0])+" Subspace/sec, and are boosting your subspace base in TPTC by "+format(tmp.tptr_ss.effect[1])+"x"
		},
		update(diff) {
			if(player.tptr_ss.best.gte(10)&&layers.tptr_s.buyables[11].unlocked())layers.tptr_s.buyables[11].buyMax();
			if(player.tptr_ss.best.gte(10)&&layers.tptr_s.buyables[12].unlocked())layers.tptr_s.buyables[12].buyMax();
			if(player.tptr_ss.best.gte(10)&&layers.tptr_s.buyables[13].unlocked())layers.tptr_s.buyables[13].buyMax();
			if(player.tptr_ss.best.gte(10)&&layers.tptr_s.buyables[14].unlocked())layers.tptr_s.buyables[14].buyMax();
			if(player.tptr_ss.best.gte(10)&&layers.tptr_s.buyables[15].unlocked())layers.tptr_s.buyables[15].buyMax();
			if (player.tptr_ss.unlocked) player.tptr_ss.subspace = player.tptr_ss.subspace.plus(tmp.tptr_ss.effect[0].times(diff));
		},
        row: 3, // Row the layer is in on the tree (0 is the first row)
		effPow() {
			let pow = new Decimal(1);
			if (hasUpgrade("tptr_ss", 12)) pow = pow.times(upgradeEffect("tptr_ss", 12));
			if (hasUpgrade("tptr_ba", 12)) pow = pow.times(upgradeEffect("tptr_ba", 12).plus(1));
			return pow;
		},
		eff1() { return player.tptr_ss.subspace.plus(1).pow(tmp.tptr_ss.effPow).log10().pow(3).times(100).floor() },
		eff2() { return player.tptr_ss.subspace.plus(1).pow(tmp.tptr_ss.effPow).log10().plus(1).log10().div(6) },
		eff3() { return player.tptr_ss.subspace.plus(1).pow(tmp.tptr_ss.effPow).pow(1e3) },
		tabFormat: ["main-display",
			"prestige-button",
			"resource-display",
			"blank",
			["display-text",
				function() {return 'You have ' + format(player.tptr_ss.subspace) + ' Subspace, which is providing '+formatWhole(tmp.tptr_ss.eff1)+' extra Space, makes Space Buildings '+format(tmp.tptr_ss.eff2.times(100))+'% stronger, and cheapens Space Buildings by '+format(tmp.tptr_ss.eff3)+'x.'},
					{}],
			"blank",
			"upgrades","milestones"
		],
        layerShown(){return player.tm.currentTree==7 && hasUpgrade("tm",39)},
		doReset(l){
			if(l=="tptr_p" || l=="tptr_b" || l=="tptr_g" || l=="tptr_t" || l=="tptr_e" || l=="tptr_s" || l=="tptr_sb" || l=="tptr_sg" || l=="tptr_o" || l=="tptr_h" || l=="tptr_q" || l=="tptr_ss" || !l.startsWith("tptr_")){return;}
			var b=new Decimal(player.tptr_ss.best);
			layerDataReset("tptr_ss",["upgrades","milestones","challenges"]);
			player.tptr_ss.best=b;
			return;
		},
        branches: ["tptr_s"],
		upgrades: {
			rows: 4,
			cols: 3,
			11: {
				title: "Spatial Awakening",
				description: "The Space Energy cost base is reduced (1e15 -> 1e10).",
				cost() { return new Decimal(3) },
				unlocked() { return player.tptr_ss.unlocked },
			},
			12: {
				title: "Subspatial Awakening",
				description: "Subspace Energy boosts all Subspace effects.",
				cost() { return new Decimal(5) },
				unlocked() { return hasUpgrade("tptr_ss", 11) },
				effect() { 
					let eff = player.tptr_ss.points.div(2.5).plus(1).sqrt();
					return eff;
				},
				effectDisplay() { return format(tmp.tptr_ss.upgrades[12].effect.sub(1).times(100))+"% stronger" },
			},
			13: {
				title: "Emissary of Smash",
				description: "Quirks boost Subspace gain.",
				cost() { return new Decimal(6) },
				unlocked() { return hasUpgrade("tptr_ss", 11) },
				effect() { return player.tptr_q.points.plus(1).log10().div(10).plus(1); },
				effectDisplay() { return format(tmp.tptr_ss.upgrades[13].effect)+"x" },
			},
			21: {
				title: "Illegal Upgrade",
				description: "Super Boosters & Super Generators are 20% cheaper.",
				cost() { return new Decimal(7) },
				unlocked() { return hasUpgrade("tptr_ss", 13) },
			},
			22: {
				title: "Underneath The Sun",
				description: "<b>Solar Cores</b> use a better effect formula.",
				cost() { return new Decimal(8) },
				unlocked() { return hasUpgrade("tm", 38) },
			},
			23: {
				title: "Anti-Timeless",
				description: "<b>Timeless</b>'s cap +10",
				cost() { return new Decimal(11) },
				unlocked() { return player.tm.buyables[7].gte(21) },
			},
			31: {
				title: "No More Progress",
				description: "Unspent Space provides free Space Buildings.",
				cost() { return new Decimal(12) },
				unlocked() { return player.tm.buyables[7].gte(21) },
				effect() { return tmp.tptr_s.space.plus(1).cbrt().sub(1).floor() },
				effectDisplay() { return "+"+formatWhole(tmp.tptr_ss.upgrades[31].effect) },
			},
			32: {
				title: "Beyond Infinity",
				description: "Add to the Subspace Energy & Super-Generator bases based on your Quirk Layers.",
				cost() { return new Decimal(12) },
				unlocked() { return player.tm.buyables[7].gte(22) },
				effect() { return player.tptr_q.buyables[11].sqrt().div(1.25) },
				effectDisplay() { return "+"+format(tmp.tptr_ss.upgrades[32].effect) },
			},
			33: {
				title: "Timeless Solarity",
				description: "Solar Cores boost Solar Power.",
				cost() { return new Decimal(13) },
				unlocked() { return player.tm.buyables[7].gte(22) },
				effect() { return player.tptr_o.buyables[11].plus(1).log10().div(10) },
				effectDisplay() { return "+"+format(tmp.tptr_ss.upgrades[33].effect.times(100))+"%" },
			},
			41: {
				title: "More Sun",
				description: "Unlock Coronal Waves.",
				cost() { return new Decimal(15) },
				unlocked() { return player.tm.buyables[7].gte(25) },
			},
			42: {
				title: "Sub-Subspace",
				description: "Space Buildings are 100% stronger (additive).",
				cost() { return new Decimal(17) },
				unlocked() { return player.tm.buyables[7].gte(26) },
			},
			43: {
				title: "Balanced C-R Synergy",
				description: "Unlock a new effect of Balance Energy.",
				cost() { return new Decimal(20) },
				unlocked() { return player.tm.buyables[7].gte(29) },
			},
		},
		milestones: {
			0: {
				requirementDescription: "1 Subspace Energy",
				done() { return player.tptr_ss.best.gte(1) },
				effectDescription: "Autobuy Space Energy, Space Energy resets nothing.",
			},
			1: {
				requirementDescription: "4 Subspace Energy",
				done() { return player.tptr_ss.best.gte(4) },
				effectDescription: "Space Buildings won't reset.",
			},
			2: {
				requirementDescription: "8 Subspace Energy",
				done() { return player.tptr_ss.best.gte(8) },
				effectDescription: "Autobuy Super Generators, Super Generators resets nothing. You can buy max Super Generators.",
			},
			3: {
				requirementDescription: "10 Subspace Energy",
				done() { return player.tptr_ss.best.gte(10) },
				effectDescription: "Autobuy Space Buildings, Space Buildings won't cost any space.",
			},
		},
		canBuyMax() {return player.tptr_ba.best.gte(1)},
		resetsNothing() {return player.tptr_ba.best.gte(1)},
		autoPrestige() {return player.tptr_ba.best.gte(1)},
})


addLayer("tptr_m", {
    name: "tptr_m",
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
			},
	}},
	color: "#eb34c0",
    requires: function(){
		return new Decimal(1e285);
	},
    resource: "magic",
    baseResource: "hindrance spirit", 
    baseAmount() {return player.tptr_h.points},
    type: "normal",
    exponent: 0.007,
    row: 4,
    hotkeys: [],
    layerShown(){return player.tm.currentTree==7 && hasUpgrade("tm",56)},
	branches: ["tptr_o","tptr_h","tptr_q"],
	doReset(l){
			if(l=="tptr_p" || l=="tptr_b" || l=="tptr_g" || l=="tptr_t" || l=="tptr_e" || l=="tptr_s" || l=="tptr_sb" || l=="tptr_sg" || l=="tptr_o" || l=="tptr_h" || l=="tptr_q" || l=="tptr_ss" || l=="tptr_m" || l=="tptr_ba" || l=="tptr_ps" || !l.startsWith("tptr_")){return;}
			var b=new Decimal(player.tptr_m.best);
			layerDataReset("tptr_m",["upgrades","milestones","challenges"]);
			player.tptr_m.best=b;
		},
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
                        "milestones",
					["display-text","Casting a spell costs 1 magic. Effect of spells are based on your magic."],
					["display-text",
                        function() {return 'Effective Magic: ' + format(player.tptr_m.points.mul(layers.tptc_m.clickables[16].effect())) + ', Spell Power: '+format(tmp.tptr_m.spellPower.mul(100))+"%" },
                        {}],
                        "clickables",
                    ["display-text",
                        function() {return 'You have ' + format(player.tptr_m.hexes) + ' Hexes, '+tmp.tptr_m.hexEffDesc },
                        {}],"upgrades"
				],
		spellPower() { 
			if (!player[this.layer].unlocked) return new Decimal(0);
			let power = new Decimal(1);
			//if (tmp.ps.impr[21].unlocked) power = power.plus(tmp.ps.impr[21].effect.sub(1));
			//if (player.n.buyables[11].gte(3)) power = power.plus(buyableEffect("o", 31));
			//if ((Array.isArray(tmp.ma.mastered))?tmp.ma.mastered.includes(this.layer):false) power = power.plus(.5);
			return power;
		},
	clickables: {
            rows: 1,
            cols: 5,
			11: {
				title: "Booster Launch",
				unlocked(){return true},
				canClick(){return player.tptr_m.points.gte(1) && player.tptr_m.spellTimes[11].lte(0)},
				onClick(){
					player.tptr_m.points=player.tptr_m.points.sub(1);
					player.tptr_m.hexes=player.tptr_m.hexes.add(1);
					player.tptr_m.spellTimes[11]=new Decimal(60);
				},
				effect(){
					if(player.tptr_m.spellTimes[11].lte(0))return new Decimal(1);
					return layers.tptr_m.clickables[11].realEffect();
				},
				realEffect(){
					let power = tmp.tptr_m.spellPower.times(player.tptr_m.points.mul(layers.tptc_m.clickables[16].effect()).max(1).log10().plus(1));
					let eff = power.div(2).plus(1)
					if (hasUpgrade("tptr_ba", 31)) eff = Decimal.pow(1.1, power).times(eff);
					let sc=new Decimal(1e6);
					if(eff.gte(sc))eff = Decimal.pow(10,eff.log10().div(sc.log10()).root(1.5).mul(sc.log10()));
					return eff.div(1.5).max(1);
				},
				display(){
					return "Effect: Booster base ^1.05, x"+format(layers.tptr_m.clickables[11].realEffect())+"\n\
					Time: "+formatTime(player.tptr_m.spellTimes[11].max(0));
				},
                style: {'height':'160px','width':'200px'},
			},
			12: {
				title: "Time Warp",
				unlocked(){return true},
				canClick(){return player.tptr_m.points.gte(1) && player.tptr_m.spellTimes[12].lte(0)},
				onClick(){
					player.tptr_m.points=player.tptr_m.points.sub(1);
					player.tptr_m.hexes=player.tptr_m.hexes.add(1);
					player.tptr_m.spellTimes[12]=new Decimal(60);
				},
				effect(){
					if(player.tptr_m.spellTimes[12].lte(0))return new Decimal(1);
					return layers.tptr_m.clickables[12].realEffect();
				},
				realEffect(){
					let power = tmp.tptr_m.spellPower.times(player.tptr_m.points.mul(layers.tptc_m.clickables[16].effect()).max(1).log10().plus(1));
					let eff = power.div(5).plus(1)
					if (hasUpgrade("tptr_ba", 31)) eff = Decimal.pow(1.1, power).times(eff);
					let sc=new Decimal(1e6);
					if(eff.gte(sc))eff = Decimal.pow(10,eff.log10().div(sc.log10()).root(2).mul(sc.log10()));
					return eff.div(1.2).max(1);
				},
				display(){
					return "Effect: Time Capsule base ^1.1, x"+format(layers.tptr_m.clickables[12].realEffect())+"\n\
					Time: "+formatTime(player.tptr_m.spellTimes[12].max(0));
				},
                style: {'height':'160px','width':'200px'},
			},
			13: {
				title: "Quirk Amplification",
				unlocked(){return player.tm.buyables[7].gte(28)},
				canClick(){return player.tptr_m.points.gte(1) && player.tptr_m.spellTimes[13].lte(0)},
				onClick(){
					player.tptr_m.points=player.tptr_m.points.sub(1);
					player.tptr_m.hexes=player.tptr_m.hexes.add(1);
					player.tptr_m.spellTimes[13]=new Decimal(60);
				},
				effect(){
					if(player.tptr_m.spellTimes[13].lte(0))return new Decimal(1);
					return layers.tptr_m.clickables[13].realEffect();
				},
				realEffect() {
					let power = tmp.tptr_m.spellPower.times(player.tptr_m.points.mul(layers.tptc_m.clickables[16].effect()).max(1).log10().plus(1));
					let eff = power.times(1.25)
					let sc=new Decimal(1).max(player.tptr_ps.points.pow(2.5)).min(45);//45
					if(eff.gte(sc))eff = eff.div(sc).root(5).mul(sc);
					return eff;
				},
				display() {
					return "Effect: +"+format(layers.tptr_m.clickables[13].realEffect())+" Free Quirk Layers\n\
					Time: "+formatTime(player.tptr_m.spellTimes[13].max(0));
                },
                style: {'height':'160px','width':'200px'},
			},
	},
	
		update(diff){
			for(var i in player.tptr_m.spellTimes){
				player.tptr_m.spellTimes[i]=player.tptr_m.spellTimes[i].sub(diff);
				if(player.tm.buyables[7].gte(27) && player.tptr_m.spellTimes[i].lte(0) && player.tptr_m.points.gte(1) && tmp.tptr_m.clickables[i] && tmp.tptr_m.clickables[i].unlocked){
					player.tptr_m.points=player.tptr_m.points.sub(1);
					player.tptr_m.hexes=player.tptr_m.hexes.add(1);
					player.tptr_m.spellTimes[i]=new Decimal(60);
				}
			}
		},
	hexEff() {
		return player.tptr_m.hexes.times(2).plus(1).pow(10).min("1e10000");
	},
		hexEffDesc() {
			return "which are multiplying Hindrance Spirit, Quirk, Solar Energy, & Subspace gain by "+format(tmp.tptr_m.hexEff);
		},
		milestones: {
			0: {
				requirementDescription: "TPTR Level 27",
				done() { return player.tm.buyables[7].gte(27) },
				effectDescription: "Gain 100% of Magic gain per second, Autocast Spells.",
			},
		},
	 passiveGeneration(){
		 if(player.tm.buyables[7].gte(27))return 1;
		 return 0;
	 }
});



addLayer("tptr_ba", {
		name: "tptr_ba", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "BA", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
            unlocked: false,
			points: new Decimal(0),
			best: new Decimal(0),
			total: new Decimal(0),
			allotted: 0.5,
			pos: new Decimal(0),
			neg: new Decimal(0),
			keepPosNeg: false,
			first: 0,
        }},
        color: "#fced9f",
        requires: new Decimal("1e365"), // Can be a function that takes requirement increases into account
        resource: "balance energy", // Name of prestige currency
        baseResource: "quirks", // Name of resource prestige is based on
        baseAmount() {return player.tptr_q.points}, // Get the current amount of baseResource
        type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent() { return new Decimal(0.005) }, // Prestige currency exponent
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1);
			//if (hasAchievement("a", 74)) mult = mult.times(challengeEffect("h", 32));
			//if (player.mc.unlocked) mult = mult.times(clickableEffect("mc", 22));
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
		effect() { 
			if(!hasUpgrade("tptr_ss",33))return new Decimal(1);
			return player.tptr_ba.points.add(10).log10();
		},
		effectDescription() {
			if(!hasUpgrade("tptr_ss",33))return null;
			return "which are boosting your Positivity & Negativity effect in TPTC by ^"+format(tmp.tptr_ba.effect)
		},
        row: 4, // Row the layer is in on the tree (0 is the first row)
		doReset(l){
			if(l=="tptr_p" || l=="tptr_b" || l=="tptr_g" || l=="tptr_t" || l=="tptr_e" || l=="tptr_s" || l=="tptr_sb" || l=="tptr_sg" || l=="tptr_o" || l=="tptr_h" || l=="tptr_q" || l=="tptr_ss" || l=="tptr_m" || l=="tptr_ba" || l=="tptr_ps" || !l.startsWith("tptr_")){return;}
			var b=new Decimal(player.tptr_ba.best);
			layerDataReset("tptr_ba",["upgrades","milestones","challenges"]);
			player.tptr_ba.best=b;
			return;
		},
        layerShown(){return player.tm.currentTree==7 && hasUpgrade("tm",58) },
        branches: ["tptr_q","tptr_ss"],
		update(diff) {
			if (!player.tptr_ba.unlocked) return;
			player.tptr_ba.pos = player.tptr_ba.pos.plus(tmp.tptr_ba.posGain.times(diff));
			player.tptr_ba.neg = player.tptr_ba.neg.plus(tmp.tptr_ba.negGain.times(diff));
		},
		dirBase() { return player.tptr_ba.points.times(10) },
		posGainMult() {
			let mult = new Decimal(1);
			if (hasUpgrade("tptr_ba", 24)) mult = mult.times(upgradeEffect("tptr_ba", 24).pos);
			return mult;
		},
		posGain() { return Decimal.pow(tmp.tptr_ba.dirBase, player.tptr_ba.allotted).times(player.tptr_ba.allotted).times(tmp.tptr_ba.posGainMult) },
		posBuff() { 
			let eff = player.tptr_ba.pos.plus(1).log10().plus(1).div(tmp.tptr_ba.negNerf); 
			if(eff.gte(1e6))eff=eff.cbrt().mul(1e4);
			return eff;
		},
		noNerfs() {
			return false;
		},
		posNerf() { return tmp.tptr_ba.noNerfs?new Decimal(1):(player.tptr_ba.pos.plus(1).sqrt()) },
		negGainMult() {
			let mult = new Decimal(1);
			if (hasUpgrade("tptr_ba", 24)) mult = mult.times(upgradeEffect("tptr_ba", 24).neg);
			return mult;
		},
		negGain() { return Decimal.pow(tmp.tptr_ba.dirBase, (1-player.tptr_ba.allotted)).times(1-player.tptr_ba.allotted).times(tmp.tptr_ba.negGainMult) },
		negBuff() { 
			let eff = player.tptr_ba.neg.plus(1).pow((hasUpgrade("tptr_ba", 13))?10:1).div(tmp.tptr_ba.posNerf);
			if(eff.gte("1e1500"))eff=Decimal.pow(10,eff.log10().div(1500).sqrt().mul(1500));
			return eff;
		},
		negNerf() { return tmp.tptr_ba.noNerfs?new Decimal(1):(player.tptr_ba.neg.plus(1).log10().plus(1).sqrt().div(hasUpgrade("tptr_ba", 14)?2:1).max(1)) },
		tabFormat: ["main-display",
			"prestige-button",
			"resource-display",
			"blank",
			"milestones",
			"blank",
			["clickable", 31],
			["row", [["clickable", 21], ["clickable", 11], "blank", ["bar", "balanceBar"], "blank", ["clickable", 12], ["clickable", 22]]],
			["row", [
				["column", [["display-text", function() {return ("+"+format(tmp.tptr_ba.negGain)+"/sec")}, {}], ["display-text", function() {return "Negativity: "+format(player.tptr_ba.neg)}, {}], ["display-text", function() {return (("Buff: Multiply each Quirk Layer by "+format(tmp.tptr_ba.negBuff)))}, {}], ["display-text", function() {return tmp.tptr_ba.noNerfs?"":(("Nerf: Divide the Positivity buff by "+format(tmp.tptr_ba.negNerf)))}, {}], "blank", ["row", [["upgrade", 11], ["upgrade", 13]]]], {"max-width": "240px"}], 
				"blank", "blank", "blank", 
				["column", 
				[["display-text", function() {return ("+"+format(tmp.tptr_ba.posGain)+"/sec")}, {}], ["display-text", function() {return "Positivity: "+format(player.tptr_ba.pos)}, {}], ["display-text", function() {return (("Buff: Multiply the Subspace & Time base by "+format(tmp.tptr_ba.posBuff)))}, {}], ["display-text", function() {return tmp.tptr_ba.noNerfs?"":(("Nerf: Divide the Negativity buff by "+format(tmp.tptr_ba.posNerf)))}, {}], "blank", ["row", [["upgrade", 14], ["upgrade", 12]]]], {"max-width": "240px"}]], {"visibility": function() { return player.tptr_ba.unlocked?"visible":"hidden" }}],
			["row", [["upgrade", 22], ["upgrade", 21], ["upgrade", 23]]],
			["row", [["upgrade", 31], ["upgrade", 24], ["upgrade", 32]]],
			["upgrade", 33],
			"blank", "blank"
		],
		bars: {
			balanceBar: {
				direction: RIGHT,
				width: 400,
				height: 20,
				progress() { return player.tptr_ba.allotted },
				unlocked() { return player.tptr_ba.unlocked },
				fillStyle() { 
					let r = 235 + (162 - 235) * tmp.tptr_ba.bars.balanceBar.progress;
					let g = 64 + (249 - 64) * tmp.tptr_ba.bars.balanceBar.progress;
					let b = 52 + (252 - 52) * tmp.tptr_ba.bars.balanceBar.progress;
					return {"background-color": ("rgb("+r+", "+g+", "+b+")") } 
				},
				borderStyle() { return {"border-color": "#fced9f"} },
			},
		},
		clickables: {
			rows: 3,
			cols: 2,
			11: {
				title: "-",
				unlocked() { return player.tptr_ba.unlocked },
				canClick() { return player.tptr_ba.allotted>0 },
				onClick() { player.tptr_ba.allotted = Math.max(player.tptr_ba.allotted-0.05, 0) },
				style: {"height": "50px", "width": "50px", "background-color": "rgb(235, 64, 52)"},
			},
			12: {
				title: "+",
				unlocked() { return player.tptr_ba.unlocked },
				canClick() { return player.tptr_ba.allotted<1 },
				onClick() { player.tptr_ba.allotted = Math.min(player.tptr_ba.allotted+0.05, 1) },
				style: {"height": "50px", "width": "50px", "background-color": "rgb(162, 249, 252)"},
			},
			21: {
				title: "&#8592;",
				unlocked() { return player.tptr_ba.unlocked },
				canClick() { return player.tptr_ba.allotted>0 },
				onClick() { player.tptr_ba.allotted = 0 },
				style: {"height": "50px", "width": "50px", "background-color": "rgb(235, 64, 52)"},
			},
			22: {
				title: "&#8594;",
				unlocked() { return player.tptr_ba.unlocked },
				canClick() { return player.tptr_ba.allotted<1 },
				onClick() { player.tptr_ba.allotted = 1 },
				style: {"height": "50px", "width": "50px", "background-color": "rgb(162, 249, 252)"},
			},
			31: {
				title: "C",
				unlocked() { return player.tptr_ba.unlocked },
				canClick() { return player.tptr_ba.allotted!=.5 },
				onClick() { player.tptr_ba.allotted = .5 },
				style: {"height": "50px", "width": "50px", "background-color": "yellow"},
			},
		},
		milestones: {
			0: {
				requirementDescription: "1 Balance Energy",
				done() { return player.tptr_ba.best.gte(1) },
				effectDescription: "Autobuy Subspace Energy, Subspace Energy resets nothing, You can buy max Subspace energy. Autobuy Quirk Layers.",
			},
		},
		upgrades: {
			rows: 3,
			cols: 4,
			11: {
				title: "Negative Ion",
				description: "Negativity boosts Solar Power.",
				cost() { return new Decimal(1e12) },
				unlocked() { return hasUpgrade("tm",44) },
				effect() { 
					let ret = player.tptr_ba.neg.plus(1).log10().sqrt().div(10);
					if(ret.gte(1.5))return ret.log10().pow(0.5).times(new Decimal(1.5).div(new Decimal(1.5).log10().pow(0.5)));
					return ret;
				},
				effectDisplay() { return "+"+format(tmp.tptr_ba.upgrades[11].effect.times(100))+"%" },
			},
			12: {
				title: "Positive Ion",
				description: "Positivity boosts Space Building Power & all Subspace effects.",
				cost() { return new Decimal(1e12) },
				unlocked() { return hasUpgrade("tm",44) },
				effect() { 
					let ret = player.tptr_ba.pos.plus(1).log10().cbrt().div(10);
					if(ret.gte(0.75))return ret.log10().pow(0.25).times(new Decimal(0.75).div(new Decimal(0.75).log10().pow(0.25)));
					return ret;
				},
				effectDisplay() { return "+"+format(tmp.tptr_ba.upgrades[12].effect.times(100))+"%" },
			},
			13: {
				title: "Negative Energy",
				description: "Raise the Negativity buff to the power of 10.",
				cost() { return new Decimal(1e13) },
				unlocked() { return hasUpgrade("tm",44) },
			},
			14: {
				title: "Positive Vibe",
				description: "Halve the Negativity nerf.",
				cost() { return new Decimal(1e13) },
				unlocked() { return hasUpgrade("tm",44) },
			},
			21: {
				title: "Neutral Atom",
				description: "The Hindrance Spirit effect is raised to the power of 8, and affects Real Prestige Tree (H challenge) effect in TPTC.",
				cost() { return new Decimal(1e20) },
				unlocked() { return hasUpgrade("tm",44) },
			},
			22: {
				title: "Negative Mass",
				description: "The Negativity buff also multiplies Hindrance Spirit & Quirk gain.",
				cost() { return new Decimal(1e23) },
				unlocked() { return player.tm.buyables[7].gte(27) },
			},
			23: {
				title: "Complete Plus",
				description: "The Positivity buff also divides the Solarity requirement.",
				cost() { return new Decimal(1e23) },
				unlocked() { return player.tm.buyables[7].gte(27) },
			},
			24: {
				title: "Net Neutrality",
				description: "Positivity and Negativity boost each other's generation.",
				cost() { return new Decimal(1e28) },
				unlocked() { return player.tm.buyables[7].gte(27) },
				effect() { 
					let ret = {
						pos: player.tptr_ba.neg.div(1e12).plus(1).log10().plus(1).pow(hasUpgrade("tptr_ba", 33)?15:5),
						neg: player.tptr_ba.pos.div(1e12).plus(1).log10().plus(1).pow(hasUpgrade("tptr_ba", 33)?15:5),
					} 
					return ret;
				},
				effectDisplay() { return "Pos: "+format(tmp.tptr_ba.upgrades[24].effect.pos)+"x, Neg: "+format(tmp.tptr_ba.upgrades[24].effect.neg)+"x" },
				style: {"font-size": "9px"},
			},
			31: {
				title: "Tangible Degeneration",
				description: "The first two Spells use better formulas.",
				cost() { return new Decimal(1e50) },
				unlocked() { return player.tm.buyables[7].gte(29) },
			},
			32: {
				title: "Visible Regeneration",
				description: "Positivity multiplies the Super-Generator base.",
				cost() { return new Decimal(1e50) },
				unlocked() { return player.tm.buyables[7].gte(29) },
				effect() { 
					let eff = player.tptr_ba.pos.plus(1).log10().div(50).plus(1).pow(10);
					if(eff.gte(1e9))eff = eff.log10().pow(1.6).times(new Decimal(1e9).div(new Decimal(1e9).log10().pow(1.6)));

					//if (hasUpgrade("hn", 44)) eff = eff.times(upgradeEffect("p", 44));
					//if ((Array.isArray(tmp.ma.mastered))?tmp.ma.mastered.includes(this.layer):false) eff = eff.pow(10);
					return eff;
				},
				effectDisplay() { return format(tmp.tptr_ba.upgrades[32].effect)+"x" },
				style: {"font-size": "9px"},
			},
			33: {
				title: "True Equality",
				description: "Both <b>Net Neutrality</b> effects are cubed.",
				cost() { return new Decimal(1e50) },
				unlocked() { return player.tm.buyables[7].gte(28) },
			},
		},
})



addLayer("tptr_ps", {
		name: "tptr_ps", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "PS", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
            unlocked: false,
			points: new Decimal(0),
			best: new Decimal(0),
			prevH: new Decimal(0),
			souls: new Decimal(0),
			power: new Decimal(0),
			auto: false,
			autoW: false,
			autoGhost: false,
			first: 0,
        }},
        color: "#b38fbf",
        requires() { return new Decimal("1e16000") }, // Can be a function that takes requirement increases into account
        resource: "phantom souls", // Name of prestige currency
        baseResource: "quirk energy", // Name of resource prestige is based on
        baseAmount() {return player.tptr_q.energy}, // Get the current amount of baseResource
        type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent: new Decimal(1.5), // Prestige currency exponent
		base() { 
			let b = new Decimal("1e8000");//.root(((Array.isArray(tmp.ma.mastered))?tmp.ma.mastered.includes(this.layer):false)?2:1);
			//if (tmp.ps.impr[32].unlocked) b = b.root(improvementEffect("ps", 32));
			return b;
		},
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
			//if (player.i.buyables[11].gte(2)) mult = mult.div(buyableEffect("s", 17));
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            return new Decimal(1)
        },
		effect() {
			return player.tptr_ps.points.add(1).pow(10);
		},
		effectDescription() {
			return "which are multiplying your phantom soul base in TPTC by "+format(tmp.tptr_ps.effect)+"x";
		},
		canBuyMax() { return false },
        row: 4, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
        ],
		resetsNothing() { return false },
        doReset(l){ 
			if(l=="tptr_p" || l=="tptr_b" || l=="tptr_g" || l=="tptr_t" || l=="tptr_e" || l=="tptr_s" || l=="tptr_sb" || l=="tptr_sg" || l=="tptr_o" || l=="tptr_h" || l=="tptr_q" || l=="tptr_ss" || l=="tptr_m" || l=="tptr_ba" || l=="tptr_ps" || !l.startsWith("tptr_")){return;}
			var b=new Decimal(player.tptr_ps.best);
			layerDataReset("tptr_ps",["upgrades","milestones","challenges"]);
			player.tptr_ps.best=b;
        },
		update(diff) {
			/*if (hasMilestone("hn", 5)) {
				if (player.ps.autoW) layers.ps.buyables[11].buyMax();
				player.ps.souls = player.ps.souls.max(tmp.ps.soulGain.times(player.h.points.max(1).log10()))
			} else */
				player.tptr_ps.souls = player.tptr_ps.souls.max(tmp.tptr_ps.soulGain.times(player.tptr_h.points.max(1).log10()))
			player.tptr_ps.prevH = new Decimal(player.tptr_h.points);
			//if (hasMilestone("hn", 7)) player.ps.power = player.ps.power.root(tmp.ps.powerExp).plus(tmp.ps.powerGain.times(diff)).pow(tmp.ps.powerExp);
			//else 
			player.tptr_ps.power = new Decimal(0);
			//if (player.ps.autoGhost && hasMilestone("ma", 0) && player.ma.current!="ps") layers.ps.buyables[21].buyMax();
		},
		autoPrestige() { return false; },
        layerShown(){return player.tm.currentTree==7 && hasUpgrade("tm",57) },
        branches: ["tptr_q", ["tptr_h", 2]],
		soulGainExp() { return 1.5 },
		soulGainMult() {
			let mult = new Decimal(1);
			//if (tmp.ps.buyables[11].effects.damned) mult = mult.times(tmp.ps.buyables[11].effects.damned||1);
			//if (player.i.buyables[11].gte(1)) mult = mult.times(buyableEffect("s", 16));
			//if (player.c.unlocked) mult = mult.times(tmp.c.eff4);
			return mult;//.times(tmp.n.dustEffs.purple);
		},
		soulGain() {
			let gain = Decimal.pow(player.tptr_ps.points, tmp.tptr_ps.soulGainExp).div(9.4).times(layers.tptr_ps.soulGainMult());
			return gain;
		},
		gainDisplay() {
			let gain = tmp.tptr_ps.soulGain;
			let display = "";
			if (gain.eq(0)) display = "0"
			else if (gain.gte(1)) display = format(gain)+" per OoM of Hindrance Spirit"
			else display = "1 per "+format(gain.pow(-1))+" OoMs of Hindrance Spirit"
			return display;
		},
		soulEffExp() {
			let exp = new Decimal(1.5e3);
			//if (tmp.tptr_ps.buyables[11].effects.damned) exp = exp.times(tmp.tptr_ps.buyables[11].effects.damned||1);
			//if ((Array.isArray(tmp.ma.mastered))?tmp.ma.mastered.includes(this.layer):false) exp = exp.times(100);
			return exp;
		},
		soulEff() {
			let eff = player.tptr_ps.souls.plus(1).pow(layers.tptr_ps.soulEffExp());
			return eff;
		},
		powerGain() { return player.tptr_ps.souls.plus(1).times(tmp.tptr_ps.buyables[21].effect)/*.times(tmp.n.dustEffs.purple)*/ },
		powerExp() { return player.tptr_ps.points.sqrt().times(tmp.tptr_ps.buyables[21].effect) },
		tabFormat: {
			"Main Tab": {
				content: ["main-display",
					"prestige-button",
					"resource-display",
					"blank",
					["display-text", function() { return "You have "+formatWhole(player.tptr_ps.souls)+" Damned Souls "+(("(Gain: "+tmp.tptr_ps.gainDisplay+")"))+": Divide Quirk Improvement requirements by "+format(tmp.tptr_ps.soulEff)+(tmp.nerdMode?(" (x+1)^("+formatWhole(tmp.tptr_ps.soulEffExp)+")"):"") }],
					"blank",
					["buyable", 11],
				],
			},/*
			Boosters: {
				unlocked() { return hasMilestone("hn", 7) },
				buttonStyle() { return {'background-color': '#b38fbf'} },
				content: [
					"main-display",
					"blank",
					["buyable", 21],
					"blank",
					["display-text",
						function() {return 'You have ' + formatWhole(player.ps.power)+' Phantom Power'+(tmp.nerdMode?(" (Gain Formula: (damned+1), Exp Formula: sqrt(ps))"):" (+"+format(tmp.ps.powerGain)+"/sec (based on Damned Souls), then raised to the power of "+format(tmp.ps.powerExp)+" (based on Phantom Souls))")+', which has provided the below Phantom Boosters (next at '+format(tmp.ps.impr.overallNextImpr)+')'},
							{}],
					"blank",
					"improvements"],
			},*/
		},
		buyables: {
			rows: 2,
			cols: 1,
			11: {
				title: "Wraiths",
				scaleSlow() {
					let speed = new Decimal(1);
					//if ((Array.isArray(tmp.ma.mastered))?tmp.ma.mastered.includes(this.layer):false) speed = speed.times(2);
					return speed;
				},
				cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost1 = x.div(tmp.tptr_ps.buyables[this.id].scaleSlow).times(2).plus(1).floor();
					let cost2 = x.div(tmp.tptr_ps.buyables[this.id].scaleSlow).plus(1).pow(4).times(174).plus(200).floor();
                    return { phantom: cost1, damned: cost2 };
                },
				effects(adj=0) {
					let data = {};
					let x = player[this.layer].buyables[this.id].plus(adj);
					if (x.gte(1)) data.hindr = x.add(1).div(2).floor().min(1).toNumber();
					if (x.gte(2)) data.damned = x.sub(1).times(0.5).div(10/9.4).plus(1);
					if (x.gte(4)) data.quirkImpr = x.div(2).sub(1).floor().min(3).toNumber();
					return data;
				},
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    let display = ((tmp.nerdMode?("Cost Formula: 2*x+1 Phantom Souls, (x+1)^4*174+200 Damned Souls"):("Cost: " + formatWhole(data.cost.phantom) + " Phantom Souls, "+formatWhole(data.cost.damned)+" Damned Souls"))+"\n\
                    Amount: " + formatWhole(player[this.layer].buyables[this.id])+"\n\
					Effects: ")
					let curr = data.effects;
					let next = this.effects(1);
					if (Object.keys(next).length>0) {
						if (next.hindr) {
							display += "\n"
							if (curr.hindr) display += curr.hindr+" New Hindrance"+(curr.hindr==1?"":"s")+(curr.hindr>=1?" (MAXED)":"")
							else display += "<b>NEXT: Unlock a new Hindrance</b>"
						}
						if (next.damned) {
							display += "\n"
							if (curr.damned) display += "Multiply Damned Soul gain & effect exponent by "+format(curr.damned)+(tmp.nerdMode?" ((x-1)*0.5+1)":"");
							else display += "<b>NEXT: Multiply Damned Soul gain & effect exponent</b>"
						}
						if (next.quirkImpr) {
							display += "\n"
							if (curr.quirkImpr) display += curr.quirkImpr+" New Quirk Improvement"+(curr.quirkImpr==1?"":"s")+(curr.quirkImpr>=3?" (MAXED)":"")
							else if (next.quirkImpr>(curr.quirkImpr||0)) display += "<b>NEXT: Unlock a new Quirk Improvement</b>"
						}
					} else display += "None"
					return display;
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return player.tptr_ps.points.gte(tmp[this.layer].buyables[this.id].cost.phantom)&&player.tptr_ps.souls.gte(tmp[this.layer].buyables[this.id].cost.damned)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {
					let target = player.tptr_ps.points.sub(1).div(2).min(player.tptr_ps.souls.sub(200).div(174).root(4).sub(1)).times(tmp.tptr_ps.buyables[this.id].scaleSlow).plus(1).floor().max(0)
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(target)
				},
                style: {'height':'200px', 'width':'200px'},
				//autoed() { return hasMilestone("hn", 5) && player.ps.autoW },
			},
			21: {
				title: "Ghost Spirit",
				scaleSlow() {
					let slow = new Decimal(1);
					//if (hasUpgrade("hn", 51)) slow = slow.times(2);
					//if ((Array.isArray(tmp.ma.mastered))?tmp.ma.mastered.includes(this.layer):false) slow = slow.times(1.2);
					//if (tmp.ps.impr[31].unlocked) slow = slow.times(improvementEffect("ps", 31));
					return slow;
				},
				cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(10, Decimal.pow(2, x.div(this.scaleSlow()))).times(x.eq(0)?1e21:1e22);
					//if (hasUpgrade("hn", 51)) cost = cost.div(upgradeEffect("hn", 51));
					return cost;
                },
				effect() {
					return player[this.layer].buyables[this.id].div(25).plus(1).pow(2);
				},
				effect2() {
					return player[this.layer].buyables[this.id].div(10).plus(1);
				},
				display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    let display = ((tmp.nerdMode?("Cost Formula: (10^(2^x))*1e22"):("Cost: " + formatWhole(data.cost) + " Phantom Power"))+"\n\
                    Amount: " + formatWhole(player[this.layer].buyables[this.id])+"\n\
					Effect: "+(tmp.nerdMode?("Formula 1: (x/25+1)^2, Formula 2: (x/10+1)"):("Multiply Phantom Power gain/exponent by "+format(tmp.tptr_ps.buyables[this.id].effect)+", and boost Phantom Booster effectiveness by "+format(tmp.tptr_ps.buyables[this.id].effect2.sub(1).times(100))+"%")))
					return display;
                },
                unlocked() { return player[this.layer].unlocked }, 
                canAfford() {
                    return player.tptr_ps.power.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
					player.tptr_ps.power = player.tptr_ps.power.sub(cost);
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                buyMax() {
					let target = player.tptr_ps.power.times(/*hasUpgrade("hn", 51)?upgradeEffect("hn", 51):*/1).div(1e22).max(1).log10().max(1).log(2).times(this.scaleSlow()).plus(1).floor();
					player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].max(target);
				},
                style: {'height':'200px', 'width':'200px'},
				//autoed() { return player.ps.autoGhost && hasMilestone("ma", 0) && player.ma.current!="ps" },
			},
		},/*
		impr: {
			baseReq() { 
				let req = new Decimal(1e20).div(99);
				return req;
			},
			amount() { 
				let amt = player.ps.power.div(this.baseReq()).plus(1).log10().div(4).root(1.5).max(0);
				//if (amt.gte(270)) amt = amt.log10().times(270/Math.log10(270));
				return amt.floor();
			},
			overallNextImpr() { 
				let impr = tmp.ps.impr.amount.plus(1);
				//if (impr.gte(270)) impr = Decimal.pow(10, impr.div(270/Math.log10(270)));
				return Decimal.pow(10, impr.pow(1.5).times(4)).sub(1).times(this.baseReq()) 
			},
			nextAt(id=11) { 
				let impr = getImprovements("ps", id).times(tmp.ps.impr.activeRows*tmp.ps.impr.activeCols).add(tmp.ps.impr[id].num);
				//if (impr.gte(270)) impr = Decimal.pow(10, impr.div(270/Math.log10(270)));
				return Decimal.pow(10, impr.pow(1.5).times(4)).sub(1).times(this.baseReq());
			},
			power() { return tmp.ps.buyables[21].effect2.times(((Array.isArray(tmp.ma.mastered))?tmp.ma.mastered.includes(this.layer):false)?1.1:1) },
			resName: "phantom power",
			rows: 3,
			cols: 2,
			activeRows: 2,
			activeCols: 2,
			11: {
				num: 1,
				title: "Phantom Booster I",
				description: "Boost Solar Power.",
				unlocked() { return hasMilestone("hn", 7) },
				effect() { return getImprovements("ps", 11).times(tmp.ps.impr.power).div(20).plus(1).sqrt() },
				effectDisplay() { return "+"+format(tmp.ps.impr[11].effect.sub(1).times(100))+"% (multiplicative)" },
				formula: "sqrt(x*5%)",
				style: {height: "150px", width: "150px"},
			},
			12: {
				num: 2,
				title: "Phantom Booster II",
				description: "Boost Hex gain.",
				unlocked() { return hasMilestone("hn", 7) },
				effect() { return Decimal.pow(10, getImprovements("ps", 11).times(tmp.ps.impr.power).pow(2.5)) },
				effectDisplay() { return format(tmp.ps.impr[12].effect)+"x" },
				formula: "10^(x^2.5)",
				style: {height: "150px", width: "150px"},
			},
			21: {
				num: 3,
				title: "Phantom Booster III",
				description: "Spells are more effective.",
				unlocked() { return hasMilestone("hn", 7) },
				effect() { return getImprovements("ps", 21).times(tmp.ps.impr.power).div(10).plus(1) },
				effectDisplay() { return format(tmp.ps.impr[21].effect.sub(1).times(100))+"% stronger" },
				formula: "x*10%",
				style: {height: "150px", width: "150px"},
			},
			22: {
				num: 4,
				title: "Phantom Booster IV",
				description: "Quirk Improvement requirements increase slower.",
				unlocked() { return hasMilestone("hn", 7) },
				effect() { return getImprovements("ps", 22).times(tmp.ps.impr.power).div(20).plus(1) },
				effectDisplay() { return format(tmp.ps.impr[22].effect)+"x slower" },
				formula: "x/20+1",
				style: {height: "150px", width: "150px"},
			},
			31: {
				num: 1500,
				title: "Phantom Booster V",
				description: "The Ghost Spirit cost scaling is weakened.",
				unlocked() { return hasMilestone("hn", 7) && player.i.buyables[14].gte(1) },
				effect() { return getImprovements("ps", 31).times(tmp.ps.impr.power).plus(1).log10().div(25).plus(1) },
				effectDisplay() { return format(Decimal.sub(1, tmp.ps.impr[31].effect.pow(-1)).times(100))+"% slower" },
				formula: "log(x+1)/25+1",
				style: {height: "150px", width: "150px"},
			},
			32: {
				num: 1751,
				title: "Phantom Booster VI",
				description: "The Phantom Soul cost base is reduced based on your Phantom Souls.",
				unlocked() { return hasMilestone("hn", 7) && player.i.buyables[14].gte(2) },
				effect() { return getImprovements("ps", 31).times(tmp.ps.impr.power).pow(2).times(player.ps.points).plus(1).log10().plus(1).pow(1.2) },
				effectDisplay() { return "brought to the "+format(tmp.ps.impr[32].effect)+"th root" },
				formula: "(log((x^2)*PS+1)+1)^1.2",
				style: {height: "150px", width: "150px"},
			},
		},*/
})