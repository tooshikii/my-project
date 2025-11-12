import AlbumSphereSample from "@/components/albumSphereSample";
import React from "react";

const AlbumSpherePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Album Sphere</h1>
      <AlbumSphereSample />
    </div>
  );
};

export default AlbumSpherePage;
