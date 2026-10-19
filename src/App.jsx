import {useState , useEffect} from "react";
function Header({ taskList, setTask, setCompletedFilter, setTimeFilter, timeFilter, completedFilter }) {
  const [inputTaskValue, setinputTaskValue] = useState("");
  const copyList = taskList;
  const count = copyList.filter((task)=> task.completed).length
  return (
    <header>
      <div id="addTask">
        <div className="block">
          <label htmlFor="inputTask">Добавте задачу:<input type="text" value={inputTaskValue} id="inputTask" onChange={(e) =>{setinputTaskValue(e.target.value);}} placeholder="Введите название задачи" /> </label>
          <button onClick={()=> {
            if (inputTaskValue != "") {
              setTask([...taskList ,{id: Date.now() , title: inputTaskValue.trim() , completed: false}]);
              setinputTaskValue("");
            }
          }}>Добавить</button>
        </div>
      </div>
      <div className="block" id="statistic">
        <h2>Статистика:</h2>
        <p>Количесвто задач: {taskList.length}</p>
        <p>Количество выполненных: {count}</p>
        <p>Процент выполнения: {taskList.length === 0 ? 0 : Math.round(count / taskList.length * 100)}%</p>
      </div>
      <div className="block" id="filtr">
        <div >
          <button className={timeFilter ? "onn" : "off"}  onClick={()=>{setTimeFilter(true)}}>Сначало новые</button>
          <button className={timeFilter ? "off" : "onn"} onClick={()=>{setTimeFilter(false)}}>Сначало старые</button></div>
        <div>
          <button className={completedFilter === 'all' ? "onn" : "off"} onClick={()=>setCompletedFilter("all")}>Все</button>
          <button className={completedFilter === 'active' ? "onn" : "off"} onClick={()=>setCompletedFilter("active")}>Активные</button>
          <button className={completedFilter === 'completed' ? "onn" : "off"} onClick={()=>setCompletedFilter("completed")}>Выполненные</button>
        </div>
      </div>
    </header>
  );
};

function TaskList({ taskList, setTask, timeFilter, completedFilter }) {
  const [searchQuery , setsearchQuery] = useState("");
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
  useEffect(() => {
    if (taskList.length >= 0) {
      localStorage.setItem("taskList",JSON.stringify(taskList));
      console.log("СОхранило", taskList)
    }
  },[taskList]);

  let sortList =[...taskList].sort((a,b)=>{
    return timeFilter ? b.id - a.id : a.id - b.id ;
  });
  if (completedFilter === "active") {
    sortList = sortList.filter(task => task.completed === false);
    console.log("активные",sortList)
  };
  if (completedFilter === "completed") {
    sortList = sortList.filter(task => task.completed === true);
    console.log("выполненные",sortList)
  };
  if (searchQuery !="") {
    sortList = sortList.filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
  };
  
  return (
    <section>
      <input type="text" placeholder="Поиск задачи..." id="search" onChange={(e) =>{setsearchQuery(e.target.value);}}></input>
      {sortList.map((i) => (
        <article key={i.id}>
          <h2 className={i.completed ? "com" : "act"}>{i.title}</h2>
          <div onClick={() => changeStatus(i.id)}><p>{i.completed ? <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="16" height="16" rx="2" ry="2"></rect><polyline points="6 11 10 15 19 6"></polyline></svg> : <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="16" height="16" rx="2" ry="2"></rect></svg>}</p></div>
          <button onClick={() => deleteTask(i.id)}>Удалить</button>
        </article>
      ))}
    </section>
  );
};

export default function App() {
  const [taskList, setTask] = useState(() => {
      const savedTasks = localStorage.getItem('taskList');
      return savedTasks ? JSON.parse(savedTasks) : [];
    });
    const [timeFilter , setTimeFilter] = useState(true);
    const [completedFilter , setCompletedFilter] = useState("all");
  return (
    <>
      <Header taskList={taskList} setTask={setTask} setCompletedFilter = {setCompletedFilter} setTimeFilter={setTimeFilter} timeFilter={timeFilter} completedFilter = {completedFilter}/>
      <TaskList taskList={taskList} setTask={setTask} timeFilter={timeFilter} completedFilter = {completedFilter}/>
    </>
  );
};