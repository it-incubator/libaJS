export function Todo(_, {liba}) {
   liba.create("li")

    return {
       // todo: remove cleanup from return instance;
        // todo: after this remove return instance from functino compoennt
        cleanup: () => {}
    }
}

// todo: ref mechanism
Todo.render = ({props, liba}) => {
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