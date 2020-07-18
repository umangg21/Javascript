// Mindtickle is looking for Javascript Engineers, flexible on experience, but expect strong command on JS.  

// Here is a quick assignment, assuming that there is no promise implemented in Javascript, 
// how would you build the class of Promise which should mimic the behaviour of Promise as described here:

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise


// p1 = new YourNamePromise(executorFn)
// p1.then(handleFulfilledA, handleRejectedA).then(handleFulfilledB,handleRejectedB)
// p1.catch(handleRejectedAny)


function testFunction(params) {
    console.log("HI, I am starting")
    setTimeout(() => {
        console.log("HI, I am done", params)
    }, 3000)
}

function handleFulfilledA() {
    console.log("handleFulfilledA")
}

function handleRejectedA() {
    console.log("handleRejectedA")
}

function handleFulfilledB() {
    console.log("handleFulfilledB")
}

function handleRejectedB() {
    console.log("handleRejectedB")
}

function handleRejectedAny() {
    console.log("handleRejectedAny")
}

// function PsuedoPromise(init) {

//     let thenCallBack

//     this.then = (cb) => {
//         // thenCallBack = cb

//         return new PsuedoPromise((resolve) => {
//             thenCallBack = (value) => {
//                 const result = cb(value)
//                 resolve(result)
//             }
//         })

//     }


//     const resolve = (data) => {
//         thenCallBack && thenCallBack(data)
//     }

//     init(resolve)
// }


// p1 = new PsuedoPromise((resolve, reject) => {
//     console.log("HI, I am starting")
//     setTimeout(() => {
//         console.log("HI, I am done")
//         resolve("123 - data from resolve")
//     }, 2000)
// }).then((data) => {
//     console.log("HI, I am done in 1 then", data)
//     return "456- data from 1 then"
// }).then((data) => {
//     console.log("HI, I am done in 2 then", data)
//     return
// }).then((data) => {
//     console.log("HI, I am done in 3 then", data)
// })



function NewPromise(init) {

    let thenCallBack;
    let catchCallBack;

    this.catch = (catchFunc) => {
        catchCallBack = catchFunc
    }

    this.then = (thenfunc) => {
        return new NewPromise((resolve, reject) => {
            thenCallBack = data => {
                try {
                    let result = thenfunc(data)
                    result instanceof NewPromise ? result.then(resolve) : resolve(result)
                }
                catch (error) {
                    reject(error)
                }
            }

            catchCallBack = (data) => {
                reject(data)
            }
        })
    }

    const resolve = (data) => {
        try {
            thenCallBack && thenCallBack(data)
        } catch (error) {
            reject(error)
        }
    }

    const reject = (data) => {
        debugger
        catchCallBack && catchCallBack(data)
    }

    try {
        init && init(resolve, reject)
        debugger
    } catch (error) {
        reject(error)
    }
}



new NewPromise((resolve, reject) => {
    console.log("I am starting")
    setTimeout(() => {
        console.log("I am done")
        throw Error("2345")
        resolve(123)
        // reject(123)
        // throw Error("Hello new Error")
    }, 2000)
})
    .then((data) => {
        console.log("Inside 1 then, data from Promise - ", data)
        return 456
    })
    .then((data) => {
        console.log("Inside 2 then, data from 1 then - ", data)
        return 456
    })
    .catch((err) => {
        console.log("Inside catch", err)
    })