import React, { useMemo, useState } from "react";

function labelForYard(position) {
  if (position === 50) return "50";
  if (position < 50) return `${position}`;
  return `${100 - position}`;
}

function sideLabel(position) {
  if (position === 50) return "50";
  if (position < 50) return `Own ${position}`;
  return `Opp ${100 - position}`;
}

function gainText(yards) {
  if (yards > 0) return `Gain of ${yards} yard${yards === 1 ? "" : "s"}`;
  if (yards < 0) return `Loss of ${Math.abs(yards)} yard${Math.abs(yards) === 1 ? "" : "s"}`;
  return "No gain";
}

export default function App() {
  const [lineOfScrimmage, setLineOfScrimmage] = useState(null);
  const [downedSpot, setDownedSpot] = useState(null);
  const [offenseDirection, setOffenseDirection] = useState("right");

  const displayedYardage = useMemo(() => {
    if (lineOfScrimmage === null || downedSpot === null) return null;
    const raw = downedSpot - lineOfScrimmage;
    return offenseDirection === "right" ? raw : -raw;
  }, [lineOfScrimmage, downedSpot, offenseDirection]);

  const instruction = useMemo(() => {
    if (lineOfScrimmage === null) return "Click a yard line to set the line of scrimmage.";
    if (downedSpot === null) return "Now click another yard line to mark the downed spot.";
    return "Click any yard line to start a new play.";
  }, [lineOfScrimmage, downedSpot]);

  const handleLineTap = (yard) => {
    if (lineOfScrimmage === null) {
      setLineOfScrimmage(yard);
      return;
    }
    if (downedSpot === null) {
      setDownedSpot(yard);
      return;
    }
    setLineOfScrimmage(yard);
    setDownedSpot(null);
  };

  const fieldLines = Array.from({ length: 101 }, (_, i) => i);
  const majorNumbers = Array.from({ length: 9 }, (_, i) => (i + 1) * 10);

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1>Football Yardage Tracker</h1>
        <p>Select the line of scrimmage, then the downed spot.</p>

        <div style={{ marginBottom: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => setOffenseDirection(offenseDirection === "right" ? "left" : "right")}
            style={{ padding: "10px 14px", cursor: "pointer" }}
          >
            Offense: {offenseDirection === "right" ? "→ Right" : "← Left"}
          </button>

          <button
            onClick={() => {
              setLineOfScrimmage(null);
              setDownedSpot(null);
            }}
            style={{ padding: "10px 14px", cursor: "pointer" }}
          >
            Reset
          </button>
        </div>

        <div style={{ marginBottom: "15px", padding: "10px", background: "white", borderRadius: "8px" }}>
          <strong>{instruction}</strong>
          <div style={{ marginTop: "8px" }}>
            <div>Line of Scrimmage: {lineOfScrimmage === null ? "Not set" : sideLabel(lineOfScrimmage)}</div>
            <div>Downed Spot: {downedSpot === null ? "Not set" : sideLabel(downedSpot)}</div>
            <div>
              Result: {displayedYardage === null ? "Not calculated yet" : `${displayedYardage > 0 ? "+" : ""}${displayedYardage} (${gainText(displayedYardage)})`}
            </div>
          </div>
        </div>

        <div style={{ overflowX: "auto", background: "white", padding: "10px", borderRadius: "8px" }}>
          <svg viewBox="0 0 1200 520" style={{ width: "100%", minWidth: "900px", height: "auto", borderRadius: "12px" }}>
            <defs>
              <pattern id="grass" width="120" height="520" patternUnits="userSpaceOnUse">
                <rect width="60" height="520" fill="#2f8f46" />
                <rect x="60" width="60" height="520" fill="#287a3c" />
              </pattern>
            </defs>

            <rect x="0" y="0" width="1200" height="520" rx="24" fill="url(#grass)" />
            <rect x="40" y="50" width="1120" height="420" rx="16" fill="none" stroke="white" strokeWidth="4" />

            <rect x="40" y="50" width="100" height="420" fill="#1f6a33" />
            <rect x="1060" y="50" width="100" height="420" fill="#1f6a33" />

            {fieldLines.map((yard) => {
              const x = 140 + yard * 9.2;
              const isMajor = yard % 5 === 0;
              const isGoal = yard === 0 || yard === 100;
              const selectedLOS = yard === lineOfScrimmage;
              const selectedDowned = yard === downedSpot;

              return (
                <g key={yard}>
                  <rect
                    x={x - 4.6}
                    y={42}
                    width={9.2}
                    height={436}
                    fill="transparent"
                    onClick={() => handleLineTap(yard)}
                    style={{ cursor: "pointer" }}
                  />
                  <line
                    x1={x}
                    y1={50}
                    x2={x}
                    y2={470}
                    stroke={selectedLOS ? "#f59e0b" : selectedDowned ? "#ef4444" : "white"}
                    strokeWidth={isGoal ? 5 : isMajor ? 3 : 1.2}
                  />
                </g>
              );
            })}

            {majorNumbers.map((yard) => {
              const x = 140 + yard * 9.2;
              const display = labelForYard(yard);
              return (
                <g key={yard}>
                  <text
                    x={x}
                    y="150"
                    fill="white"
                    fontSize="34"
                    fontWeight="700"
                    textAnchor="middle"
                    transform={`rotate(180 ${x} 150)`}
                  >
                    {display}
                  </text>
                  <text
                    x={x}
                    y="395"
                    fill="white"
                    fontSize="34"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {display}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
