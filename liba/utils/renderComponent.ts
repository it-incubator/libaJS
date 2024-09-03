import {TComponentInstance, TStateWrapperWithSetter} from "../Liba";

export function renderComponent(
    componentInstance: TComponentInstance<any, any, any>,
    stateWrappersWithSetters: TStateWrapperWithSetter<any>
): void {
    componentInstance.childrenIndex = -1;

    componentInstance.type.render({
        element: componentInstance.element,
        localState: componentInstance.localState,
        statesWithSetters: stateWrappersWithSetters.map(swws => [swws[0].value, swws[1]]),
        props: componentInstance.props,
        liba: componentInstance.renderLiba
    })
}