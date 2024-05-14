
addLayer("milestone_m", {
    name: "milestone", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#793784",
    requires(){
		if(player.milestone_m.points.gte(5))return new Decimal(Infinity);
		return new Decimal("e2e8");
	},
    resource: "MT-Milestones", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
	base: new Decimal("e1e7"),
	exponent: function(){
		var base=new Decimal(3);
		return base;
	},
    layerShown(){return player.tm.currentTree==8},
		doReset(l){
			return;
		},
	resetsNothing(){return true},
	milestones: [
		{
			requirementDescription: "1st MT-Milestone",
            unlocked() {return player[this.layer].best.gte(0)},
            done() {return player[this.layer].best.gte(1)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Gain "+format(layers[this.layer].milestone1Effect())+" milestone power per second."
			},
        },
		{
			requirementDescription: "2nd MT-Milestone",
            unlocked() {return player[this.layer].best.gte(1)},
            done() {return player[this.layer].best.gte(2)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "Points boost milestone power gain. Currently: "+format(player.points.add(1e100).log10().log10())+"x"
			},
        },
		{
			requirementDescription: "3rd MT-Milestone",
            unlocked() {return player[this.layer].best.gte(2)},
            done() {return player[this.layer].best.gte(3)}, // Used to determine when to give the milestone
            effectDescription:  function(){
				return "First MT-Milestone's effect is boosted by your milestone power. Currently: "+format(tmp.milestone_m.milestone3Effect)+"x";
			},
        },
	],
	milestone1Effect(){
		var r=new Decimal(1);
		if(player.milestone_m.best.gte(2))r=r.mul(player.points.add(1e100).log10().log10());
		if(player.milestone_m.best.gte(3))r=r.mul(tmp.milestone_m.milestone3Effect);
		return r;
	},
	update(diff){
		if(player.milestone_m.best.gte(1)){
			player.modpoints[8]=player.modpoints[8].add(layers.milestone_m.milestone1Effect().mul(diff));
		}
	},
	powerEffect(){
		let eff1=Decimal.pow(10,player.modpoints[8]);
		if(player.modpoints[8].gte(50000))eff1=player.modpoints[8].mul(2).pow(10000);
		return [eff1];
	},
	milestone3Effect(){
		var m=Decimal.log10(player.modpoints[8].add(20)).pow(0.9);
		var b=new Decimal(2);
		return Decimal.pow(b,m);
	},
});
