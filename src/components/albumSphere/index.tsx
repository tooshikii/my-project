import { Album } from "@/app/api/list/[userName]/route";
import Image from "next/image";

interface AlbumSphereProps {
  albums: Album[];
}

export default function AlbumSphere({ albums }: AlbumSphereProps) {
  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {albums.map((album) => (
          <div
            key={album.id}
            className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <Image
              src={album.image}
              alt={album.title}
              width={300}
              height={300}
              className="w-full aspect-square object-cover rounded-md mb-3"
            />
            <h3 className="text-sm font-semibold text-center line-clamp-2">
              {album.title}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-1">
              {album.artist}
            </p>
            {album.releaseTitle && (
              <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-1 line-clamp-1">
                {album.releaseTitle}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
