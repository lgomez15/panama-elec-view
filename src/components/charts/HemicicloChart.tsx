interface HemicicloChartProps {
  data: Array<{ name: string; value: number; fill: string }>;
  totalSeats: number;
}

const HemicicloChart = ({ data, totalSeats }: HemicicloChartProps) => {
  const width = 1000;
  const height = 500;
  const centerX = width / 2;
  const centerY = height - 50;
  
  // Calculate number of rows based on total seats
  const rows = Math.max(3, Math.min(6, Math.ceil(Math.sqrt(totalSeats / 8))));
  const baseRadius = 200;
  const rowGap = 45;
  
  // Calculate seat radius to avoid overlaps
  const seatRadius = Math.max(5, Math.min(10, 250 / Math.sqrt(totalSeats)));
  
  // Distribute seats across rows
  const seatsPerRow: number[] = [];
  let remainingSeats = totalSeats;
  
  for (let i = 0; i < rows; i++) {
    const ratio = (i + 1) / rows;
    const seatsInThisRow = Math.round((totalSeats / rows) * (0.7 + ratio * 0.6));
    seatsPerRow.push(Math.min(seatsInThisRow, remainingSeats));
    remainingSeats -= seatsPerRow[i];
  }
  
  // Adjust last row if needed
  if (remainingSeats > 0) {
    seatsPerRow[rows - 1] += remainingSeats;
  }
  
  // Generate seat positions
  const seats: Array<{ x: number; y: number; party: string; color: string; index: number }> = [];
  let currentSeatIndex = 0;
  
  data.forEach((party) => {
    const partySeats = Math.round(party.value);
    
    for (let i = 0; i < partySeats; i++) {
      // Find which row this seat belongs to
      let rowIndex = 0;
      let seatsBeforeRow = 0;
      let cumulativeSeats = 0;
      
      for (let r = 0; r < rows; r++) {
        cumulativeSeats += seatsPerRow[r];
        if (currentSeatIndex < cumulativeSeats) {
          rowIndex = r;
          seatsBeforeRow = cumulativeSeats - seatsPerRow[r];
          break;
        }
      }
      
      const seatInRow = currentSeatIndex - seatsBeforeRow;
      const totalSeatsInRow = seatsPerRow[rowIndex];
      const radius = baseRadius + (rowIndex * rowGap);
      
      // Calculate angle for this seat
      const angleSpan = Math.PI;
      const angle = Math.PI - (seatInRow / Math.max(1, totalSeatsInRow - 1)) * angleSpan;
      
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
    <div className="w-full h-full flex flex-col items-center justify-center bg-background">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        style={{ maxHeight: '500px' }}
        role="img"
        aria-label={`Hemiciclo con ${totalSeats} escaños distribuidos entre partidos`}
      >
        {/* Background semicircle arcs */}
        {Array.from({ length: rows }).map((_, i) => {
          const r = baseRadius + (i * rowGap);
          return (
            <path
              key={`arc-${i}`}
              d={`M ${centerX - r} ${centerY} A ${r} ${r} 0 0 1 ${centerX + r} ${centerY}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="5,5"
              opacity="0.15"
              className="text-muted-foreground"
            />
          );
        })}
        
        {/* Center line */}
        <line
          x1={centerX}
          y1={centerY}
          x2={centerX}
          y2={centerY - baseRadius - (rows - 1) * rowGap}
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="5,5"
          opacity="0.15"
          className="text-muted-foreground"
        />
        
        {/* Seats */}
        <g>
          {seats.map((seat, idx) => (
            <g key={`seat-${idx}`}>
              <circle
                cx={seat.x}
                cy={seat.y}
                r={seatRadius}
                fill={seat.color}
                stroke="white"
                strokeWidth="1"
                className="transition-all duration-200 hover:opacity-80 cursor-pointer"
                role="graphics-symbol"
                aria-label={`Escaño ${seat.index + 1} - ${seat.party}`}
              >
                <title>{`${seat.party} - Escaño ${seat.index + 1}`}</title>
              </circle>
            </g>
          ))}
        </g>
      </svg>
      
      {/* Legend */}
      <div className="flex justify-center gap-4 flex-wrap mt-6 px-4">
        {data.map((party) => (
          <div key={party.name} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border border-white"
              style={{ backgroundColor: party.fill }}
            />
            <span className="text-sm font-medium">
              {party.name}: {Math.round(party.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HemicicloChart;