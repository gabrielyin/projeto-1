import { FileText, Twitter, Linkedin, Github } from "lucide-react";

export function Footer() {
  const footerSections = [
    {
      title: "Produto",
      links: ["Recursos", "Modelos", "Preços", "API"]
    },
    {
      title: "Empresa",
      links: ["Sobre", "Blog", "Carreiras", "Contato"]
    },
    {
      title: "Recursos",
      links: ["Central de Ajuda", "Tutoriais", "Comunidade", "Status"]
    },
    {
      title: "Legal",
      links: ["Privacidade", "Termos", "Segurança", "Cookies"]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">InvoiceGen</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              A maneira mais fácil de criar orçamentos profissionais.
              Confiado por milhares de empresas no mundo todo.
            </p>
            <div className="flex space-x-4">
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Github className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
          
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">
            © 2024 InvoiceGen. Todos os direitos reservados.
          </p>
          <p className="text-gray-400 mt-4 md:mt-0">
            Feito com ❤️ para pequenos negócios
          </p>
        </div>
      </div>
    </footer>
  );
}