var punch=function(src, target){
	target.hp=target.hp-src.ap;
};
var kick=function(src, target){
	target.hp=target.hp-src.ap*2;
};

var Fighter= function(params){
	var hp=params.hp;
	var ap=params.ap;
	var slug=params.slug;
	var skills=[];
	var target=undefined;
	var baseGCD=1500;
	var minGCD=1000;
	var lastSkillTime=0;
	
	
	var inGCD=function(){
		var currentTime=now();
		var last=this.lastSkillTime;
		var interval=currentTime-last;
		return interval<baseGCD;
	};
	
	
	var addSkill=function(_skill){
		for(var i=0;i<skills.length;i++){
			var currentSkill=skills[i];
			if(currentSkill.slug==_skill.slug){
				skills[i]=currentSkill;
				return;
			}
		}
		skills.push(_skill);
	};
	var getSkill=function(_slug){
		if(skills.length>0){
			for(var i=0;i<skills.length;i++){
				var currentSkill=skills[i];
				if(currentSkill.slug==_slug){
					return currentSkill;
				}
			}
		}
	};
	var removeAllSkills=function(){
		skills.splice(0,skills.length);
	};
	var removeSkill=function(_slug){
		var deleteIndex=-1;
		if(skills.length>0){
			for(var i=0;i<skills.length;i++){
				var currentSkill=skills[i];
				if(currentSkill.slug==_slug){
					deleteIndex=i;
					break;
				}
			}
		}
		if(deleteIndex>-1){
			skills.splice(deleteIndex,1);
		}
	};
	var useSkill=function(_slug){
		var skill=getSkill(_slug);
		if(this.inGCD()&&!skill.ignoresGCD){
			amplify.publish('log','Not ready yet');
		}
		else{
			var success=skill.requestUse(this, this.target);
			if(success){
				this.lastSkillTime=now();
			}
		}
	};
	return{
		slug:			slug,
		hp:				hp,
		ap:				ap,
		baseGCD:		baseGCD,
		minGCD:			minGCD,
		lastSkillTime: lastSkillTime,
		addSkill:		addSkill,
		getSkill:		getSkill,
		useSkill:		useSkill,
		removeSkill: 	removeSkill,
		removeAllSkills:removeAllSkills,
		inGCD:			inGCD,
		target:			target
	};
};

var Item=function(params){
	
};

var Skill=function(params){
	var name=params.name;
	var slug=params.slug;
	var coolDown=params.coolDown;
	var activatesGCD=params.activatesGCD;
	var ignoresGCD=params.ignoresGCD;
	var lastUsed=0;
	var timeout=[];
	var t1,t2,t3,t4;
	timeout.push(t1,t2,t3,t4);
	var use=params.use;
	var requestUse=function(src, target){
		if(this.inCD()){
			amplify.publish('log','This ability is not ready yet');
		}else{
			var result=use(src, target);
			this.lastUsed=now();
			amplify.publish("skillUsed", src, target, this, result);
			return true;
		}
		return false;
	};
	var inCD=function(){
		var currentTime=now();
		var last=this.lastUsed;
		var interval=currentTime-last;
		return interval<coolDown;
	};
	var activeIn=function(){
		var currentTime=now();
		var last=this.lastUsed;
		var interval=currentTime-last;
		return Math.max(coolDown-interval,0);
	};
	return{
		name:			name,
		coolDown:		coolDown,
		activatesGCD:	activatesGCD,
		inCD:			inCD,
		activeIn:		activeIn,
		ignoresGCD:		ignoresGCD,
		lastUsed:		lastUsed,
		requestUse:		requestUse,
		timeout:		timeout,
		slug:			slug
	};
};
