import {renderComponent} from "./renderComponent";
import {TComponentInstance, TStateWrapperWithSetter} from "../Liba";

export function refresh(
    componentInstance: TComponentInstance<any, any>,
    stateWrappersWithSetters: TStateWrapperWithSetter<any>
): void {
    // todo: if element doesn't hav innerHTML??
    componentInstance.element.innerHTML = ''

    if (componentInstance.childrenComponents) {
        for (const cc of componentInstance.childrenComponents) {
            cc.cleanup?.();
        }
    }
    //componentInstance.childrenComponents = []

    renderComponent(componentInstance, stateWrappersWithSetters);
}