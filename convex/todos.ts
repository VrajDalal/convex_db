import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createTask = mutation({
    args: {
        tasks: v.object({
            nestedArray: v.array(
                v.object({
                    _id: v.optional(v.string()),
                    task: v.string(),
                    note: v.string(),
                    date: v.string(),
                    time: v.string(),
                    status: v.string()
                })
            )
        })
    },
    handler: async (ctx, args) => {
        const newTask = await ctx.db.insert("Tasks", args.tasks)
        return newTask
    }
})

export const getTasks = query({
    handler: async (ctx) => {
        return ctx.db.query("Tasks").collect()
    }
})

export const getTaskById = query({
    args: { _id: v.id("Tasks") },
    handler: async (ctx, args) => {
        const task = await ctx.db.get(args._id)
        console.log(task)
        return task
    }
})


export const updateTask = mutation({
    args: { _id: v.id("Tasks") },
    handler: async (ctx, args) => {
        const { _id } = args
        const updateTask = await ctx.db.patch(_id, {
            nestedArray: [{
                task: "new task",
                note: "new note",
                date: "New date",
                time: "New time",
                status: "New status"
            }]
        })
        console.log(updateTask)
    },
})


export const deleteTask = mutation({
    args: { id: v.id("Tasks") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id)
    },
})