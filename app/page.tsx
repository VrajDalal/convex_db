'use client'

import * as React from "react"
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { Toaster, toast } from 'sonner'
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"

export default function Home() {

  const [task, setTask] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = React.useState<Date>()
  const [time, setTime] = useState('')
  const [status, setStatus] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState(null)
  const [taskId, setTaskId] = useState<Id<"Tasks">>();

  const createTaskMutation = useMutation(api.todos.createTask);
  const getAllTasks = useQuery(api.todos.getTasks)
  // const getTaskById = useQuery(api.todos.getTaskById, { _id: taskId! })
  // console.log(getTaskById)
  // const updateTaskById = useMutation(api.todos.updateTask)
  // console.log(updateTaskById)

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newtask = {
      task: task,
      note: note,
      date: date ? format(date, "yyyy-MM-dd") : "",
      time: time,
      status: "Pending"
    }

    if (!task || !note || !date || !time) {
      toast.error('Enter every fields data')
      return
    } else {
      createTaskMutation({ tasks: { nestedArray: [newtask] } })
      window.location.href = '#yourTasks'
      toast.success('Your task is create')
      setTask('')
      setNote('')
      setDate(undefined)
      setTime('')
    }
  }

  // const handleEditTask = (taskItem: any) => {
  //   setCurrentTask(taskItem)
  //   setTask(taskItem.task)
  //   setNote(taskItem.note)
  //   setDate(taskItem.date)
  //   setTime(taskItem.time)
  //   setIsModalOpen(true)
  //   setTaskId(taskItem._id)
  // }

  // const closeModal = () => {
  //   setIsModalOpen(false)
  //   setCurrentTask(null)
  // }

  //time and date match function to change status pending to complete
  //using Date function date and system time for match the task date & time

  const matchDateAndTime = async () => {
    const getTime = new Date()
    const getdate = getTime.getDate()
    const getMonth = getTime.getMonth() + 1
    const getYear = getTime.getFullYear()
    const getHour = getTime.getHours()
    const getMinute = getTime.getMinutes()
    const getSecond = getTime.getSeconds()

    const fullDate = getYear + "-" + getMonth + "-" + getdate
    const fullTime = getHour + ":" + getMinute
    console.log(fullDate)
    console.log(fullTime)

    getAllTasks?.map((data) => {
      data.nestedArray.map((getDateAndTime) => {
        console.log(getDateAndTime.date)
        console.log(getDateAndTime.time)
      })
    })
  }
  matchDateAndTime()
  return (
    <>
      <div className="mt-3 font-serif container mx-auto px-4">
        <Toaster position="top-right" richColors closeButton></Toaster>
        <div>
          <h1 className="flex font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl justify-center items-center">Create Your Task </h1>
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
                    "sm:ml-9 w-full md:w-auto justify-start text-left font-normal",
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

        {getAllTasks && getAllTasks?.length > 0 && (
          <>
            <div>
              <h1 id="yourTasks" className="flex font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl justify-center item-center mt-4">Your Tasks</h1>
            </div>
            <div className="overflow-x-auto">
              <Table className="mb-8 w-full border border-collapse border-gray-300 mt-5">
                <TableHeader>
                  <TableRow>
                    <TableHead className="border border-gray-300 px-2 py-1 text-sm sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-2 md:text-base lg:px-6 lg:py-3 lg:text-lg xl:px-8 xl:py-4 xl:text-xl font-bold">Task</TableHead>
                    <TableHead className="border border-gray-300 px-2 py-1 text-sm sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-2 md:text-base lg:px-6 lg:py-3 lg:text-lg xl:px-8 xl:py-4 xl:text-xl font-bold">Note</TableHead>
                    <TableHead className="border border-gray-300 px-2 py-1 text-sm sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-2 md:text-base lg:px-6 lg:py-3 lg:text-lg xl:px-8 xl:py-4 xl:text-xl font-bold">Date</TableHead>
                    <TableHead className="border border-gray-300 px-2 py-1 text-sm sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-2 md:text-base lg:px-6 lg:py-3 lg:text-lg xl:px-8 xl:py-4 xl:text-xl font-bold">Time</TableHead>
                    <TableHead className="border border-gray-300 px-2 py-1 text-sm sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-2 md:text-base lg:px-6 lg:py-3 lg:text-lg xl:px-8 xl:py-4 xl:text-xl font-bold">Status</TableHead>
                    <TableHead className="border border-gray-300 px-2 py-1 text-sm sm:px-4 sm:py-2 sm:text-sm md:px-4 md:py-2 md:text-base lg:px-6 lg:py-3 lg:text-lg xl:px-8 xl:py-4 xl:text-xl font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getAllTasks && getAllTasks.length > 0 && getAllTasks.map((taskItem) => (
                    taskItem.nestedArray.map((task, index) => (
                      <TableRow key={index} className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
                        <TableCell className="border border-gray-300 px-2 sm:px-4 py-2">{task.task}</TableCell>
                        <TableCell className="border border-gray-300 px-2 sm:px-4 py-2">{task.note}</TableCell>
                        <TableCell className="border border-gray-300 px-2 sm:px-4 py-2">{task.date}</TableCell>
                        <TableCell className="border border-gray-300 px-2 sm:px-4 py-2">{task.time}</TableCell>
                        <TableCell className="border border-gray-300 px-2 sm:px-4 py-2">{task.status}</TableCell>
                        <TableCell className="px-6 py-8 flex space-x-3">
                          <Button className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base lg:text-lg xl:texl-xl">Edit</Button>
                          <Button className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base lg:text-lg xl:texl-xl">Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ))}
                </TableBody>
                <TableFooter>

                </TableFooter>
              </Table>
            </div>
          </>
        )}
        {/* modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 bg-scroll">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Edit Task</h2>
                <button className="text-gray-700 hover:text-gray-900 text-2xl">&times;</button>
              </div>
              <form>

              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
