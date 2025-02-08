import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

const ImageCanvas = () => {
  const canvasEl = useRef(null);
  const canvasInstance = useRef(null);
  const imageRef = useRef(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [eraserMode, setEraserMode] = useState(false);
  const history = useRef([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    if (!canvasEl.current) return;

    const canvas = new fabric.Canvas(canvasEl.current, {
      backgroundColor: '#f3f3f3',
      selection: false,
    });

    canvas.setWidth(700);
    canvas.setHeight(700);
    canvasInstance.current = canvas;

    return () => {
      canvas.dispose();
    };
  }, []);

  const saveHistory = () => {
    if (!canvasInstance.current) return;
    const json = canvasInstance.current.toJSON();
    history.current = history.current.slice(0, historyIndex + 1);
    history.current.push(json);
    setHistoryIndex(history.current.length - 1);
  };

  const undo = () => {
    if (!canvasInstance.current || historyIndex <= 0) return;
    setHistoryIndex(historyIndex - 1);
    canvasInstance.current.loadFromJSON(history.current[historyIndex - 1], () => {
      canvasInstance.current.renderAll();
    });
  };

  const redo = () => {
    if (!canvasInstance.current || historyIndex >= history.current.length - 1) return;
    setHistoryIndex(historyIndex + 1);
    canvasInstance.current.loadFromJSON(history.current[historyIndex + 1], () => {
      canvasInstance.current.renderAll();
    });
  };

  const addImage = () => {
    if (!canvasInstance.current) return;
    const canvas = canvasInstance.current;

    if (imageRef.current) {
      canvas.remove(imageRef.current);
      imageRef.current = null;
    }

    const imageUrl = 'https://picsum.photos/600/900';
    const imageElement = document.createElement('img');
    imageElement.src = imageUrl;

    imageElement.onload = () => {
      const image = new fabric.Image(imageElement, {
        left: 50,
        top: 50,
        scaleX: 1,
        scaleY: 1,
        selectable: false,
        evented: false,
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
      });

      canvas.add(image);
      canvas.centerObject(image);
      canvas.renderAll();
      imageRef.current = image;
      saveHistory();
    };
  };

  const rotateImage = (angle) => {
    if (!canvasInstance.current || !imageRef.current) return;
    const canvas = canvasInstance.current;
    const image = imageRef.current;
    image.rotate((image.angle || 0) + angle);
    canvas.renderAll();
    saveHistory();
  };

  const toggleDrawing = () => {
    if (!canvasInstance.current) return;
    const canvas = canvasInstance.current;
    setDrawingMode(!drawingMode);
    setEraserMode(false);
    canvas.isDrawingMode = !drawingMode;
    if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.width = 2;
      canvas.freeDrawingBrush.color = 'black';
    }
  };

  const toggleEraser = () => {
    if (!canvasInstance.current) return;
    const canvas = canvasInstance.current;
    setEraserMode(!eraserMode);
    setDrawingMode(false);
    canvas.isDrawingMode = !eraserMode;
    if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.width = 10;
      canvas.freeDrawingBrush.color = '#f3f3f3';
    }
  };

  const addText = () => {
    if (!canvasInstance.current) return;
    const canvas = canvasInstance.current;
    const text = new fabric.Textbox('Your Text', {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: 'black',
      selectable: true,
      lockScalingX: false,
      lockScalingY: false,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    saveHistory();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div>Canvas</div>
      <canvas width="700" height="700" className="border-2" ref={canvasEl} />
      <div className="flex gap-2">
        <button onClick={addImage} className="px-4 py-2 bg-blue-500 text-white rounded">Add Image</button>
        <button onClick={() => rotateImage(90)} className="px-4 py-2 bg-green-500 text-white rounded">Rotate 90°</button>
        <button onClick={() => rotateImage(180)} className="px-4 py-2 bg-red-500 text-white rounded">Rotate 180°</button>
        <button onClick={toggleDrawing} className={`px-4 py-2 rounded ${drawingMode ? 'bg-gray-500' : 'bg-purple-500'} text-white`}>
          {drawingMode ? 'Disable Brush' : 'Enable Brush'}
        </button>
        <button onClick={toggleEraser} className={`px-4 py-2 rounded ${eraserMode ? 'bg-gray-500' : 'bg-orange-500'} text-white`}>
          {eraserMode ? 'Disable Eraser' : 'Enable Eraser'}
        </button>
        <button onClick={addText} className="px-4 py-2 bg-yellow-500 text-black rounded">Add Text</button>
        {/* <button onClick={undo} className="px-4 py-2 bg-gray-500 text-white rounded">Undo</button>
        <button onClick={redo} className="px-4 py-2 bg-gray-700 text-white rounded">Redo</button> */}
      </div>
    </div>
  );
};

export default ImageCanvas;