module("data");

test("Fighter test", function(){
	var a=new Fighter({hp: 100, ap:10});
	equal(a.hp,100,"get performed correctly");
	equal(a.ap,10,"get performed correctly");
	a.hp=3;
	equal(a.hp,3,"get and set performed correctly");
	a.ap=1;
	equal(a.ap,1,"get and set performed correctly");
});
test("Fighter addSkill test", function() {
	var testFighter=new Fighter({hp: 100, ap:10});
	var skill1=new Skill({slug: 'punch'});
	var skill2=new Skill({slug: 'kick'});
	testFighter.addSkill(skill1);
	var actualEmpty=testFighter.getSkill('none');
	var actual=testFighter.getSkill('punch');
	var expected='punch';
	equal(actual.slug,expected,'punch ok');
	ok(actualEmpty===undefined,'undefined ok');
	testFighter.addSkill(skill2);
	actual=testFighter.getSkill('kick');
	expected='kick';
	equal(actual.slug,expected,'kick ok');
	testFighter.removeSkill('kick');
	actual=testFighter.getSkill('kick');
	ok(actual===undefined,'remove(slug) ok:'+actual);
	testFighter.addSkill(skill2);
	testFighter.removeAllSkills();
	actual=testFighter.getSkill('punch');
	ok(actual===undefined,'removeAllSkills ok:'+actual);
	actual=testFighter.getSkill('kick');
	ok(actual===undefined,'removeAllSkills ok:'+actual);
	
});
test('use skill test',function(){
	var skill=new Skill({slug: 'kick',
						use:function(src, target){target.hp=target.hp-src.ap;}
	});
	var player=new Fighter({hp: 100, ap:10});
	var dummy=new Fighter({hp: 100, ap:10});
	skill.requestUse(player,dummy);
	equal(dummy.hp,90,"skill performed correctly");
	player.addSkill(skill);
	dummy.hp=100;
	player.target=dummy;
	player.useSkill('kick');
	equal(dummy.hp,90,"skill performed correctly");
	
});
test("punch test", function() {
	var a=new Fighter({hp: 100, ap:10});
	var b=new Fighter({hp: 100, ap:10});
	punch(a,b);
	equal(b.hp,90,"punch performed correctly");
});
test("kick test", function() {
	var a=new Fighter({hp: 100, ap:10});
	var b=new Fighter({hp: 100, ap:10});
	kick(a,b);
	equal(b.hp,80,"kick performed correctly");
});
test("inGCD", function() {
	var a=new Fighter({hp: 100, ap:10});
	a.lastSkillTime=now();
	var failGCD=a.inGCD();
	ok(failGCD,'Not ready yet');
	a.lastSkillTime=now();
	sleepFor(2000);
	failGCD=a.inGCD();
	ok(!failGCD,'ready');
});
test("cd tests", function() {
	var ryu = new Fighter({
		hp : 100,
		ap : 10,
		slug : 'Ryu'
	});
	var dummy = new Fighter({
		hp : 100,
		ap : 10,
		slug : 'Dummy'
	});

	var flyingKick = new Skill({
		name : 'Flying kick',
		slug : 'kick',
		coolDown : 3000,
		activatesGCD : true,
		ignoresGCD : false,
		use : function(src, target) {
			target.hp = target.hp - src.ap*2;
		}
	});
	var flyingPunch = new Skill({
		name : 'Flying punch',
		slug : 'punch',
		coolDown : 1500,
		activatesGCD : true,
		ignoresGCD : false,
		use : function(src, target) {
			target.hp = target.hp - src.ap;
		}
	});
	ryu.addSkill(flyingKick);
	ryu.addSkill(flyingPunch);
	ryu.target=dummy;
	ryu.useSkill('kick');
	equal(dummy.hp,80,"skill performed correctly");
	ryu.useSkill('kick');//Ryu in GCD-> will not kick
	equal(dummy.hp,80,"/Fighter in GCD-> will not kick");
	sleepFor(1500);
	ryu.useSkill('kick');//Ability in CD-> will not kick
	equal(dummy.hp,80,"Skill in CD-> will not kick");
	ryu.useSkill('punch');//Ability not in in CD-> will punch
	equal(dummy.hp,70,"Skill -> will punch");
	sleepFor(1500);
	ryu.useSkill('kick');//CD in use -> kick
	equal(dummy.hp,50,"skill performed correctly");
	
});
