"use client";

import { useRef, useState, useEffect } from "react";
import { useMediaQueryMatch } from "@/hooks/useMediaQueryMatch";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import { Group } from "three";
import { Environment, ContactShadows } from "@react-three/drei";
import { Label3D } from "./Label3D";
import { Crane } from "@/components/Crane";
import { BookMesh } from "@/components/shapes/BookMesh";
import { LinkCubeMesh } from "@/components/shapes/LinkCubeMesh";
import {
  isComingSoonSection,
  isCubeSection,
  isExternalSection,
  openExternalSection,
  type CarouselSection,
} from "@/data/carousel-sections";

type Mode = "carousel" | "detail";
type ViewMode = "carousel" | "detail";

interface SceneCarouselProps {
  sections: readonly CarouselSection[];
  viewMode: ViewMode;
  activeIndex: number;
  onSelect: (index: number) => void;
  onEnter: () => void;
  onCenterHoverChange?: (hovered: boolean) => void;
  comingSoonPulse?: { id: string; key: number } | null;
  onComingSoonAttempt?: (sectionId: string) => void;
}

const SPRING_CONFIG = { mass: 0.8, tension: 120, friction: 14 };
const DESKTOP = { leftX: -2.6, rightX: 2.6 };
/* Coords mobile resserrées pour rester visibles en portrait étroit (aspect ~0.5). */
const MOBILE = { leftX: -1.35, rightX: 1.35 };
const DOCK_DESKTOP = { x: -3.9, y: -0.1, z: 0.15 };
/* Dock mobile : forme 3D parquée en haut de l'écran (le panneau occupe toute la largeur). */
const DOCK_MOBILE = { x: 0, y: 2.1, z: 0.15 };
const SHAPE_Y = 0;
const SCALE_CENTER = 1.35;
const SCALE_SIDE = 1.12;
const SCALE_CENTER_MOBILE = 1.15;
const SCALE_SIDE_MOBILE = 0.9;
const SCALE_DOCK = 1;
const SCALE_DOCK_MOBILE = 0.7;

type Slot = "left" | "center" | "right" | "hidden";
function getSlot(index: number, activeIndex: number, total: number): Slot {
  const leftIndex = (activeIndex + total - 1) % total;
  const rightIndex = (activeIndex + 1) % total;
  if (index === leftIndex) return "left";
  if (index === activeIndex) return "center";
  if (index === rightIndex) return "right";
  return "hidden";
}

function handleShapeActivate(
  mode: Mode,
  slot: Slot,
  section: CarouselSection,
  onSelectIndex: () => void,
  onEnterPanel: () => void,
  onComingSoonAttempt?: (sectionId: string) => void
): void {
  if (mode === "detail") return;
  if (slot === "center") {
    if (isComingSoonSection(section)) {
      onComingSoonAttempt?.(section.id);
      return;
    }
    if (isExternalSection(section)) {
      openExternalSection(section);
      return;
    }
    onEnterPanel();
  } else {
    onSelectIndex();
  }
}

function CameraRig({ mode, isMobile }: { mode: Mode; isMobile: boolean }) {
  const { camera } = useThree();
  /* Mobile : caméra reculée + fov élargi pour que les 3 formes tiennent en portrait. */
  const targetZ = isMobile
    ? mode === "detail"
      ? 8.5
      : 9
    : mode === "detail"
    ? 6.2
    : 7;
  const targetFov = isMobile ? 55 : 45;
  useFrame(() => {
    /* R3F : la caméra Three.js se met à jour par mutation dans useFrame (usage documenté) */
    // eslint-disable-next-line react-hooks/immutability
    camera.position.z += (targetZ - camera.position.z) * 0.08;
    const perspective = camera as unknown as { fov?: number };
    if (typeof perspective.fov === "number") {
      /* R3F : ajustement du fov en useFrame (documenté) */
      // eslint-disable-next-line react-hooks/immutability
      perspective.fov += (targetFov - perspective.fov) * 0.1;
    }
    camera.updateProjectionMatrix();
  });
  return null;
}

function useIsMobile(): boolean {
  return useMediaQueryMatch("(max-width: 576px)");
}

export function SceneCarousel({
  sections,
  viewMode,
  activeIndex,
  onSelect,
  onEnter,
  onCenterHoverChange,
  comingSoonPulse,
  onComingSoonAttempt,
}: SceneCarouselProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const mode: Mode = viewMode === "detail" ? "detail" : "carousel";

  useEffect(() => {
    onCenterHoverChange?.(hoveredIndex === activeIndex);
  }, [hoveredIndex, activeIndex, onCenterHoverChange]);

  return (
    <>
      <CameraRig mode={mode} isMobile={isMobile} />
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[3, 4, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <spotLight position={[-3, 5, 4]} intensity={0.6} angle={0.3} penumbra={1} castShadow />
      <Environment preset="city" />
      <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={12} blur={2} far={4} />
      {sections.map((section, i) => (
        <CarouselMesh
          key={section.id}
          index={i}
          section={section}
          activeIndex={activeIndex}
          totalSections={sections.length}
          mode={mode}
          isMobile={isMobile}
          hovered={hoveredIndex === i}
          onPointerOver={() => setHoveredIndex(i)}
          onPointerOut={() => setHoveredIndex(null)}
          onClick={() => onSelect(i)}
          onEnter={onEnter}
          comingSoonPulse={comingSoonPulse}
          onComingSoonAttempt={onComingSoonAttempt}
        />
      ))}
    </>
  );
}

interface CarouselMeshProps {
  index: number;
  section: CarouselSection;
  activeIndex: number;
  totalSections: number;
  mode: Mode;
  isMobile: boolean;
  hovered: boolean;
  onPointerOver: () => void;
  onPointerOut: () => void;
  onClick: () => void;
  onEnter: () => void;
  comingSoonPulse?: { id: string; key: number } | null;
  onComingSoonAttempt?: (sectionId: string) => void;
}

function CarouselMesh({
  index,
  section,
  activeIndex,
  totalSections,
  mode,
  isMobile,
  hovered,
  onPointerOver,
  onPointerOut,
  onClick,
  onEnter,
  comingSoonPulse,
  onComingSoonAttempt,
}: CarouselMeshProps) {
  const slot = getSlot(index, activeIndex, totalSections);
  const isDetailActive = mode === "detail" && index === activeIndex;
  const isDetailInactive = mode === "detail" && index !== activeIndex;
  const coords = isMobile ? MOBILE : DESKTOP;
  const dock = isMobile ? DOCK_MOBILE : DOCK_DESKTOP;
  const leftOffIndex = (activeIndex + totalSections - 1) % totalSections;
  const scaleCenter = isMobile ? SCALE_CENTER_MOBILE : SCALE_CENTER;
  const scaleSide = isMobile ? SCALE_SIDE_MOBILE : SCALE_SIDE;
  const scaleDock = isMobile ? SCALE_DOCK_MOBILE : SCALE_DOCK;
  let targetX: number, targetY: number, targetZ: number, targetScale: number, targetOpacity: number;
  if (slot === "hidden") {
    targetX = 10;
    targetY = SHAPE_Y;
    targetZ = -0.6;
    targetScale = 0;
    targetOpacity = 0;
  } else if (isDetailInactive) {
    targetX = index === leftOffIndex ? coords.leftX : coords.rightX;
    targetY = SHAPE_Y;
    targetZ = -0.6;
    targetScale = 0;
    targetOpacity = 0;
  } else if (isDetailActive) {
    targetX = dock.x;
    targetY = dock.y;
    targetZ = dock.z;
    targetScale = scaleDock;
    targetOpacity = 1;
  } else {
    targetX = slot === "left" ? coords.leftX : slot === "right" ? coords.rightX : 0;
    targetY = SHAPE_Y;
    targetZ = slot === "center" ? 0 : -0.2;
    targetScale = (slot === "center" ? scaleCenter : scaleSide) + (hovered ? 0.03 : 0);
    targetOpacity = 1;
  }

  const isBook = section.id === "me";
  const isCrane = section.id === "projects";
  const isCube = isCubeSection(section);

  if (isBook) {
    return (
      <CarouselBook
        index={index}
        section={section}
        activeIndex={activeIndex}
        mode={mode}
        slot={slot}
        isMobile={isMobile}
        hovered={hovered}
        targetPosition={[targetX, targetY, targetZ]}
        targetScale={targetScale}
        targetOpacity={targetOpacity}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
        onEnter={onEnter}
        onComingSoonAttempt={onComingSoonAttempt}
      />
    );
  }
  if (isCube) {
    return (
      <CarouselCube
        section={section}
        mode={mode}
        slot={slot}
        isMobile={isMobile}
        targetPosition={[targetX, targetY, targetZ]}
        targetScale={targetScale}
        targetOpacity={targetOpacity}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
        onEnter={onEnter}
        comingSoonPulse={comingSoonPulse}
        onComingSoonAttempt={onComingSoonAttempt}
      />
    );
  }
  if (isCrane) {
    return (
      <CarouselCrane
        index={index}
        section={section}
        activeIndex={activeIndex}
        mode={mode}
        slot={slot}
        isMobile={isMobile}
        hovered={hovered}
        targetPosition={[targetX, targetY, targetZ]}
        targetScale={targetScale}
        targetOpacity={targetOpacity}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
        onEnter={onEnter}
        onComingSoonAttempt={onComingSoonAttempt}
      />
    );
  }

  return null;
}

interface CarouselCubeProps {
  section: CarouselSection;
  mode: Mode;
  slot: Slot;
  isMobile: boolean;
  targetPosition: [number, number, number];
  targetScale: number;
  targetOpacity: number;
  onPointerOver: () => void;
  onPointerOut: () => void;
  onClick: () => void;
  onEnter: () => void;
  comingSoonPulse?: { id: string; key: number } | null;
  onComingSoonAttempt?: (sectionId: string) => void;
}

function CarouselCube({
  section,
  mode,
  slot,
  targetPosition,
  targetScale,
  targetOpacity,
  onPointerOver,
  onPointerOut,
  onClick,
  onEnter,
  isMobile,
  comingSoonPulse,
  onComingSoonAttempt,
}: CarouselCubeProps) {
  const groupRef = useRef<Group>(null!);
  const wiggleRef = useRef(0);
  const isCenter = slot === "center";
  const isComingSoon = isComingSoonSection(section);
  const subtextPulseKey =
    comingSoonPulse?.id === section.id && isCenter ? comingSoonPulse.key : 0;
  const spring = useSpring({
    position: targetPosition,
    scale: targetScale,
    config: SPRING_CONFIG,
  });

  useEffect(() => {
    if (comingSoonPulse?.id === section.id) {
      wiggleRef.current = 0.55;
    }
  }, [comingSoonPulse, section.id]);

  useFrame((_state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const speed = slot === "center" ? 0.2 : 0.5;
    group.rotation.y += delta * speed;
    group.rotation.x += delta * (slot === "center" ? 0.08 : 0.12);

    if (wiggleRef.current > 0) {
      wiggleRef.current -= delta;
      const t = wiggleRef.current * 18;
      group.rotation.z = Math.sin(t) * 0.14;
      group.position.y = Math.sin(t * 1.4) * 0.04;
    } else {
      group.rotation.z *= 0.85;
      group.position.y *= 0.85;
    }
  });

  const handleClick = () => {
    handleShapeActivate(mode, slot, section, onClick, onEnter, onComingSoonAttempt);
  };

  return (
    <animated.group
      position={spring.position as unknown as [number, number, number]}
      scale={spring.scale}
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = isComingSoon ? "default" : "pointer";
        onPointerOver();
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
        onPointerOut();
      }}
    >
      {isCenter && mode === "carousel" && (
        <Label3D
          text={section.label}
          subtext={section.sublabel}
          visible
          position={[0, -0.62, 0]}
          isMobile={isMobile}
          fontSize={isMobile ? 0.22 : 0.24}
          subtextPulseKey={subtextPulseKey}
        />
      )}
      <group ref={groupRef} scale={0.82}>
        <LinkCubeMesh
          size={0.48}
          color={isCenter ? section.cubeColor ?? "#6c7bd8" : "#8a9ac4"}
          emissive={isCenter ? section.cubeEmissive ?? "#2a2a4a" : "#1a1a2e"}
          emissiveIntensity={isCenter ? 0.18 : 0.06}
          opacity={targetOpacity}
        />
      </group>
    </animated.group>
  );
}

interface CarouselCraneProps {
  index: number;
  section: CarouselSection;
  activeIndex: number;
  mode: Mode;
  slot: Slot;
  isMobile: boolean;
  hovered: boolean;
  targetPosition: [number, number, number];
  targetScale: number;
  targetOpacity: number;
  onPointerOver: () => void;
  onPointerOut: () => void;
  onClick: () => void;
  onEnter: () => void;
  onComingSoonAttempt?: (sectionId: string) => void;
}

function CarouselCrane({
  section,
  mode,
  slot,
  targetPosition,
  targetScale,
  targetOpacity,
  onPointerOver,
  onPointerOut,
  onClick,
  onEnter,
  isMobile,
  onComingSoonAttempt,
}: CarouselCraneProps) {
  const groupRef = useRef<Group>(null!);
  const spring = useSpring({
    position: targetPosition,
    scale: targetScale,
    config: SPRING_CONFIG,
  });

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const speed = slot === "center" ? 0.2 : 0.5;
    group.rotation.y += delta * speed;
    if (mode === "detail" && targetOpacity > 0.5) {
      group.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
    } else {
      group.position.y = 0;
    }
  });

  const handleClick = () => {
    handleShapeActivate(mode, slot, section, onClick, onEnter, onComingSoonAttempt);
  };

  return (
    <animated.group
      position={spring.position as unknown as [number, number, number]}
      scale={spring.scale}
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
        onPointerOver();
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
        onPointerOut();
      }}
    >
      {slot === "center" && mode === "carousel" && (
        <Label3D text={section.label} visible position={[0, -1.05, 0]} isMobile={isMobile} />
      )}
      <group ref={groupRef}>
        <group position={[0, -0.5, 0]} scale={0.24}>
          <Crane opacity={targetOpacity} />
        </group>
      </group>
    </animated.group>
  );
}

interface CarouselBookProps {
  index: number;
  section: CarouselSection;
  activeIndex: number;
  mode: Mode;
  slot: Slot;
  isMobile: boolean;
  hovered: boolean;
  targetPosition: [number, number, number];
  targetScale: number;
  targetOpacity: number;
  onPointerOver: () => void;
  onPointerOut: () => void;
  onClick: () => void;
  onEnter: () => void;
  onComingSoonAttempt?: (sectionId: string) => void;
}

function CarouselBook({
  section,
  mode,
  slot,
  hovered,
  targetPosition,
  targetScale,
  targetOpacity,
  onPointerOver,
  onPointerOut,
  onClick,
  onEnter,
  isMobile,
  onComingSoonAttempt,
}: CarouselBookProps) {
  const groupRef = useRef<Group>(null!);
  const isCenter = slot === "center";
  const spring = useSpring({
    position: targetPosition,
    scale: targetScale,
    config: SPRING_CONFIG,
  });

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const speed = slot === "center" ? 0.2 : 0.5;
    group.rotation.y += delta * speed;
    if (mode === "detail" && targetOpacity > 0.5) {
      group.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
    } else {
      group.position.y = 0;
    }
  });

  const handleClick = () => {
    handleShapeActivate(mode, slot, section, onClick, onEnter, onComingSoonAttempt);
  };

  return (
    <animated.group
      position={spring.position as unknown as [number, number, number]}
      scale={spring.scale}
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
        onPointerOver();
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
        onPointerOut();
      }}
    >
      {isCenter && mode === "carousel" && (
        <Label3D text={section.label} visible position={[0, -1.05, 0]} isMobile={isMobile} />
      )}
      <group ref={groupRef} scale={0.42}>
        <BookMesh active={isCenter} hovered={hovered} opacity={targetOpacity} onClick={handleClick} />
      </group>
    </animated.group>
  );
}
