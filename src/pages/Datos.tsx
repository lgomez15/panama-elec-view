// --- 💡 CAMBIO 1: Importar useEffect ---
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import ejecutivoData from "@/data/elecciones_ejecutivo.json";
import legislativoData from "@/data/elecciones_legislativo.json";
import provinciaData from "@/data/votos_por_provincia.json";
import { BarChart3, PieChart as PieChartIcon, CircleDot, Map } from "lucide-react";
import HemicicloChart from "@/components/charts/HemicicloChart";
import MapChart from "@/components/charts/MapChart";

type ElectionType = "ejecutivo" | "legislativo";
type ChartType = "bar" | "pie" | "hemiciclo" | "mapa";

const Datos = () => {
  const [electionType, setElectionType] = useState<ElectionType>("ejecutivo");
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  // --- 💡 CAMBIO 2: Añadir hook useEffect para restablecer el estado ---
  useEffect(() => {
    // Si cambiamos a "ejecutivo" Y el gráfico actual es "hemiciclo"...
    if (electionType === "ejecutivo" && chartType === "hemiciclo") {
      // ...restablecemos el gráfico a "barras"
      setChartType("bar");
    }
  }, [electionType, chartType]); // Se ejecuta cada vez que electionType cambia
  // --- 💡 ---

  const years = [1994, 1999, 2004, 2009, 2014, 2019, 2024];
  const currentData = electionType === "ejecutivo" ? ejecutivoData : legislativoData;
  const yearData = currentData[String(selectedYear) as keyof typeof currentData];

  const chartData = yearData.parties.map((party: any) => ({
    name: party.name,
    value: electionType === "ejecutivo" ? party.percentage : party.seats,
    fill: party.color,
  }));

  // Party colors for map
  const partyColors: Record<string, string> = {};
  yearData.parties.forEach((party: any) => {
    partyColors[party.name] = party.color;
  });

  // Province data for map
  const provinceData = (provinciaData.data as any)[String(selectedYear)] || {};

  const renderChart = () => {
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

    // --- 💡 CAMBIO 3: Condición añadida al renderizado (aunque useEffect ya lo previene) ---
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Election Type Selector */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Tipo de Elección
                </label>
                <div className="flex gap-2">
                  <Button
                    // El onClick ahora es simple, el useEffect se encarga de la lógica
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
                {/* --- 💡 CAMBIO 3: Cuadrícula (grid) dinámica --- */}
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
                  
                  {/* --- 💡 CAMBIO 3: Renderizado condicional del botón --- */}
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
                  {/* --- 💡 --- */}

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
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Elecciones {electionType === "ejecutivo" ? "Ejecutivas" : "Legislativas"} - {selectedYear}
              </h2>
              <p className="text-muted-foreground">
                {electionType === "ejecutivo"
                  ? `Total de votos: ${(yearData as any).totalVotes.toLocaleString()}`
                  : `Total de escaños: ${(yearData as any).totalSeats}`}
              </p>
            </div>
            {renderChart()}
          </Card>

          {/* Year Slider */}
          <Card className="p-6 shadow-soft">
            {/* ...tu slider (sin cambios)... */}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Datos;