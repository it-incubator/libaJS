import {Todo} from "./todo.js";
import {Filter} from "./filter.js";

export function Todos(_, {liba}) {
    const element = document.createElement("ul")

    liba.useState( [
        {id: 1, title: 'milk', isDone: false},
        {id: 2, title: 'bread', isDone: true},
        {id: 3, title: 'juice', isDone: true}
    ])

    liba.useState('all');// all / done / active

    const component = {
        element,
        cleanup: () => {}
    }

    return component
}

Todos.render = ({element, statesWithSetters, props, liba}) => {
    const [todos, setTodos] = statesWithSetters[0]
    const [filter, setFilter] = statesWithSetters[1]

    const setIsDone =  (todoId, isDone) => {
            setTodos(todos.map(td => td.id === todoId ? {...td, isDone} : td))
    }

    const filterComponent = liba.create(Filter, {filter, setFilter})

    element.append(filterComponent.element)

    let todosForRender = todos;
    switch (filter) {
        case 'all': break;
        case 'done': todosForRender = todos.filter(t => t.isDone); break;
        case 'active': todosForRender = todos.filter(t => !t.isDone); break;
    }

    for (let i = 0; i < todosForRender.length; i++){
      const todo = todosForRender[i]
      const todoComponent = liba.create(Todo, {todo, setIsDone: setIsDone})
      element.append(todoComponent.element)
    }


}