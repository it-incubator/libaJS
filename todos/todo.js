export function Todo(todo) {
    const element = document.createElement("li")

    const localState = {
        todo
    }

    render(element, localState)

    return {
        element,
        cleanup: () => {}
    }
}

function render(element, localState) {
    element.innerHTML = '';
    element.append(localState.todo.title)
}