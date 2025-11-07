import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import ejecutivoData from "@/data/elecciones_ejecutivo.json";
import legislativoData from "@/data/elecciones_legislativo.json";
import { BarChart3, PieChart as PieChartIcon, CircleDot } from "lucide-react";

type ElectionType = "ejecutivo" | "legislativo";
type ChartType = "bar" | "pie" | "hemiciclo";

const Datos = () => {
  const [electionType, setElectionType] = useState<ElectionType>("ejecutivo");
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  const years = [1994, 1999, 2004, 2009, 2014, 2019, 2024];
  const currentData = electionType === "ejecutivo" ? ejecutivoData : legislativoData;
  const yearData = currentData[String(selectedYear) as keyof typeof currentData];

  const chartData = yearData.parties.map((party: any) => ({
    name: party.name,
    value: electionType === "ejecutivo" ? party.percentage : party.seats,
    fill: party.color,
  }));

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

    // Hemiciclo (semicircle)
    const totalSeats = electionType === "legislativo" ? (yearData as any).totalSeats : 100;
    const angleStep = 180 / totalSeats;
    let currentAngle = 0;

    return (
      <div className="relative w-full h-[400px] flex items-end justify-center">
        <div className="relative w-full max-w-2xl h-64">
          {chartData.map((party) => {
            const seats = electionType === "legislativo" ? party.value : Math.round(party.value);
            const dots = [];
            
            for (let i = 0; i < seats; i++) {
              const angle = (currentAngle + i * angleStep) * (Math.PI / 180);
              const radius = 180;
              const x = 50 + Math.cos(angle) * radius / 4;
              const y = 100 - Math.sin(angle) * radius / 4;
              
              dots.push(
                <circle
                  key={`${party.name}-${i}`}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="6"
                  fill={party.fill}
                  className="transition-all hover:r-8"
                />
              );
            }
            
            currentAngle += seats * angleStep;
            return dots;
          })}
        </div>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6 flex-wrap">
          {chartData.map((party) => (
            <div key={party.name} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: party.fill }}
              />
              <span className="text-sm font-medium">
                {party.name}: {party.value}{electionType === "ejecutivo" ? "%" : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
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
                <div className="flex gap-2">
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
                  <Button
                    onClick={() => setChartType("hemiciclo")}
                    variant={chartType === "hemiciclo" ? "default" : "outline"}
                    className="flex-1"
                  >
                    <CircleDot className="h-4 w-4 mr-2" />
                    Hemiciclo
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
