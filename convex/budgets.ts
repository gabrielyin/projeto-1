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

export const getBudgetById = query({
  args: { id: v.id("budgets") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateBudget = mutation({
  args: {
    id: v.id("budgets"),
    client: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string(),
      address: v.string(),
      city: v.string(),
      zipCode: v.string(),
    }),
    products: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        description: v.string(),
        quantity: v.number(),
        price: v.number(),
      })
    ),
    template: v.string(),
    notes: v.string(),
    total: v.number(),
    pdfFileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      client: args.client,
      products: args.products,
      template: args.template,
      notes: args.notes,
      total: args.total,
      pdfFileId: args.pdfFileId,
      updatedAt: Date.now(),
    });
  },
});