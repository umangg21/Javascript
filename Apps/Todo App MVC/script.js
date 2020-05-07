const TODO_KEY = "todo"

class Modal {
    constructor() {
        this.toDos = JSON.parse(localStorage.getItem(TODO_KEY)) ||
            [
                { id: 1, text: "Run a marathon", complete: false },
                { id: 2, text: "Plan a garden", complete: false }
            ]
    }

    addtoDo(itemText) {
        const item = {
            id: this.toDos.length > 0 ? this.toDos[this.toDos.length - 1].id + 1 : 1,
            text: itemText,
            complete: false
        }
        this.toDos.push(item)
        this._commit(this.toDos)
    }

    deleteToDo(id) {
        this.toDos = this.toDos.filter(todo => todo.id !== id)
        this._commit(this.toDos)
    }

    editToDo(id, updatedText) {
        this.toDos = this.toDos.map(
            (item) => item.id === id ? { ...item, text: updatedText } : item
        )
        this._commit(this.toDos)
    }

    toggleTodo(id) {
        this.toDos = this.toDos.map(
            (item) => item.id === id ? { ...item, complete: !item.complete } : item
        )
        this._commit(this.toDos)
    }

    bindTodoListChanged(callbak) {
        this.onToDoListChange = callbak
    }

    _commit(todos) {
        this.onToDoListChange(todos)
        localStorage.setItem(TODO_KEY, JSON.stringify(todos))
    }

}

class View {
    constructor() {

        this.app = this.getElement("#root")

        this.title = this.createElement("h1")
        this.title.textContent = "Todos"


        this.form = this.createElement("form")

        this.input = this.createElement("input")
        this.input.type = "text"
        this.input.placeholder = "Add todo"
        this.input.name = "todo"

        this.submitButton = this.createElement("button")
        this.submitButton.textContent = "Submit"

        this.todoList = this.createElement('ul', 'todo-list')

        this.form.append(this.input, this.submitButton)

        this.app.append(this.title, this.form, this.todoList)

        this._temporaryTodoText
        this._initLocalListeners()

    }

    _initLocalListeners() {
        this.todoList.addEventListener('input', (event) => {
            if (event.target.className === "editable") {
                this._temporaryTodoText = event.target.innerText
            }
        })
    }

    bindEditToo(handler) {
        this.todoList.addEventListener('focusout', (event) => {
            if (this._temporaryTodoText) {
                const id = parseInt(event.target.parentElement.id)
                handler(id, this._temporaryTodoText)
                this._temporaryTodoText = ""
            }
        })
    }


    bindAddToDo(handler) {
        this.form.addEventListener("submit", (event) => {
            event.preventDefault()

            if (this._todoText) {
                handler(this._todoText)
                this._resetInput()
            }
        })
    }

    bindToggleTodo(handler) {
        this.todoList.addEventListener("click", (event) => {
            if (event.target.type === "checkbox") {
                const id = parseInt(event.target.parentElement.id)
                handler(id)
            }

        })
    }

    bindDeleteTodo(handler) {
        this.todoList.addEventListener("click", (event) => {
            if (event.target.className === "delete") {
                const id = parseInt(event.target.parentElement.id)
                handler(id)
            }

        })
    }

    displayTodos(todos) {
        // Delete all nodes
        while (this.todoList.firstChild)
            this.todoList.removeChild(this.todoList.firstChild)

        if (todos.length === 0) {
            const p = this.createElement("p")
            p.textContent = "Nothing to do! Add a task?"
            this.todoList.append(p)
        } else {
            todos.forEach(todo => {
                const li = this.createElement("li")
                li.id = todo.id


                const checkbox = this.createElement("input")
                checkbox.type = "checkbox"
                checkbox.checked = todo.complete


                const span = this.createElement("span")
                span.contentEditable = true
                span.classList.add('editable')

                if (todo.complete) {
                    const strike = this.createElement("s")
                    strike.textContent = todo.text
                    span.append(strike)
                } else {
                    span.textContent = todo.text
                }

                const deleteButton = this.createElement("button", "delete")
                deleteButton.textContent = "Delete"


                li.append(checkbox, span, deleteButton)
                this.todoList.append(li)
            });
        }
    }

    get _todoText() {
        return this.input.value
    }

    _resetInput() {
        this.input.value = ''
    }

    createElement(tag, className) {
        const element = document.createElement(tag)
        if (className) element.classList.add(className)

        return element
    }

    getElement(selector) {
        return document.querySelector(selector)
    }
}

class Controller {
    constructor(modal, view) {
        this.modal = modal
        this.view = view
        this.onToDoListChange(this.modal.toDos)

        this.modal.bindTodoListChanged(this.onToDoListChange)

        this.view.bindAddToDo(this.handleAddToDo)
        this.view.bindDeleteTodo(this.handleDeleteToDo)
        this.view.bindToggleTodo(this.handleToggleToDo)
        this.view.bindEditToo(this.handleEditToDo)

    }

    onToDoListChange = (toDos) => {
        this.view.displayTodos(toDos)
    }

    handleAddToDo = (text) => {
        this.modal.addtoDo(text)
    }

    handleDeleteToDo = (id) => {
        this.modal.deleteToDo(id)
    }

    handleEditToDo = (id, text) => {
        this.modal.editToDo(id, text)
    }

    handleToggleToDo = (id) => {
        this.modal.toggleTodo(id)
    }
}


const app = new Controller(new Modal(), new View())

console.log(app, "hello")