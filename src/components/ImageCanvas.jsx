import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import Button from "./Button";
import { Image, RotateCw, Eraser, Pencil, Text } from "lucide-react";

const ImageCanvas = ({ selectedImage }) => {
  const canvasEl = useRef(null);
  const canvasInstance = useRef(null);
  const imageRef = useRef(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [eraserMode, setEraserMode] = useState(false);
  const [brushColor, setBrushColor] = useState("black");
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 650, height: 650 });

  // Update canvas dimensions based on screen size
  useEffect(() => {
    const updateCanvasDimensions = () => {
      const maxWidth = window.innerWidth * 0.9; // 90% of screen width
      const maxHeight = window.innerHeight * 0.7; // 70% of screen height
      const size = Math.min(maxWidth, maxHeight, 650); // Limit to 650px
      setCanvasDimensions({ width: size, height: size });
    };

    updateCanvasDimensions();
    window.addEventListener("resize", updateCanvasDimensions);
    return () => window.removeEventListener("resize", updateCanvasDimensions);
  }, []);

  // Initialize canvas
  useEffect(() => {
    if (!canvasEl.current) return;

    const canvas = new fabric.Canvas(canvasEl.current, {
      backgroundColor: "#27272a",
      selection: false,
    });

    canvas.setWidth(canvasDimensions.width);
    canvas.setHeight(canvasDimensions.height);
    canvasInstance.current = canvas;

    return () => {
      canvas.dispose();
    };
  }, [canvasDimensions]);

  // Add image to canvas
  useEffect(() => {
    if (selectedImage) {
      addImage(selectedImage);
    }
  }, [selectedImage]);

  const addImage = (imageUrl) => {
    if (!canvasInstance.current) return;
    const canvas = canvasInstance.current;

    if (imageRef.current) {
      canvas.remove(imageRef.current);
      imageRef.current = null;
    }

    const imageElement = document.createElement("img");
    imageElement.src = imageUrl;

    imageElement.onload = () => {
      const image = new fabric.Image(imageElement, {
        left: 50,
        top: 50,
        scaleX: canvasDimensions.width / imageElement.width, // Scale image to fit canvas
        scaleY: canvasDimensions.height / imageElement.height,
        selectable: false,
      });

      canvas.add(image);
      canvas.centerObject(image);
      canvas.renderAll();
      imageRef.current = image;
    };
  };

  const handleBrushColorChange = (color) => {
    setBrushColor(color);
    if (canvasInstance.current && canvasInstance.current.isDrawingMode) {
      canvasInstance.current.freeDrawingBrush.color = color;
    }
  };

  const rotateImage = (angle) => {
    if (!canvasInstance.current || !imageRef.current) return;
    const canvas = canvasInstance.current;
    const image = imageRef.current;
    image.rotate((image.angle || 0) + angle);
    canvas.renderAll();
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
      canvas.freeDrawingBrush.color = brushColor;
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
      canvas.freeDrawingBrush.color = "#f3f3f3";
    }
  };

  const addText = () => {
    if (!canvasInstance.current) return;
    const canvas = canvasInstance.current;
    const text = new fabric.Textbox("Your Text", {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: "black",
      selectable: true,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-zinc-800 p-4">
      {/* Canvas */}
      <canvas
        ref={canvasEl}
        width={canvasDimensions.width}
        height={canvasDimensions.height}
        className="border border-zinc-700"
      />

      {/* Button Panel */}
      <div className="flex flex-row flex-wrap justify-center gap-2 mt-4 md:absolute md:right-3 md:top-1/2 md:transform md:-translate-y-1/2 md:flex-col md:gap-2 md:p-4 md:bg-gray-900 md:rounded-lg md:shadow-lg">
        <Button onClick={() => rotateImage(90)} isActive={false} icon={RotateCw}>
          Rotate 90°
        </Button>
        <Button onClick={() => rotateImage(180)} isActive={false} icon={RotateCw}>
          Rotate 180°
        </Button>
        <Button
          onClick={toggleDrawing}
          isActive={drawingMode}
          icon={Pencil}
          showColorPicker={drawingMode}
          onColorChange={handleBrushColorChange}
        >
          {drawingMode ? "Disable Brush" : "Enable Brush"}
        </Button>
        <Button onClick={toggleEraser} isActive={eraserMode} icon={Eraser}>
          {eraserMode ? "Disable Eraser" : "Enable Eraser"}
        </Button>
        <Button onClick={addText} isActive={false} icon={Text}>
          Add Text
        </Button>
      </div>
    </div>
  );
};

export default ImageCanvas;