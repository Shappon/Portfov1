"use client";

/**
 * Grue 3D (forme « Projets » du carrousel) — modèle d’origine `app/testgrue/Crane.tsx`.
 */

const CRANE_YELLOW = "#F4B000";
const BASE_GRAY = "#2F343A";
const CABIN_GRAY = "#DDE1E6";
const WINDOW_TEAL = "#2FA7A0";
const CABLE_BLACK = "#1B1D1F";
const HOOK_METAL = "#60666E";
const AXLE_DARK = "#2F343A";

interface CraneProps {
  scale?: number;
  opacity?: number;
}

function matProps(opacity: number) {
  return {
    transparent: opacity < 1,
    opacity,
  } as const;
}

export function Crane({ scale = 1, opacity = 1 }: CraneProps) {
  return (
    <group scale={scale}>
      {/* Base : socle + plateforme */}
      <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
        <boxGeometry args={[1.6, 0.2, 1.6]} />
        <meshStandardMaterial color={BASE_GRAY} {...matProps(opacity)} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.275, 0]}>
        <boxGeometry args={[1.2, 0.15, 1.2]} />
        <meshStandardMaterial color={BASE_GRAY} {...matProps(opacity)} />
      </mesh>

      {/* Tour */}
      <mesh castShadow receiveShadow position={[0, 1.65, 0]}>
        <cylinderGeometry args={[0.2, 0.26, 2.6, 10]} />
        <meshStandardMaterial color={CRANE_YELLOW} {...matProps(opacity)} />
      </mesh>

      {/* Capot + cylindre transition */}
      <mesh castShadow receiveShadow position={[0, 2.95, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color={CRANE_YELLOW} {...matProps(opacity)} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 3.01, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.12, 10]} />
        <meshStandardMaterial color={CRANE_YELLOW} {...matProps(opacity)} />
      </mesh>

      <group position={[0, 3.07, 0]}>
        {/* Jonction tour / bras */}
        <mesh castShadow receiveShadow position={[0, 0.06, 0]}>
          <boxGeometry args={[0.4, 0.12, 0.32]} />
          <meshStandardMaterial color={CRANE_YELLOW} {...matProps(opacity)} />
        </mesh>

        {/* Bras principal */}
        <mesh castShadow receiveShadow position={[1.35, 0.21, 0]}>
          <boxGeometry args={[2.7, 0.18, 0.24]} />
          <meshStandardMaterial color={CRANE_YELLOW} {...matProps(opacity)} />
        </mesh>
        {/* Poutre inférieure (collée sous le bras, même longueur) */}
        <mesh castShadow receiveShadow position={[1.35, 0.09, 0]}>
          <boxGeometry args={[2.7, 0.06, 0.2]} />
          <meshStandardMaterial color={CRANE_YELLOW} {...matProps(opacity)} />
        </mesh>
        {/* Montants verticaux bras ↔ poutre (truss intégré) */}
        <mesh castShadow receiveShadow position={[0.5, 0.15, 0]}>
          <boxGeometry args={[0.08, 0.12, 0.2]} />
          <meshStandardMaterial color={CRANE_YELLOW} {...matProps(opacity)} />
        </mesh>
        <mesh castShadow receiveShadow position={[1.35, 0.15, 0]}>
          <boxGeometry args={[0.08, 0.12, 0.2]} />
          <meshStandardMaterial color={CRANE_YELLOW} {...matProps(opacity)} />
        </mesh>
        <mesh castShadow receiveShadow position={[2.2, 0.15, 0]}>
          <boxGeometry args={[0.08, 0.12, 0.2]} />
          <meshStandardMaterial color={CRANE_YELLOW} {...matProps(opacity)} />
        </mesh>

        {/* Cabine : support contre la tour + base + corps + vitre */}
        <mesh castShadow receiveShadow position={[0.28, 0.14, 0]}>
          <boxGeometry args={[0.12, 0.08, 0.4]} />
          <meshStandardMaterial color={CRANE_YELLOW} {...matProps(opacity)} />
        </mesh>
        <mesh castShadow receiveShadow position={[0.55, 0.16, 0]}>
          <boxGeometry args={[0.5, 0.08, 0.45]} />
          <meshStandardMaterial color={CABIN_GRAY} {...matProps(opacity)} />
        </mesh>
        <mesh castShadow receiveShadow position={[0.55, 0.04, 0]}>
          <boxGeometry args={[0.42, 0.32, 0.38]} />
          <meshStandardMaterial color={CABIN_GRAY} {...matProps(opacity)} />
        </mesh>
        <mesh castShadow receiveShadow position={[0.55, 0.08, 0.18]}>
          <boxGeometry args={[0.2, 0.22, 0.06]} />
          <meshStandardMaterial color={WINDOW_TEAL} {...matProps(opacity)} />
        </mesh>

        {/* Suspension : support (collé à la poutre) → poulie → axe */}
        <mesh castShadow receiveShadow position={[2.7, 0.03, 0]}>
          <boxGeometry args={[0.2, 0.18, 0.16]} />
          <meshStandardMaterial color={CRANE_YELLOW} {...matProps(opacity)} />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          position={[2.7, -0.12, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.06, 0.06, 0.14, 8]} />
          <meshStandardMaterial color={HOOK_METAL} {...matProps(opacity)} />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          position={[2.7, -0.12, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.018, 0.018, 0.22, 8]} />
          <meshStandardMaterial color={AXLE_DARK} {...matProps(opacity)} />
        </mesh>

        {/* Câble */}
        <mesh castShadow position={[2.7, -0.93, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
          <meshStandardMaterial color={CABLE_BLACK} {...matProps(opacity)} />
        </mesh>

        {/* Bloc métal câble → crochet */}
        <mesh castShadow receiveShadow position={[2.7, -1.74, 0]}>
          <boxGeometry args={[0.18, 0.12, 0.14]} />
          <meshStandardMaterial color={HOOK_METAL} {...matProps(opacity)} />
        </mesh>

        {/* Crochet */}
        <mesh castShadow receiveShadow position={[2.7, -1.88, 0]}>
          <torusGeometry args={[0.08, 0.03, 8, 10]} />
          <meshStandardMaterial color={HOOK_METAL} {...matProps(opacity)} />
        </mesh>
      </group>
    </group>
  );
}
