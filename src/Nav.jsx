import { createContext, useContext } from "react";
import { NavLink } from "react-router-dom";

const NavContext = createContext(null);

export function NavProvider({children}){
    const nav = 
    <nav>
      <NavLink className={({isActive}) => (isActive ? "activeNav": "Nav")} to="/">Главная</NavLink>
      <NavLink className={({isActive}) => (isActive ? "activeNav": "Nav")} to="/about">О приложении</NavLink>
    </nav>
    return <NavContext.Provider value={nav}>{children}</NavContext.Provider>;
}

export function UseNav(){
  const ctx = useContext(NavContext)
  if (!ctx) throw new Error('useNav должен использоваться внутри NavProvider');
  return ctx;
}