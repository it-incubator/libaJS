export function Counter(_, {liba}) {
    const element = document.createElement("div")

    const state = liba.useState(1)
    const [localState, setState] = state;

    liba.useEffect(() => {
      console.log('=== Counter | useEffect 1 ===');

      const interval = setInterval(() => {
        setState((prev) => prev + 1)
        console.log('Counter Tick')
    }, 1000);

      return () => {
        console.log('=== Counter | useEffect 1 | cleanup ===')
        clearInterval(interval);
      }
    }, [state]);

    return {
        element,
    }
}

Counter.render = ({element, statesWithSetters}) => {
    let counterStateWrapper = statesWithSetters[0];
    element.append(counterStateWrapper[0])
}