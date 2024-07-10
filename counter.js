export function Counter() {
    const element = document.createElement("div")

    const localState = {
        counter: 1
    }

    render(element, localState)

    const interval = setInterval(() => {
        localState.counter++;
        console.log('Counter Tick')
        render(element, localState)
    }, 1000)


    return {
        element,
        cleanup: () => {
            clearInterval(interval)
        }
    }
}

function render(element, localState) {
    element.innerHTML = '';
    element.append(localState.counter)
}