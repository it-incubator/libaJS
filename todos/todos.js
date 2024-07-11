import {Todo} from "./todo.js";
import {Liba} from "../liba/Liba.js";

export function Todos(_, {liba}) {
    const element = document.createElement("ul")

    const localState = {
        todos: [{id: 1, title: 'milk', isDone: false}, {id: 2, title: 'bread', isDone: true}],
        setIsDone: (todoId, isDone) => {
            localState.prevState = localState.todos
            localState.todos = localState.todos.map(td => td.id === todoId ? {...td, isDone} : td)
            //Todos.render({element, localState, component})
            liba.refresh();
        },
        childComponents: []
    }

    const component = {
        element,
        cleanup: () => {},
        type: Todos,
        localState
    }

    return component
}

Todos.render = ({element, localState, props, liba}) => {
    element.innerHTML = '';

    for (let i = 0; i < localState.todos.length; i++){
        const todo = localState.todos[i];

        if (localState.childComponents[i]) {
            if (localState.childComponents[i].props.todo === todo) {
                element.append(localState.childComponents[i].element);
                continue;
            }
        }
        const todoComponent = liba.create(Todo, {todo, setIsDone: localState.setIsDone, meta: {key: todo.id}})
        localState.childComponents[i]?.cleanup()

        localState.childComponents[i] = todoComponent;
        element.append(todoComponent.element)
    }
}