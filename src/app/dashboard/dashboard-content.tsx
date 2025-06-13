"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Edit,
  Plus,
  FileText,
  Calendar,
  DollarSign,
  Download,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { Preloaded, useConvex, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

interface Budget {
  id: Id<"budgets">;
  client: Client;
  products: Product[];
  template: string;
  notes: string;
  createdAt: string;
  total: number;
  pdfFileId: Id<"_storage">;
}

export default function DashboardContent(props: {
  preloadedBudgets: Preloaded<typeof api.budgets.listBudgets>;
}) {
  const budgets = usePreloadedQuery(props.preloadedBudgets);
  const deleteBudget = useMutation(api.budgets.deleteBudget);
  const deleteFile = useMutation(api.files.deleteById);
  const convex = useConvex();

  const handleDownloadFile = async (storageId: Id<"_storage">) => {
    try {
      const url = await convex.query(api.files.getFileUrl, { storageId });

      if (url) window.open(url, "_blank");
    } catch {
      alert("Não foi possível baixar o arquivo!");
    }
  };

  const handleDeleteBudget = async (id: Id<"budgets">, fileId: Id<"_storage">) => {
    try {
      if (fileId) {
        await deleteFile({ storageId: fileId });
      }
      await deleteBudget({ id });
      toast.success("Budget deleted!", {
        description: "The budget was deleted successfully.",
      });
    } catch (error) {
      toast.error("Delete failed.", {
        description: "Could not delete the budget.",
      });
      console.error(error);
    }
  };

  const getTotalValue = () => {
    return budgets.reduce((total: number, budget: Budget) => total + budget.total, 0);
  };

  const getThisMonthBudgets = () => {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    return budgets.filter((budget: Budget) => {
      const budgetDate = new Date(budget.createdAt);
      return (
        budgetDate.getMonth() === thisMonth && budgetDate.getFullYear() === thisYear
      );
    });
  };

  return (
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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Orçamentos Salvos</CardTitle>
            <CardDescription>Gerencie todos os seus orçamentos criados</CardDescription>
          </div>
          <Link href="/dashboard/novo-orcamento">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Criar Orçamento
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {budgets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum orçamento encontrado</h3>
              <p className="text-gray-600 mb-4">Crie seu primeiro orçamento para começar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {budgets.map((budget: Budget) => (
                <div
                  key={budget.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">
                        {budget.client.name || "Cliente não informado"}
                      </h3>
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
                      <div className="font-bold text-lg text-green-600">
                        R$ {budget.total.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">Total</div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleDownloadFile(budget.pdfFileId)} variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Link href={`/?edit=${budget.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete budget?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action is irreversible. Are you sure you want to delete this budget?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteBudget(budget.id, budget.pdfFileId)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}