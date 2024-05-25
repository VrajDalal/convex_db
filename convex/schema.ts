import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


export default defineSchema({
    Tasks: defineTable({
        clerkUserId: v.string(),
        task: v.string(),
        note: v.string(),
        date: v.string(),
        time: v.string(),
        status: v.string()
    }),
});