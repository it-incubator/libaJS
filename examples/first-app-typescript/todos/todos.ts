import {Todo} from "./todo";
import {Filter} from "./filter";
import {AddItemForm} from "./add-item-form";

export function Todos(_, {liba}) {
    const element = document.createElement("div")

    const state = liba.useState( [
        {id: 1, title: 'milk', isDone: false},
        {id: 2, title: 'bread', isDone: true},
        {id: 3, title: 'juice', isDone: true}
    ])

    liba.useState('all');// all / done / active

    liba.useEffect(() => {
      console.log('=== Todos | useEffect 1 ===');
    }, [state]);

    const component = {
        element,
        cleanup: () => {}
    }

    return component
}

Todos.render = ({element: rootElement, statesWithSetters, props, liba}) => {
    const element = document.createElement("ul")


    const [todos, setTodos] = statesWithSetters[0]
    const [filter, setFilter] = statesWithSetters[1]

    console.log(todos)

    const setIsDone =  (todoId, isDone) => {
            setTodos((prev) => prev.map(td => td.id === todoId ? {...td, isDone} : td))
    }

    const deleteTodo =  (todoId) => {
       setTodos(prev => prev.filter(td => td.id !== todoId))
    }

    let addItem = (value) => {
        setTodos(prev => [...prev, {id: Date.now(), title: value, isDone: false}])
    };

    const addItemFormComponent = liba.create(AddItemForm, {itemAdded: addItem})

    rootElement.append(addItemFormComponent.element)

    rootElement.append(element)


    let todosForRender = todos;
    switch (filter) {
        case 'all': break;
        case 'done': todosForRender = todos.filter(t => t.isDone); break;
        case 'active': todosForRender = todos.filter(t => !t.isDone); break;
    }

    for (let i = 0; i < todosForRender.length; i++){
      const todo = todosForRender[i]
      const todoComponent = liba.create(Todo, {todo, setIsDone: setIsDone, deleteTodo}, {key: todo.id})
      element.append(todoComponent.element)
    }

    const filterComponent = liba.create(Filter, {filter, setFilter})
    rootElement.append(filterComponent.element)
}