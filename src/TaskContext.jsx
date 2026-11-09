import { useEffect , useContext ,createContext , useState } from "react";

const TaskContext = createContext(null)

export function TaskProvider({children}){
  const deleteTask = (id) => {
    setTask(prev => prev.filter(task => task.id !== id));
  };
  const changeStatus = (id) => {
    setTask(prev => prev.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    }));
  };
  const [taskList, setTask] = useState(() => {
      const savedTasks = localStorage.getItem('taskList');
      return savedTasks ? JSON.parse(savedTasks) : [];
    });
  const [timeFilter , setTimeFilter] = useState(true);
  const [completedFilter , setCompletedFilter] = useState("all");
  useEffect(() => {
      localStorage.setItem("taskList",JSON.stringify(taskList));
  },[taskList]);

  const value = { taskList, setTask, deleteTask, changeStatus, timeFilter , setTimeFilter, completedFilter , setCompletedFilter};
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks должен использоваться внутри TaskProvider');
  return ctx;
}