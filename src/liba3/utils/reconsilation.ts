import {FiberNode} from "./create-fiber-node.ts";

export const reconsilation = (oldFiber: FiberNode | string | number, newFiber: FiberNode | string | number) => {
    if (oldFiber === undefined) {
        return { type: 'CREATE', newVNode: newFiber, newFiberType: newFiber?.type };
    }
    if (!newFiber) {
        return { type: 'REMOVE', oldFiberType: oldFiber.type };
    }
    if (oldFiber === null || typeof oldFiber !== typeof newFiber || oldFiber?.type !== newFiber.type) {
        return { type: 'REPLACE', newVNode: newFiber, newFiberType: newFiber.type, oldFiberType: oldFiber?.type   };
    }
    if (typeof newFiber === 'string' || typeof newFiber === 'number') {
        if (oldFiber !== newFiber) {
            return { type: 'TEXT', newVNode: newFiber, newFiberType: typeof newFiber };
        } else {
            return null;
        }
    }

    const patch = {
        type: 'UPDATE',
        props: diffProps(oldFiber.props, newFiber.props),
        children: diffChildren(oldFiber.children, newFiber.children),
        newFiberType: newFiber.type,
        oldFiberType: oldFiber.type
    };
    return patch;
}

function diffProps(oldProps, newProps) {
    const patches = [];

    for (let key in newProps) {
        if (newProps[key] !== oldProps[key]) {
            patches.push({ key, value: newProps[key] });
        }
    }

    for (let key in oldProps) {
        if (!(key in newProps)) {
            patches.push({ key, value: undefined });
        }
    }

    return patches;
}

function diffChildren(oldChildren, newChildren) {
    const patches = [];
    const maxLen = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0; i < maxLen; i++) {
        patches.push(reconsilation(oldChildren[i], newChildren[i]));
    }

    return patches;
}