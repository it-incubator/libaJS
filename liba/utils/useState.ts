import {TDispatch, TStateWrapperWithSetter} from "../Liba";

export function useState<T>(
    initialState: T,
    stateWrappersWithSetters: TStateWrapperWithSetter<T>,
    refreshComponent: () => void
): [T, TDispatch<T>] {
    const stateWrapper = { value: initialState }
    const setter = (newValueOrReducer) => {
        if (typeof newValueOrReducer === 'function') {
            stateWrapper.value = newValueOrReducer(stateWrapper.value)
        } else {
            stateWrapper.value = newValueOrReducer
        }
        refreshComponent()
    };

    stateWrappersWithSetters.push([stateWrapper, setter])
    console.log(stateWrappersWithSetters, "stateWrappersWithSetters");
    return [stateWrapper.value, setter]
}