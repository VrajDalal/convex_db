import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createTask = mutation({
    args: {
        id: v.optional(v.string()),
        clerkUserId: v.string(),
        task: v.string(),
        note: v.string(),
        date: v.string(),
        time: v.string(),
        status: v.string()

    },
    handler: async (ctx, args) => {
        const newTask = await ctx.db.insert("Tasks", {
            clerkUserId: args.clerkUserId,
            task: args.task,
            note: args.note,
            date: args.date,
            time: args.time,
            status: args.status
        })
        return newTask
    }
})

export const getTasks = query({
    args: { clerkUserId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db.query("Tasks")
            .filter(id => id.eq(id.field("clerkUserId"), args.clerkUserId))
            .collect()
    }
})

// export const getTaskById = query({
//     args: { id: v.id("Tasks") },
//     handler: async (ctx, args) => {
//         const task = await ctx.db.get(args.id)
//         console.log(task)
//         return task
//     }
// })

export const updateTask = mutation({
    args: {
        id: v.id("Tasks"),
        newTask: v.string(),
        newNote: v.string(),
        newDate: v.string(),
        newTime: v.string(),
        newStatus: v.string()
    },
    handler: async (ctx, args) => {
        const { id, newTask, newNote, newDate, newTime, newStatus } = args
        const taskData = await ctx.db.get(id)
        if (!taskData) {
            throw new Error("Task Not Found")
        }
        await ctx.db.patch(id, {
            task: newTask,
            note: newNote,
            date: newDate,
            time: newTime,
            status: newStatus
        })
    }
})

export const deleteTask = mutation({
    args: { id: v.id("Tasks") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id)
    },
})