function BindPollyfill() {
    let name = {
        firstName: "umang",
        lastName: "gupta"
    }

    // This need to do

    // let printName = function(){
    //     console.log(this.firstName, this.lastName)
    // }

    // printName1 = printName.bind(name)
    // printName1() 


    // 1. simple parameters

    let printName = function () {
        console.log(this.firstName, this.lastName)
    }

    Function.prototype.myBind = function (...args) {
        let obj = this
        return () => {
            obj.call(args[0])
        }
    }

    printName2 = printName.myBind(name)
    printName2()

    // 2. parameter while binding


    let printNameB = function (state, country) {
        console.log(this.firstName, this.lastName, state, country)
    }

    Function.prototype.myBindB = function (...args) {
        let obj = this
        let params = args.slice(1)
        return () => {
            obj.call(args[0], ...params)
        }
    }

    printName3 = printNameB.myBindB(name, "UP", "India")
    printName3()


    // 3. parameters while calling

    let printNameC = function (state, country) {
        console.log(this.firstName, this.lastName, state, country)
    }
        // 3.a. Using call
    Function.prototype.myBindC = function (...args) {
        let obj = this
        let params = args.slice(1)
        return (...childParams) => {
            const finalParams = [...params, ...childParams]
            obj.call(args[0], ...finalParams)
        }
    }

        // 3.b. Using apply
    Function.prototype.myBindD = function (...args) {
        let obj = this
        let params = args.slice(1)
        return (...childParams) => {
            obj.apply(args[0], [...params, ...childParams])
        }
    }

    printName3 = printNameC.myBindC(name, "UP")
    printName3("India")

    printName4 = printNameC.myBindD(name, "UP")
    printName4("India")



}

BindPollyfill()