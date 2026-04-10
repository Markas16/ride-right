import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { motion } from "framer-motion";

mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  themeVariables: {
    primaryColor: "#6366f1",
    primaryTextColor: "#f8fafc",
    primaryBorderColor: "#818cf8",
    lineColor: "#94a3b8",
    secondaryColor: "#7c3aed",
    tertiaryColor: "#1e1b4b",
    background: "#0f0e1a",
    mainBkg: "#1e1b4b",
    nodeBorder: "#818cf8",
    clusterBkg: "#1e1b4b",
    clusterBorder: "#4f46e5",
    titleColor: "#e2e8f0",
    edgeLabelBackground: "#1e1b4b",
    textColor: "#e2e8f0",
    actorBkg: "#4f46e5",
    actorBorder: "#818cf8",
    actorTextColor: "#f8fafc",
    actorLineColor: "#94a3b8",
    signalColor: "#e2e8f0",
    signalTextColor: "#e2e8f0",
    labelBoxBkgColor: "#1e1b4b",
    labelBoxBorderColor: "#818cf8",
    labelTextColor: "#e2e8f0",
    loopTextColor: "#c4b5fd",
    activationBorderColor: "#818cf8",
    activationBkgColor: "#312e81",
    sequenceNumberColor: "#f8fafc",
    noteBkgColor: "#312e81",
    noteTextColor: "#e2e8f0",
    noteBorderColor: "#818cf8",
  },
  fontFamily: "Plus Jakarta Sans, sans-serif",
  fontSize: 13,
  securityLevel: "loose",
});

let idCounter = 0;

export default function MermaidDiagram({ chart, className = "" }: { chart: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState("");
  const idRef = useRef(`mermaid-${idCounter++}`);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { svg: rendered } = await mermaid.render(idRef.current, chart);
        if (!cancelled) setSvg(rendered);
      } catch (e) {
        console.error("Mermaid render error:", e);
      }
    })();
    return () => { cancelled = true; };
  }, [chart]);

  return (
    <motion.div
      ref={containerRef}
      className={`overflow-x-auto rounded-xl p-4 bg-[#0f0e1a]/60 border border-border/30 ${className}`}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
