import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Palette, 
  Download, 
  Clock, 
  Shield, 
  Smartphone,
  Calculator,
  Globe,
  Zap
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: FileText,
      title: "Modelos Profissionais",
      description: "Escolha entre mais de 100 modelos de orçamento profissionalmente desenhados para transmitir confiança ao seu cliente.",
      badge: "Popular"
    },
    {
      icon: Palette,
      title: "Personalização de Marca",
      description: "Adicione seu logo, personalize as cores e mantenha a identidade visual em todos os seus orçamentos.",
      badge: null
    },
    {
      icon: Download,
      title: "Opções de Exportação",
      description: "Baixe orçamentos em PDF, imprima diretamente ou envie por e-mail com apenas um clique.",
      badge: null
    },
    {
      icon: Clock,
      title: "Geração Instantânea",
      description: "Crie orçamentos em menos de 30 segundos. Nunca mais perca tempo com formatação e design.",
      badge: "Rápido"
    },
    {
      icon: Calculator,
      title: "Cálculos Automáticos",
      description: "Cálculo automático de impostos, subtotais e totais. Nunca mais se preocupe com erros de matemática.",
      badge: null
    },
    {
      icon: Shield,
      title: "Seguro e Privado",
      description: "Seus dados são criptografados e seguros. Nunca compartilhamos suas informações com terceiros.",
      badge: null
    },
    {
      icon: Smartphone,
      title: "Compatível com Celular",
      description: "Crie e gerencie orçamentos em qualquer dispositivo. Design totalmente responsivo para celular e tablet.",
      badge: null
    },
    {
      icon: Globe,
      title: "Multi-Moeda",
      description: "Suporte para mais de 150 moedas com taxas de câmbio em tempo real para clientes internacionais.",
      badge: null
    },
    {
      icon: Zap,
      title: "Com IA",
      description: "Sugestões inteligentes para detalhes do orçamento, informações do cliente e descrições profissionais.",
      badge: "Novo"
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Tudo que você precisa para orçar como um profissional
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Recursos poderosos criados para tornar a criação de orçamentos simples, rápida e profissional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      {feature.badge && (
                        <Badge variant={feature.badge === "New" ? "default" : "secondary"} className="text-xs">
                          {feature.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}