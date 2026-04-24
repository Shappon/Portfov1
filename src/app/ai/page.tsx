"use client";

import { SectionPageLayout } from "@/components/SectionPageLayout";
import { AIPanel } from "@/components/panels/AIPanel";

export default function AIPage() {
  return (
    <SectionPageLayout title="IA">
      <AIPanel />
    </SectionPageLayout>
  );
}
