import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 bg-blue-600">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Pronto para começar a criar orçamentos profissionais?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de profissionais que confiam no InvoiceGen para suas necessidades de orçamentos
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Comece Gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 text-white border-white hover:bg-white hover:text-blue-600">
              Ver Preços
            </Button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 opacity-90" />
              Plano gratuito para sempre
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 opacity-90" />
              Sem taxas de configuração
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 opacity-90" />
              Cancele quando quiser
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}