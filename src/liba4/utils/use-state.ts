type SetterReducer<T> = (prevState: T) => T
type TValueOrReducer<T> = T | SetterReducer<T>;
export type TSetter<T> = (valueOrReducer: TValueOrReducer<T>) => void;
export type TStateWrapperWithSetter<T> = [ {value: T}, TSetter<T>];

export type StateWrapper<T> = {value: T}
export type StateWrapperWithSetter<T> = [StateWrapper<T>, TSetter<T>]

export function useState<T>(
    initialState: T,
   // stateWrappersWithSetters: TStateWrapperWithSetter<T>,
    renderComponent: () => void
): StateWrapperWithSetter<T> {
    const stateWrapper: StateWrapper<T> = { value: initialState }
    const setter: TSetter<T> = (newValueOrReducer: T | TValueOrReducer<T>) => {
        if (typeof newValueOrReducer === 'function') {
            stateWrapper.value = (newValueOrReducer as (prevValue: T) => T)(stateWrapper.value)
        } else {
            stateWrapper.value = newValueOrReducer
        }
        renderComponent()
    };

    // @ts-ignore todo: make typing
    //stateWrappersWithSetters.push([stateWrapper, setter])
    //console.log(stateWrappersWithSetters, "stateWrappersWithSetters");
    return [stateWrapper, setter]
}