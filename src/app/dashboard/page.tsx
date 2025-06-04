"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trash2, Edit, Plus, FileText, Calendar, DollarSign } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"

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

interface Budget {
  id: string
  client: Client
  products: Product[]
  template: string
  notes: string
  createdAt: string
  total: number
}

export default function Dashboard() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [user] = useState({
    name: "João Silva",
    email: "joao@empresa.com",
    company: "Minha Empresa Ltda",
  })

  useEffect(() => {
    const saved = localStorage.getItem("budgets")
    if (saved) {
      setBudgets(JSON.parse(saved))
    }
  }, [])

  const deleteBudget = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este orçamento?")) {
      const updatedBudgets = budgets.filter((b) => b.id !== id)
      setBudgets(updatedBudgets)
      localStorage.setItem("budgets", JSON.stringify(updatedBudgets))
    }
  }

  const getTotalValue = () => {
    return budgets.reduce((total, budget) => total + budget.total, 0)
  }

  const getThisMonthBudgets = () => {
    const thisMonth = new Date().getMonth()
    const thisYear = new Date().getFullYear()
    return budgets.filter((budget) => {
      const budgetDate = new Date(budget.createdAt)
      return budgetDate.getMonth() === thisMonth && budgetDate.getFullYear() === thisYear
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Gerencie seus orçamentos</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Orçamento
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.company}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Orçamentos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{budgets.length}</div>
              <p className="text-xs text-muted-foreground">Orçamentos criados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {getTotalValue().toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Soma de todos os orçamentos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getThisMonthBudgets().length}</div>
              <p className="text-xs text-muted-foreground">Orçamentos criados este mês</p>
            </CardContent>
          </Card>
        </div>

        {/* Budgets List */}
        <Card>
          <CardHeader>
            <CardTitle>Orçamentos Salvos</CardTitle>
            <CardDescription>Gerencie todos os seus orçamentos criados</CardDescription>
          </CardHeader>
          <CardContent>
            {budgets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum orçamento encontrado</h3>
                <p className="text-gray-600 mb-4">Crie seu primeiro orçamento para começar</p>
                <Link href="/">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Orçamento
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {budgets.map((budget) => (
                  <div
                    key={budget.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{budget.client.name || "Cliente não informado"}</h3>
                        <Badge variant="outline" className="capitalize">
                          {budget.template}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Email:</span> {budget.client.email || "Não informado"}
                        </div>
                        <div>
                          <span className="font-medium">Items:</span> {budget.products.length}
                        </div>
                        <div>
                          <span className="font-medium">Criado:</span>{" "}
                          {formatDistanceToNow(new Date(budget.createdAt), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-lg text-green-600">R$ {budget.total.toFixed(2)}</div>
                        <div className="text-sm text-gray-500">Total</div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/?edit=${budget.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => deleteBudget(budget.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
