export function Todo(props, {liba}) {
    liba.create("li")
    console.log('TODO RENDERED', props)

    liba.create("input", {
        type: 'checkbox',
        checked: props.todo.isDone,
        onChange: (e) => {
            props.setIsDone(props.todo.id, e.currentTarget.checked)
        }
    })

    liba.create('span', {children: [props.todo.title]})

    liba.create("button", {
        children: ['x'],
        onClick: () => {
            props.deleteTodo(props.todo.id)
        }
    })
}
