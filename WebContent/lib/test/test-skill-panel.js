var testFighter;
var dummyFighter;
module("test-skill-panel", {
	setup: function() {
		var ryu = new Fighter({
			hp : 100,
			ap : 10,
			slug : 'Ryu'
		});
		var dummy = new Fighter({
			hp : 100000,
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
		},
		teardown: function() {
			testFighter='';
		}
});
test("init test", function(){
	equal(testFighter.slug,"Ryu","corect slug)");
	var params={fighter:testFighter,containerId:"control-panel", skills:['punch','kick','notASkill']};
	var ryuPanel=new SkillPanel(params);
	ryuPanel.init();
	equal($('.skill-buttons').first().attr('class'),'skill-buttons','Button panel added');
	equal($('.skill-buttons').first().children().first().attr('data-skill-slug'),'punch','data-skill attribute set correctly');
	equal($('.skill-buttons').first().children().first().text(),'A','label set correctly');
	equal($('.skill-buttons').first().children().first().next().attr('data-skill-slug'),'kick','data-skill attribute set correctly');
	equal($('.skill-buttons').first().children().first().next().text(),'B','label set correctly');
	equal($('.skill-buttons').first().children().first().next().next().html(),undefined,'Third element is not a registered skill. Therefore, it is not rendered');
	$('.skill-buttons').first().children().first().click();
	equal(dummyFighter.hp,99990,'punch button performed correctly');
	equal($('.skill-result').first().text(),99990,'HP shown correctly');
});
