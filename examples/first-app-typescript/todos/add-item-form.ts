export function AddItemForm(props, {liba}) {
    liba.create("div")

    return {
        cleanup: () => {},
        props
    }
}

AddItemForm.render = ({element, props, liba}) => {
    const titleInputRef = liba.create("input")

    liba.create("button", {
        children: ['add +'],
        onClick: () => {
            props.itemAdded(titleInputRef.value)
            titleInputRef.value = ''
        }
    })
}