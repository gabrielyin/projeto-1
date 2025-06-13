"use client"

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Download, Save, ArrowLeft } from "lucide-react";
import { BudgetPreview } from "@/components/budget-preview";
import { TemplateSelector } from "@/components/template-selector";
import { generatePDF, generatePDFBlob } from "@/lib/pdf-generator";
import Link from "next/link";
import { toast } from "sonner";

interface Client {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

export default function BudgetGenerator() {
  const [client, setClient] = useState<Client>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });

  const [products, setProducts] = useState<Product[]>(
    [{ id: "1", name: "", description: "", quantity: 1, price: 0 }]
  );
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [notes, setNotes] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const createBudget = useMutation(api.budgets.createBudget);
  const generatedUploadUrl = useMutation(api.files.generateUploadUrl);

  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: "",
      description: "",
      quantity: 1,
      price: 0,
    };
    setProducts([...products, newProduct]);
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const updateProduct = (
    id: string,
    field: keyof Product,
    value: string | number
  ) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => {
      return total + product.quantity * product.price;
    }, 0);
  };

  // Helper to upload PDF (implement your own storage if needed)
  // For now, we'll skip PDF upload and just save the budget data
  // If you want to upload PDFs, consider using a third-party storage and save the URL in Convex

  const saveBudget = async () => {
    const budget = {
      client,
      products,
      template: selectedTemplate,
      notes,
      createdAt: new Date().toISOString(),
      total: calculateTotal(),
    };

    try {
      // 1. Gera o PDF como Blob (opcional)
      if (!previewRef.current) throw new Error("Preview não encontrado")
      const pdfBlob = await generatePDFBlob(previewRef.current);      
      // const pdfUrl = await uploadFile({ file: pdfBlob }) // Implement if needed
      const pdfUrl = await uploadFile(pdfBlob);

      // 2. Salva o orçamento no Convex
      await createBudget({
        ...budget,
        pdfFileId: pdfUrl,
      });

      toast.success("Budget saved!", {
        description: "Your budget has been saved successfully.",
      });
    } catch {
      toast.error("Save failed.", {
        description: "Could not save the budget.",
      });
    }
  };

  async function uploadFile(file: File | Blob) {
    // 1. Get upload URL from Convex
    const url = await generatedUploadUrl();

    // 2. Upload the file to the URL
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });

    // 3. Get the storageId from the response
    const { storageId } = await res.json();

    // 4. Save storageId in your Convex database if needed
    return storageId;
  }

  const downloadPDF = async () => {
    if (!previewRef.current) return;

    setIsGeneratingPDF(true);
    try {
      await generatePDF(previewRef.current, `orcamento-${client.name || "cliente"}`);
      toast.success("PDF generated successfully!", {
        description: "Your budget PDF is ready for download.",
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Download failed.", {
        description: "Could not download the file.",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>

              <div className="border-l pl-3">
                <h1 className="text-2xl font-bold text-gray-900">Novo Orçamento</h1>
                <p className="text-gray-600">Crie orçamentos profissionais em tempo real</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={saveBudget} variant="outline">
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button onClick={downloadPDF} disabled={isGeneratingPDF}>
                <Download className="w-4 h-4 mr-2" />
                {isGeneratingPDF ? "Gerando..." : "Baixar PDF"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_210mm] gap-6 max-w-7xl mx-auto">
          {/* Formulário - Lado Esquerdo */}
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {/* Dados do Cliente */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Dados do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="clientName" className="text-sm">
                      Nome
                    </Label>
                    <Input
                      id="clientName"
                      value={client.name}
                      onChange={(e) => setClient({ ...client, name: e.target.value })}
                      placeholder="Nome do cliente"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="clientEmail" className="text-sm">
                      Email
                    </Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={client.email}
                      onChange={(e) => setClient({ ...client, email: e.target.value })}
                      placeholder="email@exemplo.com"
                      className="h-9"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="clientPhone" className="text-sm">
                      Telefone
                    </Label>
                    <Input
                      id="clientPhone"
                      value={client.phone}
                      onChange={(e) => setClient({ ...client, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="clientZip" className="text-sm">
                      CEP
                    </Label>
                    <Input
                      id="clientZip"
                      value={client.zipCode}
                      onChange={(e) => setClient({ ...client, zipCode: e.target.value })}
                      placeholder="00000-000"
                      className="h-9"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="clientAddress" className="text-sm">
                    Endereço
                  </Label>
                  <Input
                    id="clientAddress"
                    value={client.address}
                    onChange={(e) => setClient({ ...client, address: e.target.value })}
                    placeholder="Rua, número, bairro"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="clientCity" className="text-sm">
                    Cidade
                  </Label>
                  <Input
                    id="clientCity"
                    value={client.city}
                    onChange={(e) => setClient({ ...client, city: e.target.value })}
                    placeholder="Cidade - Estado"
                    className="h-9"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Produtos/Serviços */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  Produtos/Serviços
                  <Button onClick={addProduct} size="sm" className="h-8">
                    <Plus className="w-3 h-3 mr-1" />
                    Adicionar
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {products.map((product, index) => (
                  <div key={product.id} className="border rounded-lg p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Item {index + 1}</span>
                      {products.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProduct(product.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Input
                        value={product.name}
                        onChange={(e) => updateProduct(product.id, "name", e.target.value)}
                        placeholder="Nome do produto/serviço"
                        className="h-8 text-sm"
                      />
                      <Input
                        value={product.description}
                        onChange={(e) => updateProduct(product.id, "description", e.target.value)}
                        placeholder="Descrição"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs">Qtd</Label>
                        <Input
                          type="number"
                          min="1"
                          value={product.quantity}
                          onChange={(e) => updateProduct(product.id, "quantity", Number.parseInt(e.target.value) || 1)}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Preço (R$)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={product.price}
                          onChange={(e) => updateProduct(product.id, "price", Number.parseFloat(e.target.value) || 0)}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Total</Label>
                        <div className="h-8 px-2 bg-gray-100 rounded-md flex items-center text-sm font-medium">
                          R$ {(product.quantity * product.price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total Geral:</span>
                  <span className="text-green-600">R$ {calculateTotal().toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Observações */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                  placeholder="Condições de pagamento, prazo de entrega, garantias, etc."
                  className="min-h-[80px] text-sm"
                />
              </CardContent>
            </Card>
          </div>

          {/* Preview - Lado Direito */}
          <div className="w-[210mm]">
            <div className="py-4 bg-gray-50 flex-shrink-0">
              <TemplateSelector selectedTemplate={selectedTemplate} onTemplateChange={setSelectedTemplate} />
            </div>
            <div className="bg-white mx-auto">
              <div ref={previewRef}>
                <BudgetPreview
                  client={client}
                  products={products}
                  template={selectedTemplate}
                  notes={notes}
                  total={calculateTotal()}
                  compact={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
