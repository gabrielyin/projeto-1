"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Download, Save } from "lucide-react"
import { useEffect, useState } from "react"

interface Client {
  name: string
  email: string
  phone: string
  address: string
  city: string
  zipCode: string
}

interface Product {
  id: string
  name: string
  description: string
  quantity: number
  price: number
}

interface BudgetPreviewProps {
  client: Client
  products: Product[]
  template: string
  notes: string
  total: number
  compact?: boolean
}

export function BudgetPreview({ client, products, template, notes, total, compact = false }: BudgetPreviewProps) {
  const [budgetNumber, setBudgetNumber] = useState("")
  const currentDate = new Date().toLocaleDateString("pt-BR")

  useEffect(() => {
    setBudgetNumber(`ORC-${Date.now().toString().slice(-6)}`)
  }, [])

  const getTemplateStyles = () => {
    switch (template) {
      case "modern":
        return {
          container: "bg-gradient-to-br from-blue-50 to-indigo-100",
          header: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white",
          accent: "text-blue-600",
          border: "border-blue-200",
        }
      case "classic":
        return {
          container: "bg-amber-50",
          header: "bg-amber-800 text-white",
          accent: "text-amber-800",
          border: "border-amber-200",
        }
      case "minimal":
        return {
          container: "bg-gray-50",
          header: "bg-gray-800 text-white",
          accent: "text-gray-800",
          border: "border-gray-200",
        }
      case "corporate":
        return {
          container: "bg-slate-50",
          header: "bg-slate-700 text-white",
          accent: "text-slate-700",
          border: "border-slate-200",
        }
      default:
        return {
          container: "bg-white",
          header: "bg-gray-800 text-white",
          accent: "text-gray-800",
          border: "border-gray-200",
        }
    }
  }

  const styles = getTemplateStyles()

  if (compact) {
    return (
      <div className={`h-[1123px] w-[794px] ${styles.container}`}>
        {/* Header Compacto */}
        <div className={`${styles.header} p-4`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold mb-1">ORÇAMENTO</h2>
              <p className="text-sm opacity-90">Nº {budgetNumber}</p>
              <p className="text-sm opacity-90">{currentDate}</p>
            </div>
            <div className="text-right text-sm">
              <h3 className="font-bold">Sua Empresa</h3>
              <p className="opacity-90">contato@empresa.com</p>
              <p className="opacity-90">(11) 99999-9999</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Dados do Cliente Compacto */}
          <div className={`border rounded p-3 ${styles.border}`}>
            <h3 className={`font-semibold mb-2 ${styles.accent} text-sm`}>Cliente</h3>
            <div className="text-sm space-y-1">
              <p>
                <strong>Nome:</strong> {client.name || "Não informado"}
              </p>
              <p>
                <strong>Email:</strong> {client.email || "Não informado"}
              </p>
              <p>
                <strong>Telefone:</strong> {client.phone || "Não informado"}
              </p>
              {client.address && (
                <p>
                  <strong>Endereço:</strong> {client.address}
                </p>
              )}
              {client.city && (
                <p>
                  <strong>Cidade:</strong> {client.city}
                </p>
              )}
            </div>
          </div>

          {/* Produtos Compacto */}
          <div>
            <h3 className={`font-semibold mb-2 ${styles.accent} text-sm`}>Itens</h3>
            <div className="space-y-2">
              {products.map((product, index) => (
                <div key={product.id} className={`border rounded p-2 text-sm ${styles.border}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">{product.name || `Item ${index + 1}`}</span>
                    <span className="font-semibold">R$ {(product.quantity * product.price).toFixed(2)}</span>
                  </div>
                  {product.description && <p className="text-xs text-gray-600 mb-1">{product.description}</p>}
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Qtd: {product.quantity}</span>
                    <span>Unit: R$ {product.price.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Compacto */}
          <div className={`border rounded p-3 ${styles.border}`}>
            <div className={`text-right text-lg font-bold ${styles.accent}`}>Total: R$ {total.toFixed(2)}</div>
          </div>

          {/* Observações Compacto */}
          {notes && (
            <div className={`border rounded p-3 ${styles.border}`}>
              <h3 className={`font-semibold mb-2 ${styles.accent} text-sm`}>Observações</h3>
              <p className="text-sm whitespace-pre-wrap">{notes}</p>
            </div>
          )}

          {/* Rodapé Compacto */}
          <div className="text-center text-xs text-gray-600 pt-4 border-t">
            <p>Orçamento válido por 30 dias</p>
          </div>
        </div>
      </div>
    )
  }

  // Versão completa (mantém o código original para quando não for compact)
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Preview do Orçamento</h2>
          <p className="text-gray-600">
            Template:{" "}
            <Badge variant="outline" className="capitalize">
              {template}
            </Badge>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Baixar PDF
          </Button>
        </div>
      </div>

      <Card className={`max-w-4xl mx-auto ${styles.container}`}>
        <CardHeader className={`${styles.header} rounded-t-lg`}>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">ORÇAMENTO</CardTitle>
              <p className="opacity-90">Número: {budgetNumber}</p>
              <p className="opacity-90">Data: {currentDate}</p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-bold">Sua Empresa</h3>
              <p className="opacity-90">contato@empresa.com</p>
              <p className="opacity-90">(11) 99999-9999</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Dados do Cliente */}
          <div className={`border rounded-lg p-4 ${styles.border}`}>
            <h3 className={`text-lg font-semibold mb-3 ${styles.accent}`}>Dados do Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Nome:</strong> {client.name || "Não informado"}
                </p>
                <p>
                  <strong>Email:</strong> {client.email || "Não informado"}
                </p>
                <p>
                  <strong>Telefone:</strong> {client.phone || "Não informado"}
                </p>
              </div>
              <div>
                <p>
                  <strong>Endereço:</strong> {client.address || "Não informado"}
                </p>
                <p>
                  <strong>Cidade:</strong> {client.city || "Não informado"}
                </p>
                <p>
                  <strong>CEP:</strong> {client.zipCode || "Não informado"}
                </p>
              </div>
            </div>
          </div>

          {/* Produtos/Serviços */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${styles.accent}`}>Produtos/Serviços</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className={`${styles.header}`}>
                    <th className="border p-3 text-left">Item</th>
                    <th className="border p-3 text-left">Descrição</th>
                    <th className="border p-3 text-center">Qtd</th>
                    <th className="border p-3 text-right">Valor Unit.</th>
                    <th className="border p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="border p-3">{product.name || `Item ${index + 1}`}</td>
                      <td className="border p-3">{product.description || "Sem descrição"}</td>
                      <td className="border p-3 text-center">{product.quantity}</td>
                      <td className="border p-3 text-right">R$ {product.price.toFixed(2)}</td>
                      <td className="border p-3 text-right font-medium">
                        R$ {(product.quantity * product.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-end">
            <div className={`border rounded-lg p-4 ${styles.border}`}>
              <div className="text-right space-y-2">
                <div className="flex justify-between gap-8">
                  <span>Subtotal:</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
                <Separator />
                <div className={`flex justify-between gap-8 text-xl font-bold ${styles.accent}`}>
                  <span>Total:</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Observações */}
          {notes && (
            <div className={`border rounded-lg p-4 ${styles.border}`}>
              <h3 className={`text-lg font-semibold mb-3 ${styles.accent}`}>Observações</h3>
              <p className="whitespace-pre-wrap">{notes}</p>
            </div>
          )}

          {/* Rodapé */}
          <div className="text-center text-sm text-gray-600 pt-6 border-t">
            <p>Este orçamento tem validade de 30 dias a partir da data de emissão.</p>
            <p>Agradecemos pela oportunidade de apresentar nossa proposta.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
