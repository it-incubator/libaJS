export function Counter(_, {liba}) {
    const element = document.createElement("div")

    const [localState, setState] = liba.useState(1)

    const interval = setInterval(() => {
        setState((prev) => prev + 1)
        console.log('Counter Tick')
    }, 1000)


    return {
        element,
        cleanup: () => {
            clearInterval(interval)
        }
    }
}

Counter.render = ({element, statesWithSetters}) => {
    let counterStateWrapper = statesWithSetters[0];
    element.append(counterStateWrapper[0])
}