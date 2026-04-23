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

function getFieldGoalLength(position, offenseDirection) {
  if (position === null) return null;

  const yardsToGoal = offenseDirection === "right" ? 100 - position : position;
  return yardsToGoal + 17;
}

function getFirstDownLine(lineOfScrimmage, offenseDirection) {
  if (lineOfScrimmage === null) return null;

  if (offenseDirection === "right") {
    return Math.min(lineOfScrimmage + 10, 100);
  }

  return Math.max(lineOfScrimmage - 10, 0);
}

function getYardsToFirstDown(currentSpot, firstDownLine, offenseDirection) {
  if (currentSpot === null || firstDownLine === null) return null;

  const yards =
    offenseDirection === "right"
      ? firstDownLine - currentSpot
      : currentSpot - firstDownLine;

  return Math.max(0, yards);
}

export default function App() {
  const [lineOfScrimmage, setLineOfScrimmage] = useState(null);
  const [downedSpot, setDownedSpot] = useState(null);
  const [offenseDirection, setOffenseDirection] = useState("right");

  const primaryColor = "#B9D9EB";   // Columbia Blue
  const secondaryColor = "#FFB81C"; // Gold
  const darkBlue = "#002244";

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

  const kickSpot = downedSpot !== null ? downedSpot : lineOfScrimmage;

  const fieldGoalLength = useMemo(() => {
    return getFieldGoalLength(kickSpot, offenseDirection);
  }, [kickSpot, offenseDirection]);

  const firstDownLine = useMemo(() => {
    return getFirstDownLine(lineOfScrimmage, offenseDirection);
  }, [lineOfScrimmage, offenseDirection]);

  const currentSpot = downedSpot !== null ? downedSpot : lineOfScrimmage;

  const yardsToFirstDown = useMemo(() => {
    return getYardsToFirstDown(currentSpot, firstDownLine, offenseDirection);
  }, [currentSpot, firstDownLine, offenseDirection]);

  const madeFirstDown = useMemo(() => {
    if (downedSpot === null || firstDownLine === null) return false;

    return offenseDirection === "right"
      ? downedSpot >= firstDownLine
      : downedSpot <= firstDownLine;
  }, [downedSpot, firstDownLine, offenseDirection]);

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
    <div
      style={{
        minHeight: "100vh",
        background: "#eef2f7",
        padding: "12px",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}
        >
          <h1 style={{ marginTop: 0, marginBottom: "8px", color: darkBlue }}>
            Football Yardage Tracker
          </h1>

          <p style={{ marginTop: 0 }}>
            Select the line of scrimmage, then the downed spot.
          </p>

          <div style={{ marginBottom: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => setOffenseDirection(offenseDirection === "right" ? "left" : "right")}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                background: darkBlue,
                color: "white",
                border: "none",
                borderRadius: "8px"
              }}
            >
              Offense: {offenseDirection === "right" ? "→ Right" : "← Left"}
            </button>

            <button
              onClick={() => {
                setLineOfScrimmage(null);
                setDownedSpot(null);
              }}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                background: secondaryColor,
                color: darkBlue,
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold"
              }}
            >
              Reset
            </button>
          </div>

          <div
            style={{
              marginBottom: "10px",
              padding: "12px",
              background: "#f8fafc",
              borderRadius: "8px",
              borderLeft: `6px solid ${secondaryColor}`
            }}
          >
            <strong>{instruction}</strong>

            <div style={{ marginTop: "8px", lineHeight: "1.8" }}>
              <div>
                Line of Scrimmage: {lineOfScrimmage === null ? "Not set" : sideLabel(lineOfScrimmage)}
              </div>

              <div>
                First Down Line: {firstDownLine === null ? "Not set" : sideLabel(firstDownLine)}
              </div>

              <div>
                Downed Spot: {downedSpot === null ? "Not set" : sideLabel(downedSpot)}
              </div>

              <div>
                Field Goal Length: {fieldGoalLength === null ? "Set line of scrimmage first" : `${fieldGoalLength} yards`}
              </div>

              <div>
                Yards to First Down: {yardsToFirstDown === null ? "Set line of scrimmage first" : `${yardsToFirstDown} yards`}
              </div>

              <div>
                First Down Result: {downedSpot === null ? "Play not finished" : madeFirstDown ? "First Down" : "Short of the line to gain"}
              </div>

              <div
                style={{
                  marginTop: "8px",
                  fontSize: "22px",
                  fontWeight: "bold",
                  color: darkBlue
                }}
              >
                Result:{" "}
                {displayedYardage === null
                  ? "Not calculated yet"
                  : `${displayedYardage > 0 ? "+" : ""}${displayedYardage} (${gainText(displayedYardage)})`}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            overflowX: "auto",
            background: "white",
            padding: "14px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}
        >
          <svg
            viewBox="0 0 1400 600"
            style={{
              width: "100%",
              minWidth: "1200px",
              height: "auto",
              borderRadius: "14px",
              display: "block"
            }}
          >
            <defs>
              <pattern id="grass" width="140" height="600" patternUnits="userSpaceOnUse">
                <rect width="70" height="600" fill="#2f8f46" />
                <rect x="70" width="70" height="600" fill="#287a3c" />
              </pattern>
            </defs>

            <rect x="0" y="0" width="1400" height="600" rx="24" fill="url(#grass)" />
            <rect x="50" y="55" width="1300" height="490" rx="16" fill="none" stroke="white" strokeWidth="4" />

            <rect x="50" y="55" width="120" height="490" fill={primaryColor} />
            <rect x="1230" y="55" width="120" height="490" fill={primaryColor} />

            <text
              x="110"
              y="300"
              fill={darkBlue}
              fontSize="36"
              fontWeight="700"
              textAnchor="middle"
              transform="rotate(-90 110 300)"
            >
              END ZONE
            </text>

            <text
              x="1290"
              y="300"
              fill={darkBlue}
              fontSize="36"
              fontWeight="700"
              textAnchor="middle"
              transform="rotate(90 1290 300)"
            >
              END ZONE
            </text>

            {fieldLines.map((yard) => {
              const x = 170 + yard * 10.6;
              const isMajor = yard % 5 === 0;
              const isGoal = yard === 0 || yard === 100;
              const selectedLOS = yard === lineOfScrimmage;
              const selectedDowned = yard === downedSpot;
              const selectedFirstDown = yard === firstDownLine;

              return (
                <g key={yard}>
                  <rect
                    x={x - 5.3}
                    y={45}
                    width={10.6}
                    height={510}
                    fill="transparent"
                    onClick={() => handleLineTap(yard)}
                    style={{ cursor: "pointer" }}
                  />
                  <line
                    x1={x}
                    y1={55}
                    x2={x}
                    y2={545}
                    stroke={
                      selectedLOS
                        ? secondaryColor
                        : selectedDowned
                        ? darkBlue
                        : selectedFirstDown
                        ? "#ff6600"
                        : "white"
                    }
                    strokeWidth={selectedFirstDown ? 5 : isGoal ? 5 : isMajor ? 3 : 1.3}
                    strokeDasharray={selectedFirstDown ? "10,8" : "0"}
                  />
                </g>
              );
            })}

            {majorNumbers.map((yard) => {
              const x = 170 + yard * 10.6;
              const display = labelForYard(yard);

              return (
                <g key={yard}>
                  <text
                    x={x}
                    y="170"
                    fill="white"
                    fontSize="38"
                    fontWeight="700"
                    textAnchor="middle"
                    transform={`rotate(180 ${x} 170)`}
                  >
                    {display}
                  </text>

                  <text
                    x={x}
                    y="440"
                    fill="white"
                    fontSize="38"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {display}
                  </text>
                </g>
              );
            })}

            {lineOfScrimmage !== null && (
              <g>
                <circle cx={170 + lineOfScrimmage * 10.6} cy="300" r="18" fill={secondaryColor} />
                <text
                  x={170 + lineOfScrimmage * 10.6}
                  y="305"
                  fill={darkBlue}
                  fontSize="12"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  LOS
                </text>
              </g>
            )}

            {downedSpot !== null && (
              <g>
                <circle cx={170 + downedSpot * 10.6} cy="300" r="18" fill={darkBlue} />
                <text
                  x={170 + downedSpot * 10.6}
                  y="305"
                  fill="white"
                  fontSize="11"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  END
                </text>
              </g>
            )}

            {firstDownLine !== null && (
              <g>
                <rect
                  x={170 + firstDownLine * 10.6 - 8}
                  y="255"
                  width="16"
                  height="90"
                  fill="#ff6600"
                  rx="4"
                />
                <text
                  x={170 + firstDownLine * 10.6}
                  y="250"
                  fill="#ff6600"
                  fontSize="14"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  1ST
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
