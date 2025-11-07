import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-institutional rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">TE</span>
            </div>
            <span className="font-semibold text-foreground hidden md:block">
              Tribunal Electoral
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                className="font-medium"
              >
                Inicio
              </Button>
            </Link>
            <Link to="/datos">
              <Button
                variant={isActive("/datos") ? "default" : "ghost"}
                className="font-medium"
              >
                Datos Electorales
              </Button>
            </Link>
            <Link to="/contacto">
              <Button
                variant={isActive("/contacto") ? "default" : "ghost"}
                className="font-medium"
              >
                Contacto
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)}>
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                className="w-full justify-start font-medium"
              >
                Inicio
              </Button>
            </Link>
            <Link to="/datos" onClick={() => setIsOpen(false)}>
              <Button
                variant={isActive("/datos") ? "default" : "ghost"}
                className="w-full justify-start font-medium"
              >
                Datos Electorales
              </Button>
            </Link>
            <Link to="/contacto" onClick={() => setIsOpen(false)}>
              <Button
                variant={isActive("/contacto") ? "default" : "ghost"}
                className="w-full justify-start font-medium"
              >
                Contacto
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
