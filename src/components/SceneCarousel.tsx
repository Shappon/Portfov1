"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useMediaQueryMatch } from "@/hooks/useMediaQueryMatch";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import { Group, Mesh } from "three";
import { Environment, ContactShadows } from "@react-three/drei";
import { AIBlocks } from "./AIBlocks";
import { Label3D } from "./Label3D";
import { Crane } from "@/components/Crane";
import { BookMesh } from "@/components/shapes/BookMesh";

type Mode = "carousel" | "detail";
type ViewMode = "carousel" | "detail";

interface SectionItem {
  id: string;
  title: string;
  subtitle: string;
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

function getLabelForSection(sectionId: string): string {
  if (sectionId === "me") return "MOI";
  if (sectionId === "projects") return "PROJETS";
  if (sectionId === "ai") return "IA";
  return sectionId.toUpperCase();
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
      perspective.fov += (targetFov - perspective.fov) * 0.1;
    }
    camera.updateProjectionMatrix();
  });
  return null;
}

function useIsMobile(): boolean {
  return useMediaQueryMatch("(max-width: 576px)");
}

interface SceneCarouselProps {
  sections: SectionItem[];
  viewMode: ViewMode;
  activeIndex: number;
  onSelect: (index: number) => void;
  onEnter: () => void;
  onCenterHoverChange?: (hovered: boolean) => void;
}

export function SceneCarousel({
  sections,
  viewMode,
  activeIndex,
  onSelect,
  onEnter,
  onCenterHoverChange,
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
        />
      ))}
    </>
  );
}

interface CarouselMeshProps {
  index: number;
  section: SectionItem;
  activeIndex: number;
  totalSections: number;
  mode: Mode;
  isMobile: boolean;
  hovered: boolean;
  onPointerOver: () => void;
  onPointerOut: () => void;
  onClick: () => void;
  onEnter: () => void;
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

  const spring = useSpring({
    position: [targetX, targetY, targetZ] as [number, number, number],
    scale: targetScale,
    config: SPRING_CONFIG,
  });

  const meshRef = useRef<Mesh | null>(null);

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const speed = slot === "center" ? 0.2 : 0.5;
    mesh.rotation.y += delta * speed;
  });

  const handleClick = () => {
    if (mode === "detail") return;
    if (slot === "center") onEnter();
    else onClick();
  };

  const isBook = section.id === "me";
  const isCrane = section.id === "projects";
  const isAIBlocks = section.id === "ai";
  const geometry = useMemo(() => <boxGeometry args={[0.44, 0.44, 0.44]} />, []);
  const isCenter = slot === "center";

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
      />
    );
  }
  if (isAIBlocks) {
    return (
      <CarouselAIBlocks
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
      />
    );
  }

  return (
    <animated.group position={spring.position as unknown as [number, number, number]} scale={spring.scale}>
      {isCenter && mode === "carousel" && (
        <Label3D
          text={getLabelForSection(section.id)}
          visible
          position={[0, -1.05, 0]}
          isMobile={isMobile}
        />
      )}
      <animated.mesh
        ref={meshRef}
        position={[0, 0, 0]}
        scale={1}
        castShadow
        receiveShadow
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
        {geometry}
        <meshStandardMaterial
        color={isCenter ? "#6c7bd8" : "#8a9ac4"}
        metalness={0.35}
        roughness={0.4}
        emissive={isCenter ? "#2a2a4a" : "#1a1a2e"}
        emissiveIntensity={isCenter ? 0.15 : 0.05}
        transparent={targetOpacity < 1}
        opacity={targetOpacity}
      />
      </animated.mesh>
    </animated.group>
  );
}

interface CarouselAIBlocksProps {
  index: number;
  section: SectionItem;
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
}

function CarouselAIBlocks({
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
}: CarouselAIBlocksProps) {
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
    if (mode === "detail") return;
    if (slot === "center") onEnter();
    else onClick();
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
        <Label3D
          text={getLabelForSection(section.id)}
          visible
          position={[0, -1.05, 0]}
          isMobile={isMobile}
        />
      )}
      <group ref={groupRef}>
        <AIBlocks
          scale={0.72}
          color="#6c7bd8"
          emissive="#3a4a9a"
          emissiveIntensity={0.2}
          thickness={0.12}
          height={0.9}
          width={1.15}
          gap={0.08}
          opacity={targetOpacity}
        />
      </group>
    </animated.group>
  );
}

interface CarouselCraneProps {
  index: number;
  section: SectionItem;
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
    if (mode === "detail") return;
    if (slot === "center") onEnter();
    else onClick();
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
        <Label3D
          text={getLabelForSection(section.id)}
          visible
          position={[0, -1.05, 0]}
          isMobile={isMobile}
        />
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
  section: SectionItem;
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
    if (mode === "detail") return;
    if (slot === "center") onEnter();
    else onClick();
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
        <Label3D
          text={getLabelForSection(section.id)}
          visible
          position={[0, -1.05, 0]}
          isMobile={isMobile}
        />
      )}
      <group ref={groupRef} scale={0.42}>
        <BookMesh active={isCenter} hovered={hovered} opacity={targetOpacity} onClick={handleClick} />
      </group>
    </animated.group>
  );
}
