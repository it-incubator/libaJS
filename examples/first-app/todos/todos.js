import { Todo } from "./todo.js";
import { Filter } from "./filter.js";

export function Todos(_, { liba }) {
  const element = document.createElement("ul");

  const localState = liba.useState({
    todos: [
      { id: 1, title: "milk", isDone: false },
      { id: 2, title: "bread", isDone: true },
      { id: 3, title: "juice", isDone: true },
    ],
    filter: "all", // all / done / active
  });

  const component = {
    localState,
    element,
    cleanup: () => {},
  };

  return component;
}

Todos.render = ({ element, localState, liba }) => {
  const { todos, filter } = localState ?? {};

  const setIsDone = (todoId, isDone) => {
    const newTodos = todos.map((td) =>
      td.id === todoId ? { ...td, isDone } : td
    );
    localState.todos = newTodos;
  };

  const setFilter = (filterType) => {
    localState.filter = filterType;
  };

  const filterComponent = liba.create(Filter, { filter, setFilter });

  element.append(filterComponent.element);

  let todosForRender = todos;

  switch (filter) {
    case "all":
      break;
    case "done":
      todosForRender = todos.filter((t) => t.isDone);
      break;
    case "active":
      todosForRender = todos.filter((t) => !t.isDone);
      break;
  }

  for (let i = 0; i < todosForRender.length; i++) {
    const todo = todosForRender[i];
    const todoComponent = liba.create(Todo, { todo, setIsDone });
    element.append(todoComponent.element);
  }
};
