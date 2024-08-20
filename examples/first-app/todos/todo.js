export function Todo(props) {
  const element = document.createElement("li");

  return {
    element,
    cleanup: () => {},
    props,
  };
}

Todo.render = ({ element, props }) => {
  const isDoneCheckbox = document.createElement("input");
  isDoneCheckbox.type = "checkbox";
  isDoneCheckbox.checked = props.todo.isDone;
  isDoneCheckbox.addEventListener("change", () => {
    props.setIsDone(props.todo.id, isDoneCheckbox.checked);
  });
  element.append(isDoneCheckbox);
  element.append(props.todo.title);
};
