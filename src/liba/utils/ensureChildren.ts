import {TComponentInstance} from "../Liba";
import {CacheManager} from "./children-cache-manager.ts";

export function ensureChildren< P extends {}, EL extends HTMLElement, LS extends {}>
(parent: TComponentInstance<P, EL, LS>|null): void
{
    if (parent) {
        if (!parent.childrenComponents) parent.childrenComponents =  new CacheManager<any>();
    }
}