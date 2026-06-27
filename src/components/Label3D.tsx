"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";
import type { Group } from "three";

const LABEL_SPRING_CONFIG = { tension: 220, friction: 22 };

export interface Label3DProps {
  text: string;
  subtext?: string;
  visible: boolean;
  position?: [number, number, number];
  isMobile?: boolean;
  fontSize?: number;
  /** Incrémenté à chaque tentative de clic « arrive bientôt » pour animer le sous-texte. */
  subtextPulseKey?: number;
}

function getLabelOpacity(opacity: { get: () => number }): number {
  return opacity.get();
}

export function Label3D({
  text,
  subtext,
  visible,
  position = [0, 1.6, 0],
  isMobile = false,
  fontSize: fontSizeProp,
  subtextPulseKey = 0,
}: Label3DProps) {
  const [x, y, z] = position;
  const groupRef = useRef<Group>(null);
  const subtextGroupRef = useRef<Group>(null);
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

  const [{ subtextScale, subtextGlow }, subtextPulseApi] = useSpring(() => ({
    subtextScale: 1,
    subtextGlow: 0,
  }));

  useEffect(() => {
    if (!subtextPulseKey) return;
    subtextPulseApi.start({
      subtextScale: 1.28,
      subtextGlow: 1,
      config: { tension: 420, friction: 12 },
      onRest: () => {
        subtextPulseApi.start({
          subtextScale: 1,
          subtextGlow: 0,
          config: { tension: 200, friction: 16 },
        });
      },
    });
  }, [subtextPulseKey, subtextPulseApi]);

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

    const subGroup = subtextGroupRef.current;
    if (subGroup) {
      const pulseScale = subtextScale.get();
      subGroup.scale.setScalar(pulseScale);
      const glow = subtextGlow.get();
      subGroup.traverse((obj) => {
        if (!("material" in obj) || !obj.material) return;
        const mat = obj.material as { color?: { setRGB: (r: number, g: number, b: number) => void } };
        if (!mat.color?.setRGB) return;
        const baseR = 0.66;
        const baseG = 0.71;
        const baseB = 0.85;
        const hotR = 0.98;
        const hotG = 0.82;
        const hotB = 0.35;
        mat.color.setRGB(
          baseR + (hotR - baseR) * glow,
          baseG + (hotG - baseG) * glow,
          baseB + (hotB - baseB) * glow
        );
      });
    }
  });

  /* Mobile : caméra reculée + fov élargi dans SceneCarousel → on agrandit légèrement le label pour compenser. */
  const fontSize = fontSizeProp ?? (isMobile ? 0.38 : 0.4);
  const subFontSize = fontSize * 0.58;
  const lineGap = fontSize * 0.72;

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
          position={[0, subtext ? lineGap * 0.5 : 0, 0]}
        >
          {text}
        </Text>
        {subtext ? (
          <group ref={subtextGroupRef}>
            <Text
              fontSize={subFontSize}
              color="#a8b4d8"
              anchorX="center"
              anchorY="middle"
              maxWidth={3}
              position={[0, -lineGap * 0.5, 0]}
            >
              {subtext}
            </Text>
          </group>
        ) : null}
      </Billboard>
    </a.group>
  );
}
