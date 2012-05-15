/*
	Extensions to Javascript Objects.
*/


/**
 * Returns the first element that respects an arbitrary predicate, or null if it doesn't finds one.
 */
Array.prototype.firstOrNull = function(predicate){
	var tmp = this.filter(
				(function(){
					// Set to false as soon as it finds a matching item
					var first = true;

					//Return function with closured var first
					return function(item){
						// If already found one elem, stops testing conds and returns always false
						if(!first) return false;

						// If doesn't have an item yet, test conds; return true as soon as it finds one
						if(predicate(item)){
							first = false;
							return true;
						}

						// returns false if all fails
						return false;
					}
				})());
	//---

	return tmp && tmp[0] ? tmp[0] : null;
}

Array.prototype.contains = function(item){
	return this.indexOf(item) > -1;
}
