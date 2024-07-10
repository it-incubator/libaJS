import {Counter} from "./counter.js";
import {Todos} from "./todos/todos.js";

export function App() {
    const element = document.createElement("div")

    const localState = {
        menuItemId: 'counter', // 'todos'
    }

    render(element, localState)

    return {
        element
    }
}

function render(element, localState) {
    element.innerHTML = '';

    const menuSelector = document.createElement('select')

    const menuItem1 = document.createElement('option')
    menuItem1.value = 'counter'
    menuItem1.append('Counter')
    const menuItem2 = document.createElement('option')
    menuItem2.value = 'todos'
    menuItem2.append('Todolist')
    menuSelector.append(menuItem1,menuItem2);
    menuSelector.value = localState.menuItemId
    element.append(menuSelector)

    menuSelector.addEventListener('change', () => {
        localState.menuItemId = menuSelector.value
        render(element, localState)
    })

    if (localState.menuItemId === 'counter') {
        const counterComponent = Counter()
        element.append(counterComponent.element)
    }
    if (localState.menuItemId === 'todos') {
        const todosComponent = Todos()
        element.append(todosComponent.element)
    }
}