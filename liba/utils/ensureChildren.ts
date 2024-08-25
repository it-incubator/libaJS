import {TComponentInstance} from "../Liba";

export function ensureChildren< P extends {}, EL extends HTMLElement, LS extends {}>
(parent: TComponentInstance<P, EL, LS>|null): void
{
    if (parent) {
        if (!parent.childrenComponents) parent.childrenComponents = []
    }
}