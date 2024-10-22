
addLayer("tptc_p", {
    name: "tptc_p", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#00bfbf",
    requires(){
		if(hasUpgrade("tptc_p",34))return new Decimal(1);
		return new Decimal(10);
	},
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
		if(inChallenge("tptr_h",12))mult = new Decimal(0);
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
            rows: 5,
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
                    let ret = Decimal.pow(base,Decimal.log10(player.tptc_p.points.mul(2).add(3)).pow(hasUpgrade("tptc_sp",33)?0.91:0.9));
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
					if(hasUpgrade("tptc_p",31))return (1+(player.tm.upgrades.length||0)*0.05)**2;
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
					if(hasUpgrade("tptc_p",33))ret=ret.pow(1.25);
					if(hasUpgrade("tptc_sp",14))ret=ret.pow(1.25);
					if(hasUpgrade("tptc_sp",15))ret=ret.pow(1.25);
					if(player.tptc_i.buyables[11].gte(3))ret = ret.mul(tmp.tptc_s.buyables[15].effect);
					if(player.tptc_mb.buyables[11].gte(3))ret = ret.mul(tmp.tptc_m.clickables[14].effect);
					if(player.tptc_mb.buyables[12].gte(3))ret = ret.mul(tmp.tptc_l.buyables[17].effect);
					if(player.tptc_mb.buyables[13].gte(4))ret=ret.mul(buyableEffect("tptc_ma",14));
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
					if(hasUpgrade("tptc_p",33))ret=ret.pow(1.25);
					if(hasUpgrade("tptc_sp",14))ret=ret.pow(1.25);
					if(hasUpgrade("tptc_sp",15))ret=ret.pow(1.25);
					if(player.tptc_i.buyables[11].gte(3))ret = ret.mul(tmp.tptc_s.buyables[15].effect);
					if(player.tptc_mb.buyables[11].gte(3))ret = ret.mul(tmp.tptc_m.clickables[14].effect);
					if(player.tptc_mb.buyables[12].gte(3))ret = ret.mul(tmp.tptc_l.buyables[17].effect);
					if(player.tptc_mb.buyables[13].gte(4))ret=ret.mul(buyableEffect("tptc_ma",14));
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
					if(hasUpgrade("tptc_p",33))ret=ret.pow(1.25);
					if(hasUpgrade("tptc_sp",14))ret=ret.pow(1.25);
					if(hasUpgrade("tptc_sp",15))ret=ret.pow(1.25);
					if(player.tptc_i.buyables[11].gte(3))ret = ret.mul(tmp.tptc_s.buyables[15].effect);
					if(player.tptc_mb.buyables[11].gte(3))ret = ret.mul(tmp.tptc_m.clickables[14].effect);
					if(player.tptc_mb.buyables[12].gte(3))ret = ret.mul(tmp.tptc_l.buyables[17].effect);
					if(player.tptc_mb.buyables[13].gte(4))ret=ret.mul(buyableEffect("tptc_ma",14));
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
					if(hasUpgrade("tptc_p",33))ret=ret.pow(1.25);
					if(hasUpgrade("tptc_sp",14))ret=ret.pow(1.25);
					if(hasUpgrade("tptc_sp",15))ret=ret.pow(1.25);
					if(player.tptc_i.buyables[11].gte(3))ret = ret.mul(tmp.tptc_s.buyables[15].effect);
					if(player.tptc_mb.buyables[11].gte(3))ret = ret.mul(tmp.tptc_m.clickables[14].effect);
					if(player.tptc_mb.buyables[12].gte(3))ret = ret.mul(tmp.tptc_l.buyables[17].effect);
					if(player.tptc_mb.buyables[13].gte(4))ret=ret.mul(buyableEffect("tptc_ma",14));
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
					if(hasUpgrade("tptc_p",33))ret=ret.pow(1.25);
					if(hasUpgrade("tptc_sp",14))ret=ret.pow(1.25);
					if(hasUpgrade("tptc_sp",15))ret=ret.pow(1.25);
					if(player.tptc_i.buyables[11].gte(3))ret = ret.mul(tmp.tptc_s.buyables[15].effect);
					if(player.tptc_mb.buyables[11].gte(3))ret = ret.mul(tmp.tptc_m.clickables[14].effect);
					if(player.tptc_mb.buyables[12].gte(3))ret = ret.mul(tmp.tptc_l.buyables[17].effect);
					if(player.tptc_mb.buyables[13].gte(4))ret=ret.mul(buyableEffect("tptc_ma",14));
                    return ret;
                },
                effectDisplay() { return "/"+format(this.effect()) }, // Add formatting to the effect
            },
			31: {
				title: "Prestige Upgrade 31",
                description: "Prestige Upgrade 15's effect ^2.",
                cost: new Decimal(1),
                unlocked() { return hasUpgrade("tm",23); }, // The upgrade is only visible when this is true
            },
			32: {
				title: "Prestige Upgrade 32",
                description: "Prestige Points in TPTR is boosted by your Prestige Points.",
                cost: new Decimal("e1817e4"),
                unlocked() { return hasUpgrade("tm",23); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=((hasUpgrade("tptc_p",41))?1.03:1.005);
                    let ret = Decimal.pow(base,Decimal.log10(player.tptc_p.points.add(1)).pow(0.5));
					if(hasUpgrade("tptc_p",14)&&hasUpgrade("tptc_p",41))ret=ret.pow(1.25);
					if(hasUpgrade("tptc_p",15)&&hasUpgrade("tptc_p",41))ret=ret.pow(upgradeEffect("tptc_p",15));
					if(hasUpgrade("tptc_p",33)&&hasUpgrade("tptc_p",41))ret=ret.pow(1.25);
					if(hasUpgrade("tptc_sp",34))ret=ret.pow(1.25);
					if(hasUpgrade("tptc_sp",35))ret=ret.pow(1.25);
					if(hasUpgrade("tptc_p",42)&&player.tptc_i.buyables[11].gte(3))ret = ret.mul(tmp.tptc_s.buyables[15].effect);
					if(hasUpgrade("tptc_m",12))ret = ret.mul(tmp.tptc_m.clickables[15].effect);
					if(hasUpgrade("tptc_p",43)&&player.tptc_mb.buyables[12].gte(3))ret = ret.mul(tmp.tptc_l.buyables[17].effect);
					if(hasUpgrade("tptc_p",42)&&player.tptc_mb.buyables[13].gte(4))ret=ret.mul(buyableEffect("tptc_ma",14));
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			33: {
				title: "Prestige Upgrade 33",
                description: "The base effect of 2nd row of Prestige Upgrades ^1.25",
                cost: new Decimal(1),
                unlocked() { return hasUpgrade("tm",33); },
            },
			34: {
				title: "Prestige Upgrade 34",
                description: "Reduce base requirements of Prestige, Boosters and Generators in TPTC and TPTR to 1.",
                cost: new Decimal("e45e6"),
                unlocked() { return hasUpgrade("tm",33); }, // The upgrade is only visible when this is true
            },
			35: {
				title: "Prestige Upgrade 35",
                description: "Super-Boosters in TPTC and TPTR are cheaper.",
                cost: new Decimal("e5e7"),
                unlocked() { return hasUpgrade("tm",33); }, // The upgrade is only visible when this is true
            },
			41: {
				title: "Prestige Upgrade 41",
                description: "Prestige Upgrade 32 is better and Prestige Upgrades which boost 2nd row of Prestige Upgrades boost Prestige Upgrade 32.",
                cost: new Decimal(1),
                unlocked() { return hasUpgrade("tm",41); }, // The upgrade is only visible when this is true
            },
			42: {
				title: "Prestige Upgrade 42",
                description: "Spell of Multitree B is better. Space Building 5 & Machine 4 boost Prestige Upgrade 32.",
                cost: new Decimal("e64e7"),
                unlocked() { return hasUpgrade("tm",41); }, // The upgrade is only visible when this is true
            },
			43: {
				title: "Prestige Upgrade 43",
                description: "Life Booster 7 boost Prestige Upgrade 32.",
                cost: new Decimal("e735e6"),
                unlocked() { return hasUpgrade("tm",41); }, // The upgrade is only visible when this is true
            },
			44: {
				title: "Prestige Upgrade 44",
                description: "Super-Generator Power effect is better.",
                cost: new Decimal("e876543210"),
                unlocked() { return hasUpgrade("tm",41); }, // The upgrade is only visible when this is true
            },
			45: {
				title: "Prestige Upgrade 45",
                description: "Super-Boosters in TPTC and TPTR are cheaper.",
                cost: new Decimal("e1e9"),
                unlocked() { return hasUpgrade("tm",41); }, // The upgrade is only visible when this is true
            },
			51: {
				title: "Prestige Upgrade 51",
                description: "Coin gain in The Dynas Tree is boosted by your Prestige Points.",
                cost: new Decimal("ee12"),
                unlocked() { return hasUpgrade("dynas_c",34); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let base=1.03;
                    let ret = Decimal.pow(base,Decimal.log10(player.tptc_p.points.add(1)).pow(hasUpgrade("tptc_p",55)?0.3:hasUpgrade("tptc_p",54)?0.275:hasUpgrade("tptc_p",53)?0.25:hasUpgrade("tptc_p",52)?0.2:0.15));
                    return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			52: {
				title: "Prestige Upgrade 52",
                description: "Previous upgrade is better.",
                cost: new Decimal("e27e11"),
                unlocked() { return hasUpgrade("dynas_c",34); }, // The upgrade is only visible when this is true
            },
			53: {
				title: "Prestige Upgrade 53",
                description: "Previous upgrade is better.",
                cost: new Decimal("e45e11"),
                unlocked() { return hasUpgrade("dynas_c",34); }, // The upgrade is only visible when this is true
            },
			54: {
				title: "Prestige Upgrade 54",
                description: "Previous upgrade is better.",
                cost: new Decimal("e14e12"),
                unlocked() { return hasUpgrade("dynas_c",34); }, // The upgrade is only visible when this is true
            },
			55: {
				title: "Prestige Upgrade 55",
                description: "Previous upgrade is better.",
                cost: new Decimal("e22e12"),
                unlocked() { return hasUpgrade("dynas_c",34); }, // The upgrade is only visible when this is true
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
    requires(){
		if(hasUpgrade("tptc_p",34))return new Decimal(1);
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
		if(hasUpgrade("stardust_s",42))mult = mult.div(upgradeEffect("stardust_n",12));
		if(player.tptc_i.buyables[11].gte(2))mult = mult.div(buyableEffect("tptc_s",14));
		if(hasUpgrade("tptc_g",12))mult = mult.div(upgradeEffect("tptc_g",12));
		if(hasUpgrade("forest_p",51))mult = mult.div(upgradeEffect("forest_p",51));
		if(hasUpgrade("forest_p",54))mult = mult.div(upgradeEffect("forest_p",54));
        return mult
    },
    row: 1,
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(2)},
	branches: ["tptc_p"],
	effect() {
		if(inChallenge("tptc_h",21)||inChallenge("tptr_h",41))return new Decimal(1);
		let ret = player.tptc_b.points;
		let base = new Decimal(2);
		if(hasUpgrade("tptc_e",12))base = base.mul(tmp.tptc_e.buyables[11].effect[0]);else base = base.add(tmp.tptc_e.buyables[11].effect[0]);
		base = base.mul(tmp.tptc_sb.effect);
		if(hasUpgrade("tptc_b",11))base = base.mul(upgradeEffect("tptc_b",11));
		base = base.mul(tmp.tptr_b.effect[1]);
		ret = Decimal.pow(base,ret);
		return ret;
	},
	effectDescription() { // Optional text to describe the effects
           let eff = this.effect();
           return "translated to a "+format(eff)+"x multiplier to point gain"
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
            rows: 2,
            cols: 5,
			11: {
				title: "Booster Upgrade 11",
                description: "Multiply Booster base by your Generators.",
                cost: new Decimal(5625),
                unlocked() { return hasUpgrade("tm",11); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let ret=Decimal.pow(player.tptc_g.points.add(2),0.5);
					if(hasUpgrade("tptc_b",14))ret = player.tptc_g.points.add(1);
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
					if(hasUpgrade("tptc_b",15))ret = ret.pow(65);
					if(hasUpgrade("tptc_b",21))ret = ret.pow(1000/65);
					return ret;
                },
                effectDisplay() { return "/"+format(this.effect()) }, // Add formatting to the effect
            },
			13: {
				title: "Booster Upgrade 13",
                description: "The second effect of Boosters in TPTR is squared.",
                cost: new Decimal(85000),
                unlocked() { return hasUpgrade("tm",22); }, // The upgrade is only visible when this is true
            },
			14: {
				title: "Booster Upgrade 14",
                description: "Booster Upgrade 11 is better.",
                cost: new Decimal(1250000),
                unlocked() { return hasUpgrade("tm",22); }, // The upgrade is only visible when this is true
            },
			15: {
				title: "Booster Upgrade 15",
                description: "Booster Upgrade 12 is better.",
                cost: new Decimal(1440000),
                unlocked() { return hasUpgrade("tm",22); }, // The upgrade is only visible when this is true
            },
			21: {
				title: "Booster Upgrade 21",
                description: "Booster Upgrade 12 is better.",
                cost: new Decimal(22e7),
                unlocked() { return hasUpgrade("tm",22); }, // The upgrade is only visible when this is true
            },
			22: {
				title: "Booster Upgrade 22",
                description: "The second effect of Boosters in TPTR is better.",
                cost: new Decimal(552e6),
                unlocked() { return hasUpgrade("tm",22); }, // The upgrade is only visible when this is true
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
    requires(){
		if(hasUpgrade("tptc_p",34))return new Decimal(1);
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
		if(hasUpgrade("stardust_s",41))mult = mult.div(upgradeEffect("stardust_so",12));
		if(player.tptc_i.buyables[11].gte(2))mult = mult.div(buyableEffect("tptc_s",14));
		if(hasUpgrade("tptc_b",12))mult = mult.div(upgradeEffect("tptc_b",12));
		if(hasUpgrade("forest_p",52))mult = mult.div(upgradeEffect("forest_p",52));
		if(hasUpgrade("forest_p",55))mult = mult.div(upgradeEffect("forest_p",55));
        return mult
    },
    row: 1,
    hotkeys: [],
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(2)},
	branches: ["tptc_p"],
	effect() {
		if(inChallenge("tptc_h",21)||inChallenge("tptr_h",41))return new Decimal(0);
		let ret = player.tptc_g.points;
		let base = new Decimal(2);
		base = base.add(tmp.tptc_sg.getSGenPowerEff);
		if(hasUpgrade("tptc_e",12))base = base.mul(tmp.tptc_e.buyables[11].effect[0]);else base = base.add(tmp.tptc_e.buyables[11].effect[0]);
		base = base.mul(tmp.tptr_g.effect[1]);
		if(hasUpgrade("tptc_g",14))base = base.mul(upgradeEffect("tptc_g",14));
		ret = Decimal.pow(base,ret).mul(ret);
		
		let sc=player.tptc_g.points.div(1e7);
		if(player.tptc_g.points.gte(4e6))sc=player.tptc_g.points.sqrt().div(5000);
		if(player.tptc_g.points.gte(7.84e6))sc=player.tptc_g.points.sqrt().div(7).sqrt().mul(0.028).min(1);
		if(ret.gte("e3e7"))ret = ret.div("e3e7").pow(sc).mul("e3e7");
		if(ret.gte("e7e7"))ret = ret.div("e7e7").pow(sc).mul("e7e7");
		
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
                    "blank",
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
		if(hasChallenge("tptc_h",21))exp = exp.mul(1.0416666666666666666666666);
		if(hasChallenge("tptc_h",22))exp = exp.mul(1.2);
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
            rows: 2,
            cols: 5,
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
					if(hasUpgrade("tptc_g",15))ret = ret.pow(65);
					if(hasUpgrade("tptc_g",21))ret = ret.pow(1000/65);
					return ret;
                },
                effectDisplay() { return "/"+format(this.effect()) }, // Add formatting to the effect
            },
			13: {
				title: "Generator Upgrade 13",
                description: "The second effect of Generators in TPTR is squared.",
                cost: new Decimal(85000),
                unlocked() { return hasUpgrade("tm",22); }, // The upgrade is only visible when this is true
            },
			14: {
				title: "Generator Upgrade 14",
                description: "Multiply Generator base by your Boosters.",
                cost: new Decimal(1250000),
                unlocked() { return hasUpgrade("tm",22); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let ret = player.tptc_b.points.add(1);
					return ret;
                },
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
            },
			15: {
				title: "Generator Upgrade 15",
                description: "Generator Upgrade 12 is better.",
                cost: new Decimal(1440000),
                unlocked() { return hasUpgrade("tm",22); }, // The upgrade is only visible when this is true
            },
			21: {
				title: "Generator Upgrade 21",
                description: "Generator Upgrade 12 is better.",
                cost: new Decimal(22e7),
                unlocked() { return hasUpgrade("tm",22); }, // The upgrade is only visible when this is true
            },
			22: {
				title: "Generator Upgrade 22",
                description: "The second effect of Generators in TPTR is better.",
                cost: new Decimal(555555555),
                unlocked() { return hasUpgrade("tm",22); }, // The upgrade is only visible when this is true
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
	requires() { if(hasUpgrade("tptr_t",23))return new Decimal(1);return new Decimal(5e6); },
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
		let ret = player.tptc_t.points.add(player.tptc_t.buyables[11].mul(inChallenge("tptr_h",31)?0:1));
		let base = new Decimal(2);
		if(player.tptc_h.challenges[11])base=base.add(tmp.tptc_h.challenges[11].rewardEffect);
		base = base.mul(tmp.tptr_t.effect.tptc_t_boost);
		ret = Decimal.pow(base,ret.mul(hasUpgrade("tptc_t",15)?1.5:1)).mul(ret);
		ret=ret.mul(tmp.tptc_m.clickables[11].effect);
		ret=ret.mul(inChallenge("tptr_h",32)?0:1);
		return ret;
	},
	effectDescription() { // Optional text to describe the effects
           let eff = this.effect();
           return "which are generating "+format(eff)+" Time Energy/sec"+((inChallenge("tptc_h",11)||inChallenge("tptr_h",11))?", but with a limit of "+format(player.tptc_t.points.pow(player.tptc_t.buyables[11].sqrt().add(5)))+" Time Energy":"");
       },
	doReset(l){
			if(l=="tptc_p" || l=="tptc_b" || l=="tptc_g" || l=="tptc_t" || l=="tptc_e" || l=="tptc_s" || l=="tptc_sb" || l=="tptc_sg" || !l.startsWith("tptc_")){return;}
			var b=new Decimal(player.tptc_t.best);
			layerDataReset("tptc_t",["upgrades","milestones","challenges"]);
			player.tptc_t.best=b;
		},
		
	 update(diff){
		 player.tptc_t.energy = player.tptc_t.energy.add(tmp.tptc_t.effect.times(diff)).max(0)
		 if((inChallenge("tptc_h",11)||inChallenge("tptr_h",11)))player.tptc_t.energy=player.tptc_t.energy.min(player.tptc_t.points.pow(player.tptc_t.buyables[11].sqrt().add(5)));
		 if(player.tptc_m.best.gte(1)){
			player.tptc_t.buyables[11]=player.tptc_t.buyables[11].max(player.tptc_b.points.add(1).pow(1/(hasUpgrade("tptc_t",14)?1.4:1.5)).sub(2).add(0.000001).floor());
		 }
	 },
	 
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
			"blank",
                        "milestones",
                    ["display-text",
                        function() {
							return 'You have ' + format(player.tptc_t.energy) + ' Time Energy, which multiplies point gain by ' + format(tmp.tptc_t.getEnergyEff);
						},
                        {}],
                        "buyables","upgrades"
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
                title: "Extra Time Capsules", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x.add(3).pow(hasUpgrade("tptc_t",14)?1.4:1.5).sub(1).ceil();
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
	 upgrades: {
            rows: 1,
            cols: 5,
			11: {
				title: "Time Upgrade 11",
                description: "The second effect of Time Capsules in TPTR is cubed.",
                cost: new Decimal(3333),
                unlocked() { return hasUpgrade("tm",31); }, // The upgrade is only visible when this is true
            },
			12: {
				title: "Time Upgrade 12",
                description: "The second effect of Time Capsules in TPTR is cubed.",
                cost: new Decimal(6000),
                unlocked() { return hasUpgrade("tm",31); }, // The upgrade is only visible when this is true
            },
			13: {
				title: "Time Upgrade 13",
                description: "The second effect of Time Capsules in TPTR ^2.222",
                cost: new Decimal(12500),
                unlocked() { return hasUpgrade("tm",35); }, // The upgrade is only visible when this is true
            },
			14: {
				title: "Time Upgrade 14",
                description: "Extra Time Capsules are cheaper.",
                cost: new Decimal(750000),
                unlocked() { return hasUpgrade("tm",35); }, // The upgrade is only visible when this is true
            },
			15: {
				title: "Time Upgrade 15",
                description: "Time Capsules are 1.5x stronger.",
                cost: new Decimal(1e6),
                unlocked() { return hasUpgrade("tm",35); }, // The upgrade is only visible when this is true
            },
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
	requires() { if(hasUpgrade("tptr_e",22))return new Decimal(1);return new Decimal(5e6); },
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
	buyables: {
            rows: 1,
            cols: 1,
            11: {
                title: "Enhancers", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(1.5))
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = [];
					eff[0]=x;
					if(hasUpgrade("tptc_e",13))eff[0] = x.pow(1.1);
					if(hasUpgrade("tptc_e",15))eff[0] = x.pow(1.11);
					if(hasUpgrade("tptc_e",12))eff[0] = eff[0].max(1);
					eff[0]=eff[0].pow(tmp.tptr_e.effect);
					eff[1]=Decimal.pow(10,x.pow(0.9));
					if(hasUpgrade("tptc_e",11))eff[1] = Decimal.pow(10, x.mul(10));
					if(hasUpgrade("tptc_e",14))eff[1] = Decimal.pow(10, x.mul(15));
					eff[1]=eff[1].pow(tmp.tptr_e.effect);
					if(inChallenge("tptr_h",31))return [new Decimal(1),new Decimal(1)];
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "You have "+formatWhole(player[this.layer].buyables[this.id])+" Enhancers.\n\
					They are multiplying Prestige Point gain by "+format(data.effect[1])+"\n\
					They are "+(hasUpgrade("tptc_e",12)?"multiplying":"adding")+" Booster/Generator bases by "+format(data.effect[0])+"\n\
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
	 upgrades: {
            rows: 1,
            cols: 5,
			11: {
				title: "Enhance Upgrade 11",
                description: "First Enhancer effect is better.",
                cost: new Decimal("e45e5"),
                unlocked() { return hasUpgrade("tm",31); }, // The upgrade is only visible when this is true
            },
			12: {
				title: "Enhance Upgrade 12",
                description: "Second Enhancer effect uses multiplication instead of addition.",
                cost: new Decimal("e19e6"),
                unlocked() { return hasUpgrade("tm",31); }, // The upgrade is only visible when this is true
            },
			13: {
				title: "Enhance Upgrade 13",
                description: "Second Enhancer effect is better.",
                cost: new Decimal("e15e7"),
                unlocked() { return hasUpgrade("tm",35); }, // The upgrade is only visible when this is true
            },
			14: {
				title: "Enhance Upgrade 14",
                description: "First Enhancer effect is better.",
                cost: new Decimal("e4e11"),
                unlocked() { return hasUpgrade("tm",35); }, // The upgrade is only visible when this is true
            },
			15: {
				title: "Enhance Upgrade 15",
                description: "Second Enhancer effect is better.",
                cost: new Decimal("e116e10"),
                unlocked() { return hasUpgrade("tm",35); }, // The upgrade is only visible when this is true
            },
	 }
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
	requires() { if(hasUpgrade("tptr_s",23))return new Decimal(1);return new Decimal(5e6); },
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
							if(hasUpgrade("tptc_s",15))return "Effective Space Energy for Space Buildings: "+format(tmp.tptc_s.getEffectiveSE);
							return 'You have ' + format(tmp.tptc_s.getSpace) + ' Space remaining for Space Buildings.'
						},
						 {}],
                    ["display-text",
                        function() {return 'You have ' + format(player.tptc_g.power) + ' Generator Power'},
                        {}],
                        "buyables","upgrades"
				],
				    
	getBaseSpace(){
		if(hasUpgrade("tptc_s",15))return Decimal.dInf;
		let baseSpace = player.tptc_s.best.pow(3).mul(10);
		baseSpace=baseSpace.floor();
		return baseSpace;
	},
	getSpace(){
		let baseSpace = tmp.tptc_s.getBaseSpace;
		return baseSpace.sub(tmp.tptc_s.getSpaceSpent);
	},
	getSpaceSpent(){
		return player[this.layer].buyables[11].add(player[this.layer].buyables[12]).add(player[this.layer].buyables[13]).add(player[this.layer].buyables[14]).add(player[this.layer].buyables[15]).add(player[this.layer].buyables[16]).add(player[this.layer].buyables[17]).add(player[this.layer].buyables[18]).add(player[this.layer].buyables[19]);
	},
	getEffectiveSE(){
		return player.tptc_s.points.mul(layers.tptc_s.buyables[20].effect());
	},
	buyables: {
            rows: 1,
            cols: 10,
            11: {
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1e4,Decimal.pow(x,1.35))
					if(x.eq(0))return new Decimal(0)
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					if(inChallenge("tptr_h", 21))return new Decimal(1);
					x=x.add(layers.tptc_s.buyables[18].effect());
					let eff = Decimal.pow(layers.tptc_s.getEffectiveSE().add(1),x.mul(3));
					eff=eff.pow(tmp.tptc_ss.ssEff);
					eff=eff.pow(tmp.tptc_hs.buyables[11].effect);
					eff=eff.pow(tmp.tptc_i.buyables[11].effect[this.id]);
					eff=eff.pow(tmp.tptr_s.effect);
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
					if(inChallenge("tptr_h", 21))return new Decimal(1);
					x=x.add(layers.tptc_s.buyables[18].effect());
					let eff = Decimal.pow(layers.tptc_s.getEffectiveSE().add(1),x.mul(3));
					eff=eff.pow(tmp.tptc_ss.ssEff);
					eff=eff.pow(tmp.tptc_hs.buyables[12].effect);
					eff=eff.pow(tmp.tptc_i.buyables[11].effect[this.id]);
					eff=eff.pow(tmp.tptr_s.effect);
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
                    let cost = Decimal.pow(hasUpgrade("tptc_s",13)?1e8:1e20,Decimal.pow(x,1.35))
					if(x.eq(0))return new Decimal(0)
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					if(inChallenge("tptr_h", 21))return new Decimal(1);
					x=x.add(layers.tptc_s.buyables[18].effect());
					let eff = x.add(1).mul(layers.tptc_s.getEffectiveSE().add(1).pow(hasUpgrade("tptc_s",12)?1:0.7));
					eff=eff.pow(tmp.tptc_ss.ssEff);
					eff=eff.pow(tmp.tptc_hs.buyables[13].effect);
					eff=eff.pow(tmp.tptc_i.buyables[11].effect[this.id]);
					eff=eff.pow(tmp.tptr_s.effect);
					if(hasUpgrade("tptc_s",11))eff=eff.pow(1.1);
					if(hasUpgrade("tptc_s",12))eff=eff.pow(10/1.1);
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
					if(inChallenge("tptr_h", 21))return new Decimal(1);
					x=x.add(layers.tptc_s.buyables[18].effect());
					let eff = Decimal.pow(layers.tptc_s.getEffectiveSE().add(1),x.mul(3));
					eff=eff.pow(tmp.tptc_ss.ssEff);
					eff=eff.pow(tmp.tptc_hs.buyables[14].effect);
					eff=eff.pow(tmp.tptc_i.buyables[11].effect[this.id]);
					eff=eff.pow(tmp.tptr_s.effect);
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
                    let cost = Decimal.pow(hasUpgrade("tptc_s",14)?1e12:hasUpgrade("tptc_s",13)?1e30:1e100,Decimal.pow(x,1.35))
					if(x.eq(0))return new Decimal(0)
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					if(inChallenge("tptr_h", 21))return new Decimal(1);
					x=x.add(layers.tptc_s.buyables[18].effect());
					let eff = Decimal.pow(layers.tptc_s.getEffectiveSE().add(1),x.pow(0.5).mul(0.05));
					eff=eff.pow(tmp.tptc_ss.ssEff);
					eff=eff.pow(tmp.tptc_hs.buyables[15].effect);
					eff=eff.pow(tmp.tptc_i.buyables[11].effect[this.id]);
					eff=eff.pow(tmp.tptr_s.effect);
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
                    let cost = Decimal.pow(hasUpgrade("tptc_s",14)?1e14:hasUpgrade("tptc_s",13)?1e35:1e50,Decimal.pow(x,1.35))
					if(x.eq(0))return new Decimal(0)
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					if(inChallenge("tptr_h", 21))return new Decimal(1);
					x=x.add(layers.tptc_s.buyables[18].effect());
					let eff = Decimal.pow(layers.tptc_s.getEffectiveSE().add(1),x.pow(0.9).mul(0.05));
					eff=eff.pow(tmp.tptc_ss.ssEff);
					eff=eff.pow(tmp.tptc_hs.buyables[16].effect);
					eff=eff.pow(tmp.tptc_i.buyables[11].effect[this.id]);
					eff=eff.pow(tmp.tptr_s.effect);
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
                    let cost = Decimal.pow(hasUpgrade("tptc_s",14)?1e16:1e40,Decimal.pow(x,1.35))
					if(x.eq(0))return new Decimal(0)
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					if(inChallenge("tptr_h", 21))return new Decimal(1);
					x=x.add(layers.tptc_s.buyables[18].effect());
					let eff = Decimal.pow(layers.tptc_s.getEffectiveSE().add(1),x.pow(0.7).mul(0.05));
					eff=eff.pow(tmp.tptc_ss.ssEff);
					eff=eff.pow(tmp.tptc_hs.buyables[17].effect);
					eff=eff.pow(tmp.tptc_i.buyables[11].effect[this.id]);
					eff=eff.pow(tmp.tptr_s.effect);
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
                    let cost = Decimal.pow(hasUpgrade("tptc_s",14)?1e50:1e100,Decimal.pow(x,2))
					if(x.eq(0))return new Decimal(0)
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = Decimal.log10(layers.tptc_s.getEffectiveSE().add(10));
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
            19: {
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1e100,Decimal.pow(x,4.5))
					if(x.eq(0))return new Decimal(0)
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = x.add(10).log10();
					if(hasUpgrade("tptc_hs",22))eff = eff.add(x.div(1000));
					if(hasUpgrade("tptc_hs",23))eff = eff.max(x.div(100).add(1));
					if(hasUpgrade("tptc_hs",24))eff = eff.mul(tmp.tptc_ss.ssEff);
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Space Building 9\n\
					Cost: " + format(data.cost) + " Generator Power\n\
                    Level: " + format(player[this.layer].buyables[this.id]) + "\n"+
                    "Currently: +"+format(data.effect.sub(1).mul(100))+"% to Space Building Power in TPTR.";
                },
                unlocked() { return hasUpgrade("tptc_s",14) }, 
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
            20: {
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(1e300,Decimal.pow(x,6))
					if(x.eq(0))return new Decimal(0)
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = x.div(3).add(10).log10();
					if(hasUpgrade("tptc_hs",25))eff = eff.mul(tmp.tptc_ss.ssEff);
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Space Building 10\n\
					Cost: " + format(data.cost) + " Generator Power\n\
                    Level: " + format(player[this.layer].buyables[this.id]) + "\n"+
                    "Currently: "+format(data.effect)+"x to Effective Space Energy for Space Buildings.";
                },
                unlocked() { return hasUpgrade("tptc_s",15) }, 
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
			if(hasUpgrade("tptc_s",15)){
				var target=pow.add(1).log(1e300).pow(1/6).add(1).floor();
				if(target.gt(player.tptc_s.buyables[20])){
					player.tptc_s.buyables[20]=target;
				}
			}
			if(hasUpgrade("tptc_s",14)){
				var target=pow.add(1).log(1e100).pow(1/4.5).add(1).floor();
				if(target.gte(tmp.tptc_s.getSpace.add(player.tptc_s.buyables[19])))target=tmp.tptc_s.getSpace.add(player.tptc_s.buyables[19]);
				if(target.gt(player.tptc_s.buyables[19])){
					player.tptc_s.buyables[19]=target;
				}
			}
			if(player.tptc_i.buyables[11].gte(6)){
				var target=pow.add(1).log(hasUpgrade("tptc_s",14)?1e50:1e100).pow(1/2).add(1).floor();
				if(target.gte(tmp.tptc_s.getSpace.add(player.tptc_s.buyables[18])))target=tmp.tptc_s.getSpace.add(player.tptc_s.buyables[18]);
				if(target.gt(player.tptc_s.buyables[18])){
					player.tptc_s.buyables[18]=target;
				}
			}
			if(player.tptc_i.buyables[11].gte(5)){
				var target=pow.add(1).log(hasUpgrade("tptc_s",14)?1e16:1e40).pow(1/1.35).add(1).floor();
				if(target.gte(tmp.tptc_s.getSpace.add(player.tptc_s.buyables[17])))target=tmp.tptc_s.getSpace.add(player.tptc_s.buyables[17]);
				if(target.gt(player.tptc_s.buyables[17])){
					player.tptc_s.buyables[17]=target;
				}
			}
			if(player.tptc_i.buyables[11].gte(4)){
				var target=pow.add(1).log(hasUpgrade("tptc_s",14)?1e14:hasUpgrade("tptc_s",13)?1e35:1e50).pow(1/1.35).add(1).floor();
				if(target.gte(tmp.tptc_s.getSpace.add(player.tptc_s.buyables[16])))target=tmp.tptc_s.getSpace.add(player.tptc_s.buyables[16]);
				if(target.gt(player.tptc_s.buyables[16])){
					player.tptc_s.buyables[16]=target;
				}
			}
			if(player.tptc_i.buyables[11].gte(3)){
				var target=pow.add(1).log(hasUpgrade("tptc_s",14)?1e12:hasUpgrade("tptc_s",13)?1e30:1e100).pow(1/1.35).add(1).floor();
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
				var target=pow.add(1).log(hasUpgrade("tptc_s",13)?1e8:1e20).pow(1/1.35).add(1).floor();
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
	 upgrades: {
            rows: 1,
            cols: 5,
			11: {
				title: "Space Upgrade 11",
                description: "Space Building 3's effect is slightly better.",
                cost: new Decimal(3333),
                unlocked() { return hasUpgrade("tm",31); }, // The upgrade is only visible when this is true
            },
			12: {
				title: "Space Upgrade 12",
                description: "Space Building 3's effect is better.",
                cost: new Decimal(7777),
                unlocked() { return hasUpgrade("tm",35); }, // The upgrade is only visible when this is true
            },
			13: {
				title: "Space Upgrade 13",
                description: "Space Buildings are cheaper.",
                cost: new Decimal(12500),
                unlocked() { return hasUpgrade("tm",35); }, // The upgrade is only visible when this is true
            },
			14: {
				title: "Space Upgrade 14",
                description: "Space Buildings are cheaper, and Unlock Space Building 9.",
                cost: new Decimal(750000),
                unlocked() { return hasUpgrade("tm",35); }, // The upgrade is only visible when this is true
            },
			15: {
				title: "Space Upgrade 15",
                description: "Get Unlimited Space and Unlock Space Building 10.",
                cost: new Decimal(1600000),
                unlocked() { return hasUpgrade("tm",35); }, // The upgrade is only visible when this is true
            },
	 }
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
	base: function(){
		if(hasUpgrade("tptc_sp",24))return new Decimal(1.1);
		if(hasUpgrade("tptc_sb",13))return new Decimal(1.12);
		if(hasUpgrade("tptc_p",45))return new Decimal(1.125);
		if(hasUpgrade("tptc_sb",12))return new Decimal(1.15);
		if(hasUpgrade("tptc_p",35))return new Decimal(1.19);
		return new Decimal(1.2);
	},
    exponent: 1.2,
    row: 2,
	roundUpCost: true,
    hotkeys: [],
    layerShown(){return player.tm.currentTree==1 && player.tm.buyables[1].gte(4)},
	branches: ["tptc_b"],
	effect() {
		if(inChallenge("tptc_ge",12)||inChallenge("tptc_h",31))return new Decimal(1);
		let ret = player.tptc_sb.points;
		let base = new Decimal(1.5);
		base = base.mul(tmp.tptc_hb.effect);
		if(hasUpgrade('tptc_m',15))base = base.mul(tmp.tptc_m.clickables[13].effect.pow(hasUpgrade('tptc_sb',15)?0.125:0.1));
		if(player.tptc_ge.challenges[12])base = base.mul(tmp.tptc_ge.challenges[12].rewardEffect);
		base = base.mul(tmp.tptr_sb.effect[1]);
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
	 upgrades: {
            rows: 1,
            cols: 5,
			11: {
				title: "Super-Booster Upgrade 11",
                description(){return "The second Super-Booster effect in TPTR ^"+(hasUpgrade("tptc_sb",14)?2:1.15)},
                cost: new Decimal(29),
                unlocked() { return hasUpgrade("tm",31); }, // The upgrade is only visible when this is true
            },
			12: {
				title: "Super-Booster Upgrade 12",
                description: "Super-Boosters in TPTC & TPTR are cheaper",
                cost: new Decimal(31),
                unlocked() { return hasUpgrade("tm",35); }, // The upgrade is only visible when this is true
            },
			13: {
				title: "Super-Booster Upgrade 13",
                description: "Super-Boosters in TPTC & TPTR are cheaper",
                cost: new Decimal(48),
                unlocked() { return hasUpgrade("tm",35); }, // The upgrade is only visible when this is true
            },
			14: {
				title: "Super-Booster Upgrade 14",
                description: "Super-Booster upgrade 11 is better.",
                cost: new Decimal(70),
                unlocked() { return hasUpgrade("tm",35); }, // The upgrade is only visible when this is true
            },
			15: {
				title: "Super-Booster Upgrade 15",
                description: "Magic Upgrade 15 is better.",
                cost: new Decimal(81),
                unlocked() { return hasUpgrade("tm",56); }, // The upgrade is only visible when this is true
            },
	 }
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
		if(hasUpgrade('tptc_sg',13))return new Decimal(10);
		if(hasUpgrade('dynas_c',25))return new Decimal(30);
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
                        {}],"upgrades"
				],
	effect() {
		if(inChallenge("tptc_ge",12)||inChallenge("tptc_h",31))return new Decimal(0);
		let ret = player.tptc_sg.points;
		let base = new Decimal(2);
		base=base.mul(tmp.tptc_m.clickables[13].effect);
		if(player.tptc_ge.challenges[12])base = base.mul(tmp.tptc_ge.challenges[12].rewardEffect);
		base = base.mul(tmp.tptr_sg.effect[1]);
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
		if(hasUpgrade("tptc_p",44))return player.tptc_sg.power.add(1);
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
	 upgrades: {
            rows: 1,
            cols: 5,
			11: {
				title: "Super-Generator Upgrade 11",
                description: "Super-Generators in TPTR are cheaper",
                cost: new Decimal(42),
                unlocked() { return hasUpgrade("tm",31); }, // The upgrade is only visible when this is true
            },
			12: {
				title: "Super-Generator Upgrade 12",
                description: "Super-Generators in TPTR are cheaper",
                cost: new Decimal(43),
                unlocked() { return hasUpgrade("tm",35); }, // The upgrade is only visible when this is true
            },
			13: {
				title: "Super-Generator Upgrade 13",
                description: "Super-Generators are cheaper.",
                cost: new Decimal(73),
                unlocked() { return hasUpgrade("tm",35); }, // The upgrade is only visible when this is true
            },
			14: {
				title: "Super-Generator Upgrade 14",
                description: "Super-Generators in TPTR are cheaper",
                cost: new Decimal(79),
                unlocked() { return hasUpgrade("tm",35); }, // The upgrade is only visible when this is true
            },
			15: {
				title: "Super-Generator Upgrade 15",
                description: "Hyperspace Upgrade 12 is better.",
                cost: new Decimal(81),
                unlocked() { return hasUpgrade("tm",56); }, // The upgrade is only visible when this is true
            },
	 }
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
            rows: 3,
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
					ret=ret.mul(tmp.tptr_h.effect[1]);
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
		    21: {
                name: "Disabled Boosters/Generators",
                completionLimit: 1,
			    challengeDescription() {
					return "Boosters and Generators has no effect.";
				},
                unlocked() { return hasChallenge("tptr_h", 11) },
                goal: function(){
					return new Decimal("e24250000");
				},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardDescription() { 
					return "Generator Power Effect ^1.042"
				},
            },
		    22: {
                name: "First 2 rows are useless",
                completionLimit: 1,
			    challengeDescription() {
					return "You can't gain any Prestige Points. Boosters and Generators has no effect.";
				},
                unlocked() { return hasChallenge("tptr_h", 12) },
                goal: function(){
					return new Decimal("e24900000");
				},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardDescription() { 
					return "Generator Power Effect ^1.2"
				},
				countsAs: [12,21]
            },
		    31: {
                name: "Disabled Super-Boosters/Super-Generators",
                completionLimit: 1,
			    challengeDescription() {
					return "Super-Boosters and Super-Generators do nothing.";
				},
                unlocked() { return hasChallenge("tptr_h", 41) },
                goal: function(){
					return new Decimal("e407e8");
				},
                currencyDisplayName: "points",
                currencyInternalName: "points",
                rewardDescription() { 
					return "Super-Boosters and Super-Generators in TPTR are cheaper."
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
                title: "Quirk Layers", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2, x.pow(2))
					return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					if(inChallenge("tptc_ge",22))return new Decimal(0);
					let base=new Decimal(player.timePlayed);
					base=base.mul(tmp.tptc_m.clickables[12].effect);
					base=base.mul(tmp.tptr_q.effect);
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
		if (player.tptr_ss.unlocked)base = base.mul(tmp.tptr_ss.effect[1]);
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
							if(hasUpgrade("tptc_hs",25))return 'You have ' + format(player.tptc_ss.subspace) + ' Subspace, which are raising effects of Space Buildings 1-7 to a power of '+ format(tmp.tptc_ss.ssEff)+', and multiplying effects of Space Buildings 8-10 by '+ format(tmp.tptc_ss.ssEff)
							if(hasUpgrade("tptc_hs",24))return 'You have ' + format(player.tptc_ss.subspace) + ' Subspace, which are raising effects of Space Buildings 1-7 to a power of '+ format(tmp.tptc_ss.ssEff)+', and multiplying effects of Space Buildings 8-9 by '+ format(tmp.tptc_ss.ssEff)
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
		base=base.add(tmp.tptr_o.effect3.sub(1));
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
				15: new Decimal(0),
				16: new Decimal(0),
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
					["display-text","Casting a spell costs 1 magic. Effect of spells are based on your magic and hexes."],
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
            cols: 6,
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
					let ret=Decimal.pow(10,Decimal.log10(player.tptc_m.points.add(1).mul(player.tptc_m.hexes.add(1)).max(1)).add(2).mul(2).pow(0.9));
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
					let ret=Decimal.pow(1.1,Decimal.log10(player.tptc_m.points.add(1).mul(player.tptc_m.hexes.add(1)).max(1)).add(2).mul(2).pow(0.5));
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
					let ret=Decimal.pow(1.1,Decimal.log10(player.tptc_m.points.add(1).mul(player.tptc_m.hexes.add(1)).max(1)).add(2).pow(0.3)).min(50000);
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
					let ret=Decimal.pow(1.5,Decimal.log10(player.tptc_m.points.add(1).mul(player.tptc_m.hexes.add(1)).max(1)).add(2).pow(0.4));
					ret=ret.pow(tmp.tptc_mb.buyables[11].effect);
					return ret;
				},
				display(){
					return "Multiply 2nd row of Prestige Upgrades by "+format(layers.tptc_m.clickables[14].realEffect())+"\n\
					Time: "+formatTime(player.tptc_m.spellTimes[14].max(0));
				},
                style: {'height':'160px','width':'200px'},
			},
			15: {
				title: "Spell of Multitree B",
				unlocked(){return hasUpgrade("tptc_m",12)},
				canClick(){return player.tptc_m.points.gte(1) && player.tptc_m.spellTimes[15].lte(0)},
				onClick(){
					player.tptc_m.points=player.tptc_m.points.sub(1);
					player.tptc_m.hexes=player.tptc_m.hexes.add(1);
					player.tptc_m.spellTimes[15]=new Decimal(60);
				},
				effect(){
					if(player.tptc_m.spellTimes[15].lte(0))return new Decimal(1);
					return layers.tptc_m.clickables[15].realEffect();
				},
				realEffect(){
					let ret=Decimal.pow(2,Decimal.log10(player.tptc_m.points.add(1).mul(player.tptc_m.hexes.add(1)).max(1)).add(2).pow(0.1));
					if(hasUpgrade("tptc_p",42))ret=Decimal.pow(1.5,Decimal.log10(player.tptc_m.points.add(1).mul(player.tptc_m.hexes.add(1)).max(1)).add(2).pow(0.4));
					ret=ret.pow(tmp.tptc_mb.buyables[11].effect);
					return ret;
				},
				display(){
					return "Multiply Prestige Upgrade 32 by "+format(layers.tptc_m.clickables[15].realEffect())+"\n\
					Time: "+formatTime(player.tptc_m.spellTimes[15].max(0));
				},
                style: {'height':'160px','width':'200px'},
			},
			16: {
				title: "Spell of Rewritten",
				unlocked(){return hasUpgrade("tptc_m",14)},
				canClick(){return player.tptc_m.points.gte(1) && player.tptc_m.spellTimes[16].lte(0)},
				onClick(){
					player.tptc_m.points=player.tptc_m.points.sub(1);
					player.tptc_m.hexes=player.tptc_m.hexes.add(1);
					player.tptc_m.spellTimes[16]=new Decimal(60);
				},
				effect(){
					if(player.tptc_m.spellTimes[16].lte(0))return new Decimal(1);
					return layers.tptc_m.clickables[16].realEffect();
				},
				realEffect(){
					let ret=Decimal.pow(1.5,Decimal.log10(player.tptc_m.points.add(1).mul(player.tptc_m.hexes.add(1)).max(1)).add(2).pow(0.2));
					ret=ret.pow(tmp.tptc_mb.buyables[11].effect);
					return ret;
				},
				display(){
					return "Multiply Effective Magic in Spells in TPTR by "+format(layers.tptc_m.clickables[16].realEffect())+"\n\
					Time: "+formatTime(player.tptc_m.spellTimes[16].max(0));
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
			if(hasUpgrade("tptc_m",13))player.tptr_m.hexes=player.tptr_m.hexes.add(upgradeEffect("tptc_m",13).mul(diff));
		},
	hexEff() {
		let eff = player.tptc_m.hexes.mul(20).add(1).pow(0.4);
		return eff;
	},
		upgrades: {
            rows: 1,
            cols: 5,
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
			12: {
				title: "Magic Upgrade 12",
                description: "Unlock a new spell.",
                cost: new Decimal("ee5"),
                unlocked() { return hasUpgrade("tm",23); }, // The upgrade is only visible when this is true
            },
			13: {
				title: "Magic Upgrade 13",
                description(){
					return "Gain hexes based on your magic AGAIN, but this time... in TPTR!";
				},
                cost: new Decimal("e6e6"),
                unlocked() { return hasUpgrade("tm",56); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let ret=player.tptr_m.points.add(1);
					if(ret.gte("e25000000"))ret = Decimal.pow(10,ret.log10().div(25000000).cbrt().mul(25000000));
					return ret;
                },
                effectDisplay() { return "+"+format(this.effect())+"/sec" }, // Add formatting to the effect
            },
			14: {
				title: "Magic Upgrade 14",
                description: "Unlock a new spell.",
                cost: new Decimal("e15e7"),
                unlocked() { return hasUpgrade("tm",56); }, // The upgrade is only visible when this is true
            },
			15: {
				title: "Magic Upgrade 15",
                description: "Spell 3 boost Super-Boosters at a reduced rate.",
                cost: new Decimal("e3e9"),
                unlocked() { return hasUpgrade("tm",56); }, // The upgrade is only visible when this is true
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
		if(hasUpgrade("tptc_l",25)){
			ret.pos=ret.neg=player.tptc_ba.points;
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
		eff = eff.pow(tmp.tptr_ba.effect);
		return eff;
	},
	negEff() {
		let eff = player.tptc_ba.neg.add(1).log10().add(1).pow(2);
		if(player.tptc_mb.buyables[12].gte(1))eff=eff.pow(buyableEffect("tptc_l",15));
		eff = eff.pow(tmp.tptr_ba.effect);
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
            cols: 5,
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
                    let ret = Decimal.pow(base,Decimal.log10(player.tptc_sp.points.mul(2).add(3)).pow(hasUpgrade("tptc_sp",32)?0.91:0.9));
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
                    if (ret.gte("1e21000000")) ret = Decimal.pow(10,ret.log10().div(2.1).log10().mul(3e6));
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
                    if (ret.lte(player.tptc_sp.points.pow(2)) && hasUpgrade("tptc_sp",25)) ret = player.tptc_sp.points.pow(2);
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
			32: {
				title: "Super-Prestige Upgrade 32",
                description: "Super-Prestige Upgrade 12's effect is better",
                cost: new Decimal("e13e8"),
                unlocked() { return hasUpgrade("tm", 42); },
            },
			33: {
				title: "Super-Prestige Upgrade 33",
                description: "Prestige Upgrade 12's effect is better",
                cost: Decimal.pow(10,Math.sqrt(2e18)),
                unlocked() { return hasUpgrade("tm", 42); },
            },
			14: {
				title: "Super-Prestige Upgrade 14",
                description: "The base effect of 2nd row of Prestige Upgrades ^1.25",
                cost: new Decimal("e15e8"),
                unlocked() { return hasUpgrade("tm", 42); },
            },
			24: {
				title: "Super-Prestige Upgrade 24",
                description: "Super-Boosters are cheaper.",
                cost: new Decimal("e18e8"),
                unlocked() { return hasUpgrade("tm", 42); },
            },
			34: {
				title: "Super-Prestige Upgrade 34",
                description: "The base effect of Prestige Upgrade 32 ^1.25",
                cost: new Decimal("e12e9"),
                unlocked() { return hasUpgrade("tm", 42); },
            },
			15: {
				title: "Super-Prestige Upgrade 15",
                description: "The base effect of 2nd row of Prestige Upgrades ^1.25",
                cost: new Decimal("e26e10"),
                unlocked() { return hasUpgrade("tptr_hn", 31); },
            },
			25: {
				title: "Super-Prestige Upgrade 25",
                description: "Super-Prestige Upgrade 23 is better.",
                cost: new Decimal("e29e10"),
                unlocked() { return hasUpgrade("tptr_hn", 31); },
            },
			35: {
				title: "Super-Prestige Upgrade 35",
                description: "The base effect of Prestige Upgrade 32 ^1.25",
                cost: new Decimal("e75e10"),
                unlocked() { return hasUpgrade("tptr_hn", 31); },
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
		base=base.mul(tmp.tptr_ps.effect);
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
		 if(hasUpgrade("tptc_l",11)){
			 if(player.tptc_ps.points.gte(layers.tptc_l.buyables[11].cost())){
				 player.tptc_l.buyables[11]=player.tptc_ps.points.add(1);
			 }
		 }
		 if(hasUpgrade("tptc_l",12)){
			 if(player.tptc_ps.points.gte(layers.tptc_l.buyables[12].cost())){
				 if(hasUpgrade("tptc_l",21))player.tptc_l.buyables[12]=player.tptc_ps.points.add(1);
				 else player.tptc_l.buyables[12]=player.tptc_ps.points.root(1.1).div(1.5).floor().add(1);
			 }
		 }
		 if(hasUpgrade("tptc_l",13)){
			 if(player.tptc_ps.points.gte(layers.tptc_l.buyables[13].cost())){
				 if(hasUpgrade("tptc_l",24))player.tptc_l.buyables[13]=player.tptc_ps.points.add(1);
				 else player.tptc_l.buyables[13]=player.tptc_ps.points.root(1.2).div(2).floor().add(1);
			 }
		 }
		 if(hasUpgrade("tptc_l",14)){
			 if(player.tptc_ps.points.gte(layers.tptc_l.buyables[14].cost())){
				 if(hasUpgrade("tptc_l",23))player.tptc_l.buyables[14]=player.tptc_ps.points.add(1);
				 else player.tptc_l.buyables[14]=player.tptc_ps.points.root(1.2).floor().add(1);
			 }
		 }
		 if(player.tptc_mb.buyables[12].gte(1)){
			 if(player.tptc_ps.points.gte(layers.tptc_l.buyables[15].cost())){
				 if(hasUpgrade("tptc_l",22))player.tptc_l.buyables[15]=player.tptc_ps.points.add(1);
				 else player.tptc_l.buyables[15]=player.tptc_ps.points.div(2).floor().add(1);
			 }
		 }
		 if(player.tptc_mb.buyables[12].gte(2)){
			 if(player.tptc_ps.points.gte(layers.tptc_l.buyables[16].cost())){
				 player.tptc_l.buyables[16]=player.tptc_ps.points.root(1.4).div(2).floor().add(1);
			 }
		 }
		 if(player.tptc_mb.buyables[12].gte(3)){
			 if(player.tptc_ps.points.gte(layers.tptc_l.buyables[17].cost())){
				 player.tptc_l.buyables[17]=player.tptc_ps.points.root(1.5).floor().add(1);
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
			21: {
				title: "Life Upgrade 21",
                description: "Life Booster 2 is cheaper.",
                cost: new Decimal("e569e6"),
                unlocked() { return hasUpgrade("tptr_hn",31); }, // The upgrade is only visible when this is true
            },
			22: {
				title: "Life Upgrade 22",
                description: "Life Booster 5 is cheaper.",
                cost: new Decimal("e599e6"),
                unlocked() { return hasUpgrade("tptr_hn",31); }, // The upgrade is only visible when this is true
            },
			23: {
				title: "Life Upgrade 23",
                description: "Life Booster 4 is cheaper & effect is better.",
                cost: new Decimal("e631e6"),
                unlocked() { return hasUpgrade("tptr_hn",31); }, // The upgrade is only visible when this is true
            },
			24: {
				title: "Life Upgrade 24",
                description: "Life Booster 3 is cheaper.",
                cost: new Decimal("e75e7"),
                unlocked() { return hasUpgrade("tptr_hn",31); }, // The upgrade is only visible when this is true
            },
			25: {
				title: "Life Upgrade 25",
                description: "Life Booster 5 is better, and Positivity/Negativity gain is better.",
                cost: new Decimal("ee9"),
                unlocked() { return hasUpgrade("tptr_hn",31); }, // The upgrade is only visible when this is true
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
					if(hasUpgrade("tptc_l",21))return x;
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
					if(hasUpgrade("tptc_l",24))return x;
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
					if(hasUpgrade("tptc_l",23))return x;
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
					if(hasUpgrade("tptc_l",23))return Decimal.pow(10,x.add(1).log10().pow(2.5));
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
					if(hasUpgrade("tptc_l",22))return x;
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
					ret=x.add(1).pow(0.7);
					if(hasUpgrade("tptc_l",25))if(ret.gte(Decimal.pow(2,16))){
						ret=ret.log2().div(16).pow(0.82).mul(5).add(11);
						ret=Decimal.pow(2,ret);
					}else if(ret.gte(Decimal.pow(2,15))){
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
		if(hasUpgrade("tptc_hs",21))ret=new Decimal(3).add(player.tptc_hs.upgrades.length);
		if(hasUpgrade("tptc_hs",11))ret=ret.add(upgradeEffect("tptc_hs",11));
		if(hasUpgrade("tptc_hs",12))ret=ret.add(upgradeEffect("tptc_hs",12));
		if(hasUpgrade("tptc_i",11))ret=ret.add(upgradeEffect("tptc_i",11));
		if(player.tptc_mb.buyables[13].gte(2))ret=ret.add(buyableEffect("tptc_ma",12));
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
					["display-text",function(){if(player.tm.buyables[1].lt(20))return "Upgrade the tree to increase the progress.";return "";}],
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
            rows: 2,
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
					if(hasUpgrade("tptc_sg",15))ret=ret.max(player.tptc_sg.points.pow(2).div(3000));
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
			21: {
				title: "Hyperspace Upgrade 21",
                description: "Hyperspace Upgrades add to Hyper Building Limit Upgrade Progress.",
                cost: new Decimal("4e449"),
                unlocked() { return hasUpgrade("tptr_hn",31); }, // The upgrade is only visible when this is true
            },
			22: {
				title: "Hyperspace Upgrade 22",
                description: "Space Building 9 is better.",
                cost: new Decimal("1e453"),
                unlocked() { return hasUpgrade("tptr_hn",31); }, // The upgrade is only visible when this is true
            },
			23: {
				title: "Hyperspace Upgrade 23",
                description: "Space Building 9 is better.",
                cost: new Decimal("1e460"),
                unlocked() { return hasUpgrade("tptr_hn",31); }, // The upgrade is only visible when this is true
            },
			24: {
				title: "Hyperspace Upgrade 24",
                description: "Subspace boost Space Building 9.",
                cost: new Decimal("1e478"),
                unlocked() { return hasUpgrade("tptr_hn",31); }, // The upgrade is only visible when this is true
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
					if(player.tptc_i.buyables[11].gte(6)||hasUpgrade("tptc_i",12)){
						ret=ret+"<br>Space Building 1's effect ^"+format(tmp.tptc_i.buyables[11].effect[11])+((player.tptc_i.buyables[11].sub(6).toNumber()%8==0&&!hasUpgrade("tptc_i",12))?" (Next Effect)":"");
					}
					if(player.tptc_i.buyables[11].gte(7)||hasUpgrade("tptc_i",12)){
						ret=ret+"<br>Space Building 2's effect ^"+format(tmp.tptc_i.buyables[11].effect[12])+((player.tptc_i.buyables[11].sub(7).toNumber()%8==0&&!hasUpgrade("tptc_i",12))?" (Next Effect)":"");
					}
					if(player.tptc_i.buyables[11].gte(8)||(hasUpgrade("tptc_i",12)&&player.tptc_i.buyables[11].gte(1))){
						ret=ret+"<br>Space Building 3's effect ^"+format(tmp.tptc_i.buyables[11].effect[13])+((player.tptc_i.buyables[11].sub(8).toNumber()%8==0&&!hasUpgrade("tptc_i",12))?" (Next Effect)":"");
					}
					if(player.tptc_i.buyables[11].gte(9)||(hasUpgrade("tptc_i",12)&&player.tptc_i.buyables[11].gte(2))){
						ret=ret+"<br>Space Building 4's effect ^"+format(tmp.tptc_i.buyables[11].effect[14])+((player.tptc_i.buyables[11].sub(9).toNumber()%8==0&&!hasUpgrade("tptc_i",12))?" (Next Effect)":"");
					}
					if(player.tptc_i.buyables[11].gte(10)||(hasUpgrade("tptc_i",12)&&player.tptc_i.buyables[11].gte(3))){
						ret=ret+"<br>Space Building 5's effect ^"+format(tmp.tptc_i.buyables[11].effect[15])+((player.tptc_i.buyables[11].sub(10).toNumber()%8==0&&!hasUpgrade("tptc_i",12))?" (Next Effect)":"");
					}
					if(player.tptc_i.buyables[11].gte(11)||(hasUpgrade("tptc_i",12)&&player.tptc_i.buyables[11].gte(4))){
						ret=ret+"<br>Space Building 6's effect ^"+format(tmp.tptc_i.buyables[11].effect[16])+((player.tptc_i.buyables[11].sub(11).toNumber()%8==0&&!hasUpgrade("tptc_i",12))?" (Next Effect)":"");
					}
					if(player.tptc_i.buyables[11].gte(12)||(hasUpgrade("tptc_i",12)&&player.tptc_i.buyables[11].gte(5))){
						ret=ret+"<br>Space Building 7's effect ^"+format(tmp.tptc_i.buyables[11].effect[17])+((player.tptc_i.buyables[11].sub(12).toNumber()%8==0&&!hasUpgrade("tptc_i",12))?" (Next Effect)":"");
					}
					if(player.tptc_i.buyables[11].gte(13)||(hasUpgrade("tptc_i",12)&&player.tptc_i.buyables[11].gte(6))){
						ret=ret+"<br>Space Building 8's effect is multiplied by "+format(tmp.tptc_i.buyables[11].effect[18])+((player.tptc_i.buyables[11].sub(13).toNumber()%8==0&&!hasUpgrade("tptc_i",12))?" (Next Effect)":"");
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
					if(hasUpgrade("tptc_i",12))return {
						11: player.tptc_i.buyables[11].div(75).add(1),
						12: player.tptc_i.buyables[11].div(75).add(1),
						13: player.tptc_i.buyables[11].div(75).add(1),
						14: player.tptc_i.buyables[11].div(75).add(1),
						15: player.tptc_i.buyables[11].div(75).add(1),
						16: player.tptc_i.buyables[11].div(75).add(1),
						17: player.tptc_i.buyables[11].div(75).add(1),
						18: player.tptc_i.buyables[11].div(75).add(1),
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
						if(player.tptc_i.buyables[11].gte(hasUpgrade("tptc_i",12)?6:13))return '372px';
						if(player.tptc_i.buyables[11].gte(hasUpgrade("tptc_i",12)?5:12))return '342px';
						if(player.tptc_i.buyables[11].gte(hasUpgrade("tptc_i",12)?4:11))return '312px';
						if(player.tptc_i.buyables[11].gte(hasUpgrade("tptc_i",12)?3:10))return '282px';
						if(player.tptc_i.buyables[11].gte(hasUpgrade("tptc_i",12)?2:9))return '252px';
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
			12: {
				title: "Imperium Upgrade 12",
                description: "Imperium Building is better.",
                cost: new Decimal(4269),
                unlocked() { return true; }, // The upgrade is only visible when this is true
            },
			13: {
				title: "Imperium Upgrade 13",
                description: "Imperium Bricks boost Machine Power gain.",
                cost: new Decimal(10000),
                unlocked() { return player.tm.buyables[1].gte(20); }, // The upgrade is only visible when this is true
				effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
					let ret=player.tptc_i.points.add(1).pow(2);
					return ret;
                },
                effectDisplay() { return "x"+format(this.effect().mul(100)) }, // Add formatting to the effect
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
            7: {requirementDescription: "59 Mastery Bricks",
                done() {return player[this.layer].best.gte(59)}, // Used to determine when to give the milestone
                effectDescription: "Mastery Building 2 is cheaper, and effect is better.",
            },
            8: {requirementDescription: "66 Mastery Bricks",
                done() {return player[this.layer].best.gte(66)}, // Used to determine when to give the milestone
                effectDescription: "Mastery Building 1 effect is better.",
            },
            9: {requirementDescription: "79 Mastery Bricks",
                done() {return player[this.layer].best.gte(79)}, // Used to determine when to give the milestone
                effectDescription: "Autobuy Mastery Bricks and Mastery Buildings. Mastery Building 3 is cheaper, and effect is better.",
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
                unlocked() { return player[this.layer].unlocked && player[this.layer].best.lt(79)}, 
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
					if(player.tptc_mb.buyables[11].gte(3) || player[this.layer].best.gte(66)){
						ret=ret+"<br>Spell Effects ^"+format(data.effect);
					}
					return ret;
                },
				effect() {
					let ret=player.tptc_mb.buyables[11].sub(3).max(0).mul(0.01).add(1);
					if(player[this.layer].best.gte(66))ret=player.tptc_mb.buyables[11].max(0).mul(0.02).add(1);
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
					if(player[this.layer].best.gte(59))cost = x.plus(1);
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
					if(player.tptc_mb.buyables[12].gte(3) || player[this.layer].best.gte(59)){
						ret=ret+"<br>Phantom Soul base is multiplied by "+format(data.effect);
					}
					return ret;
                },
				effect() {
					let ret=player.tptc_mb.buyables[12].sub(3).max(0).pow(0.2).add(1);
					if(player[this.layer].best.gte(59))ret=player.tptc_mb.buyables[12].max(0).add(1);
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
                    let cost = x.mul(9).plus(36);
					if(player[this.layer].best.gte(79))cost = x.plus(1);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    let ret="Level: "+formatWhole(player.tptc_mb.buyables[13])+"<br>"+
					"Req: "+formatWhole(data.cost)+" mastery bricks<br>"+
					"Unlocked "+formatWhole(player.tptc_mb.buyables[13].min(5))+" new machines"+(player.tptc_mb.buyables[13].gte(5)?" (MAX)":" (Next at "+formatWhole(data.nextat)+")");
					if(player[this.layer].best.gte(79)){
						ret=ret+"<br>Machine effects are multiplied by "+format(data.effect);
					}
					return ret;
                },
				effect() {
					if(!player[this.layer].best.gte(79))return new Decimal(1);
					let ret=player.tptc_mb.buyables[13].max(0).add(1).log10().add(1);
					return ret;
                },
				nextat() {
					let ret=player.tptc_mb.buyables[13].add(1);
					if(ret.gte(6))return new Decimal(9999);
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
		 return player.tptc_mb.best.gte(79);
	 },resetsNothing(){
		 return player.tptc_mb.best.gte(40);
	 },update(diff){
		 if(player.tptc_mb.best.gte(79)){
			 player[this.layer].buyables[11]=player[this.layer].buyables[12]=player[this.layer].buyables[13]=player[this.layer].points;
		 };
	 }
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
					return "Effects of point gain multiplier upgrades and buyables from other trees ^0.001";
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
					if(hasUpgrade("tptc_ge",14))b=b.pow(2);
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
			14: {
				title: "Gear Upgrade 14",
                description: "Gear Upgrade 11's effect ^2",
                cost: new Decimal("ee9"),
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
		if(hasUpgrade("tptc_i",13))ret=ret.mul(upgradeEffect("tptc_i",13));
		if(player.tptc_mb.buyables[13].gte(3))ret=ret.mul(buyableEffect("tptc_ma",13));
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
            cols: 5,
            11: {
                title: "Machine 1", // Optional, displayed at the top in a larger font
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Imperium Building is "+format(data.effect)+"x cheaper";
                },
				effect(){
					if(player.tptc_mb.buyables[13].lt(1))return new Decimal(1);
					let x=player.tptc_ma.points.add(1).log10().add(1);
					return x.pow(0.2).mul(tmp.tptc_mb.buyables[13].effect);
				},
                unlocked() { return player.tptc_mb.buyables[13].gte(1) }, 
                canAfford() {
					return false;
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px','background-color':'#9f9f9f'},
            },
            12: {
                title: "Machine 2", // Optional, displayed at the top in a larger font
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return "Add "+format(data.effect.mul(100))+"% to Hyper Building Limit Progress";
                },
				effect(){
					if(player.tptc_mb.buyables[13].lt(2))return new Decimal(0);
					let x=player.tptc_ma.points.add(1).log10();
					return x.pow(0.5).div(10).mul(tmp.tptc_mb.buyables[13].effect);
				},
                unlocked() { return player.tptc_mb.buyables[13].gte(2) }, 
                canAfford() {
					return false;
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px','background-color':'#9f9f9f'},
            },
            13: {
                title: "Machine 3", // Optional, displayed at the top in a larger font
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return format(data.effect)+"x Machine Power gain";
                },
				effect(){
					if(player.tptc_mb.buyables[13].lt(3))return new Decimal(1);
					let x=player.tptc_ma.points;
					return x.pow(0.1).mul(tmp.tptc_mb.buyables[13].effect);
				},
                unlocked() { return player.tptc_mb.buyables[13].gte(3) }, 
                canAfford() {
					return false;
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px','background-color':'#9f9f9f'},
            },
            14: {
                title: "Machine 4", // Optional, displayed at the top in a larger font
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return format(data.effect)+"x to 2nd row of Prestige Upgrades";
                },
				effect(){
					if(player.tptc_mb.buyables[13].lt(4))return new Decimal(1);
					let x=player.tptc_ma.points;
					return x.pow(10).mul(tmp.tptc_mb.buyables[13].effect);
				},
                unlocked() { return player.tptc_mb.buyables[13].gte(4) }, 
                canAfford() {
					return false;
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px','background-color':'#9f9f9f'},
            },
            15: {
                title: "Machine 5", // Optional, displayed at the top in a larger font
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
                    return format(data.effect)+"x Rewritten Point gain in TPTR";
                },
				effect(){
					if(player.tptc_mb.buyables[13].lt(5))return new Decimal(1);
					let x=player.tptc_ma.points;
					return x.pow(100).mul(tmp.tptc_mb.buyables[13].effect);
				},
                unlocked() { return player.tptc_mb.buyables[13].gte(5) }, 
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

