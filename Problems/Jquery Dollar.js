// https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
// https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
// implement jquery like functions addClass and removeClass


// $('#test').delay(1000).removeClass('blue').delay(1000).delay(1000).addClass('red');

//implement $, it will take a string , which is a query, it will use the querySelector to selec the element.


function $(selector) {
    let element = document.querySelector(selector)
    element.queue = []
    element.active = false
    return element
}

Element.prototype.next = function () {
    if (this.queue.length) this.runTask(this.queue.shift())
}

Element.prototype.runTask = function (callBack) {
    this.active = true
    callBack().then(() => {
        this.active = false
        this.next()
    })
}

Element.prototype.register = function (callBack) {
    console.log(this.queue)
    if (this.active) {
        this.queue.push(callBack)
    } else {
        this.runTask(callBack)
    }
}

Element.prototype.addClass = function (className) {
    that = this
    // let callBack = () => new Promise(resolve => setTimeout(function () {
    //     that.classList.add(className)
    //     resolve()
    // }, 0))
    let callBack = () => {
        that.classList.add(className)
        return Promise.resolve()
    }
    this.register(callBack)
    return this
}

Element.prototype.removeClass = function (className) {
    that = this
    // let callBack = () => new Promise(resolve => setTimeout(function () {
    //     that.classList.remove(className)
    //     resolve()
    // }, 0))
    let callBack = () => {
        that.classList.remove(className)
        return Promise.resolve()
    }
    this.register(callBack)
    return this
}

Element.prototype.delay = function (ms) {
    that = this
    let callBack = () => new Promise(resolve =>
        setTimeout(function () {
            resolve()
        }, ms))

    this.register(callBack)
    return this
}

$('#test')
    .removeClass("red").delay(500)
    .addClass("blue").delay(500).delay(500).removeClass("blue")
    .delay(500).addClass("red").delay(500).removeClass("red")
    .delay(500).addClass("blue").delay(500).removeClass("blue")
    .delay(500).addClass("red").delay(500).removeClass("red")
