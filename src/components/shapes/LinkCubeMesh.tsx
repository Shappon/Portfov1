"use client";

import { useMemo } from "react";

export interface LinkCubeMeshProps {
  color?: string;
  emissive?: string;
  emissiveIntensity?: number;
  opacity?: number;
  size?: number;
}

/**
 * Cube 3D pour les sections du carrousel (liens externes ou « arrive bientôt »).
 */
export function LinkCubeMesh({
  color = "#6c7bd8",
  emissive = "#2a2a4a",
  emissiveIntensity = 0.15,
  opacity = 1,
  size = 0.52,
}: LinkCubeMeshProps) {
  const mat = useMemo(
    () => ({
      color,
      metalness: 0.38,
      roughness: 0.38,
      emissive,
      emissiveIntensity,
      transparent: opacity < 1,
      opacity,
    }),
    [color, emissive, emissiveIntensity, opacity]
  );

  return (
    <mesh castShadow receiveShadow>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial {...mat} />
    </mesh>
  );
}
