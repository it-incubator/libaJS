export function AddItemForm(props, {liba}) {
    console.log("AddItemForm rendering")
    liba.create("div")
    const titleInputRef = liba.create("input")

    liba.create("button", {
        children: ['add +'],
        onClick: () => {
            props.itemAdded(titleInputRef.value)
            titleInputRef.value = ''
        }
    })
}
