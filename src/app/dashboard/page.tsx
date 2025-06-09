import DashboardContent from "./dashboard-content"
import ProfileCard from "@/components/profile-card"
import { preloadQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";

export default async function Dashboard() {
  const budgets = await preloadQuery(api.budgets.listBudgets);
  console.log(budgets)
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
              <ProfileCard />
            </div>
          </div>
        </div>
      </div>

     <DashboardContent preloadedBudgets={budgets} />
    </div>
  )
}
