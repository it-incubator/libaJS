import {Counter} from "./counter";
import {Todos} from "./todos/todos";

export function App(_, {liba}) {
    const element = document.createElement("div")

    liba.useState({
        menuItemId: 'todos', // 'counter'
    })

    return {
        element
    }
}

App.render = ({element, statesWithSetters, liba}) => {
    const [state, setMenuItemId] = statesWithSetters[0]
    const menuSelector = document.createElement('select')

    const menuItem1 = document.createElement('option')
    menuItem1.value = 'counter'
    menuItem1.append('Counter')
    const menuItem2 = document.createElement('option')
    menuItem2.value = 'todos'
    menuItem2.append('Todolist')
    menuSelector.append(menuItem1,menuItem2);
    menuSelector.value = state.menuItemId
    element.append(menuSelector)

    menuSelector.addEventListener('change', () => {
        setMenuItemId({menuItemId: menuSelector.value})
    })
    if (state.menuItemId === 'counter') {
        const counterComponent = liba.create(Counter)
        element.append(counterComponent.element)
    }
    if (state.menuItemId === 'todos') {
        const todosComponent = liba.create(Todos)
        element.append(todosComponent.element)
    }
}