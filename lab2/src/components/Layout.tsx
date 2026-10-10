import { NavLink, Outlet } from "react-router-dom";
import "./Layout.css";

export default function Layout() {
  return (
    <>
      <header>
        <h1>Нобелевские премии</h1>
      </header>

      <nav>
        <ul>
          <li>
            <NavLink to="/prizes" className={({ isActive }) => (isActive ? "active" : undefined)}>
              Премии
            </NavLink>
          </li>
          <li>
            <NavLink to="/laureats" className={({ isActive }) => (isActive ? "active" : undefined)}>
              Лауреаты
            </NavLink>
          </li>
        </ul>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>&copy; 2026 Лабораторная работа №2</p>
      </footer>
    </>
  );
}
