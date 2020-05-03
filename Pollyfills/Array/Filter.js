// Simple Prototype for Array.filter


if (!Array.prototype.filter) {

    Array.prototype.filter = function (fun) {
        var currentArray = this
        var currentArrayLength = currentArray.length

        var newArray = []

        for (index = 0; index < currentArrayLength; index++) {
            var curentElement = currentArray[index]

            if(fun(curentElement)){
                newArray.push(curentElement)
            }
        }

        return newArray
    }
}