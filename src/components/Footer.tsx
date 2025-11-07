const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-3">Tribunal Electoral</h3>
            <p className="text-sm opacity-90">
              Organismo autónomo e independiente responsable de la organización, 
              dirección y vigilancia de los actos relativos al sufragio.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>
                <a href="/" className="hover:opacity-100 transition-opacity">
                  Historia Electoral
                </a>
              </li>
              <li>
                <a href="/datos" className="hover:opacity-100 transition-opacity">
                  Datos y Estadísticas
                </a>
              </li>
              <li>
                <a href="/contacto" className="hover:opacity-100 transition-opacity">
                  Contacto
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3">Contacto</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>Ave. Balboa y Federico Boyd</li>
              <li>Ciudad de Panamá, Panamá</li>
              <li>Tel: +507 504-1700</li>
              <li>info@tribunal-electoral.gob.pa</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm opacity-90">
          <p>© {new Date().getFullYear()} Tribunal Electoral de Panamá. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
