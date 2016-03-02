var ryu = new Fighter({
	hp : 100,
	ap : 10,
	slug : 'Ryu'
});
var dummy = new Fighter({
	hp : 100,
	ap : 10,
	slug : 'dummy'
});
var flyingKick = new Skill({
	name : 'B',
	slug : 'kick',
	coolDown : 3000,
	activatesGCD : true,
	ignoresGCD : false,
	use : function(src, target) {
		var formerHP=target.hp;
		var damage=src.ap*2;
		target.hp = target.hp - damage;
		var extraDamage=0;
		if(damage>formerHP){
			extraDamage=damage-formerHP;
		}
		var result={message: 'deals '+damage+' hp of damage',type:'damage',overall:damage, overkill:extraDamage};
		return result;
	}
});
var flyingPunch = new Skill({
	name : 'A',
	slug : 'punch',
	coolDown : 1500,
	activatesGCD : true,
	ignoresGCD : false,
	use : function(src, target) {
		var formerHP=target.hp;
		var damage=src.ap;
		target.hp = target.hp - damage;
		var extraDamage=0;
		if(damage>formerHP){
			extraDamage=damage-formerHP;
		}
		var result={message: 'deals '+damage+' hp of damage',type:'damage',overall:damage, overkill:extraDamage};
		return result;
	}
});
ryu.addSkill(flyingKick);
ryu.addSkill(flyingPunch);
testFighter=ryu;
dummyFighter=dummy;
testFighter.target=dummyFighter;
var params={fighter:testFighter,containerId:"control-panel", skills:['punch','kick']};
var ryuPanel=new SkillPanel(params);
ryuPanel.init();