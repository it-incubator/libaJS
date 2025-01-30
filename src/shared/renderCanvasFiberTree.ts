const BLOCK_HEIGHT = 24;
const BLOCK_WIDTH = BLOCK_HEIGHT * 3;
const MARGIN = 8;
const X_PADDING = 24;
let y = 0;

const getFiberNodeName = (fiberNode: any) => {
	if (typeof fiberNode.type === 'function') {
		return fiberNode.type.name;
	}

	if (typeof fiberNode === 'string') {
		return 'text node';
	}

	return fiberNode.type
}

const updateYMargin = () => {
	y = y + BLOCK_HEIGHT + MARGIN;
}

export const renderCanvasFiberTree = (fiberNode: any) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) return;

  canvas.width = 1000;
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
  context.fillText(getFiberNodeName(fiberNode), rect.x + 10, rect.y + 15);

	updateYMargin();

  if (fiberNode.child) {
    renderCanvasFiberTreeChild(context, fiberNode.child, rect.x + X_PADDING);
  }

  if (fiberNode.sibling) {
    renderCanvasFiberTreeSibling(context, fiberNode.sibling, rect.x, rect.y);
  }

  document.body.appendChild(canvas);
};

const renderCanvasFiberTreeChild = (context: CanvasRenderingContext2D, fiberNode: any, x: number) => {
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
  context.fillText(getFiberNodeName(fiberNode), rect.x + 10, rect.y + 15);

	context.beginPath();
  context.moveTo(rect.x, y + (rect.height / 2));
  context.lineTo(rect.x - 8, y + (rect.height / 2));
  context.lineTo(rect.x - 8, y + (rect.height / 2) - 20);
  context.stroke();

	updateYMargin();

  if (fiberNode.child) {
    renderCanvasFiberTreeChild(context, fiberNode.child, rect.x + X_PADDING);
  }

  if (fiberNode.sibling) {
    renderCanvasFiberTreeSibling(context, fiberNode.sibling, rect.x, rect.y);
  }
};

const renderCanvasFiberTreeSibling = (context: CanvasRenderingContext2D, fiberNode: any, x: number, yParent: number) => {
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
  context.fillText(getFiberNodeName(fiberNode), rect.x + 10, rect.y + 15);

	context.beginPath();
  context.moveTo(rect.x + 16, y);
  context.lineTo(rect.x + 16, yParent + BLOCK_HEIGHT);
  context.stroke();

	updateYMargin();

  if (fiberNode.child) {
    renderCanvasFiberTreeChild(context, fiberNode.child, rect.x + X_PADDING);
  }

  if (fiberNode.sibling) {
    renderCanvasFiberTreeSibling(context, fiberNode.sibling, rect.x, rect.y);
  }
};
