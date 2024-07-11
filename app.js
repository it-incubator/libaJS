import {Counter} from "./counter.js";
import {Todos} from "./todos/todos.js";

export function App(_, liba) {
    const element = document.createElement("div")

    const localState = {
        menuItemId: 'todos', // 'counter'
    }

    return {
        element,
        localState
    }
}

App.render = ({element, localState, liba}) => {
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
        liba.refresh()
    })
    if (localState.menuItemId === 'counter') {
        const counterComponent = liba.create(Counter)
        element.append(counterComponent.element)
    }
    if (localState.menuItemId === 'todos') {
        const todosComponent = liba.create(Todos)
        element.append(todosComponent.element)
    }
}