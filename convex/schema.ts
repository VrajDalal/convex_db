import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    Tasks: defineTable({
        nestedArray: v.array(
            v.object({
                _id:  v.optional(v.string()),
                text: v.optional(v.string()),
                task: v.string(),
                note: v.string(),
                date: v.string(),
                time: v.string(),
                status: v.string()
            })
        )
    }),
});