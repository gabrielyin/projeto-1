import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Designer Freelancer",
      company: "Creative Studio",
      avatar: "/placeholder.svg",
      content: "O InvoiceGen transformou completamente como eu lido com cobranças. O que antes levava 30 minutos agora leva menos de 2 minutos. Os modelos são lindos e profissionais.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Pequeno Empresário",
      company: "Tech Solutions LLC",
      avatar: "/placeholder.svg",
      content: "O suporte a múltiplas moedas é fantástico para meus clientes internacionais. Os cálculos automáticos me salvam de erros constrangedores, e os PDFs ficam incrivelmente profissionais.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Consultora",
      company: "Marketing Pro",
      avatar: "/placeholder.svg",
      content: "Adoro como posso personalizar tudo com as cores e logo da minha marca. Meus clientes sempre comentam como meus orçamentos ficam profissionais. Recomendo muito!",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Amado por milhares de profissionais
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Veja o que nossos usuários dizem sobre a experiência com o InvoiceGen
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  &quot;{testimonial.content}&quot;
                </p>
                
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-gray-500">{testimonial.company}</div>
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