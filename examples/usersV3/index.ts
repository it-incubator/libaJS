import { App } from "./app";
import { Liba } from "../../src/liba3/Liba";
import { LibaDOM } from "../../src/liba3/LIbaDOM/LibaDOM";
import { createFiberCanvasRenderer } from "../../src/shared/renderCanvasFiberTree";

const rootElement = LibaDOM.createRoot(document.getElementById('root'))

const fiberNode = Liba.create(App);
createFiberCanvasRenderer()(fiberNode, "currentFullTree");
//createCanvasRenderer()(fiberNode, "newFiberNode");
//createCanvasRenderer()(fiberNode, "prevFiberNode");
//createCanvasRenderer()(fiberNode, "patchTree");

// @ts-ignore
window.fiberNode = fiberNode;

rootElement.render(fiberNode)
