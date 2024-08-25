import {renderComponent} from "./renderComponent";
import {TComponentInstance, TStateWrapperWithSetter} from "../Liba";

export function refresh(
    componentInstance: TComponentInstance<any, any, any>,
    stateWrappersWithSetters: TStateWrapperWithSetter<any>
): void {
    // todo: if element doesn't hav innerHTML??
    componentInstance.element.innerHTML = ''

    componentInstance.childrenComponents?.forEach(cc => cc.cleanup?.())
    //componentInstance.childrenComponents = []

    renderComponent(componentInstance, stateWrappersWithSetters);
}