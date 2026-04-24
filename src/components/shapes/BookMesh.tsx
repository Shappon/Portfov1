"use client";

import { useMemo } from "react";

export interface BookMeshProps {
  active?: boolean;
  hovered?: boolean;
  opacity?: number;
  onClick?: () => void;
}

const COVER_COLOR = "#2d5a27";
const COVER_COLOR_DARK = "#1e3d1a";
const PAGES_COLOR = "#f5f0e6";
const SPINE_COLOR = "#1a3316";

const WIDTH = 1.25;
const HEIGHT = 1.6;
const COVER_THICK = 0.03;
const PAGES_THICK = 0.22;

export function BookMesh({ opacity = 1, onClick }: BookMeshProps) {
  const coverMat = useMemo(
    () => ({
      color: COVER_COLOR,
      metalness: 0.2,
      roughness: 0.5,
      transparent: opacity < 1,
      opacity,
    }),
    [opacity]
  );
  const coverBackMat = useMemo(
    () => ({
      color: COVER_COLOR_DARK,
      metalness: 0.2,
      roughness: 0.5,
      transparent: opacity < 1,
      opacity,
    }),
    [opacity]
  );
  const pagesMat = useMemo(
    () => ({
      color: PAGES_COLOR,
      metalness: 0,
      roughness: 0.9,
      transparent: opacity < 1,
      opacity,
    }),
    [opacity]
  );
  const spineMat = useMemo(
    () => ({
      color: SPINE_COLOR,
      metalness: 0.15,
      roughness: 0.6,
      transparent: opacity < 1,
      opacity,
    }),
    [opacity]
  );

  return (
    <group onClick={onClick}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[WIDTH, HEIGHT, PAGES_THICK]} />
        <meshStandardMaterial {...pagesMat} />
      </mesh>
      <mesh position={[-WIDTH / 2 - 0.01, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.02, HEIGHT, PAGES_THICK + 2 * COVER_THICK]} />
        <meshStandardMaterial {...spineMat} />
      </mesh>
      <mesh position={[0, 0, -PAGES_THICK / 2 - COVER_THICK / 2]} castShadow receiveShadow>
        <boxGeometry args={[WIDTH, HEIGHT, COVER_THICK]} />
        <meshStandardMaterial {...coverBackMat} />
      </mesh>
      <mesh position={[0, 0, PAGES_THICK / 2 + COVER_THICK / 2]} castShadow receiveShadow>
        <boxGeometry args={[WIDTH, HEIGHT, COVER_THICK]} />
        <meshStandardMaterial {...coverMat} />
      </mesh>
    </group>
  );
}
