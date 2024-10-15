import {TComponentInstance, TStateWrapperWithSetter} from "../Liba";

export function renderComponent(
    componentInstance: TComponentInstance<any, any>,
    stateWrappersWithSetters: TStateWrapperWithSetter<any>
): void {
    componentInstance.childrenIndex = -1;
    componentInstance.useStateCallIndex = -1;
    componentInstance.useEffectCallIndex = -1;

    if (componentInstance.status === 'created') {
        componentInstance.status = 'first-rendering';
    }

    componentInstance.type(
        // localState: componentInstance.localState,
        // statesWithSetters: stateWrappersWithSetters.map(swws => [swws[0].value, swws[1]]),
        componentInstance.props,
        {
            liba: componentInstance.renderLiba
        }
    )

    componentInstance.status = 'other';
}