import {propsTheSame} from "./propsTheSame";
import {Liba, TComponentFunction, TComponentInstance} from "../Liba";

export function createChildren<
    CI extends TComponentInstance<any, any>,
    CF extends TComponentFunction<any, any>,
    P extends {}
>(
    componentInstance: CI,
    ChildrenComponentFunction: CF,
    props: P,
    key?: string
): TComponentInstance<Partial<any>, {}>
{
    componentInstance.childrenIndex++

    const alreadyExistedComponentInstance = componentInstance.childrenComponents?.getItem(ChildrenComponentFunction, key)

    if (alreadyExistedComponentInstance) {
        if (alreadyExistedComponentInstance.type === ChildrenComponentFunction) {
            if (propsTheSame(props, alreadyExistedComponentInstance.props)) {
                //componentInstance.childrenComponents?.killGroupsBefore(ChildrenComponentFunction, key)
                return alreadyExistedComponentInstance
            } else {
                alreadyExistedComponentInstance.props = props
                alreadyExistedComponentInstance.renderLiba.refresh()
                return alreadyExistedComponentInstance
            }
        } else {
            delete componentInstance.childrenComponents?.[componentInstance.childrenIndex]
        }
    }

    return Liba.create(ChildrenComponentFunction, props)
}