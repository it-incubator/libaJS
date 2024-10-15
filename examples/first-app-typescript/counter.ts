export function Counter(_, {liba}) {
    console.log('Counter rendering')
    const [localState, setState] = liba.useState(1)

    liba.useEffect(() =>{
        const interval = setInterval(() => {
            setState((prev) => prev + 1)
            console.log('Counter Tick')
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    })

    liba.create("div")
    liba.create('span', { children: [localState] })
}