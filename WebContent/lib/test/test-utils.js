module("utils");
test("dice test", function() {
	var value=dice(10, 12);
	equal(value,12,"default value applied correctly");
	value=dice(10);
	var inBounds=value>0&&value<11;
	ok(inBounds,"dice with one value works fine: "+value);
});
