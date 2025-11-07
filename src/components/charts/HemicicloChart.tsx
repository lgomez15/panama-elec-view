interface HemicicloChartProps {
  data: Array<{ name: string; value: number; fill: string }>;
  totalSeats: number;
}

const HemicicloChart = ({ data, totalSeats }: HemicicloChartProps) => {
  const width = 1000;
  const height = 500;
  const centerX = width / 2;
  const centerY = height * 0.85;
  const radius = Math.min(width, height * 2) * 0.4;
  
  // Calculate seat radius based on total seats to avoid overlap
  const seatRadius = Math.max(8, Math.min(16, (Math.PI * radius) / (totalSeats * 2.5)));
  
  // Generate seat positions
  const seats: Array<{ x: number; y: number; party: string; color: string; index: number }> = [];
  let currentSeatIndex = 0;
  
  data.forEach((party) => {
    const partySeats = Math.round(party.value);
    for (let i = 0; i < partySeats; i++) {
      const angle = Math.PI - (currentSeatIndex / (totalSeats - 1)) * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY - radius * Math.sin(angle);
      
      seats.push({
        x,
        y,
        party: party.name,
        color: party.fill,
        index: currentSeatIndex,
      });
      currentSeatIndex++;
    }
  });

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        role="img"
        aria-label={`Hemiciclo con ${totalSeats} escaños distribuidos entre partidos`}
      >
        {/* Background semicircle */}
        <path
          d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="2"
          strokeDasharray="5,5"
          opacity="0.3"
        />
        
        {/* Seats */}
        <g>
          {seats.map((seat, idx) => (
            <circle
              key={`seat-${idx}`}
              cx={seat.x}
              cy={seat.y}
              r={seatRadius}
              fill={seat.color}
              className="transition-all duration-200 hover:opacity-80 cursor-pointer"
              role="graphics-symbol"
              aria-label={`Escaño ${seat.index + 1} - ${seat.party}`}
            >
              <title>{seat.party}</title>
            </circle>
          ))}
        </g>
      </svg>
      
      {/* Legend */}
      <div className="flex justify-center gap-6 flex-wrap mt-4 px-4">
        {data.map((party) => (
          <div key={party.name} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: party.fill }}
            />
            <span className="text-sm font-medium text-foreground">
              {party.name}: {Math.round(party.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HemicicloChart;
