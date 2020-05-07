// Simple Prototype for Array.map


if (Array.prototype.map === undefined) {
    Array.prototype.map = function (fn) {

        var currentArray = this
        var newArray = [];

        for (var index = 0; index < currentArray.length; index++) {

            var newElement = fn(currentArray[index])
            newArray.push(newElement);
        }

        return newArray;
    };
}