import {FiberNode} from "./create-fiber-node.ts";

export const reconsilation = (oldFiber: FiberNode | string | number, newFiber: FiberNode | string | number) => {
    if (!oldFiber && !newFiber) return undefined;

    if (oldFiber === undefined || oldFiber === null) {
        return { type: 'CREATE', newVNode: newFiber, newFiberType: newFiber?.type };
    }
    if (!newFiber) {
        return { type: 'REMOVE', oldFiberType: oldFiber.type };
    }
    if (oldFiber === null || typeof oldFiber !== typeof newFiber || oldFiber?.type !== newFiber.type) {
        return { type: 'REPLACE', newVNode: newFiber, newFiberType: newFiber.type, oldFiberType: oldFiber?.type };
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
        sibling: undefined,
        child: undefined,
        parent: null,
        newFiberType: newFiber.type,
        oldFiberType: oldFiber.type
    };

    // Рекурсивная обработка детей с сохранением родительских связей
    if (oldFiber.child || newFiber.child) {
        patch.child = reconsilation(oldFiber.child, newFiber.child);
        if (patch.child) patch.child.parent = newFiber;  // Сохраняем ссылку на родителя для дочерних элементов
    }

    // Рекурсивная обработка сиблингов с сохранением родительских связей
    if (oldFiber.sibling || newFiber.sibling) {
        patch.sibling = reconsilation(oldFiber.sibling, newFiber.sibling);
        if (patch.sibling) patch.sibling.parent = newFiber;  // Сохраняем ссылку на родителя для сиблингов
    }

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