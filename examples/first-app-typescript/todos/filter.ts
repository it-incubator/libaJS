export function Filter(props) {
    const element = document.createElement("div")

    return {
        element,
        props
    }
}

Filter.render = ({element, props}) => {
    console.log("FILTER RENDERING...")
   const allButton = document.createElement("button")
    allButton.append('all')
    allButton.addEventListener('click', () => {props.setFilter('all')})

    const doneButton = document.createElement("button")
    doneButton.append('done')
    doneButton.addEventListener('click', () => {props.setFilter('done')})

    const activeButton = document.createElement("button")
    activeButton.append('active')
    activeButton.addEventListener('click', () => {props.setFilter('active')})

    element.append(allButton, doneButton, activeButton)
}