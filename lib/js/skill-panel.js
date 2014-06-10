var SkillPanel=function(params){
	var container=$('#'+params.containerId);
	var fighter=params.fighter;
	var skills=params.skills;
	
	var init=function(){
		if(skills.length>0){
			renderSkills();
		}
		var a=$('.skill-buttons').children('button');
		$.each(a, function() {
			var button=$(this);
			var skill=fighter.getSkill( (($(this)).attr('data-skill-slug')));
			bindSkill(button, skill);
		});
	};
	function bindSkill(button, skill){
		button.click(
					function(){
						fighter.useSkill(skill.slug);
					}
		);
	};
	function renderSkills(){
		var panelButtons='<div class="skill-buttons">';
		for (var index=0;index<skills.length;index++){
			var skill=fighter.getSkill(skills[index]);
			if(!(skill===undefined)){
				panelButtons=panelButtons+renderSkill(skill.slug);
			}
		}
		panelButtons=panelButtons+'</div>';
		container.append(panelButtons);
	};
	function renderSkill(_skillSlug){
		var result='';
		var skill=fighter.getSkill(_skillSlug);
		if(!(skill===undefined)){
			result='<button class="btn-blue" id="'+fighter.slug+'-'+skill.slug+'" data-skill-slug="'+skill.slug+'">'+skill.name+'</button>';
		}
		return result;
	};
	return {
		init:		init
	};
};
