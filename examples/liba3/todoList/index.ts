import { App } from './App';
import { Liba } from "../../../src/liba3/Liba";
import { LibaDOM } from "../../../src/liba3/LIbaDOM/LibaDOM";
import { createFiberCanvasRenderer } from "../../../src/shared/renderCanvasFiberTree";

const rootElement = LibaDOM.createRoot(document.getElementById('root'))

const fiberNode = Liba.create(App);
createFiberCanvasRenderer()(fiberNode, "currentFullTree");

// @ts-ignore
window.windowFiberNode = fiberNode;

rootElement.render(fiberNode)
