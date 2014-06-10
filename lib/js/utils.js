function now(){
	return new Date().getTime();
};
function dice(sides, deterministicReturn){
	if(deterministicReturn===undefined){
		return Math.ceil(Math.random()*sides);
	}
	return deterministicReturn;
};
function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}
