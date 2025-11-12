"use client";

import { motion, PanInfo, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

type Album = {
  id: number;
  title: string;
  artist: string;
  year: number;
  tracks: number;
  accent: string;
};

const albums: Album[] = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "Lumen Flux",
    year: 2024,
    tracks: 11,
    accent: "from-indigo-500 via-purple-500 to-pink-500",
  },
  {
    id: 2,
    title: "Ocean Waves",
    artist: "Tidal Bloom",
    year: 2022,
    tracks: 13,
    accent: "from-blue-500 via-cyan-400 to-teal-500",
  },
  {
    id: 3,
    title: "Desert Sun",
    artist: "Amber Lights",
    year: 2019,
    tracks: 9,
    accent: "from-amber-500 via-orange-500 to-red-500",
  },
  {
    id: 4,
    title: "Forest Echo",
    artist: "Moss & Stone",
    year: 2021,
    tracks: 12,
    accent: "from-emerald-500 via-green-500 to-lime-500",
  },
  {
    id: 5,
    title: "Urban Nights",
    artist: "Neon Valley",
    year: 2020,
    tracks: 10,
    accent: "from-slate-600 via-gray-700 to-slate-900",
  },
  {
    id: 6,
    title: "Cosmic Journey",
    artist: "Star Pilot",
    year: 2023,
    tracks: 8,
    accent: "from-fuchsia-500 via-purple-600 to-indigo-600",
  },
  {
    id: 7,
    title: "Summer Breeze",
    artist: "Citrus Club",
    year: 2018,
    tracks: 14,
    accent: "from-yellow-400 via-orange-400 to-rose-400",
  },
  {
    id: 8,
    title: "Winter Frost",
    artist: "Glacier Lines",
    year: 2017,
    tracks: 7,
    accent: "from-cyan-300 via-blue-400 to-indigo-500",
  },
  {
    id: 9,
    title: "Autumn Leaves",
    artist: "Copperlane",
    year: 2016,
    tracks: 15,
    accent: "from-red-500 via-orange-500 to-amber-500",
  },
  {
    id: 10,
    title: "Spring Bloom",
    artist: "Petal Pulse",
    year: 2025,
    tracks: 12,
    accent: "from-pink-400 via-rose-500 to-red-500",
  },
  {
    id: 11,
    title: "Neon Lights",
    artist: "City Choir",
    year: 2023,
    tracks: 10,
    accent: "from-fuchsia-500 via-pink-500 to-violet-500",
  },
  {
    id: 12,
    title: "Mountain Peak",
    artist: "Silver North",
    year: 2015,
    tracks: 9,
    accent: "from-gray-500 via-slate-600 to-gray-800",
  },
];

const SPHERE_RADIUS = 260;
const DRAG_SENSITIVITY = 0.4;
const AUTO_ROTATE_SPEED = 0.045;

const getAlbumPosition = (index: number, total: number) => {
  const offset = 2 / total;
  const increment = Math.PI * (3 - Math.sqrt(5));
  const y = index * offset - 1 + offset / 2;
  const r = Math.sqrt(1 - y * y);
  const phi = index * increment;

  return {
    x: Math.cos(phi) * r,
    y,
    z: Math.sin(phi) * r,
  };
};

const AlbumSphere = () => {
  const rotateX = useMotionValue(-10);
  const rotateY = useMotionValue(25);
  const rotateXSpring = useSpring(rotateX, {
    stiffness: 55,
    damping: 18,
    mass: 0.8,
  });
  const rotateYSpring = useSpring(rotateY, {
    stiffness: 55,
    damping: 18,
    mass: 0.8,
  });

  const dragStartRotation = useRef({ x: rotateX.get(), y: rotateY.get() });
  const isDragging = useRef(false);

  useEffect(() => {
    let raf: number;
    const loop = () => {
      if (!isDragging.current) {
        rotateY.set(rotateY.get() + AUTO_ROTATE_SPEED);
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [rotateY]);

  const handleDragStart = () => {
    isDragging.current = true;
    dragStartRotation.current = { x: rotateX.get(), y: rotateY.get() };
  };

  const handleDrag = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const nextX =
      dragStartRotation.current.x - info.offset.y * DRAG_SENSITIVITY;
    const nextY =
      dragStartRotation.current.y + info.offset.x * DRAG_SENSITIVITY;
    rotateX.set(nextX);
    rotateY.set(nextY);
  };

  const handleDragEnd = () => {
    isDragging.current = false;
    dragStartRotation.current = { x: rotateX.get(), y: rotateY.get() };
  };

  const nodes = useMemo(() => {
    return albums
      .map((album, index) => {
        const position = getAlbumPosition(index, albums.length);

        return {
          album,
          position: {
            x: position.x * SPHERE_RADIUS,
            y: position.y * SPHERE_RADIUS,
            z: position.z * SPHERE_RADIUS,
          },
        };
      })
      .sort((a, b) => a.position.z - b.position.z);
  }, []);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-6">
      <div className="w-full max-w-5xl text-center space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-purple-300/70">
            Immersive Library
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold text-white drop-shadow-[0_10px_40px_rgba(88,28,135,0.35)]">
            Orbiting Album Sphere
          </h1>
          <p className="mt-3 text-sm text-purple-200/80 md:text-base">
            Drag or swipe to rotate the planet of covers. Hover or tap to bring
            tracks into focus.
          </p>
        </div>

        <motion.div
          className="relative mx-auto h-[520px] w-full max-w-[520px] cursor-grab active:cursor-grabbing"
          style={{ perspective: 1200 }}
          drag
          dragElastic={0.12}
          dragMomentum={false}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
        >
          <motion.div
            className="relative h-full w-full"
            style={{
              transformStyle: "preserve-3d",
              rotateX: rotateXSpring,
              rotateY: rotateYSpring,
            }}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/30 to-transparent blur-[120px]" />
            {nodes.map(({ album, position }) => {
              const depth = (position.z + SPHERE_RADIUS) / (SPHERE_RADIUS * 2);
              const scale = 0.75 + depth * 0.45;
              const opacity = 0.3 + depth * 0.7;
              const blur = (1 - depth) * 4;

              return (
                <motion.div
                  key={album.id}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `translate3d(${position.x}px, ${position.y}px, ${position.z}px)`,
                    marginLeft: "-80px",
                    marginTop: "-80px",
                    zIndex: Math.round(depth * 1000),
                    filter: `blur(${blur}px)`,
                  }}
                  whileHover={{
                    scale: scale + 0.15,
                    filter: "blur(0px)",
                    zIndex: 1200,
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <motion.div
                    className={`h-40 w-40 rounded-2xl border border-white/20 bg-gradient-to-br ${album.accent} p-4 text-left text-white shadow-[0_20px_35px_rgba(0,0,0,0.35)]`}
                    style={{
                      opacity,
                      scale,
                      transformStyle: "preserve-3d",
                    }}
                    whileHover={{ rotateY: 0 }}
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                      {album.artist}
                    </p>
                    <p className="mt-2 text-lg font-semibold leading-tight">
                      {album.title}
                    </p>
                    <div className="mt-6 flex items-center justify-between text-xs text-white/80">
                      <span>{album.year}</span>
                      <span>{album.tracks} tracks</span>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        <p className="text-xs uppercase tracking-[0.5em] text-purple-200/60">
          Drag • Swipe • Hover
        </p>
      </div>
    </div>
  );
};

export default AlbumSphere;
