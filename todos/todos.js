import {Todo} from "./todo.js";

export function Todos() {
    const element = document.createElement("ul")

    const localState = {
        todos: [{id: 1, title: 'milk'}, {id: 2, title: 'bread'}]
    }

    render(element, localState)

    return {
        element,
        cleanup: () => {}
    }
}

function render(element, localState) {
    element.innerHTML = '';

    for (const todo of localState.todos) {
        const todoComponent = Todo(todo)
        element.append(todoComponent.element)
    }
}