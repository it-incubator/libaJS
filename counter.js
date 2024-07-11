export function Counter(_, {liba}) {
    const element = document.createElement("div")

    const localState = {
        counter: 1
    }

    const interval = setInterval(() => {
        localState.counter++;
        console.log('Counter Tick')
        liba.refresh()
    }, 1000)


    return {
        element,
        cleanup: () => {
            clearInterval(interval)
        },
        localState
    }
}

Counter.render = ({element, localState}) => {
    element.append(localState.counter)
}