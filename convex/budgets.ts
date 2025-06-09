// convex/budgets.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listBudgets = query({
  args: {},
  handler: async (ctx) => {
    const budgets = await ctx.db.query("budgets").collect();
    return budgets.map(b => ({
      ...b,
      id: b._id,
    }));
  },
});

export const createBudget = mutation({
  args: {
    client: v.any(),
    products: v.any(),
    template: v.string(),
    notes: v.string(),
    createdAt: v.string(),
    total: v.number(),
    pdfFileId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("budgets", {
      ...args,
    });
  },
});

export const deleteBudget = mutation({
  args: { id: v.id("budgets") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});