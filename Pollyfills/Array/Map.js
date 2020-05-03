// Simple Prototype for Array.map


if (!Array.prototype.map) {

    Array.prototype.map = function (fun) {
        var currentArray = this
        var currentArrayLength = currentArray.length

        var newArray = []

        for (index = 0; index < currentArrayLength; index++) {
            var curentElement = currentArray[index]
            var newElement = fun(curentElement)

            newArray.push(newElement)
        }

        return newArray
    }
}