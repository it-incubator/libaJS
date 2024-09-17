import {Counter} from "./counter";
import {Todos} from "./todos/todos";

export function App(_, {liba}) {
    liba.create("div")

    liba.useState({
        menuItemId: 'todos', // 'counter'
    })

    return {
        //element
    }
}

App.render = ({statesWithSetters, liba}) => {
    const [state, setMenuItemId] = statesWithSetters[0]

    liba.create('select', {
        value: state.menuItemId,
        children: [
            liba.create('option', {
                value: 'counter',
                children: ['Counter']
            }, {append: false}),
            liba.create('option', {
                value: 'todos',
                children: ['Todolist']
            }, {append: false}),
        ],
        onChange: (e) => {
            setMenuItemId({menuItemId: e.currentTarget.value})
        }
    })

    if (state.menuItemId === 'counter') {
        liba.create(Counter)
    }
    if (state.menuItemId === 'todos') {
        liba.create(Todos)
    }
}