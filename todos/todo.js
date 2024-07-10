export function Todo(props) {
    const element = document.createElement("li")

    render(element, props)

    return {
        element,
        cleanup: () => {},
        type: Todo,
        props
    }
}

function render(element, props) {
    console.log('TODO RENDERED', props)
    element.innerHTML = '';

    const isDoneCheckbox = document.createElement("input")
    isDoneCheckbox.type = 'checkbox'
    isDoneCheckbox.checked = props.todo.isDone
    isDoneCheckbox.addEventListener("change", () => {
        props.setIsDone(props.todo.id, isDoneCheckbox.checked)
    })
    element.append(isDoneCheckbox)
    element.append(props.todo.title)
}