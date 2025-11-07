// --- 💡 CAMBIO 1: Importar useRef, useCallback y las nuevas librerías ---
import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import ejecutivoData from "@/data/elecciones_ejecutivo.json";
import legislativoData from "@/data/elecciones_legislativo.json";
import provinciaData from "@/data/votos_por_provincia.json";
// --- 💡 CAMBIO 1.2: Importar el icono de Descarga ---
import { BarChart3, PieChart as PieChartIcon, CircleDot, Map, Download } from "lucide-react";
import HemicicloChart from "@/components/charts/HemicicloChart";
import MapChart from "@/components/charts/MapChart";
// --- 💡 CAMBIO 1.3: Importar las librerías de descarga ---
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';


type ElectionType = "ejecutivo" | "legislativo";
type ChartType = "bar" | "pie" | "hemiciclo" | "mapa";

const Datos = () => {
  const [electionType, setElectionType] = useState<ElectionType>("ejecutivo");
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  
  // --- 💡 CAMBIO 2: Crear una ref para el contenedor del gráfico ---
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (electionType === "ejecutivo" && chartType === "hemiciclo") {
      setChartType("bar");
    }
  }, [electionType, chartType]); 

  const years = [1994, 1999, 2004, 2009, 2014, 2019, 2024];
  const currentData = electionType === "ejecutivo" ? ejecutivoData : legislativoData;
  const yearData = currentData[String(selectedYear) as keyof typeof currentData];

  const chartData = yearData.parties.map((party: any) => ({
    name: party.name,
    value: electionType === "ejecutivo" ? party.percentage : party.seats,
    fill: party.color,
  }));

  const partyColors: Record<string, string> = {};
  yearData.parties.forEach((party: any) => {
    partyColors[party.name] = party.color;
  });

  const provinceData = (provinciaData.data as any)[String(selectedYear)] || {};

  // --- 💡 CAMBIO 3: Añadir la función de descarga ---
  const handleDownload = useCallback(() => {
    if (chartContainerRef.current === null) {
      return;
    }

    toPng(chartContainerRef.current, { 
      cacheBust: true,
      backgroundColor: 'white' // Para asegurar que no tenga fondo transparente
    })
      .then((dataUrl) => {
        // Crear un nombre de archivo dinámico
        const filename = `grafico_${chartType}_${electionType}_${selectedYear}.png`;
        // Usar saveAs para descargar la imagen
        saveAs(dataUrl, filename);
      })
      .catch((err) => {
        console.error('Error al descargar el gráfico:', err);
      });
  }, [chartContainerRef, chartType, electionType, selectedYear]); // Dependencias de la función


  const renderChart = () => {
    // ... (Tu función renderChart no cambia en absoluto) ...
    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name={electionType === "ejecutivo" ? "% Votos" : "Escaños"}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === "pie") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}${electionType === "ejecutivo" ? "%" : ""}`}
              outerRadius={120}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }
    
    if (chartType === "hemiciclo" && electionType === "legislativo") {
      const totalSeats = (yearData as any).totalSeats;
      return (
        <div className="w-full h-[500px]">
          <HemicicloChart data={chartData} totalSeats={totalSeats} />
        </div>
      );
    }

    if (chartType === "mapa") {
      return (
        <div className="w-full h-[500px]">
          <MapChart data={provinceData} partyColors={partyColors} />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-3">
              Datos Electorales de Panamá
            </h1>
            <p className="text-lg text-muted-foreground">
              Explora los resultados de las elecciones ejecutivas y legislativas desde 1994
            </p>
          </div>

          {/* Controls */}
          <Card className="p-6 mb-8 shadow-soft">
             {/* ... (Tus controles de Tipo de Elección y Tipo de Gráfico no cambian) ... */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Election Type Selector */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Tipo de Elección
                </label>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setElectionType("ejecutivo")}
                    variant={electionType === "ejecutivo" ? "default" : "outline"}
                    className="flex-1"
                  >
                    Ejecutivo
                  </Button>
                  <Button
                    onClick={() => setElectionType("legislativo")}
                    variant={electionType === "legislativo" ? "default" : "outline"}
                    className="flex-1"
                  >
                    Legislativo
                  </Button>
                </div>
              </div>

              {/* Chart Type Selector */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Tipo de Gráfico
                </label>
                <div className={`grid grid-cols-2 ${
                  electionType === 'legislativo' ? 'md:grid-cols-4' : 'md:grid-cols-3'
                } gap-2`}>
                  <Button
                    onClick={() => setChartType("bar")}
                    variant={chartType === "bar" ? "default" : "outline"}
                    className="flex-1"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Barras
                  </Button>
                  <Button
                    onClick={() => setChartType("pie")}
                    variant={chartType === "pie" ? "default" : "outline"}
                    className="flex-1"
                  >
                    <PieChartIcon className="h-4 w-4 mr-2" />
                    Circular
                  </Button>
                  
                  {electionType === "legislativo" && (
                    <Button
                      onClick={() => setChartType("hemiciclo")}
                      variant={chartType === "hemiciclo" ? "default" : "outline"}
                      className="flex-1"
                    >
                      <CircleDot className="h-4 w-4 mr-2" />
                      Hemiciclo
                    </Button>
                  )}

                  <Button
                    onClick={() => setChartType("mapa")}
                    variant={chartType === "mapa" ? "default" : "outline"}
                    className="flex-1"
                  >
                    <Map className="h-4 w-4 mr-2" />
                    Mapa
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Chart Display */}
          <Card className="p-6 mb-8 shadow-soft">
            {/* --- 💡 CAMBIO 4: Reorganizar el header del gráfico y añadir el botón --- */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Elecciones {electionType === "ejecutivo" ? "Ejecutivas" : "Legislativas"} - {selectedYear}
                </h2>
                <p className="text-muted-foreground">
                  {electionType === "ejecutivo"
                    ? `Total de votos: ${(yearData as any).totalVotes.toLocaleString()}`
                    : `Total de escaños: ${(yearData as any).totalSeats}`}
                </p>
              </div>
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
            </div>
            {/* --- 💡 --- */}

            {/* --- 💡 CAMBIO 5: Envolver el gráfico en un div con la ref --- */}
            <div ref={chartContainerRef}>
              {renderChart()}
            </div>
            {/* --- 💡 --- */}
          </Card>

          {/* Year Slider */}
          <Card className="p-6 shadow-soft">
            <label className="block text-sm font-semibold text-foreground mb-4">
              Selecciona el Año Electoral
            </label>
            <div className="space-y-4">
              <Slider
                value={[years.indexOf(selectedYear)]}
                onValueChange={(value) => setSelectedYear(years[value[0]])}
                max={years.length - 1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`font-medium transition-colors ${
                      selectedYear === year
                        ? "text-primary font-bold"
                        : "hover:text-foreground"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Datos;