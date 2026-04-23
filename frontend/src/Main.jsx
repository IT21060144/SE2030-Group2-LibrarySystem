import { useState } from "react";
import Login from "./Login";
import App from "./App";
export default function Main() {
  const [loggedIn, setLoggedIn] = useState(false);
  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;
  return <App onLogout={() => setLoggedIn(false)} />;
}
