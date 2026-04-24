"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";
import type { Group } from "three";

const LABEL_SPRING_CONFIG = { tension: 220, friction: 22 };

export interface Label3DProps {
  text: string;
  visible: boolean;
  position?: [number, number, number];
  isMobile?: boolean;
}

function getLabelOpacity(opacity: { get: () => number }): number {
  return opacity.get();
}

export function Label3D({
  text,
  visible,
  position = [0, 1.6, 0],
  isMobile = false,
}: Label3DProps) {
  const [x, y, z] = position;
  const groupRef = useRef<Group>(null);
  const [hasEntered, setHasEntered] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setHasEntered(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);
  const effectiveVisible = visible && hasEntered;
  const { opacity, yOffset, scale } = useSpring({
    opacity: effectiveVisible ? 1 : 0,
    yOffset: effectiveVisible ? 0 : -0.15,
    scale: effectiveVisible ? 1 : 0.95,
    config: LABEL_SPRING_CONFIG,
  });

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    const o = getLabelOpacity(opacity);
    group.traverse((obj) => {
      if ("material" in obj && obj.material) {
        const mat = obj.material as { opacity?: number; transparent?: boolean; emissive?: { setHex: (n: number) => void }; emissiveIntensity?: number };
        if (typeof mat.opacity !== "undefined") {
          mat.opacity = o;
          mat.transparent = o < 1;
        }
        if (mat.emissive && mat.emissive.setHex) {
          mat.emissive.setHex(0x6366f1);
          (obj.material as { emissiveIntensity: number }).emissiveIntensity = 0.35;
        }
      }
    });
  });

  const fontSize = isMobile ? 0.32 : 0.4;

  return (
    <a.group
      ref={groupRef}
      position={yOffset.to((v) => [x, y + v, z])}
      scale={scale}
      raycast={() => null}
    >
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <Text
          fontSize={fontSize}
          color="#e8ecff"
          anchorX="center"
          anchorY="middle"
          maxWidth={3}
        >
          {text}
        </Text>
      </Billboard>
    </a.group>
  );
}
