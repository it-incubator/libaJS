export function Counter(_, {liba}) {
    liba.create("div")

    const [localState, setState] = liba.useState(1)

    const interval = setInterval(() => {
        setState((prev) => prev + 1)
        console.log('Counter Tick')
    }, 1000)


    return {
        cleanup: () => {
            clearInterval(interval)
        }
    }
}

Counter.render = ({statesWithSetters, liba}) => {
    let counterStateWrapper = statesWithSetters[0];
    liba.create('span', { children: [counterStateWrapper[0]] })
}