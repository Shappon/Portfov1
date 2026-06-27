"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bounds, Center } from "@react-three/drei";
import type { Group } from "three";
import { BookMesh } from "@/components/shapes/BookMesh";
import { Crane } from "@/components/Crane";
import { LinkCubeMesh } from "@/components/shapes/LinkCubeMesh";

/**
 * Miniature 3D affichée dans l'en-tête du contenu plein écran.
 */
interface SectionMiniShapeProps {
  sectionId: string;
  reduceMotion?: boolean;
}

function ShapeForSection({ sectionId }: { sectionId: string }) {
  if (sectionId === "me") return <BookMesh />;
  if (sectionId === "projects") return <Crane />;
  if (sectionId.startsWith("link-")) {
    return <LinkCubeMesh size={1.1} />;
  }
  return null;
}

function SpinningShape({ sectionId, reduceMotion }: SectionMiniShapeProps) {
  const ref = useRef<Group>(null);
  useFrame((_state, delta) => {
    if (ref.current && !reduceMotion) {
      ref.current.rotation.y += delta * 0.5;
    }
  });
  return (
    <group ref={ref}>
      <Center>
        <ShapeForSection sectionId={sectionId} />
      </Center>
    </group>
  );
}

export function SectionMiniShape({ sectionId, reduceMotion = false }: SectionMiniShapeProps) {
  return (
    <Canvas
      className="detail-panel-mini-canvas"
      camera={{ position: [0, 0, 4], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      <directionalLight position={[-3, 2, 2]} intensity={0.4} />
      <Bounds fit clip margin={1.25}>
        <SpinningShape sectionId={sectionId} reduceMotion={reduceMotion} />
      </Bounds>
    </Canvas>
  );
}
