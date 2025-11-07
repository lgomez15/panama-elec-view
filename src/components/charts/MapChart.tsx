import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

interface MapChartProps {
  data: Record<string, { votos: number; principal: string }>;
  partyColors: Record<string, string>;
}

// Apunta a tu archivo /pa.json
const PANAMA_GEO_URL = "/pa.json";

const MapChart = ({ data, partyColors }: MapChartProps) => {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const totalVotes = Object.values(data).reduce(
    (sum, d) => sum + d.votos,
    0
  );

  const handleMouseEnter = (provinceName: string, event: React.MouseEvent) => {
    setHoveredProvince(provinceName);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredProvince(null);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-background">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 6500, // Ajusta esta escala...
          center: [-80, 8.5], // ...y este centro si es necesario
        }}
        width={800}
        height={600}
        style={{ maxHeight: '500px' }}
        role="img"
        aria-label="Mapa electoral de Panamá por provincias"
      >
        <Geographies geography={PANAMA_GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              
              // --- 💡 ¡ESTA ES LA CORRECCIÓN! 💡 ---
              // Tu GeoJSON usa "name" para la propiedad del nombre.
              const provinceName = geo.properties.name; 
              // --- 💡 ---

              const provinceData = data[provinceName];
              const fillColor =
                provinceData && partyColors[provinceData.principal]
                  ? partyColors[provinceData.principal]
                  : "hsl(var(--muted))";

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor}
                  stroke="hsl(var(--background))"
                  strokeWidth="1"
                  className="transition-all duration-200 cursor-pointer"
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", opacity: 0.8 },
                    pressed: { outline: "none" },
                  }}
                  onMouseEnter={(e) => handleMouseEnter(provinceName, e)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip (Sin cambios) */}
      {hoveredProvince && data[hoveredProvince] && (
        <div
          className="fixed z-50 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-lg border pointer-events-none"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y + 10,
          }}
        >
          <div className="font-semibold mb-1">{hoveredProvince}</div>
          <div className="text-xs space-y-0.5">
            <div>
              Votos: {data[hoveredProvince].votos.toLocaleString()}
            </div>
            {totalVotes > 0 && (
              <div>
                Porcentaje:{" "}
                {(
                  (data[hoveredProvince].votos / totalVotes) *
                  100
                ).toFixed(1)}
                %
              </div>
            )}
            <div className="font-medium">
              Ganador: {data[hoveredProvince].principal}
            </div>
          </div>
        </div>
      )}

      {/* Leyenda (Sin cambios) */}
      <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border">
        <h4 className="text-sm font-semibold mb-2">
          Ganador por Provincia
        </h4>
        <div className="space-y-1.5">
          {Object.entries(
            Object.values(data).reduce((acc, d) => {
              acc[d.principal] = (acc[d.principal] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          )
            .sort((a, b) => b[1] - a[1])
            .map(([party, count]) => (
              <div key={party} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded border border-white/20"
                  style={{
                    backgroundColor:
                      partyColors[party] || "hsl(var(--muted))",
                  }}
                />
                <span className="text-xs">
                  {party} ({count} {count === 1 ? "provincia" : "provincias"})
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MapChart;