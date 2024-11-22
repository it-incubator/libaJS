import { App } from "./app";
import { Liba } from "../../src/liba2/Liba";
import { LibaDOM } from "../../src/liba2/LibaDOM";

const rootElement = LibaDOM.createRoot(document.getElementById('root'))

const fiberNode = Liba.create(App);

// @ts-ignore
window.fiberNode = fiberNode;

rootElement.render(fiberNode)
