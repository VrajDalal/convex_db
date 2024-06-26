/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import * as React from "react"
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState, useRef } from "react";
import { Toaster, toast } from 'sonner'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { useUser } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";


export default function TaskManage() {
    const { user, isLoaded, isSignedIn } = useUser()
    const router = useRouter()

    const [task, setTask] = useState('')
    const [note, setNote] = useState('')
    const [date, setDate] = React.useState<Date>()
    const [time, setTime] = useState('')
    const [status, setStatus] = useState('')
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState<any[]>([])
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [currentTask, setCurrentTask] = useState<{ id: Id<"Tasks">, task: string, note: string, date: string, time: string, status: string } | null>(null)
    const [taskId, setTaskId] = useState<Id<"Tasks">>();

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/signin')
        }
    }, [isLoaded, isSignedIn, router])


    const createTaskMutation = useMutation(api.todos.createTask);
    const getAllTasks = useQuery(api.todos.getTasks, { clerkUserId: user?.id || "" })
    const updateTaskById = useMutation(api.todos.updateTask)
    const deleteTaskById = useMutation(api.todos.deleteTask)


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!task || !note || !date || !time) {
            toast.error('Enter every fields data')
            return
        }

        const newtask = {
            clerkUserId: user?.id || "",
            task,
            note,
            date: date ? format(date, "yyyy-MM-dd") : "",
            time,
            status: "Pending",
        }

        if (!newtask.clerkUserId) {
            toast.error("user is not authenticated");
            return;
        }

        try {
            await createTaskMutation(newtask)
            toast.success('Your task is create')
            setTask('')
            setNote('')
            setDate(undefined)
            setTime('')
            window.location.href = '#yourTasks'
        } catch (error) {
            toast.error('Failed to create task');
            console.error(error);
        }
    }


    const notifiedTasks = useRef(new Set())

    const matchDateAndTime = async () => {
        const currentDate = new Date()
        const fullDate = format(currentDate, "yyyy-MM-dd")
        const fullTime = format(currentDate, "HH:mm")

        getAllTasks?.forEach(async (task: any) => {
            if (fullDate === task.date && fullTime === task.time) {
                const taskIdentifier = `${task._id}-${task.task}`

                if (!notifiedTasks.current.has(taskIdentifier)) {
                    notifiedTasks.current.add(taskIdentifier)
                    toast.info(`Your Task: ${task.task}`)

                    try {
                        await updateTaskById({
                            id: task._id,
                            newTask: task.task,
                            newNote: task.note,
                            newDate: task.date,
                            newTime: task.time,
                            newStatus: "Completed"
                        })
                    } catch (error) {
                        return error
                    }
                }
            }
        })
    }

    useEffect(() => {
        matchDateAndTime();

        const intervalId = setInterval(() => matchDateAndTime(), 1000);

        const clearNotifiedTaskInterval = setInterval(() => {
            notifiedTasks.current.clear()
        }, 60000)

        return () => {
            clearInterval(intervalId)
            clearInterval(clearNotifiedTaskInterval)
        }
    }, [getAllTasks, updateTaskById]);


    const handleEditTask = (taskItem: any) => {
        setIsEditModalOpen(true)
        setTaskId(taskItem._id)
        setCurrentTask(taskItem)
        setTask(taskItem.task)
        setNote(taskItem.note)
        setDate(taskItem.date ? new Date(taskItem.date) : undefined)
        setTime(taskItem.time)
        document.body.classList.add('modal-open')
    }

    const closeEditModal = () => {
        setIsEditModalOpen(false)
        setCurrentTask(null)
        setTask('')
        setNote('')
        setDate(undefined)
        setTime('')
        document.body.classList.remove('modal-open')

    }

    const handleUpdateTask = async (id: Id<"Tasks">) => {

        if (!taskId) {
            toast.error('Task ID is not defined');
            return;
        }

        const updateTaskData = {
            task: task,
            note: note,
            date: date ? format(date, "yyyy-MM-dd") : "",
            time: time,
            status: "Pending"
        }


        try {
            await updateTaskById({
                id: taskId,
                newTask: updateTaskData.task,
                newNote: updateTaskData.note,
                newDate: updateTaskData.date,
                newTime: updateTaskData.time,
                newStatus: updateTaskData.status
            })
            toast.success('Task updated successfully')
            closeEditModal()
        } catch (error) {
            toast.error('Failed to update task')
            console.log(error)
        }

    }

    const handleDeleteModal = (taskItem: any) => {
        setIsDeleteModalOpen(true)
        setTaskId(taskItem._id)
        document.body.classList.add('modal-open')
    }

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false)
        document.body.classList.remove('modal-open')
    }

    const handleDeleteTask = async () => {

        if (!taskId) {
            toast.error("Task id not found")
            return;
        }

        try {
            await deleteTaskById({ id: taskId })
            toast.success("Task deleted successfully")
            closeDeleteModal()
        } catch (error) {
            toast.error("Failed to delete task")
        }
    }

    const searchByTask = async () => {

        const searchValue = search.toLowerCase()
        if (getAllTasks) {
            const filterTask = getAllTasks?.filter((data) => data.task.toLowerCase().includes(searchValue))
            setSearchResult(filterTask)
        }
    }

    useEffect(() => {
        if (search) {
            searchByTask();
        } else {
            setSearchResult([])
        }
    }, [search, getAllTasks])


    if (!isLoaded || !isSignedIn) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner sm:loading-xs md:loading-md lg:loading-lg xl:loading-lg"></span>
            </div>
        );
    }

    return (
        <>
            <div className="mt-3 font-serif container mx-auto px-4">

                <Toaster position="top-right" richColors closeButton></Toaster>
                <div>
                    <h1 className="flex font-bold text-2xl sm:text-3xl md:text-5xl lg:text-6xl justify-center items-center">Create Your Task </h1>
                </div>
                <form onSubmit={handleSubmit} className="max-w-xl mx-auto rounded-lg mt-2 p-4">

                    <div className="flex flex-col md:flex-row md:px-4 md:py-6">
                        <label htmlFor="txtTask" className="font-bold text-lg md:px-4 lg:px-4">Task Name </label>
                        <Textarea value={task} onChange={e => setTask(e.target.value)} className="text-lg" />
                    </div>

                    <div className="flex flex-col md:flex-row mt-3 md:px-4 md:py-6">
                        <label htmlFor="txtNote" className="font-bold text-lg md:px-4 lg:px-4">Task Note <span className="text-white">.</span> </label>
                        <Textarea value={note} onChange={e => setNote(e.target.value)} className="text-lg" />
                    </div>

                    <div className="flex flex-col md:flex-row mt-3 md:px-4 md:py-6">
                        <label htmlFor="txtDate" className="font-bold text-lg md:px-4 lg:px-4">Date </label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "md:ml-9 w-full md:w-auto justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a due date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="flex flex-col md:flex-row mt-3 md:px-4 md:py-6">
                        <label htmlFor="txtTime" className="text-lg font-bold md:px-4 lg:px-4">Time </label>
                        <input type="time" value={time} onChange={e => setTime(e.target.value)} className="md:ml-9 lg:ml-7 border border-input rounded-md px-14 w-full md:w-auto ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                    </div>

                    <div className="px-8 py-6 justify-center items-center flex">
                        <Button className="sm:text-xl md:text-2xl lg:text-3xl">Create</Button>
                    </div>
                </form>
                <hr />

                {getAllTasks && (
                    <>
                        <div>
                            <h1 id="yourTasks" className="flex font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl justify-center item-center mt-4">Your Tasks</h1>
                        </div>
                        {/* search */}
                        <div className="flex items-center justify-start">
                            <label htmlFor="txtSearch" className="font-bold md:px-4 lg:px-4">Search</label>
                            <Input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search task...." className="mt-2 ml-3 text-lg w-1/2" onKeyUp={searchByTask} />
                        </div>
                        <div className="flex flex-col mt-4">
                            {(search ? searchResult : getAllTasks).length > 0 ? (
                                <Table className="mb-8 w-full border border-collapse border-gray-300 mt-5">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="border border-gray-300 px-1 py-1 text-sm sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-2 md:text-sm lg:px-6 lg:py-3 lg:text-lg xl:px-6 xl:py-3 xl:text-xl font-semibold">Task</TableHead>
                                            <TableHead className="border border-gray-300 px-1 py-1 text-sm sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-2 md:text-sm lg:px-6 lg:py-3 lg:text-lg xl:px-6 xl:py-3 xl:text-xl font-semibold">Note</TableHead>
                                            <TableHead className="border border-gray-300 px-1 py-1 text-sm sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-2 md:text-sm lg:px-6 lg:py-3 lg:text-lg xl:px-6 xl:py-3 xl:text-xl font-semibold">Date</TableHead>
                                            <TableHead className="border border-gray-300 px-1 py-1 text-sm sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-2 md:text-sm lg:px-6 lg:py-3 lg:text-lg xl:px-6 xl:py-3 xl:text-xl font-semibold">Time</TableHead>
                                            <TableHead className="border border-gray-300 px-1 py-1 text-sm sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-2 md:text-sm lg:px-6 lg:py-3 lg:text-lg xl:px-6 xl:py-3 xl:text-xl font-semibold">Status</TableHead>
                                            <TableHead className="border border-gray-300 px-1 py-1 text-sm sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-2 md:text-sm lg:px-6 lg:py-3 lg:text-lg xl:px-6 xl:py-3 xl:text-xl font-semibold">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(search ? searchResult : getAllTasks).map((taskItem) => (
                                            <TableRow key={taskItem._id.toString()} className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
                                                <TableCell className="border border-gray-300 px-2 sm:px-4 py-2">{taskItem.task}</TableCell>
                                                <TableCell className="border border-gray-300 px-2 sm:px-4 py-2">{taskItem.note}</TableCell>
                                                <TableCell className="border border-gray-300 px-2 sm:px-4 py-2">{taskItem.date}</TableCell>
                                                <TableCell className="border border-gray-300 px-2 sm:px-4 py-2">{taskItem.time}</TableCell>
                                                <TableCell className="border border-gray-300 px-2 sm:px-4 py-2">{taskItem.status}</TableCell>
                                                <TableCell className="flex space-x-3">
                                                    <Button className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base lg:text-lg xl:texl-xl" onClick={() => handleEditTask({ ...taskItem, id: taskItem._id })}>Edit</Button>
                                                    <Button className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base lg:text-lg xl:texl-xl" onClick={() => handleDeleteModal({ ...taskItem, id: taskItem._id })}>Delete</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>

                                    </TableFooter>
                                </Table>
                            ) : (
                                <div className="text-center font-semibold mt-4 mb-4 sm:text-md md:text:md lg:text-lg">
                                    No task found.
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* edit modal */}
                {isEditModalOpen && currentTask && (

                    getAllTasks && getAllTasks.length > 0 && getAllTasks.map((taskItem) => (
                        <>
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
                                <div className="bg-white rounded-lg p-6 w-full max-w-md mx-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-semibold">Edit Task</h2>
                                        <Button variant="outline" className="flex justify-end text-2xl" onClick={closeEditModal}>&times;</Button>
                                    </div>
                                    <form onSubmit={(e) => { e.preventDefault(); handleUpdateTask(taskItem._id) }}>
                                        <div className="mt-4">
                                            <label htmlFor="txtTask" className="block text-lg font-bold">Task Name </label>
                                            <Textarea value={task} onChange={e => setTask(e.target.value)} className="w-full mt-2 border border-gray-300 rounded p-2 text-lg" />
                                        </div>

                                        <div className="mt-4">
                                            <label htmlFor="txtNote" className="block text-lg font-bold">Task Note <span className="text-white">.</span> </label>
                                            <Textarea value={note} onChange={e => setNote(e.target.value)} className="w-full mt-2 border border-gray-300 rounded p-2 text-lg" />
                                        </div>

                                        <div className="mt-4">
                                            <label htmlFor="txtDate" className="block text-lg font-bold">Date </label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full mt-2 p-4 md:w-auto justify-start text-left font-normal",
                                                            !date
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {date ? format(date, "PPP") : <span><b>{currentTask.date}</b></span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={date}
                                                        onSelect={setDate}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <div className="mt-4">
                                            <label htmlFor="txtTime" className="block text-lg font-bold">Time </label>
                                            <input type="time" value={time} onChange={e => setTime(e.target.value)} className="mt-2 border border-gray-300 rounded p-2 text-lg border border-input rounded-md px-7 w-full md:w-auto ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                                        </div>

                                        <div className="px-8 py-6 justify-center items-center flex">
                                            <Button className="sm:text-xl md:text-2xl lg:text-3xl">Save</Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </>
                    ))
                )}

                {/* delete modal */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Delete Task</h2>
                                <Button variant="outline" type="button" className="flex justify-end text-2xl" onClick={closeDeleteModal}>&times;</Button>
                            </div>
                            <form>
                                <p className="flex mt-5 font-semibold items-center justify-center md:text-lg lg:text-xl">Are you sure you want to delete</p>
                                <div className="flex justify-center items-center mt-4 space-x-4">
                                    <Button variant="outline" type="button" className="text-xl bg-red-300 hover:bg-red-700" onClick={closeDeleteModal}>No</Button>
                                    <Button variant="outline" type="button" className="text-xl bg-green-300 hover:bg-green-700" onClick={handleDeleteTask}>Yes</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
