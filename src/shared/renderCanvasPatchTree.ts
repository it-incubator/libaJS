


export const createPatchCanvasRenderer = () => {

  const settings =  {
    renderNullNodes: false
  }


  const BLOCK_HEIGHT = 24;
  const BLOCK_WIDTH = BLOCK_HEIGHT * 3;
  const MARGIN = 8;
  const X_PADDING = 24;
  let y = 0;

  const getPatchNodeName = (patch: any) => {
    if (patch === null) return 'NULL'

    let resultString =  patch.type;

    if (patch.newFiberType) {
      resultString += "; newFT: "  + patch.newFiberType;
    }

    if (patch.oldFiberType) {
      resultString += "; oldFT: "  + patch.oldFiberType;
    }

    if (patch.newVNode) {
      resultString += "; newVNode: "  + patch.newVNode;
    }


    if (patch.props?.length) {
      resultString += JSON.stringify(patch.props);
    }
    return resultString
  }

  const updateYMargin = () => {
    y = y + BLOCK_HEIGHT + MARGIN;
  }

  const renderCanvasPatchTree = (patch: any, canvasId: string) => {
    const canvas: HTMLCanvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = 400;
    canvas.height = 2000;

    const rect = {
      x: 1,
      y: 1,
      width: BLOCK_WIDTH,
      height: BLOCK_HEIGHT,
    };

    context.fillStyle = 'white';
    context.fillRect(rect.x, rect.y, rect.width, rect.height);

    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.strokeRect(rect.x, rect.y, rect.width, rect.height);

    context.fillStyle = 'black';
    context.fillText(getPatchNodeName(patch), rect.x + 10, rect.y + 15);

    updateYMargin();

    if (patch && patch.child !== undefined) {
      renderCanvasFiberTreeChild(context, patch.child, rect.x + X_PADDING);
    }

    if (patch && patch.sibling !== undefined) {
      renderCanvasFiberTreeSibling(context, patch.sibling, rect.x, rect.y);
    }

    //document.body.appendChild(canvas);
  };

  const renderCanvasFiberTreeChild = (context: CanvasRenderingContext2D, patch: any, x: number) => {

    if (!settings.renderNullNodes && patch === null) return;

    const rect = {
      x,
      y: y,
      width: BLOCK_WIDTH,
      height: BLOCK_HEIGHT,
    };

    context.fillStyle = 'white';
    context.fillRect(rect.x, rect.y, rect.width, rect.height);

    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.strokeRect(rect.x, rect.y, rect.width, rect.height);

    context.fillStyle = 'black';
    context.fillText(getPatchNodeName(patch), rect.x + 10, rect.y + 15);

    context.beginPath();
    context.moveTo(rect.x, y + (rect.height / 2));
    context.lineTo(rect.x - 8, y + (rect.height / 2));
    context.lineTo(rect.x - 8, y + (rect.height / 2) - 20);
    context.stroke();

    updateYMargin();

    if (patch && patch.child !== undefined) {
      renderCanvasFiberTreeChild(context, patch.child, rect.x + X_PADDING);
    }

    if (patch && patch.sibling !== undefined) {
      renderCanvasFiberTreeSibling(context, patch.sibling, rect.x, rect.y);
    }
  };

  const renderCanvasFiberTreeSibling = (context: CanvasRenderingContext2D, patch: any, x: number, yParent: number) => {
    if (!settings.renderNullNodes && patch === null) return;

    const rect = {
      x,
      y: y,
      width: BLOCK_WIDTH,
      height: BLOCK_HEIGHT,
    };

    context.fillStyle = 'white';
    context.fillRect(rect.x, rect.y, rect.width, rect.height);

    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.strokeRect(rect.x, rect.y, rect.width, rect.height);

    context.fillStyle = 'black';
    context.fillText(getPatchNodeName(patch), rect.x + 10, rect.y + 15);

    context.beginPath();
    context.moveTo(rect.x + 16, y);
    context.lineTo(rect.x + 16, yParent + BLOCK_HEIGHT);
    context.stroke();

    updateYMargin();

    if (patch.child) {
      renderCanvasFiberTreeChild(context, patch.child, rect.x + X_PADDING);
    }

    if (patch.sibling) {
      renderCanvasFiberTreeSibling(context, patch.sibling, rect.x, rect.y);
    }
  };


  return renderCanvasPatchTree;
}