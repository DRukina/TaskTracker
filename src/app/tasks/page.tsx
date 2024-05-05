import prisma from "@/lib/database"
import { auth } from "@clerk/nextjs";

import TaskForm from "@/components/TaskForm";
import Clock from "@/components/Clock";
import { DataTable } from "@/components/ui/data-table";

import { columns } from "./components/columns"

const loadTasks = async () => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User ID is not available");
  }

  const tasks = await prisma.task.findMany({
    where: { uid: userId }
  });

  return tasks.map(task => {
    return {
      ...task,
      id: task.id.toString()
    };
  });
}

export default async function TasksPage() {
  const tasks = await loadTasks();

  return (
    <main className="flex items-start overflow-x-hidden">
      <div className="relative flex flex-col items-center w-2/5 gap-10 p-10">
        <Clock />
        <TaskForm />
      </div>
      <div className="w-full bg-black bg-opacity-40 backdrop-blur-xl p-5 mt-10 mx-5 rounded-xl animate-fade-left">
        <DataTable columns={columns} data={tasks} searchKey="title" />
      </div>
    </main>
  )
}