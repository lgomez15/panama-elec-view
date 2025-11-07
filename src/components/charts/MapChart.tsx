import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import panamaGeoJSON from "@/data/panama-provinces.json";

interface MapChartProps {
  data: Record<string, { votos: number; principal: string }>;
  partyColors: Record<string, string>;
}

const MapChart = ({ data, partyColors }: MapChartProps) => {
  const [tooltipContent, setTooltipContent] = useState<string>("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Calculate vote range for color scale
  const votes = Object.values(data).map((d) => d.votos);
  const maxVotes = Math.max(...votes);
  const minVotes = Math.min(...votes);

  const colorScale = scaleLinear<string>()
    .domain([minVotes, maxVotes])
    .range(["hsl(210, 50%, 90%)", "hsl(210, 100%, 40%)"]);

  const totalVotes = votes.reduce((sum, v) => sum + v, 0);

  const handleMouseEnter = (geo: any, event: React.MouseEvent) => {
    const provinceName = geo.properties.name;
    const provinceData = data[provinceName];
    
    if (provinceData) {
      const percentage = ((provinceData.votos / totalVotes) * 100).toFixed(1);
      setTooltipContent(
        `${provinceName}\nVotos: ${provinceData.votos.toLocaleString()}\nPorcentaje: ${percentage}%\nPartido ganador: ${provinceData.principal}`
      );
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setTooltipContent("");
  };

  return (
    <div className="relative w-full h-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [-80.0, 8.5],
          scale: 4500,
        }}
        className="w-full h-full"
      >
        <Geographies geography={panamaGeoJSON}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const provinceName = geo.properties.name;
              const provinceData = data[provinceName];
              const fillColor = provinceData
                ? partyColors[provinceData.principal] || colorScale(provinceData.votos)
                : "hsl(var(--muted))";

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor}
                  stroke="hsl(var(--background))"
                  strokeWidth={0.5}
                  onMouseEnter={(event) => handleMouseEnter(geo, event)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className="transition-all duration-200 hover:opacity-80 cursor-pointer outline-none focus:outline-none"
                  tabIndex={-1}
                  aria-label={provinceName}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip */}
      {tooltipContent && (
        <div
          className="fixed z-50 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-md shadow-md border pointer-events-none whitespace-pre-line"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y + 10,
          }}
        >
          {tooltipContent}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm p-4 rounded-lg shadow-soft border">
        <h4 className="text-sm font-semibold mb-2 text-foreground">Partido Ganador por Provincia</h4>
        <div className="space-y-1">
          {Object.entries(
            Object.values(data).reduce((acc, d) => {
              acc[d.principal] = (acc[d.principal] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([party, count]) => (
            <div key={party} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: partyColors[party] || "hsl(var(--muted))" }}
              />
              <span className="text-xs text-foreground">
                {party} ({count})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapChart;
