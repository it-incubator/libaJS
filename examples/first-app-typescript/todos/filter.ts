export function Filter(props, {liba}) {
   liba.create("div")

    return {
        cleanup: () => {},
        props
    }
}

Filter.render = ({element, props, liba}) => {
    console.log("FILTER RENDERING...")

    const allButton = liba.create("button", {
       children: ['all'],
       onClick: () => {props.setFilter('all')}
   })

    const doneButton = liba.create("button", {
        children: ['done'],
        onClick: () => {props.setFilter('done')}
    })

    const activeButton = liba.create('button', {
        children: ['active'],
        onClick: () => {props.setFilter('active')}
    })

    element.append(allButton, doneButton, activeButton)
}