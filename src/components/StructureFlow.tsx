"use client";

import { StructureFlowCollection } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

export default function StructureFlow() {
  return (
    <div
      className="shader-frame"
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        background: "#09090b",
      }}
    >
      <StructureFlowCollection
        variant="structure-flow"
        speed={1.0}
        pointSize={0.08}
        opacity={0.5}
        maskStart={0.2}
        maskSolid={0.5}
      />
    </div>
  );
}
