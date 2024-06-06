
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
    type(){
		if(hasUpgrade("gd_u",41))return "normal";
		return "static";
	}, // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	base: 5,
    exponent: 0.5, // Prestige currency exponent
    resetDescription: "Release new build for ",
    gainMult() { // Calculate the multiplier for main currency from bonuses
		if(!hasUpgrade("gd_u",41))return this.gainMult2();return this.gainMult3();
    },
    gainMult2() {
        mult = new Decimal(1)
		if(hasUpgrade("gd_e",11) && !hasUpgrade("gd_u",44))mult=mult.div(upgradeEffect("gd_e",11));
		if(!hasUpgrade("gd_u",45))mult = mult.div(tmp.gd_f.buyables[14].effect);
		if(hasUpgrade("tptc_p",25))mult=mult.div(upgradeEffect("tptc_p",25));
		if(hasUpgrade("gd_g",15) && hasUpgrade("gd_l",13) && !hasUpgrade("gd_u", 43))mult = mult.div(upgradeEffect("gd_l",13));
		return mult
    },
    gainMult3() {
        mult = this.gainMult2();
		if(!hasUpgrade("gd_u",51))mult=mult.recip().log10().sqrt().add(1);
		else {
			mult=Decimal.pow(10,upgradeEffect("tptc_p",25).add(1e10).log10().pow(0.1).add(1));
		}
		if(hasUpgrade("gd_g",15) && hasUpgrade("gd_l",13) && hasUpgrade("gd_u", 43))mult = mult.mul(upgradeEffect("gd_u", 43));
		if(hasUpgrade("gd_e",11) && hasUpgrade("gd_u",44))mult = mult.mul(upgradeEffect("gd_u",44));
		if(hasUpgrade("gd_u",45))mult = mult.mul(upgradeEffect("gd_u",45));
		if(player.milestone_m.best.gte(29))mult = mult.mul(tmp.milestone_m.milestone29Effect);
		return mult;
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
	getResetGain() {
		if(!hasUpgrade("gd_u",41))return getResetGain(this.layer,"static");
		let ret=player.modpoints[6];
		if(ret.lt(5))return new Decimal(0);
		ret=ret.log10().pow(2).mul(tmp.gd_u.gainMult3).floor();
		return ret;
	},
	getNextAt(a) {
		if(!hasUpgrade("gd_u",41))return getNextAt(this.layer,a,"static");
		let ret=tmp.gd_u.getResetGain.plus(1);
		ret=ret.div(tmp.gd_u.gainMult3);
		ret=ret.pow(1/(2));
		ret=Decimal.pow(10,ret).max(5);
		return ret;
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
            rows: 5,
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
					if(hasUpgrade("gd_r",25))ret = ret.mul(tmp.gd_t.effect);
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
					if(hasUpgrade("gd_a",13)&&hasUpgrade("gd_r",33))ret=player.gd_u.points.add(1).pow(10);
					if(hasUpgrade("gd_a",13)&&hasUpgrade("gd_r",32))ret=ret.pow(100);
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
					if(hasUpgrade("gd_u",54))ret=ret.pow(2);
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
					if(hasUpgrade("gd_e",34))ret = player.modpoints[6].add(1).pow(1000);
					if(hasUpgrade("gd_u",25))ret=ret.pow(2);
					if(hasUpgrade("gd_u",33))ret=ret.pow(2);
					if(hasUpgrade("gd_c",23))ret=ret.pow(1.25);
					if(hasUpgrade("gd_e",24))ret=ret.pow(2);
					if(hasUpgrade("gd_u",55))ret=ret.pow(10);
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
			41: {
				title: "Update Upgrade 41",
                description: "You can constantly release updates now! This upgrade can change The Game Dev Tree!",
                cost: new Decimal(68e10),
                unlocked() { return hasUpgrade("tm",35); },
			},
			42: {
				title: "Update Upgrade 42",
                description: "The update auto-releaser is 100x faster.",
                cost: new Decimal(2e14),
                unlocked() { return hasUpgrade("tm",35); },
			},
			43: {
				title: "Update Upgrade 43",
                description: "Jean (Third TA) will actually increase update gain based on updates and his level, instead of reducing update requirement",
                cost: new Decimal(4e16),
                unlocked() { return hasUpgrade("tm",35); },
				effect() {
                    let base=Decimal.log10(player.gd_u.points.add(10)).sqrt().mul(0.01).add(1);
                    return base.pow(player.gd_l.carmackLevel);
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			44: {
				title: "Update Upgrade 44",
                description: "Experience Upgrade 11 will increase update gain based on experience, instead of reducing update requirement",
                cost: new Decimal(6e18),
                unlocked() { return hasUpgrade("tm",35); },
				effect() {
                    let ret=Decimal.log10(player.gd_e.points.add(10)).pow(0.03);
					if(hasUpgrade("gd_e",21))ret = ret.pow(2);
					if(hasUpgrade("gd_e",31))ret = ret.pow(10);
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			45: {
				title: "Update Upgrade 45",
                description: "'Github' fame buyable will increase update gain based on fans, instead of reducing update requirement",
                cost: new Decimal(8e20),
                unlocked() { return hasUpgrade("tm",35); },
				effect() {
                    let ret=player.gd_f.fans.add(1e10).log10().add(1e10).log10().mul(player.gd_f.buyables[14].add(1)).pow(0.25).pow(layers.gd_g.effect()[1]);
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			51: {
				title: "Update Upgrade 51",
                description: "Gain more updates based on Prestige Upgrade 25 in TPTC.",
                cost: new Decimal(2e23),
                unlocked() { return hasUpgrade("gd_u",43)&&hasUpgrade("gd_u",44)&&hasUpgrade("gd_u",45); },
			},
			52: {
				title: "Update Upgrade 52",
                description: "Updates reduce requirements of 3rd row layers.",
                cost: new Decimal(1e25),
                unlocked() { return hasUpgrade("gd_u",51); },
				effect() {
                    let ret=player.gd_u.points.add(1).pow(5);
					return ret;
				},
                effectDisplay() { return "/"+format(this.effect()) }, // Add formatting to the effect
			},
			53: {
				title: "Update Upgrade 53",
                description: "Updates boost all rings in Time Flux layer.",
                cost: new Decimal(1e25),
                unlocked() { return hasUpgrade("gd_u",51); },
				effect() {
                    let ret=player.gd_u.points.pow(0.1);
					return ret;
				},
                effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
			},
			54: {
				title: "Update Upgrade 54",
                description: "Update Upgrade 14 is squared.",
                cost: new Decimal(1e25),
                unlocked() { return hasUpgrade("gd_u",51); },
			},
			55: {
				title: "Update Upgrade 55",
                description: "Update Upgrade 21's effect ^10",
                cost: new Decimal(1e25),
                unlocked() { return hasUpgrade("gd_u",51); },
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
		ret = ret.mul(tmp.gd_a.buyables[21].effect);
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
		canBuyMax() {return hasUpgrade("gd_c",12)&&!hasUpgrade("gd_u",41)},
	 autoPrestige(){
		 return hasUpgrade("gd_c",12)&&!hasUpgrade("gd_u",41);
	 },resetsNothing(){
		 return hasUpgrade("gd_c",12);
	 },passiveGeneration(){
		 if(hasUpgrade("gd_u",42))return 100;
		 if(hasUpgrade("gd_u",41))return 1;
		 return 0;
	 },
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
                    ["blank", "5px"],
                    ["display-text",
                        function() {
							if(!hasUpgrade("gd_u",41))return '';
							if(hasUpgrade("gd_u",51))return 'Because Prestige Upgrade 25 in TPTC previously cheapens update by '+format(tmp.gd_u.gainMult2.recip())+', your update gain is multiplied by '+format(Decimal.pow(10,upgradeEffect("tptc_p",25).add(1e10).log10().pow(0.1).add(1)));
							if(hasUpgrade("gd_u",44)&&hasUpgrade("gd_u",45)&&hasUpgrade("gd_u",43))return 'Because Prestige Upgrade 25 in TPTC previously cheapens update by '+format(tmp.gd_u.gainMult2.recip())+', your update gain is multiplied by '+format(tmp.gd_u.gainMult2.recip().log10().sqrt().add(1));
							return 'Because your previous upgrades cheapens update by '+format(tmp.gd_u.gainMult2.recip())+', your update gain is multiplied by '+format(tmp.gd_u.gainMult2.recip().log10().sqrt().add(1));
						},
                        {}],
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
		if(hasUpgrade("gd_r",25))mult=mult.mul(tmp.gd_t.effect);
		if(hasUpgrade("incrementy_p",34))mult=mult.mul(10);
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
                description(){
					if(hasUpgrade("gd_u",44))return "Gain more updates based on your experience.";
					return "Updates are cheaper based on your experience.";
				},
                cost: new Decimal(3),
				effect() {
					if(hasUpgrade("gd_u",44))return upgradeEffect("gd_u",44);
					let ret = player.gd_e.points.add(1).pow(0.5);
					if(hasUpgrade("gd_e",21))ret = ret.pow(2);
					if(hasUpgrade("gd_e",31))ret = ret.pow(10);
					return ret;
				},
                effectDisplay() { if(hasUpgrade("gd_u",44))return format(this.effect())+"x"; return "/"+format(this.effect()) }, // Add formatting to the effect
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
					if(hasUpgrade("gd_e",25))ret = ret.pow(1.1363636363636363636363636363636);
					if(hasUpgrade("gd_e",32))ret = ret.pow(1.3333333333333333333333333333333);
					if(hasUpgrade("gd_e",33))ret = ret.pow(1.25);
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
			21: {
				title: "Experience Upgrade 21",
                description: "Experience Upgrade 11 is squared.",
                cost: new Decimal(1e300),
                unlocked() { return hasUpgrade("tm",25); },
			},
			22: {
				title: "Experience Upgrade 22",
                description: "Endpoints are cheaper.",
                cost: new Decimal("1e386"),
                unlocked() { return hasUpgrade("tm",25); },
			},
			23: {
				title: "Experience Upgrade 23",
                description: "Time Flux gain is better.",
                cost: new Decimal("1e391"),
                unlocked() { return hasUpgrade("tm",25); },
			},
			24: {
				title: "Experience Upgrade 24",
                description: "Update Upgrade 21 is squared.",
                cost: new Decimal("1e405"),
                unlocked() { return hasUpgrade("tm",25); },
			},
			25: {
				title: "Experience Upgrade 25",
                description: "Experience Upgrade 13 ^1.1364",
                cost: new Decimal("1e411"),
                unlocked() { return hasUpgrade("tm",25); },
			},
			31: {
				title: "Experience Upgrade 31",
                description: "Experience Upgrade 11 ^10",
                cost: new Decimal("1e540"),
                unlocked() { return hasUpgrade("tm",43); },
			},
			32: {
				title: "Experience Upgrade 32",
                description: "Experience Upgrade 13 ^1.3333",
                cost: new Decimal("1e545"),
                unlocked() { return hasUpgrade("tm",43); },
			},
			33: {
				title: "Experience Upgrade 33",
                description: "Experience Upgrade 13 ^1.25",
                cost: new Decimal("1e584"),
                unlocked() { return hasUpgrade("tm",43); },
			},
			34: {
				title: "Experience Upgrade 34",
                description: "Update Upgrade 21 is better.",
                cost: new Decimal("6.66e666"),
                unlocked() { return hasUpgrade("tm",43); },
			},
			35: {
				title: "Experience Upgrade 35",
                description: "Greatly Increase Time Flux gain.",
                cost: new Decimal("1e1333"),
                unlocked() { return hasUpgrade("tm",43); },
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
		if(hasUpgrade("gd_c",22))ret = ret.mul(1.1)
		if(hasUpgrade("gd_g",21) && hasUpgrade("gd_f",33))ret = ret.mul(1.5)
		return ret
	}, // Prestige currency exponent
    resetDescription: "Sell mod to publisher for ",
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(100)
		if(hasUpgrade("gd_e",13))mult = mult.mul(upgradeEffect("gd_e",13));
		mult = mult.mul(tmp.gd_f.buyables[12].effect);
		if(hasUpgrade("gd_g",14))mult = mult.mul(upgradeEffect("gd_g",14));
		if(hasUpgrade("gd_g",11) && hasUpgrade("gd_f",14))mult = mult.mul(upgradeEffect("gd_f",14));
		if(hasUpgrade("gd_r",25))mult=mult.mul(tmp.gd_t.effect);
		if(hasUpgrade("gd_g",15) && hasUpgrade("gd_l",11))mult = mult.mul(upgradeEffect("gd_l",11));
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
					if(hasUpgrade("gd_c",21))ret = ret.pow(2);
					if(hasUpgrade("gd_c",25))ret = ret.pow(2);
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
					if(hasUpgrade("gd_g",21) && hasUpgrade("gd_f",32))ret = ret.pow(1.1363636363636363636363636363636);
					if(hasUpgrade("gd_c",34))ret = ret.pow(1.333333333333333333333333);
					if(hasUpgrade("gd_f",34))ret = ret.pow(1.25);
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
			21: {
				title: "Cash Upgrade 21",
                description: "Cash Upgrade 11 is squared.",
                cost: new Decimal(1e216),
                unlocked() { return hasUpgrade("tm",25); },
			},
			22: {
				title: "Cash Upgrade 22",
                description: "Cash Exponent is multiplied by 1.1",
                cost: new Decimal(5e217),
                unlocked() { return hasUpgrade("tm",25); },
			},
			23: {
				title: "Cash Upgrade 23",
                description: "Update Upgrade 21 ^1.25",
                cost: new Decimal(2.22e222),
                unlocked() { return hasUpgrade("tm",25); },
			},
			24: {
				title: "Cash Upgrade 24",
                description: "Lectures gain is better.",
                cost: new Decimal(1e240),
                unlocked() { return hasUpgrade("tm",25); },
			},
			25: {
				title: "Cash Upgrade 25",
                description: "Cash Upgrade 11 is squared.",
                cost: new Decimal(1e275),
                unlocked() { return hasUpgrade("tm",25); },
			},
			31: {
				title: "Cash Upgrade 31",
                description: "Lecture Effect is better.",
                cost: new Decimal("1e450"),
                unlocked() { return hasUpgrade("tm",43); },
			},
			32: {
				title: "Cash Upgrade 32",
                description: "Reduce experience requirement of first 4 TAs.",
                cost: new Decimal("1e562"),
                unlocked() { return hasUpgrade("tm",43); },
			},
			33: {
				title: "Cash Upgrade 33",
                description: "Increase effects of first 4 TAs.",
                cost: new Decimal("1e575"),
                unlocked() { return hasUpgrade("tm",43); },
			},
			34: {
				title: "Cash Upgrade 34",
                description: "Cash Upgrade 13 ^1.3333",
                cost: new Decimal("1e900"),
                unlocked() { return hasUpgrade("tm",43); },
			},
			35: {
				title: "Cash Upgrade 35",
                description: "Greatly Increase Lectures gain.",
                cost: new Decimal("1e1333"),
                unlocked() { return hasUpgrade("tm",43); },
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
		if(hasUpgrade("gd_u",52))mult = mult.div(upgradeEffect("gd_u",52));
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
            rows: 3,
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
			25: {
				title: "Refactor Upgrade 25",
                description: "Unlock a layer.",
                cost: new Decimal(200),
				unlocked(){return hasUpgrade("gd_a",12);}
			},
			31: {
				title: "Refactor Upgrade 31",
                description: "Endpoints are cheaper.",
                cost: new Decimal(280),
				unlocked(){return hasUpgrade("gd_a",13);}
			},
			32: {
				title: "Refactor Upgrade 32",
                description: "Update Upgrade 13 ^100",
                cost: new Decimal(296),
				unlocked(){return hasUpgrade("gd_a",13);}
			},
			33: {
				title: "Refactor Upgrade 33",
                description: "Update Upgrade 13 is better.",
                cost: new Decimal(328),
				unlocked(){return hasUpgrade("gd_a",13);}
			},
			34: {
				title: "Refactor Upgrade 34",
                description: "Unlock an API buyable.",
                cost: new Decimal(360),
				unlocked(){return hasUpgrade("gd_a",12);}
			},
			35: {
				title: "Refactor Upgrade 35",
                description: "Greatly Increase Time Flux gain.",
                cost: new Decimal(531),
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
		if(hasUpgrade("gd_g",15) && hasUpgrade("gd_l",12))mult = mult.div(upgradeEffect("gd_l",12));
		if(hasUpgrade("gd_u",52))mult = mult.div(upgradeEffect("gd_u",52));
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
					return player.gd_f.fans.add(9).log10().pow(player[this.layer].buyables[this.id].sqrt().mul(0.1)).pow(layers.gd_g.effect()[1]).pow(hasUpgrade("gd_g",23)?0.2:1);
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            12: {
                title: "Patreon", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					let cost=x.mul(2).add(2);
					if(hasUpgrade("gd_g", 23))cost=x.add(1);
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
					if(hasUpgrade("gd_g", 23))cost=x.add(1);
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
					if(hasUpgrade("gd_g", 23))cost=x.add(1);
                    return cost
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					if(hasUpgrade("gd_u",45))
                    return "Fans boost update gain.\n\
					Accounts: "+formatWhole(player[this.layer].buyables[this.id])+"\n\
					Cost: "+formatWhole(data.cost)+" fame\n\
					Effect: " + format(data.effect) + "x update gain";
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
					if(hasUpgrade("gd_u",45))return upgradeEffect("gd_u",45);
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
					if(hasUpgrade("gd_g", 23))cost=x.add(1);
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
			if(hasUpgrade("gd_g", 23)){
				player.gd_f.buyables[12]=player.gd_f.buyables[12].max(player.gd_f.points);
				player.gd_f.buyables[13]=player.gd_f.buyables[13].max(player.gd_f.points);
				player.gd_f.buyables[14]=player.gd_f.buyables[14].max(player.gd_f.points);
				player.gd_f.buyables[15]=player.gd_f.buyables[15].max(player.gd_f.points);
			}else{
				player.gd_f.buyables[12]=player.gd_f.buyables[12].max(player.gd_f.points.div(2).floor());
				player.gd_f.buyables[13]=player.gd_f.buyables[13].max(player.gd_f.points.div(2).floor());
				player.gd_f.buyables[14]=player.gd_f.buyables[14].max(player.gd_f.points.div(3).floor());
				player.gd_f.buyables[15]=player.gd_f.buyables[15].max(player.gd_f.points.max(1).div(5).log(1.15).add(1).floor());
			}
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
			25: {
				title: "Fame Upgrade 25",
                description: "Unlock a new layer.",
                cost: new Decimal(110),
				unlocked(){return hasUpgrade("gd_g",15);}
			},
			31: {
				title: "Fame Upgrade 31",
                description: "Reduce the 5th TA's requirement.",
                cost: new Decimal(200),
				unlocked(){return hasUpgrade("gd_g",21);}
			},
			32: {
				title: "Fame Upgrade 32",
                description: "Cash Upgrade 13's effect ^1.1364",
                cost: new Decimal(300),
				unlocked(){return hasUpgrade("gd_g",15);}
			},
			33: {
				title: "Fame Upgrade 33",
                description: "Cash Exponent is multiplied by 1.5",
                cost: new Decimal(350),
				unlocked(){return hasUpgrade("gd_g",15);}
			},
			34: {
				title: "Fame Upgrade 34",
                description: "Cash Upgrade 13's effect ^1.25",
                cost: new Decimal(400),
				unlocked(){return hasUpgrade("gd_g",15);}
			},
			35: {
				title: "Fame Upgrade 35",
                description: "Greatly Increase Lectures gain.",
                cost: new Decimal(440),
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
		if(hasUpgrade("gd_g",15) && hasUpgrade("gd_l",14))mult = mult.div(upgradeEffect("gd_l",14));
		if(hasUpgrade("gd_u",52))mult = mult.div(upgradeEffect("gd_u",52));
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
                let ret = player.gd_g.points.mul(3).add(1).mul(player.gd_f.best.pow(player.gd_g.points.pow(0.3).mul(0.5))).pow(hasUpgrade("gd_g",23)?0.2:1).max(1);
                let ret2 = player.gd_g.points.pow(0.3).mul(0.5).add(1);
                return [ret, ret2];
        },
        effectDescription(){
                return "which are multiplying your fans gain speed by " + format(layers.gd_g.effect()[0]) + "x (based on your best fame)"
        },
    resetDescription: "Get acknowledged as trustworthy by your fans for ",
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(hasUpgrade("gd_g",15) && hasUpgrade("gd_l",15))mult = mult.div(upgradeEffect("gd_l",15));
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
			var b=new Decimal(player[this.layer].best);
			layerDataReset(this.layer,["upgrades","milestones","challenges"]);
			player[this.layer].best=b;
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
            rows: 2,
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
			21: {
				title: "Good Will Upgrade 21",
                description: "Unlock a new row of fame upgrades.",
                cost: new Decimal(2),
				currencyDisplayName: "unused good will",
				currencyInternalName: "unused",
				currencyLayer: "gd_g",
                unlocked() { return hasUpgrade("gd_g",15) && player.gd_d.challenges[22]; }, // The upgrade is only visible when this is true
            },
			22: {
				title: "Good Will Upgrade 22",
                description: "Lectures gain is better.",
                cost: new Decimal(2),
				currencyDisplayName: "unused good will",
				currencyInternalName: "unused",
				currencyLayer: "gd_g",
                unlocked() { return player[this.layer].best.gte(9); }, // The upgrade is only visible when this is true
            },
			23: {
				title: "Good Will Upgrade 23",
                description: "[Fans.zip] Reduce fans gain but 2nd-5th fame buyables are cheaper, but force a Good Will reset.",
                cost: new Decimal(2),
				currencyDisplayName: "unused good will",
				currencyInternalName: "unused",
				currencyLayer: "gd_g",
                unlocked() { return player[this.layer].best.gte(9); }, // The upgrade is only visible when this is true
				onPurchase(){
					doReset(this.layer,true);
				}
            },
			24: {
				title: "Good Will Upgrade 24",
                description: "Time Flux gain is better.",
                cost: new Decimal(2),
				currencyDisplayName: "unused good will",
				currencyInternalName: "unused",
				currencyLayer: "gd_g",
                unlocked() { return player[this.layer].best.gte(13); }, // The upgrade is only visible when this is true
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
		var l = 0;
		if(hasUpgrade("gd_a",12) && hasUpgrade("gd_r",24))l++;
		if(hasUpgrade("gd_e",22))l++;
		if(hasUpgrade("gd_a",13) && hasUpgrade("gd_r",31))l++;
		return new Decimal([1.5,1.2,1.15,1.1][l]);
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
			var b=new Decimal(player[this.layer].best);
			layerDataReset(this.layer,["upgrades","milestones","challenges"]);
			player[this.layer].best=b;
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
			13: {
				title: "API Upgrade 13",
                description: "Unlock a new row of refactor upgrades.",
                cost: new Decimal(1),
				currencyDisplayName: "unused endpoints",
				currencyInternalName: "unused",
				currencyLayer: "gd_a",
                unlocked() { return hasUpgrade("gd_a",12) && player.gd_d.challenges[21]; }, // The upgrade is only visible when this is true
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
						player[this.layer].buyables={11:new Decimal(0),12:new Decimal(0),21:new Decimal(0)};
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
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
					player.gd_a.unused=player.gd_a.points.sub(layers.gd_a.usedEndpoints());
                },
				effect(){
					if(inChallenge("gd_d",12)||inChallenge("gd_d",21)||inChallenge("gd_d",22))return new Decimal(1);
					if(player.gd_a.points.gte(20))return Decimal.pow(1e10,player.gd_a.buyables[11].mul(player.gd_a.points.add(1)));
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
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
					player.gd_a.unused=player.gd_a.points.sub(layers.gd_a.usedEndpoints());
                },
				effect(){
					if(inChallenge("gd_d",12)||inChallenge("gd_d",21)||inChallenge("gd_d",22))return new Decimal(1);
					if(player.gd_a.points.gte(20))return Decimal.pow(1e10,player.gd_a.buyables[12].mul(player.gd_a.points.add(1)));
					return Decimal.pow(1e5,player.gd_a.buyables[12].mul(player.gd_a.points.mul(0.1).add(1)).pow(0.5));
				},
                buyMax() {}, // You'll have to handle this yourself if you want
                style: {'height':'222px'},
            },
            21: {
                title: "/slowdown/boost", // Optional, displayed at the top in a larger font
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
                    return "Productivity slowdown starts later.\n\
					Endpoints: "+formatWhole(player[this.layer].buyables[this.id])+"\n\
					Cost: "+formatWhole(data.cost)+" unused endpoints\n\
					Req: "+formatWhole(data.req)+" updates\n\
					Effect: " + format(data.effect)+"x (Boosted by your total endpoints)";
                },
                unlocked() { return hasUpgrade("gd_a",13) && hasUpgrade("gd_r",34); }, 
                canAfford() {
                    return player.gd_a.unused.gte(tmp[this.layer].buyables[this.id].cost) && player.gd_u.points.gte(tmp[this.layer].buyables[this.id].req)
				},
                buy() { 
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
					player.gd_a.unused=player.gd_a.points.sub(layers.gd_a.usedEndpoints());
                },
				effect(){
					if(inChallenge("gd_d",12)||inChallenge("gd_d",21)||inChallenge("gd_d",22))return new Decimal(1);
					if(player.gd_a.points.gte(20))return Decimal.pow(1e10,player.gd_a.buyables[21].mul(player.gd_a.points.add(1)));
					return Decimal.pow(1e5,player.gd_a.buyables[21].mul(player.gd_a.points.mul(0.1).add(1)).pow(0.5));
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
			var b=new Decimal(player[this.layer].best);
			layerDataReset(this.layer,["upgrades","milestones","challenges"]);
			player[this.layer].best=b;
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
            },
			3: {requirementDescription: "9 diplomas",
                unlocked() {return hasUpgrade("gd_r",25) && hasUpgrade("gd_f",25);}, // Used to determine when to give the milestone
                done() {return player[this.layer].best.gte(9)}, // Used to determine when to give the milestone
                effectDescription: "Greatly Boost Time Flux and Lectures gain. Gain 100% of Time Flux and Lectures gain per second. Buying Time Flux buyables costs nothing.",
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
            rewardDescription: "Unlock a Good Will upgrade.",
            goal: new Decimal(55),
            currencyDisplayName: "enrollments",
            currencyInternalName: "points",
            currencyLayer: "gd_s",
            unlocked() { return player.tm.buyables[6].gte(11); },
            style: { width: "400px", height: "320px" }
        },
        21: {
            name: "M.S. in Computer Science",
            challengeDescription: "Demonstrate your subject mastery by causing a Diploma reset, and disabling all benefits from row 4 layers except for Diplomas and Time Flux.",
            rewardDescription: "Unlock a 9th ring and an API upgrade.",
            goal: new Decimal(140),
            currencyDisplayName: "enrollments",
            currencyInternalName: "points",
            currencyLayer: "gd_s",
            unlocked() { return hasMilestone("gd_d", 3) },
            countsAs: [ 11, 12 ],
            style: { width: "400px", height: "320px" }
        },
        22: {
            name: "M.A. in Marketing",
            challengeDescription: "Demonstrate your subject mastery by causing a Diploma reset, and disabling all benefits from row 4 layers except for Diplomas and Lectures.",
            rewardDescription: "Unlock another TA and a Good Will upgrade.",
            goal: new Decimal(160),
            currencyDisplayName: "enrollments",
            currencyInternalName: "points",
            currencyLayer: "gd_s",
            unlocked() { return hasMilestone("gd_d", 3) },
            countsAs: [ 11, 12 ],
            style: { width: "400px", height: "320px" }
        }
	},
});



addLayer("gd_t", {
    name: "gd_t", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        shards: new Decimal(0),
        rings: new Array(8).fill(new Decimal(0))
    }},
    color: "#9F52F0",
    requires() {
        ret = new Decimal(200)
		if(hasUpgrade("gd_e", 23))ret = ret.sub(10);
		if(player.gd_d.best.gte(9))ret = ret.sub(20);
		if(hasUpgrade("gd_r", 35))ret = ret.sub(70);
		if(hasUpgrade("gd_e", 35))ret = ret.sub(50);
		return ret
    },
    resource: "time flux", // Name of prestige currency
    baseResource: "refactors", // Name of resource prestige is based on
    baseAmount() {return player.gd_r.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent(){
		ret = new Decimal(20);
		if(hasUpgrade("gd_g", 24))ret = ret.add(5);
		return ret
	}, // Prestige currency exponent
	roundUpCost: true,
    resetDescription: "Refactor time for ",
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(hasUpgrade("gd_e", 23))mult = mult.mul(20);
		if(hasUpgrade("gd_r", 35))mult = mult.mul(5);
		return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    branches: ["gd_r","gd_s"],
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown(){return player.tm.currentTree==6 && hasUpgrade("gd_r",25);},
		
		doReset(l){
			if(l=="gd_u" || l=="gd_c" || l=="gd_e" || l=="gd_r" || l=="gd_s" || l=="gd_f" || l=="gd_a" || l=="gd_t" || l=="gd_d" || l=="gd_l" || l=="gd_g" || !l.startsWith("gd_")){return;}
			var b=new Decimal(player[this.layer].best);
			layerDataReset(this.layer,["upgrades","milestones","challenges"]);
			player[this.layer].best=b;
			return;
		},
		
    update(diff) {
        player[this.layer].rings[7] = player[this.layer].rings[7].add(buyableEffect(this.layer, 91).rate.mul(diff))
        player[this.layer].rings[6] = player[this.layer].rings[6].add(buyableEffect(this.layer, 81).rate.mul(diff))
        player[this.layer].rings[5] = player[this.layer].rings[5].add(buyableEffect(this.layer, 71).rate.mul(diff))
        player[this.layer].rings[4] = player[this.layer].rings[4].add(buyableEffect(this.layer, 61).rate.mul(diff))
        player[this.layer].rings[3] = player[this.layer].rings[3].add(buyableEffect(this.layer, 51).rate.mul(diff))
        player[this.layer].rings[2] = player[this.layer].rings[2].add(buyableEffect(this.layer, 41).rate.mul(diff))
        player[this.layer].rings[1] = player[this.layer].rings[1].add(buyableEffect(this.layer, 31).rate.mul(diff))
        player[this.layer].rings[0] = player[this.layer].rings[0].add(buyableEffect(this.layer, 21).rate.mul(diff))
        player[this.layer].shards = player[this.layer].shards.add(buyableEffect(this.layer, 11).mul(diff))
    },
	
	 tabFormat: ["main-display",
                    "prestige-button", "resource-display",
						"milestones",
                    ["blank", "5px"],
					["display-text",function(){return "You have "+formatWhole(player.gd_t.shards)+" Time Shards, which are boosting hours of work gain, experience and cash gain by "+format(tmp.gd_t.effect)+"x"}],
						"upgrades",
						"buyables"
				],
	
    effect() {
        if (inChallenge("gd_d", 22)) return 1
        return player[this.layer].shards.add(1);
    },
	
    buyables: {
        rows: 9,
        cols: 1,
        11: {
            title: "1st Ring",
            display() {
                if (getBuyableAmount(this.layer, this.id).gt(0))
                    return `Double time shards generation.<br/>Currently: ${format(this.effect())}/sec<br/>Requires ${formatWhole(this.cost())} time flux.`
                return `Generate time shards.<br/>Currently: ${format(this.effect())}/sec<br/>Requires ${formatWhole(this.cost())} time flux.`
            },
            cost(x) { return new Decimal(2).pow(new Decimal(1).pow(1.5)).pow(x || getBuyableAmount(this.layer, this.id)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if(player.gd_d.best.lt(9))player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1).add(getBuyableAmount(this.layer, this.id)))
            },
            effect() {
                if (getBuyableAmount(this.layer, this.id).gt(0))
                    return new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(1)).times(buyableEffect(this.layer, 21).multiplier).times(player.milestone_m.best.gte(21)?tmp.milestone_m.milestone21Effect:1).times(hasUpgrade("gd_u",53)?upgradeEffect("gd_u",53):1);
                return new Decimal(0)
            },
            style: { width: "600px", height: "120px" }
        },
        21: {
            title: "2nd Ring",
            display() {
                const effect = this.effect()
                if (getBuyableAmount(this.layer, this.id).gt(0))
                    return `Double how quickly the multiplier to the 1st Ring increases.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
                return `Power up the 1st Ring over time.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
            },
            cost(x) { return new Decimal(2).pow(new Decimal(2).pow(1.5)).pow(Decimal.add(x || getBuyableAmount(this.layer, this.id), 1)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if(player.gd_d.best.lt(9))player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1).add(getBuyableAmount(this.layer, this.id)))
            },
            effect() {
                return {
                    multiplier: player.gd_t.rings[0].add(1),
                    rate: getBuyableAmount(this.layer, this.id).gt(0) ? new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(1)).mul(buyableEffect(this.layer, 31).multiplier).times(player.milestone_m.best.gte(21)?tmp.milestone_m.milestone21Effect:1).times(hasUpgrade("gd_u",53)?upgradeEffect("gd_u",53):1) : new Decimal(0)
                }
            },
            style: { width: "600px", height: "120px" }
        },
        31: {
            title: "3rd Ring",
            display() {
                const effect = this.effect()
                if (getBuyableAmount(this.layer, this.id).gt(0))
                    return `Double how quickly the multiplier to the 2nd Ring increases.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
                return `Power up the 2nd Ring over time.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
            },
            cost(x) { return new Decimal(2).pow(new Decimal(3).pow(1.5)).pow(Decimal.add(x || getBuyableAmount(this.layer, this.id), 1)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if(player.gd_d.best.lt(9))player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1).add(getBuyableAmount(this.layer, this.id)))
            },
            effect() {
                return {
                    multiplier: player.gd_t.rings[1].add(1),
                    rate: getBuyableAmount(this.layer, this.id).gt(0) ? new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(1)).mul(buyableEffect(this.layer, 41).multiplier).times(player.milestone_m.best.gte(21)?tmp.milestone_m.milestone21Effect:1).times(hasUpgrade("gd_u",53)?upgradeEffect("gd_u",53):1) : new Decimal(0)
                }
            },
            style: { width: "600px", height: "120px" }
        },
        41: {
            title: "4th Ring",
            display() {
                const effect = this.effect()
                if (getBuyableAmount(this.layer, this.id).gt(0))
                    return `Double how quickly the multiplier to the 3rd Ring increases.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
                return `Power up the 3rd Ring over time.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
            },
            cost(x) { return new Decimal(2).pow(new Decimal(4).pow(1.5)).pow(Decimal.add(x || getBuyableAmount(this.layer, this.id), 1)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if(player.gd_d.best.lt(9))player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1).add(getBuyableAmount(this.layer, this.id)))
            },
            effect() {
                return {
                    multiplier: player.gd_t.rings[2].add(1),
                    rate: getBuyableAmount(this.layer, this.id).gt(0) ? new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(1)).mul(buyableEffect(this.layer, 51).multiplier).times(player.milestone_m.best.gte(21)?tmp.milestone_m.milestone21Effect:1).times(hasUpgrade("gd_u",53)?upgradeEffect("gd_u",53):1) : new Decimal(0)
                }
            },
            style: { width: "600px", height: "120px" }
        },
        51: {
            title: "5th Ring",
            display() {
                const effect = this.effect()
                if (getBuyableAmount(this.layer, this.id).gt(0))
                    return `Double how quickly the multiplier to the 4th Ring increases.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
                return `Power up the 4th Ring over time.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
            },
            cost(x) { return new Decimal(2).pow(new Decimal(5).pow(1.5)).pow(Decimal.add(x || getBuyableAmount(this.layer, this.id), 1)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if(player.gd_d.best.lt(9))player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1).add(getBuyableAmount(this.layer, this.id)))
            },
            effect() {
                return {
                    multiplier: player.gd_t.rings[3].add(1),
                    rate: getBuyableAmount(this.layer, this.id).gt(0) ? new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(1)).mul(buyableEffect(this.layer, 61).multiplier).times(player.milestone_m.best.gte(21)?tmp.milestone_m.milestone21Effect:1).times(hasUpgrade("gd_u",53)?upgradeEffect("gd_u",53):1) : new Decimal(0)
                }
            },
            style: { width: "600px", height: "120px" }
        },
        61: {
            title: "6th Ring",
            display() {
                const effect = this.effect()
                if (getBuyableAmount(this.layer, this.id).gt(0))
                    return `Double how quickly the multiplier to the 5th Ring increases.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
                return `Power up the 5th Ring over time.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
            },
            cost(x) { return new Decimal(2).pow(new Decimal(6).pow(1.5)).pow(Decimal.add(x || getBuyableAmount(this.layer, this.id), 1)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if(player.gd_d.best.lt(9))player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1).add(getBuyableAmount(this.layer, this.id)))
            },
            effect() {
                return {
                    multiplier: player.gd_t.rings[4].add(1),
                    rate: getBuyableAmount(this.layer, this.id).gt(0) ? new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(1)).mul(buyableEffect(this.layer, 71).multiplier).times(player.milestone_m.best.gte(21)?tmp.milestone_m.milestone21Effect:1).times(hasUpgrade("gd_u",53)?upgradeEffect("gd_u",53):1) : new Decimal(0)
                }
            },
            style: { width: "600px", height: "120px" }
        },
        71: {
            title: "7th Ring",
            display() {
                const effect = this.effect()
                if (getBuyableAmount(this.layer, this.id).gt(0))
                    return `Double how quickly the multiplier to the 6th Ring increases.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
                return `Power up the 6th Ring over time.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
            },
            cost(x) { return new Decimal(2).pow(new Decimal(7).pow(1.5)).pow(Decimal.add(x || getBuyableAmount(this.layer, this.id), 1)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if(player.gd_d.best.lt(9))player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1).add(getBuyableAmount(this.layer, this.id)))
            },
            effect() {
                return {
                    multiplier: player.gd_t.rings[5].add(1),
                    rate: getBuyableAmount(this.layer, this.id).gt(0) ? new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(1)).mul(buyableEffect(this.layer, 81).multiplier).times(player.milestone_m.best.gte(21)?tmp.milestone_m.milestone21Effect:1).times(hasUpgrade("gd_u",53)?upgradeEffect("gd_u",53):1) : new Decimal(0)
                }
            },
            style: { width: "600px", height: "120px" }
        },
        81: {
            title: "8th Ring",
            display() {
                const effect = this.effect()
                if (getBuyableAmount(this.layer, this.id).gt(0))
                    return `Double how quickly the multiplier to the 7th Ring increases.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
                return `Power up the 7th Ring over time.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
            },
            cost(x) { return new Decimal(2).pow(new Decimal(8).pow(1.5)).pow(Decimal.add(x || getBuyableAmount(this.layer, this.id), 1)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if(player.gd_d.best.lt(9))player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1).add(getBuyableAmount(this.layer, this.id)))
            },
            effect() {
                return {
                    multiplier: player.gd_t.rings[6].add(1),
                    rate: getBuyableAmount(this.layer, this.id).gt(0) ? new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(1)).mul(buyableEffect(this.layer, 91).multiplier).times(player.milestone_m.best.gte(21)?tmp.milestone_m.milestone21Effect:1).times(hasUpgrade("gd_u",53)?upgradeEffect("gd_u",53):1) : new Decimal(0)
                }
            },
            style: { width: "600px", height: "120px" }
        },
        91: {
            title: "9th Ring",
            display() {
                const effect = this.effect()
                if (getBuyableAmount(this.layer, this.id).gt(0))
                    return `Double how quickly the multiplier to the 8th Ring increases.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
                return `Power up the 8th Ring over time.<br/>Currently: ${format(effect.multiplier)}x (+${format(effect.rate)}/sec)<br/>Requires ${formatWhole(this.cost())} time flux.`
            },
            cost(x) { return new Decimal(2).pow(new Decimal(9).pow(1.5)).pow(Decimal.add(x || getBuyableAmount(this.layer, this.id), 1)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                if(player.gd_d.best.lt(9))player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, new Decimal(1).add(getBuyableAmount(this.layer, this.id)))
            },
            effect() {
                return {
                    multiplier: player.gd_t.rings[7].add(1),
                    rate: getBuyableAmount(this.layer, this.id).gt(0) ? new Decimal(2).pow(getBuyableAmount(this.layer, this.id).sub(1)).times(player.milestone_m.best.gte(21)?tmp.milestone_m.milestone21Effect:1).times(hasUpgrade("gd_u",53)?upgradeEffect("gd_u",53):1) : new Decimal(0)
                }
            },
            style: { width: "600px", height: "120px" },
            unlocked() { return hasChallenge("gd_d", 21) }
        }
	},
	passiveGeneration(){
		let ret=0;
		if(player.gd_d.best.gte(9))ret=ret+1;
		return ret;
	},
});


addLayer("gd_l", {
    name: "gd_l",
    symbol: "L",
    color: "#09DE89",
    branches: [ 'gd_s', 'gd_f' ],
    row: 3,
    position: 4,
    resource: "lectures",
    baseResource: "fame",
    resetDescription: "Teach ",
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        gabenExp: new Decimal(0),
        gabenLevel: new Decimal(0),
        lExp: new Decimal(0),
        lLevel: new Decimal(0),
        carmackExp: new Decimal(0),
        carmackLevel: new Decimal(0),
        thompsonExp: new Decimal(0),
        thompsonLevel: new Decimal(0),
        meierExp: new Decimal(0),
        meierLevel: new Decimal(0)
    }},
    layerShown(){return player.tm.currentTree==6 && hasUpgrade("gd_f",25);},
    type: "normal",
    requires() {
        ret = new Decimal(110)
		if(hasUpgrade("gd_c", 24))ret = ret.sub(10);
		if(player.gd_d.best.gte(9))ret = ret.sub(20);
		if(hasUpgrade("gd_g", 22))ret = ret.sub(30);
		return ret
    },
    baseAmount() { return player.gd_f.points },
    exponent() {
		let ret=new Decimal(10);
		if(hasUpgrade("gd_f", 35))ret = ret.add(10);
		if(hasUpgrade("gd_c", 35))ret = ret.add(5);
		return ret;
    },
    gainMult() {
        mult = new Decimal(2)
		if(hasUpgrade("gd_c", 24))mult = mult.mul(20);
		if(hasUpgrade("gd_f", 35))mult = mult.mul(2.5);
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    effect() {
		if(hasUpgrade("gd_c", 31))return player[this.layer].points;
        return player[this.layer].points.sqrt()
    },
    effectDescription() {
        return `which generate ${format(this.effect())} experience for your TAs every second`
    },
	
	
		doReset(l){
			if(l=="gd_u" || l=="gd_c" || l=="gd_e" || l=="gd_r" || l=="gd_s" || l=="gd_f" || l=="gd_a" || l=="gd_t" || l=="gd_d" || l=="gd_l" || l=="gd_g" || !l.startsWith("gd_")){return;}
			var b=new Decimal(player[this.layer].best);
			layerDataReset(this.layer,["upgrades","milestones","challenges"]);
			player[this.layer].best=b;
			return;
		},
		
		
    update(diff) {
        const effect = this.effect().mul(diff)
        if (hasUpgrade(this.layer, 11)) player[this.layer].gabenExp = player[this.layer].gabenExp.add(effect)
        if (player[this.layer].gabenExp.gte(this.bars.gaben.cost())) {
            player[this.layer].gabenLevel = player[this.layer].gabenLevel.add(1)
            player[this.layer].gabenExp = new Decimal(0)
        }
        if (hasUpgrade(this.layer, 12)) player[this.layer].lExp = player[this.layer].lExp.add(effect)
        if (player[this.layer].lExp.gte(this.bars.l.cost())) {
            player[this.layer].lLevel = player[this.layer].lLevel.add(1)
            player[this.layer].lExp = new Decimal(0)
        }
        if (hasUpgrade(this.layer, 13)) player[this.layer].carmackExp = player[this.layer].carmackExp.add(effect)
        if (player[this.layer].carmackExp.gte(this.bars.carmack.cost())) {
            player[this.layer].carmackLevel = player[this.layer].carmackLevel.add(1)
            player[this.layer].carmackExp = new Decimal(0)
        }
        if (hasUpgrade(this.layer, 14)) player[this.layer].thompsonExp = player[this.layer].thompsonExp.add(effect)
        if (player[this.layer].thompsonExp.gte(this.bars.thompson.cost())) {
            player[this.layer].thompsonLevel = player[this.layer].thompsonLevel.add(1)
            player[this.layer].thompsonExp = new Decimal(0)
        }
        if (hasUpgrade(this.layer, 15)) player[this.layer].meierExp = player[this.layer].meierExp.add(effect)
        if (player[this.layer].meierExp.gte(this.bars.meier.cost())) {
            player[this.layer].meierLevel = player[this.layer].meierLevel.add(1)
            player[this.layer].meierExp = new Decimal(0)
        }
    },
    roundUpCost: true,
    tabFormat: [
        ["infobox", "lore"],
        ["display-text", () => inChallenge("gd_d", 21) ? `<h2 style="color: red;">Disabled during ${layers.gd_d.challenges[player.gd_d.activeChallenge].name} degree plan</h2>` : ""],
        "main-display",
        "prestige-button", "resource-display",
        "blank",
        ["display-text", "<h2>Gabriel Newell</h2>"],
        ["row", [["upgrade", 11], "blank", ["bar", "gaben"]]],
        "blank",
        ["display-text", () => hasUpgrade("gd_l", 11) ? "<h2>L</h2>" : ""],
        ["row", [["upgrade", 12], "blank", ["bar", "l"]]],
        "blank",
        ["display-text", () => hasUpgrade("gd_l", 12) ? "<h2>Jean Carmack</h2>" : ""],
        ["row", [["upgrade", 13], "blank", ["bar", "carmack"]]],
        "blank",
        ["display-text", () => hasUpgrade("gd_l", 13) ? "<h2>Jen Thompson</h2>" : ""],
        ["row", [["upgrade", 14], "blank", ["bar", "thompson"]]],
        "blank",
        ["display-text", () => challengeCompletions("gd_d", 22) > 0 ? "<h2>Sidney Meier</h2>" : ""],
        ["row", [["upgrade", 15], "blank", ["bar", "meier"]]]
    ],
    bars: {
        gaben: {
            fillStyle: {'background-color' : "#1b2838"},
            baseStyle: {'background-color' : "#171a21"},
            textStyle: {'color': '#04e050'},
            borderStyle() {return {}},
            direction: RIGHT,
            width: 400,
            height: 140,
            progress() {
                return (player[this.layer].gabenExp.div(this.cost())).toNumber()
            },
            display() {
                return `Current TA Level: ${formatWhole(player[this.layer].gabenLevel)}<br/><br/>${format(player[this.layer].gabenExp)} / ${formatWhole(this.cost())} to next level`
            },
            cost() { return new Decimal(hasUpgrade("gd_c",32)?2:4).pow(player[this.layer].gabenLevel).mul(hasUpgrade("gd_c",32)?1:1) },
            unlocked: true
        },
        l: {
            fillStyle: {'background-color' : "#2B5293"},
            baseStyle: {'background-color' : "#2b772b"},
            textStyle: {'color': '#04e050'},
            borderStyle() {return {}},
            direction: RIGHT,
            width: 400,
            height: 140,
            progress() {
                return (player[this.layer].lExp.div(this.cost())).toNumber()
            },
            display() {
                return `Current TA Level: ${formatWhole(player[this.layer].lLevel)}<br/><br/>${format(player[this.layer].lExp)} / ${formatWhole(this.cost())} to next level`
            },
            cost() { return new Decimal(hasUpgrade("gd_c",32)?2:4).pow(player[this.layer].lLevel).mul(hasUpgrade("gd_c",32)?1:10) },
            unlocked() { return hasUpgrade("gd_l", 11) }
        },
        carmack: {
            fillStyle: {'background-color' : "#cb5e29"},
            baseStyle: {'background-color' : "#692f17"},
            textStyle: {'color': '#04e050'},
            borderStyle() {return {}},
            direction: RIGHT,
            width: 400,
            height: 140,
            progress() {
                return (player[this.layer].carmackExp.div(this.cost())).toNumber()
            },
            display() {
                return `Current TA Level: ${formatWhole(player[this.layer].carmackLevel)}<br/><br/>${format(player[this.layer].carmackExp)} / ${formatWhole(this.cost())} to next level`
            },
            cost() { return new Decimal(hasUpgrade("gd_c",32)?2:6).pow(player[this.layer].carmackLevel).mul(hasUpgrade("gd_c",32)?1:10000) },
            unlocked() { return hasUpgrade("gd_l", 12) }
        },
        thompson: {
            fillStyle: {'background-color' : "#ffffff"},
            baseStyle: {'background-color' : "#000000"},
            textStyle: {'color': '#04e050'},
            borderStyle() {return {}},
            direction: RIGHT,
            width: 400,
            height: 140,
            progress() {
                return (player[this.layer].thompsonExp.div(this.cost())).toNumber()
            },
            display() {
                return `Current TA Level: ${formatWhole(player[this.layer].thompsonLevel)}<br/><br/>${format(player[this.layer].thompsonExp)} / ${formatWhole(this.cost())} to next level`
            },
            cost() { return new Decimal(hasUpgrade("gd_c",32)?2:12).pow(player[this.layer].thompsonLevel).mul(hasUpgrade("gd_c",32)?1:50000) },
            unlocked() { return hasUpgrade("gd_l", 14) }
        },
        meier: {
            fillStyle: {'background-color' : "#947728"},
            baseStyle: {'background-color' : "#04467a"},
            textStyle: {'color': '#04e050'},
            borderStyle() {return {}},
            direction: RIGHT,
            width: 400,
            height: 140,
            progress() {
                return (player[this.layer].meierExp.div(this.cost())).toNumber()
            },
            display() {
                return `Current TA Level: ${formatWhole(player[this.layer].meierLevel)}<br/><br/>${format(player[this.layer].meierExp)} / ${formatWhole(this.cost())} to next level`
            },
            cost() { return new Decimal(hasUpgrade("gd_f",31)?2:12).pow(player[this.layer].meierLevel).mul(hasUpgrade("gd_f",31)?1:50000) },
            unlocked() { return challengeCompletions("gd_d", 22) > 0 }
        }
    },
    upgrades: {
        rows: 1,
        cols: 5,
        11: {
            title: "Hire Gabriel",
            cost: new Decimal(1),
            description() { return "<br/>Gabriel will increase cash gain based on level<br/>" },
            effect() { return inChallenge("gd_d", 21) ? new Decimal(1) : new Decimal(hasUpgrade("gd_c",33)?20:2).pow(player[this.layer].gabenLevel) },
            effectDisplay() { return `${format(this.effect())}x cash gain` }
        },
        12: {
            title: "Hire L",
            cost: new Decimal(10),
            description() { return "<br/>L will reduce fame requirement based on level<br/>" },
            effect() { return inChallenge("gd_d", 21) ? new Decimal(1) : new Decimal(hasUpgrade("gd_c",33)?20:2).pow(player[this.layer].lLevel) },
            effectDisplay() { return `fame requirement /${format(this.effect())}` },
            unlocked() { return hasUpgrade("gd_l", 11) }
        },
        13: {
            title: "Hire Jean",
            cost: new Decimal(2000),
            description() { if(hasUpgrade("gd_u", 43))return "<br/>Jean will increase update gain based on level<br/>"; return "<br/>Jean will reduce update requirement based on level<br/>" },
            effect() { if(hasUpgrade("gd_u", 43))return upgradeEffect("gd_u", 43);return inChallenge("gd_d", 21) ? new Decimal(1) : new Decimal(hasUpgrade("gd_c",33)?20:10).pow(player[this.layer].carmackLevel) },
            effectDisplay() { if(hasUpgrade("gd_u", 43))return `${format(this.effect())}x update gain`; return `update requirement /${format(this.effect())}` },
            unlocked() { return hasUpgrade("gd_l", 12) }
        },
        14: {
            title: "Hire Jen",
            cost: new Decimal(60000),
            description() { return "<br/>Jen will reduce enrollments requirement based on level<br/>" },
            effect() { return inChallenge("gd_d", 21) ? new Decimal(1) : new Decimal(hasUpgrade("gd_c",33)?20:10).pow(player[this.layer].thompsonLevel) },
            effectDisplay() { return `enrollments requirement /${format(this.effect())}` },
            unlocked() { return hasUpgrade("gd_l", 13) }
        },
        15: {
            title: "Hire Sidney",
            cost: new Decimal(1200000),
            description() { return "<br/>Sidney will reduce good will requirement based on level<br/>" },
            effect() { return inChallenge("gd_d", 21) ? new Decimal(1) : new Decimal(1.05).pow(player[this.layer].meierLevel) },
            effectDisplay() { return `good will requirement /${format(this.effect())}` },
            unlocked() { return challengeCompletions("gd_d", 22) > 0 }
        }
    },
	passiveGeneration(){
		let ret=0;
		if(player.gd_d.best.gte(9))ret=ret+1;
		return ret;
	},
})
