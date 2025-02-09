import { useEffect, useState } from "react";
import ImageCanvas from "./components/ImageCanvas";
import Sidebar from "./components/Sidebar";

function App() {
  const [selectedImage,setSelectedImage]=useState("");
  useEffect(()=>{

    console.log(selectedImage);
  },[selectedImage])
  return (
    <div className="flex h-screen bg-gray-600">
   
      <Sidebar setSelectedImage={setSelectedImage} />

     
      
        <ImageCanvas selectedImage={selectedImage} />
     
    </div>
  );
}

export default App;
