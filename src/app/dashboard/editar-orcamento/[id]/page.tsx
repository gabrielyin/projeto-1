"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { BudgetPreview } from "@/components/budget-preview";
import { TemplateSelector } from "@/components/template-selector";
import { generatePDFBlob } from "@/lib/pdf-generator";
import Link from "next/link";
import { toast } from "sonner";
import type { Id } from "../../../../../convex/_generated/dataModel";

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

export default function EditBudgetPage() {
  const router = useRouter();
  const params = useParams();
  const budgetId = params.id as Id<"budgets">;

  // Fetch the existing budget
  const budget = useQuery(api.budgets.getBudgetById, { id: budgetId });

  // Mutations
  const updateBudget = useMutation(api.budgets.updateBudget);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const deleteFile = useMutation(api.files.deleteById);

  // Local state for form fields
  const [client, setClient] = useState<Client>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [notes, setNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Populate form with existing budget data
  useEffect(() => {
    if (budget) {
      setClient(budget.client);
      setProducts(budget.products);
      setSelectedTemplate(budget.template);
      setNotes(budget.notes);
    }
  }, [budget]);

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

  // Upload new PDF and update budget
  const handleUpdate = async () => {
  setIsUpdating(true);
  try {
    if (!previewRef.current) throw new Error("Preview not found");
    const pdfBlob = await generatePDFBlob(previewRef.current);

    // Upload new PDF
    const url = await generateUploadUrl();
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": pdfBlob.type },
      body: pdfBlob,
    });
    const { storageId: newPdfFileId } = await res.json();

    // Delete previous file if it exists
    if (budget.pdfFileId) {
      await deleteFile({ storageId: budget.pdfFileId });
    }

    // Update budget in Convex
    await updateBudget({
      id: budgetId,
      client,
      products,
      template: selectedTemplate,
      notes,
      total: calculateTotal(),
      pdfFileId: newPdfFileId,
    });

    toast.success("Budget updated!", {
      description: "Your budget has been updated successfully.",
    });
    router.push("/dashboard");
  } catch {
    toast.error("Update failed.", {
      description: "Could not update the budget.",
    });
  } finally {
    setIsUpdating(false);
  }
};

  if (!budget) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-gray-500">Loading budget...</span>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold text-gray-900">Edit Budget</h1>
                <p className="text-gray-600">Update your budget information</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdate} variant="outline" disabled={isUpdating}>
                <Save className="w-4 h-4 mr-2" />
                {isUpdating ? "Updating..." : "Update"}
              </Button>
              <Button onClick={() => router.push("/dashboard")} variant="ghost">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_210mm] gap-6 max-w-7xl mx-auto">
          {/* Left Side - Form */}
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {/* Client Data */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Client Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="clientName" className="text-sm">
                      Name
                    </Label>
                    <Input
                      id="clientName"
                      value={client.name}
                      onChange={(e) => setClient({ ...client, name: e.target.value })}
                      placeholder="Client name"
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
                      placeholder="email@example.com"
                      className="h-9"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="clientPhone" className="text-sm">
                      Phone
                    </Label>
                    <Input
                      id="clientPhone"
                      value={client.phone}
                      onChange={(e) => setClient({ ...client, phone: e.target.value })}
                      placeholder="(555) 555-5555"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="clientZip" className="text-sm">
                      Zip Code
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
                    Address
                  </Label>
                  <Input
                    id="clientAddress"
                    value={client.address}
                    onChange={(e) => setClient({ ...client, address: e.target.value })}
                    placeholder="Street, number, neighborhood"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="clientCity" className="text-sm">
                    City
                  </Label>
                  <Input
                    id="clientCity"
                    value={client.city}
                    onChange={(e) => setClient({ ...client, city: e.target.value })}
                    placeholder="City - State"
                    className="h-9"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Products/Services */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  Products/Services
                  <Button onClick={addProduct} size="sm" className="h-8">
                    <Plus className="w-3 h-3 mr-1" />
                    Add
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
                        placeholder="Product/Service name"
                        className="h-8 text-sm"
                      />
                      <Input
                        value={product.description}
                        onChange={(e) => updateProduct(product.id, "description", e.target.value)}
                        placeholder="Description"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs">Qty</Label>
                        <Input
                          type="number"
                          min="1"
                          value={product.quantity}
                          onChange={(e) => updateProduct(product.id, "quantity", Number.parseInt(e.target.value) || 1)}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Price ($)</Label>
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
                          $ {(product.quantity * product.price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Grand Total:</span>
                  <span className="text-green-600">$ {calculateTotal().toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                  placeholder="Payment terms, delivery time, guarantees, etc."
                  className="min-h-[80px] text-sm"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Preview */}
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