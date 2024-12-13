export const reconsilation = (oldVNode, newVNode) => {
    if (oldVNode == null) {
        return { type: 'CREATE', newVNode };
    }
    if (!newVNode) {
        return { type: 'REMOVE' };
    }
    if (typeof oldVNode !== typeof newVNode || oldVNode.tag !== newVNode.tag) {
        return { type: 'REPLACE', newVNode };
    }
    if (typeof newVNode === 'string' || typeof newVNode === 'number') {
        if (oldVNode !== newVNode) {
            return { type: 'TEXT', newVNode };
        } else {
            return null;
        }
    }

    const patch = {
        type: 'UPDATE',
        props: diffProps(oldVNode.props, newVNode.props),
        children: diffChildren(oldVNode.children, newVNode.children),
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