import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import Button from "./Button";
import { Image, RotateCw, Eraser, Pencil, Text, Circle, Square, Save, Trash2 } from "lucide-react";
import Sidebar2 from "./Sidebar2";

const ImageCanvas = ({ selectedImage }) => {
  const canvasEl = useRef(null);
  const [patient,setPatient]=useState(selectedImage);
  const canvasInstance = useRef(null);
  const imageRef = useRef(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [eraserMode, setEraserMode] = useState(false);
  const [brushColor, setBrushColor] = useState("black");
  const [textColor, setTextColor] = useState("black"); // New state for text color
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 650, height: 650 });
  

  // Update canvas dimensions based on screen size
  useEffect(() => {
    const updateCanvasDimensions = () => {
      const maxWidth = window.innerWidth * 0.9; // 90% of screen width
      const maxHeight = window.innerHeight * 0.75; // 75% of screen height
    
      let sizeLimit;
      if (window.innerWidth <= 320) {
        // Extra small mobile devices
        sizeLimit = 250;
      } else if (window.innerWidth <= 375) {
        // Small mobile devices
        sizeLimit = 280;
      } else if (window.innerWidth <= 425) {
        // Regular mobile devices
        sizeLimit = 325;
      } else if (window.innerWidth <= 500) {
        // Large mobile devices
        sizeLimit = 350;
      } else if (window.innerWidth <= 640) {
        // Small tablets
        sizeLimit = 500;
      } else if (window.innerWidth <= 768) {
        // Tablets
        sizeLimit = 650;
      } else if (window.innerWidth <= 1024) {
        // Large tablets / Small laptops
        sizeLimit =800;
      } else if (window.innerWidth <= 1280) {
        // Laptops
        sizeLimit = 850;
      } else {
        // Desktops and larger screens
        sizeLimit = 950;
      }
    
      const size = Math.min(maxWidth, maxHeight, sizeLimit);
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
      addImage(selectedImage.image_url);
      console.log(selectedImage);
     setPatient(selectedImage)
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

  const handleTextColorChange = (color) => {
    setTextColor(color);
    const canvas = canvasInstance.current;
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === "textbox") {
      activeObject.set("fill", color);
      canvas.renderAll();
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
      fill: textColor, // Use the current text color
      selectable: true,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const addCircle = () => {
    if (!canvasInstance.current) return;
    const canvas = canvasInstance.current;
    const circle = new fabric.Circle({
      radius: 50,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 2,
      left: 100,
      top: 100,
      selectable: true,
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
  };

  const addRectangle = () => {
    if (!canvasInstance.current) return;
    const canvas = canvasInstance.current;
    const rect = new fabric.Rect({
      width: 100,
      height: 100,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 2,
      left: 100,
      top: 100,
      selectable: true,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  };

  const clearCanvas = () => {
    if (!canvasInstance.current) return;
    const canvas = canvasInstance.current;
    canvas.clear();
    if (imageRef.current) {
      canvas.add(imageRef.current);
    }
  };

  const saveCanvasAsImage = () => {
    if (!canvasInstance.current) return;
    const canvas = canvasInstance.current;
    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1.0,
    });
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas-image.png";
    link.click();
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
      <Sidebar2>
      <div className="flex flex-col gap-2">
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
        <Button
          onClick={addText}
          isActive={false}
          icon={Text}
          showColorPicker={true}
          onColorChange={handleTextColorChange}
        >
          Add Text
        </Button>
        <Button onClick={addCircle} isActive={false} icon={Circle}>
          Add Circle
        </Button>
        <Button onClick={addRectangle} isActive={false} icon={Square}>
          Add Rectangle
        </Button>
        <Button onClick={clearCanvas} isActive={false} icon={Trash2}>
          Clear Canvas
        </Button>
        <Button onClick={saveCanvasAsImage} isActive={false} icon={Save}>
          Save Image
        </Button>
      </div>
      
      </Sidebar2>
    </div>
  );
};

export default ImageCanvas;