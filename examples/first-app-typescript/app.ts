import {Counter} from "./counter";
import {Todos} from "./todos/todos";

export function App(_, {liba}) {
    liba.create("div")
    const [state, setMenuItemId] = liba.useState({
        menuItemId: 'todos', // 'counter'
    })

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