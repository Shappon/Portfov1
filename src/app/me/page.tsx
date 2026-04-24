"use client";

import { SectionPageLayout } from "@/components/SectionPageLayout";
import { MePanel } from "@/components/panels/MePanel";

export default function MePage() {
  return (
    <SectionPageLayout title="Moi">
      <MePanel />
    </SectionPageLayout>
  );
}
