function refreshPanel(src, target, skill, result){
	var log=target.hp;
	if(log<=0){
		$('.skill-result').first().text(target.slug+' is dead');
	}else{
		$('.skill-result').first().text(target.hp);
	}
	var skillResult='';
	if(!(result===undefined)){
		skillResult=result.message;
		if(result.overkill>0){
			skillResult=skillResult+' dealing '+result.overkill+' of extra damage';
		}
	}
	amplify.publish("log",src.slug +' used '+skill.slug+' on '+ target.slug+' '+skillResult);
};

function applyUnavailabeAnimation(button, time,skill){
	
	clearTimeout(skill.timeout[0]);
	clearTimeout(skill.timeout[1]);
	clearTimeout(skill.timeout[2]);
	var time1=Math.floor(time/2);
	var time2=Math.floor((time/4)+(time/2));
	button.css('opacity',0.2);
	skill.timeout[0]=setTimeout(function(){button.css('opacity',0.5);},time1);
	skill.timeout[1]=setTimeout(function(){button.css('opacity',0.8);},time2);
	skill.timeout[2]=setTimeout(function(){button.css('opacity',1);},time);
};

function applyCoolDowns(src,skill){
	var buttons=$('.skill-buttons').first().children();
	var gcd=src.baseGCD;
	$.each(buttons,
			function(){
				var currentButton=$(this);
				var currentSlug=currentButton.attr('data-skill-slug');
				if(currentSlug==skill.slug){
					applyUnavailabeAnimation(currentButton,Math.max(gcd, skill.coolDown),skill);
				}else{
					var currentSkill=src.getSkill(currentSlug);
					if(!(currentSkill.ignoresGCD)){
						applyUnavailabeAnimation(currentButton,Math.max(gcd, currentSkill.activeIn()),currentSkill);
					}
				}
			}
	);
};

amplify.subscribe("skillUsed",
		function (src, target, skill, result){
			applyCoolDowns(src,skill);
			refreshPanel(src, target, skill, result);
		}
);

amplify.subscribe("log",
		function(message){
			console.log(message);
		}
);
$(document).keyup(function(event) {
	var key= event.key;
	if(key=='a'){
		$("#Ryu-punch").click();
	}else if(key=='s'){
		$("#Ryu-kick").click();
	}
});
