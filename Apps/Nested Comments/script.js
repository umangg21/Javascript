class Modal {
    constructor() {
        this.commentDict = {
            "1583783892664": {
                "text": "comment 1",
                "child": [
                    1583788194239,
                    1583788245746
                ]
            },
            "1583783896797": {
                "text": "comment 2",
                "child": []
            },
            "1583788185893": {
                "text": "commnet 3",
                "child": [
                    1583815122766,
                    1583815162222
                ]
            },
            "1583788194239": {
                "text": "reply 1 1",
                "parentId": 1583783892664,
                "child": [
                    1583788225385
                ]
            },
            "1583788225385": {
                "text": "reply 1 1 1",
                "parentId": 1583788194239,
                "child": []
            },
            "1583788245746": {
                "text": "reply 1 2",
                "parentId": 1583783892664,
                "child": [
                    1583815091738,
                    1583815112515
                ]
            },
            "1583815091738": {
                "text": "reply 1 2 1",
                "parentId": 1583788245746,
                "child": [
                    1583815098582,
                    1583815103443
                ]
            },
            "1583815098582": {
                "text": "reply 1 2 1 1",
                "parentId": 1583815091738,
                "child": []
            },
            "1583815103443": {
                "text": "reply 1 2 1 2",
                "parentId": 1583815091738,
                "child": []
            },
            "1583815112515": {
                "text": "reply 1 2 2",
                "parentId": 1583788245746,
                "child": []
            },
            "1583815122766": {
                "text": "reply 3 1",
                "parentId": 1583788185893,
                "child": [
                    1583815131582,
                    1583815140819
                ]
            },
            "1583815131582": {
                "text": "reply 3 1 1",
                "parentId": 1583815122766,
                "child": []
            },
            "1583815140819": {
                "text": "reply 3 1 2",
                "parentId": 1583815122766,
                "child": []
            },
            "1583815162222": {
                "text": "reply 3 2",
                "parentId": 1583788185893,
                "child": []
            },
            "1583815687433": {
                "text": "comment 4",
                "child": []
            }
        }
        this.allComents = [
            1583783892664,
            1583783896797,
            1583788185893,
            1583788194239,
            1583788225385,
            1583788245746,
            1583815091738,
            1583815098582,
            1583815103443,
            1583815112515,
            1583815122766,
            1583815131582,
            1583815140819,
            1583815162222,
            1583815687433
        ]
    }

    addNewReply = (text, parentId) => {
        if (text) {
            let id = new Date().getTime()
            this.commentDict[id] = {
                text,
                parentId,
                child: [],
            }

            this.commentDict[parentId].child.push(id)
            this.allComents.push(id)

            this.displayAllcomments(this.allComents, this.commentDict)
        }
    }

    editReply = (text, id) => {
        this.commentDict[id].text = text
        this.displayAllcomments(this.allComents, this.commentDict)
    }

    addNewComment = (text) => {
        if (text) {
            let id = new Date().getTime()
            this.commentDict[id] = {
                text,
                child: [],
            }
            this.allComents.push(id)
            this.displayAllcomments(this.allComents, this.commentDict)
        }
    }

    recursivelyDelete = (id) => {
        const { child = [] } = this.commentDict[id]
        child.forEach((item) => this.recursivelyDelete(item))
        this.allComents = this.allComents.filter((c) => c != id)
        delete this.commentDict[id]
    }

    deleteComment = (id) => {

        //remove from parent

        const { parentId = "" } = this.commentDict[id]
        if (parentId) {
            this.commentDict[parentId].child = this.commentDict[parentId].child.filter(item => item != id)
        }

        // remove all childs
        this.recursivelyDelete(id)
        this.displayAllcomments(this.allComents, this.commentDict)
    }

    bindDisplayAllCommnets = (func) => {
        this.displayAllcomments = func
    }

}

class View {
    constructor() {
        this.app = this.getElement("#root")
        this.form = this.getElement("#newComment")
        this.inputField = this.getElement("#newCommentArea")
        this.commentListView = this.getElement("#commentList")
        this.bindViewReplyComment()
        this.bindViewCancelComment()

        this._temporaryText = ""
        this._initiateLocalListener()
    }

    _initiateLocalListener = () => {
        this.commentListView.addEventListener('input', (event) => {
            if (event.target.className === "editable") {
                this._temporaryText = event.target.innerText
            }
        })
    }

    bindEditTodo = (handler) => {
        this.commentListView.addEventListener('focusout', (event) => {
            event.preventDefault()
            if (this._temporaryText) {
                const { parentElement } = event.target
                const id = parseInt(parentElement.id.slice(2, parentElement.id.length))
                handler(this._temporaryText, id)
                this._temporaryText = ""
            }
        })
    }

    bindAddNewComment = (handler) => {
        this.form.addEventListener('click', (event) => {
            event.preventDefault()
            if (event.target.id === "newCommentAdd") {
                const comment = this.inputField.value
                handler(comment)
                this.inputField.value = ""
            }
        })
    }

    bindViewReplyComment = () => {
        this.commentListView.addEventListener('click', (event) => {
            event.preventDefault()
            if (event.target.innerText === "Reply") {
                const { parentElement } = event.target

                const textArea = this.createElement("textArea")
                textArea.placeholder = "Enter Reply"

                const saveButton = this.createElement("button")
                saveButton.innerText = "Save"

                const cancelButton = this.createElement("button")
                cancelButton.innerText = "Cancel"

                parentElement.childNodes.forEach((node) => {
                    if (node.innerText === "Delete" || node.innerText === "Reply") {
                        node.style.display = "none"
                    }
                })
                parentElement.append(textArea, saveButton, cancelButton)
            }
        })

    }

    bindAddReplyComment = (handler) => {
        this.commentListView.addEventListener('click', (event) => {
            event.preventDefault()
            if (event.target.innerText === "Save") {
                const { parentElement } = event.target

                parentElement.childNodes.forEach((node) => {
                    if (node.type === "textarea") {
                        handler(node.value, parseInt(parentElement.id.slice(2, parentElement.id.length)))
                    }
                })
            }
        })

    }

    bindDeleteComment = (handler) => {
        this.commentListView.addEventListener('click', (event) => {
            event.preventDefault()
            if (event.target.innerText === "Delete") {
                const { parentElement } = event.target
                handler(parseInt(parentElement.id.slice(2, parentElement.id.length)))
            }
        })
    }


    bindViewCancelComment = () => {
        this.commentListView.addEventListener('click', (event) => {
            event.preventDefault()
            if (event.target.innerText === "Cancel") {
                const { parentElement } = event.target

                let toberemoveNode = []

                parentElement.childNodes.forEach((node) => {
                    if (node.innerText === "Save"
                        || node.innerText === "Cancel"
                        || node.type === "textarea") {
                        toberemoveNode.push(node)
                    }
                    if (node.innerText === "Delete"
                        || node.innerText === "Reply"
                    ) {
                        node.style.display = ""
                    }
                })
                toberemoveNode.forEach((node) => parentElement.removeChild(node))
            }
        })
    }

    getAllCommentView = (comments = [], commentDict, parentElement) => {
        const commentList = this.createElement("ul")
        parentElement.append(commentList)

        comments.forEach((commentid) => {

            let comment = commentDict[commentid]

            const li = this.createElement("li")
            li.id = "li" + commentid

            if (!parentElement.querySelector("#" + li.id)) {

                const div = this.createElement("div")
                div.id = "li" + commentid

                const span = this.createElement("span", "editable")
                span.contentEditable = true
                span.innerText = comment.text

                const replyButton = this.createElement("button")
                replyButton.innerText = "Reply"

                const deleteButton = this.createElement("button")
                deleteButton.innerText = "Delete"

                div.append(span, replyButton, deleteButton)

                li.append(div)

                commentList.append(li)

                Array.isArray(comment.child) && comment.child.forEach((item) => {
                    this.getAllCommentView(comment.child, commentDict, li)
                })

            }

        })
    }

    viewAllComments = (comments = [], commentDict) => {

        while (this.commentListView.firstChild)
            this.commentListView.removeChild(this.commentListView.firstChild)
        const commentList = this.getAllCommentView(comments, commentDict, this.commentListView)

    }

    getElement = (selector) => {
        return document.querySelector(selector)
    }

    createElement(tag, className) {
        const element = document.createElement(tag)
        if (className) element.classList.add(className)

        return element
    }


}

class Controller {

    constructor(modal, view) {
        this.modal = modal
        this.view = view
        this.view.bindAddNewComment(this.handleAddNewComment)
        this.view.bindAddReplyComment(this.handleAddReply)
        this.view.bindDeleteComment(this.handleDeleteComment)
        this.view.bindEditTodo(this.handleEditReply)
        this.modal.bindDisplayAllCommnets(this.handleChangeAnyComment)
        this.handleChangeAnyComment(this.modal.allComents, this.modal.commentDict)

    }

    handleDeleteComment = (commentId) => {
        this.modal.deleteComment(commentId)
    }

    handleChangeAnyComment = (allcomments, commentDict) => {
        this.view.viewAllComments(allcomments, commentDict)
    }

    handleAddNewComment = (comment) => {
        this.modal.addNewComment(comment)
    }

    handleAddReply = (reply, parentId) => {
        this.modal.addNewReply(reply, parentId)
    }

    handleEditReply = (reply, id) => {
        this.modal.editReply(reply, id)
    }

}

var app = new Controller(new Modal, new View)