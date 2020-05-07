(() => {

    const exampleTask = (name) => new Promise((resove, reject) => {
        setTimeout(() => {
            try {
                console.log("Running Taks " + name + " done.")
                // throw RangeError;
                resove()
            }
            catch (e) {
                reject(e)
            }
        }, Math.floor(Math.random() * 2000))
    })

    function TaskRunner(concurrency) {
        this.limit = concurrency;
        this.store = [];
        this.active = 0;
    }

    TaskRunner.prototype.runNextTask = function() {
        if (this.store.length) this.runTask(...this.store.shift())
    }

    TaskRunner.prototype.runTask = function (task, name) {
        this.active++;
        console.log("Start Running task -> ", name)
        task(name).then(() => {
            this.active++
            console.log("Finally Running task -> ", name)
            this.runNextTask()
        })
    }

    TaskRunner.prototype.push = function(task, name){
        if (this.active < this.limit) {
            this.runTask(task, name)
        } else {
            console.log("Queuing Running task -> ", name)
            this.store.push([task, name])
        }
    }

    var task = new TaskRunner(2)
    for (let index = 1; index < 11; index++) {
        task.push(exampleTask, index)
    }

})()