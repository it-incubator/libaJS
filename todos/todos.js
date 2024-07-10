import {Todo} from "./todo.js";

export function Todos() {
    const element = document.createElement("ul")

    const localState = {
        todos: [{id: 1, title: 'milk', isDone: false}, {id: 2, title: 'bread', isDone: true}],
        setIsDone: (todoId, isDone) => {
            localState.prevState = localState.todos
            localState.todos = localState.todos.map(td => td.id === todoId ? {...td, isDone} : td)
            render(element, localState)
        },
        childComponents: []
    }

    render(element, localState)

    return {
        element,
        cleanup: () => {}
    }
}

function render(element, localState) {
    element.innerHTML = '';

    for (let i = 0; i < localState.todos.length; i++){
        const todo = localState.todos[i];

        const childComponentExist = localState.childComponents[i];
        if (localState.childComponents[i]) {
            if (localState.childComponents[i].props.todo === todo) {
                element.append(localState.childComponents[i].element);
                continue;
            }
        }
        const todoComponent = Todo({todo, setIsDone: localState.setIsDone, meta: {key: todo.id}})
        localState.childComponents[i]?.cleanup()

        localState.childComponents[i] = todoComponent;
        element.append(todoComponent.element)
    }
}