import { App } from "./app";
import { Liba } from "../../../src/liba4/Liba";
import { LibaDOM } from "../../../src/liba4/LIbaDOM/LibaDOM";
import { createFiberCanvasRenderer } from "../../../src/shared/renderCanvasFiberTree";

const rootElement = LibaDOM.createRoot(document.getElementById('root'))

const fiberNode = Liba.create(App);
createFiberCanvasRenderer()(fiberNode, "currentFullTree");

// @ts-ignore
window.windowFiberNode = fiberNode;

rootElement.render(fiberNode)
