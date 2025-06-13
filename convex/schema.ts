import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    externalId: v.string(),
  }).index("byExternalId", ["externalId"]),

  budgets: defineTable({
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
    createdAt: v.string(),
    total: v.number(),
    pdfFileId: v.optional(v.id("_storage")),
    updatedAt: v.optional(v.number()),
  }),
});