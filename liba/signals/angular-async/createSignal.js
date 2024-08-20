// эффект будет здесь в момент когда он запущен
let currentEffect = null

export function createSignal(initialValue) {
    let _value = initialValue
    let _subscribers = new Set()

    const _signal = () => {
        if (currentEffect !== null) {
            _subscribers.add(currentEffect)
        }
        return _value
    }

    _signal.set = (newValue) => {
        _value = newValue

        _subscribers.forEach(s => setTimeout(s, 0))
    }

    _signal.update = (reducer) => {
        const newValue = reducer(_value)
        _signal.set(newValue)
    }

    return _signal
}

export function registerEffect(effect) {
    const effectWrapper = () => {
        currentEffect = effect;
        effect()
        currentEffect = null
    }
    setTimeout(effectWrapper, 0)
}

export function computed(fn) {
    const _signal = () => {
        return fn()
    }
    return _signal
}


