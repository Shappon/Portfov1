"use client";

import { useMemo } from "react";

interface AIBlocksProps {
  scale?: number;
  color?: string;
  emissive?: string | null;
  emissiveIntensity?: number;
  thickness?: number;
  height?: number;
  width?: number;
  gap?: number;
  opacity?: number;
  onClick?: () => void;
}

const BAR_W = 0.14;
const BAR_H_RATIO = 0.12;

export function AIBlocks({
  scale = 1,
  color = "#6c7bd8",
  emissive = "#3a4a9a",
  emissiveIntensity = 0.2,
  thickness = 0.12,
  height = 0.8,
  width = 1,
  gap = 0.08,
  opacity = 1,
  onClick,
}: AIBlocksProps) {
  const barH = height * BAR_H_RATIO;
  const vertH = height - barH * 2;
  const letterW = (width - gap) / 2;
  const iCenterX = -(gap / 2 + letterW / 2);
  const aCenterX = gap / 2 + letterW / 2;

  const mat = useMemo(
    () => ({
      color,
      emissive: emissive ?? "#000000",
      emissiveIntensity: emissive != null ? emissiveIntensity : 0,
      metalness: 0.2,
      roughness: 0.5,
      transparent: opacity < 1,
      opacity,
    }),
    [color, emissive, emissiveIntensity, opacity]
  );

  return (
    <group scale={scale} onClick={onClick} rotation={[Math.PI, 0, 0]}>
      <group position={[iCenterX, 0, 0]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[BAR_W, vertH, thickness]} />
          <meshStandardMaterial {...mat} />
        </mesh>
        <mesh position={[0, vertH / 2 + barH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[BAR_W * 2.2, barH, thickness]} />
          <meshStandardMaterial {...mat} />
        </mesh>
        <mesh position={[0, -vertH / 2 - barH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[BAR_W * 2.2, barH, thickness]} />
          <meshStandardMaterial {...mat} />
        </mesh>
      </group>
      <group position={[aCenterX, 0, 0]}>
        <mesh position={[-letterW / 4, 0, 0]} rotation={[0, 0, 0.42]} castShadow receiveShadow>
          <boxGeometry args={[BAR_W, height * 0.95, thickness]} />
          <meshStandardMaterial {...mat} />
        </mesh>
        <mesh position={[letterW / 4, 0, 0]} rotation={[0, 0, -0.42]} castShadow receiveShadow>
          <boxGeometry args={[BAR_W, height * 0.95, thickness]} />
          <meshStandardMaterial {...mat} />
        </mesh>
        <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
          <boxGeometry args={[letterW * 0.7, barH, thickness]} />
          <meshStandardMaterial {...mat} />
        </mesh>
      </group>
    </group>
  );
}
