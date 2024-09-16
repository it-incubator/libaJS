import {renderComponent} from "./renderComponent";
import {TComponentInstance, TStateWrapperWithSetter} from "../Liba";

export function refresh(
    componentInstance: TComponentInstance<any, any, any>,
    stateWrappersWithSetters: TStateWrapperWithSetter<any>,
    cleanupWrappers: any[],
): void {
    // todo: if element doesn't hav innerHTML??
    componentInstance.element.innerHTML = ''

    for (const cleanup of cleanupWrappers) {
      cleanup();
    }
    //componentInstance.childrenComponents = []

    renderComponent(componentInstance, stateWrappersWithSetters);
}