import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


export default defineSchema({
    Tasks: defineTable({
        id: v.optional(v.string()),
        text: v.optional(v.string()),
        clerkUserId: v.string(),
        task: v.string(),
        note: v.string(),
        date: v.string(),
        time: v.string(),
        status: v.string()
    }),
});