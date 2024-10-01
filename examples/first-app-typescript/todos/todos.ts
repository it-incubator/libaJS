import {Todo} from "./todo";
import {Filter} from "./filter";
import {AddItemForm} from "./add-item-form";

export function Todos(_, {liba}) {
    const [todos, setTodos] = liba.useState( [
        {id: 1, title: 'milk', isDone: false},
        {id: 2, title: 'bread', isDone: true},
        {id: 3, title: 'juice', isDone: true}
    ])

    const [filter, setFilter] = liba.useState('all');// all / done / active

    liba.create("div")
    console.log('TODOS RENDERING')

    // const [todos, setTodos] = statesWithSetters[0]
    //const [filter, setFilter] = statesWithSetters[1]

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

    liba.create(AddItemForm, {itemAdded: addItem})

    let todosForRender = todos;
    switch (filter) {
        case 'all': break;
        case 'done': todosForRender = todos.filter(t => t.isDone); break;
        case 'active': todosForRender = todos.filter(t => !t.isDone); break;
    }

    const items = []
    for (let i = 0; i < todosForRender.length; i++){
        const todo = todosForRender[i]
        const todoComponent = liba.create(Todo, {todo, setIsDone: setIsDone, deleteTodo}, {key: todo.id})
        items.push(todoComponent.element)
    }
    liba.create("ul", {
        children: items
    })

    liba.create(Filter, {filter, setFilter})
}
