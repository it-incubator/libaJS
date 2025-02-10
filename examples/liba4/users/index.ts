import { App } from "./app";
import { Liba } from "../../../src/liba4/Liba";
import { LibaDOM } from "../../../src/liba4/LIbaDOM/LibaDOM";
import { createFiberCanvasRenderer } from "../../../src/shared/renderCanvasFiberTree";

// Функция для проверки, что каждый узел дерева удовлетворяет правилу: child.parent === node и parent.child === node
function checkChildParentEquality(node): boolean {
  let isValid = true;

  // Проверка на равенство child.parent
  if (node.child && node.child.parent !== node) {
    console.error(`Нарушение для узла с id ${node.type}: child.parent !== node`);
    isValid = false;
  }

  // Проверка на равенство parent.child
  if (node.parent && node.parent.child !== node) {
    console.error(`Нарушение для узла с id ${node.type}: parent.child !== node`);
    isValid = false;
  }

  // Рекурсивная проверка для всех дочерних узлов
  if (node.child) {
    isValid = isValid && checkChildParentEquality(node.child);
  }

  // Рекурсивная проверка для всех соседних узлов
  if (node.sibling) {
    isValid = isValid && checkChildParentEquality(node.sibling);
  }

  return isValid;
}

const rootElement = LibaDOM.createRoot(document.getElementById('root'))

const fiberNode = Liba.create(App);
createFiberCanvasRenderer()(fiberNode, "currentFullTree");

console.log(checkChildParentEquality(fiberNode));

// @ts-ignore
window.windowFiberNode = fiberNode;

rootElement.render(fiberNode)
