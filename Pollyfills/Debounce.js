// Debounce Pollyfills/Implementation

const GoodExperience = () => {
    console.count("Good Experience")
}

const BetterExperience = () => {
    console.count("Better Experience")
}

const debounce = function (fun, delay) {
    let timer ;
    return () => {
        let context = this
        let args = arguments
        clearTimeout(timer)
        timer = setTimeout(() => {
            fun.apply(context, args)
        }, delay)
    }
}


const BeExpDebounce = debounce(BetterExperience, 300)

window.addEventListener("resize", BeExpDebounce);


window.addEventListener("resize", GoodExperience);