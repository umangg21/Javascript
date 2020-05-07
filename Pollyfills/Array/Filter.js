// Simple Prototype for Array.filter


if (Array.prototype.filter === undefined) {
    Array.prototype.filter = function (fn) {

        var currentArray = this
        var newArray = [];

        for (var index = 0; index < currentArray.length; index++) {
            if (fn(currentArray[index])) {
                newArray.push(currentArray[index]);
            }
        }

        return newArray;
    };
}