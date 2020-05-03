// Throttling Pollyfill/ Implementation


const GoodExperience = () => {
    console.count("Good Experience")
}

const BetterExperience = () => {
    console.count("Better Experience")
}

const throttle = (func, delay) => {
    let flag1 = true
    return function () {
        let context = this;
        let args = arguments;
        if (flag1) {
            func.apply(context, args)
            flag1 = false;
            setTimeout(() => {
                flag1 = true;
            }, delay)
        }

    }
}

const BExpThrottle = throttle(BetterExperience, 1000)
window.addEventListener("resize", BExpThrottle);

window.addEventListener("resize", GoodExperience);