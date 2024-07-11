import {Todo} from "./todo.js";

export function Todos(_, {liba}) {
    const element = document.createElement("ul")

    const localState = {
        todos: [{id: 1, title: 'milk', isDone: false}, {id: 2, title: 'bread', isDone: true}],
        setIsDone: (todoId, isDone) => {
            localState.prevState = localState.todos
            localState.todos = localState.todos.map(td => td.id === todoId ? {...td, isDone} : td)
            liba.refresh();
        },
        childComponents: []
    }

    const component = {
        element,
        cleanup: () => {},
        localState
    }

    return component
}

Todos.render = ({element, localState, props, liba}) => {
    for (let i = 0; i < localState.todos.length; i++){
      const todo = localState.todos[i]
      const todoComponent = liba.create(Todo, {todo, setIsDone: localState.setIsDone})
      element.append(todoComponent.element)
    }
}