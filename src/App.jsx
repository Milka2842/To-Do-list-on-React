import {useState } from "react";
import { Routes, Route, NavLink, useParams ,useNavigate } from 'react-router-dom'
import { useTasks } from './TaskContext';
import {UseNav} from "./Nav"
function Header() {
  const {taskList, setTask , setCompletedFilter, setTimeFilter, timeFilter, completedFilter} = useTasks();
  const copyList = taskList;
  const [inputTaskValue, setinputTaskValue] = useState("");
  const nav = UseNav();
  const count = copyList.filter((task)=> task.completed).length
  return (
    <header>
      {nav}
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

function TaskList({ }) {
  const [searchQuery , setsearchQuery] = useState("");
  const {taskList ,deleteTask ,changeStatus, timeFilter, completedFilter} = useTasks();
  let sortList =[...taskList].sort((a,b)=>{
    return timeFilter ? b.id - a.id : a.id - b.id ;
  });
  if (completedFilter === "active") {
    sortList = sortList.filter(task => task.completed === false);
  };
  if (completedFilter === "completed") {
    sortList = sortList.filter(task => task.completed === true);
  };
  if (searchQuery !=="") {
    sortList = sortList.filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
  };
  const navigate = useNavigate()
  
  return (
    <section>
      <input type="text" placeholder="Поиск задачи..." id="search" onChange={(e) =>{setsearchQuery(e.target.value);}}></input>
      {sortList.map((i) => (
        <article key={i.id}>
          <h2 className={i.completed ? "com" : "act"} onClick={() => navigate(`/task/${i.id}`,{state: i})}>{i.title}</h2>
          <div onClick={() => changeStatus(i.id)}><p>{i.completed ? <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="16" height="16" rx="2" ry="2"></rect><polyline points="6 11 10 15 19 6"></polyline></svg> : <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="16" height="16" rx="2" ry="2"></rect></svg>}</p></div>
          <button onClick={() => deleteTask(i.id)}>Удалить</button>
        </article>
      ))}
    </section>
  );
};

function AboutPage() {
  return (
    <div>
      <nav id="AboutPageNav">
        <NavLink className={({isActive}) => (isActive ? "activeNav": "Nav")} to="/">Главная</NavLink>
        <NavLink className={({isActive}) => (isActive ? "activeNav": "Nav")} to="/about">О приложении</NavLink>
      </nav>
      <header className="aboutPage">
        <h2>О приложении</h2>
        <p>Приложение созданно в процессе изучения React . </p>
      </header>
    </div>
  );
}

function Home() {
  return (
    <>
      <Header/>
      <TaskList  />
    </>
  );
}

function TaskPage(){
  const navigate = useNavigate()
  const {strid} = useParams();
  const id = Number(strid);
  const {deleteTask ,taskList , changeStatus} = useTasks()
  const i = taskList.find(t => t.id === id);
  if (!i) {
    return (
      <>
        <h2>Задача не найдена</h2>
        <nav>
          <NavLink className={({isActive}) => (isActive ? "activeNav": "Nav")} to="/">Главная</NavLink>
          <NavLink className={({isActive}) => (isActive ? "activeNav": "Nav")} to="/about">О приложении</NavLink>
        </nav>
      </>
    );
  }
  return(
    <div>
      <nav>
        <NavLink className={({isActive}) => (isActive ? "activeNav": "Nav")} to="/">Главная</NavLink>
        <NavLink className={({isActive}) => (isActive ? "activeNav": "Nav")} to="/about">О приложении</NavLink>
      </nav>
      <article key={i.id}>
        <h2 className={i.completed ? "com" : "act"}>{i.title}</h2>
        <div onClick={() =>changeStatus(i.id) }><p>{i.completed ? <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="16" height="16" rx="2" ry="2"></rect><polyline points="6 11 10 15 19 6"></polyline></svg> : <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="16" height="16" rx="2" ry="2"></rect></svg>}</p></div>
        <button onClick={() => {deleteTask(i.id); navigate("/")}}>Удалить</button>
      </article>
    </div>
  )
}

function NotFoundPage(){
  return(
    <h2>Страница не найдена</h2>
  )
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/task/:strid" element={<TaskPage />} />
        <Route path="*" element ={<NotFoundPage/>}/>
      </Routes>
    </>
  );
};