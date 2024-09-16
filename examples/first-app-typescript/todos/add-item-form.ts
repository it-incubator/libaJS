export function AddItemForm(props) {
    const element = document.createElement("div")

    return {
        element,
        props
    }
}

AddItemForm.render = ({element, props}) => {
   const titleInput = document.createElement("input")
    element.append(titleInput)

    const addButton = document.createElement("button")
    addButton.append('add +')
    addButton.addEventListener('click', () => {
        props.itemAdded(titleInput.value)
        titleInput.value = ''
    })

    element.append(addButton)
}