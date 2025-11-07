import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart3, Users, Calendar, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  const milestones = [
    {
      year: 1989,
      title: "Retorno a la Democracia",
      description: "Panamá recupera su sistema democrático tras la intervención estadounidense.",
    },
    {
      year: 1994,
      title: "Primera Elección Post-Transición",
      description: "Ernesto Pérez Balladares del PRD gana con el 33.2% de los votos.",
    },
    {
      year: 1999,
      title: "Transferencia del Canal",
      description: "Panamá asume el control total del Canal. Elección de Mireya Moscoso.",
    },
    {
      year: 2004,
      title: "Consolidación Democrática",
      description: "Martín Torrijos del PRD gana con el 62.9%, la mayor victoria electoral.",
    },
    {
      year: 2009,
      title: "Alternancia Política",
      description: "Ricardo Martinelli del CD asume la presidencia con el 60% de apoyo.",
    },
    {
      year: 2014,
      title: "Continuidad del Cambio",
      description: "Juan Carlos Varela del Partido Panameñista gana por estrecho margen.",
    },
    {
      year: 2019,
      title: "Nueva Era PRD",
      description: "Laurentino Cortizo del PRD retorna el partido al poder ejecutivo.",
    },
    {
      year: 2024,
      title: "Renovación con RM",
      description: "José Raúl Mulino del partido Realizando Metas gana con el 40%.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-institutional text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              35 Años de Democracia Electoral
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-95">
              Explora la historia electoral de Panamá desde el retorno a la democracia en 1989 
              hasta nuestros días. Datos, análisis y transparencia al servicio de la ciudadanía.
            </p>
            <Link to="/datos">
              <Button size="lg" variant="secondary" className="font-semibold group">
                Explorar Datos Electorales
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center shadow-soft">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold text-foreground mb-2">8</h3>
              <p className="text-muted-foreground">Elecciones Presidenciales</p>
            </Card>
            <Card className="p-6 text-center shadow-soft">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold text-foreground mb-2">35+</h3>
              <p className="text-muted-foreground">Años de Democracia</p>
            </Card>
            <Card className="p-6 text-center shadow-soft">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-3xl font-bold text-foreground mb-2">71</h3>
              <p className="text-muted-foreground">Diputados Actuales</p>
            </Card>
          </div>
        </div>
      </section>

      {/* About Electoral Tribunal */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">
              El Tribunal Electoral
            </h2>
            <div className="prose prose-lg mx-auto text-muted-foreground space-y-4">
              <p>
                El Tribunal Electoral de Panamá es el organismo autónomo e independiente 
                responsable de la organización, dirección y vigilancia de los actos relativos 
                al sufragio, así como de la interpretación y aplicación de la legislación electoral.
              </p>
              <p>
                Desde el retorno a la democracia en 1989, el Tribunal Electoral ha garantizado 
                procesos electorales transparentes, libres y justos, consolidando la institucionalidad 
                democrática del país.
              </p>
              <p>
                A través de esta plataforma, ponemos a disposición de la ciudadanía los datos 
                históricos de las elecciones ejecutivas y legislativas, promoviendo la transparencia 
                y el acceso a la información pública.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Hitos de la Democracia Panameña
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-medium">
                      {index + 1}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 flex-1 bg-border mt-2" />
                    )}
                  </div>
                  <Card className="flex-1 p-6 shadow-soft group-hover:shadow-medium transition-shadow">
                    <div className="text-primary font-bold text-sm mb-1">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {milestone.description}
                    </p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="p-12 text-center bg-gradient-institutional shadow-medium">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              ¿Listo para explorar los datos?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Descubre cómo ha evolucionado la democracia panameña a través de gráficos 
              interactivos y análisis detallados de cada elección.
            </p>
            <Link to="/datos">
              <Button size="lg" variant="secondary" className="font-semibold">
                Ir a Datos Electorales
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
