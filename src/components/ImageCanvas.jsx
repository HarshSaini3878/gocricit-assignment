import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';

const ImageCanvas = () => {
  const canvasEl = useRef(null);
  const canvasInstance = useRef(null);
  const imageRef = useRef(null); // Store reference to the image object

  useEffect(() => {
    if (!canvasEl.current) return;

    // Initialize Fabric.js Canvas
    const canvas = new fabric.Canvas(canvasEl.current, {
      backgroundColor: '#f3f3f3',
      selection: false, // Disable selection for all elements
    });

    canvas.setWidth(300);
    canvas.setHeight(300);
    canvasInstance.current = canvas;

    return () => {
      canvas.dispose();
    };
  }, []);

  // Function to add the image to canvas
  const addImage = () => {
    if (!canvasInstance.current) return;
    
    const canvas = canvasInstance.current;

    // Remove existing image if any
    if (imageRef.current) {
      canvas.remove(imageRef.current);
      imageRef.current = null;
    }

    const imageUrl = 'https://picsum.photos/300/300';
    const imageElement = document.createElement('img');
    imageElement.src = imageUrl;

    imageElement.onload = () => {
      const image = new fabric.Image(imageElement, {
        left: 100,
        top: 100,
        scaleX: 1,
        scaleY: 1,
        selectable: false, // Prevent selection
        evented: false, // Disable interactions
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
      });

      canvas.add(image);
      canvas.centerObject(image);
      canvas.renderAll();
      imageRef.current = image; // Store the new image reference
    };
  };

  // Function to rotate the image by a given angle
  const rotateImage = (angle) => {
    if (!canvasInstance.current || !imageRef.current) return;

    const canvas = canvasInstance.current;
    const image = imageRef.current;
    image.rotate((image.angle || 0) + angle); // Rotate by given degrees
    canvas.renderAll();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div>Canvas</div>
      <canvas width="300" height="300" className="border-2" ref={canvasEl} />
      <div className="flex gap-2">
        <button onClick={addImage} className="px-4 py-2 bg-blue-500 text-white rounded">Add Image</button>
        <button onClick={() => rotateImage(90)} className="px-4 py-2 bg-green-500 text-white rounded">Rotate 90°</button>
        <button onClick={() => rotateImage(180)} className="px-4 py-2 bg-red-500 text-white rounded">Rotate 180°</button>
      </div>
    </div>
  );
};

export default ImageCanvas;
