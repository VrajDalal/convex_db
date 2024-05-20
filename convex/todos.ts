import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createTask = mutation({
    args: {
        tasks: v.object({
            nestedArray: v.array(
                v.object({
                    id: v.optional(v.string()),
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
    args: { id: v.id("Tasks") },
    handler: async (ctx, args) => {
        const task = await ctx.db.get(args.id)
        console.log(task)
        return task
    }
})


export const updateTask = mutation(async ({ db }, { id, newTask, newNote, newDate, newTime, newStatus }: { id: Id<"Tasks">; newTask: string; newNote: string; newDate: string; newTime: string; newStatus: string }) => {
    const taskData = await db.get(id)
    if (!taskData) {
        throw new Error("Task Not Found")
    }
    const updateNestedArray = taskData.nestedArray.map((items: any) => {
        return {
            ...items,
            task: newTask,
            note: newNote,
            date: newDate,
            time: newTime,
            status: newStatus
        }
    })
    await db.patch(id, {
        nestedArray: updateNestedArray
    })
})


export const deleteTask = mutation({
    args: { id: v.id("Tasks") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id)
    },
})