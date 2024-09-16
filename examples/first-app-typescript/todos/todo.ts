export function Todo(props) {
    const element = document.createElement("li")

    return {
        element,
        props
    }
}

Todo.render = ({element, props}) => {
    console.log('TODO RENDERED', props)

    const isDoneCheckbox = document.createElement("input")
    isDoneCheckbox.type = 'checkbox'
    isDoneCheckbox.checked = props.todo.isDone
    isDoneCheckbox.addEventListener("change", () => {
        props.setIsDone(props.todo.id, isDoneCheckbox.checked)
    })
    element.append(isDoneCheckbox)
    element.append(props.todo.title)

    const deleteButton = document.createElement("button")
    deleteButton.innerText = "x"
    deleteButton.addEventListener("click", () => {
        props.deleteTodo(props.todo.id)
    })
    element.append(deleteButton)
}