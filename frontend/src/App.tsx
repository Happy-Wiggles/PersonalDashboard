import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Provider } from "react-redux";
import { useState } from "react";
import { store } from "./store/store";

import NavBar from "./components/NavBar";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import About from "./components/About";
import Contact from "./components/Contact";

const LoginPage = ({ setTitle }: { setTitle: (title: string) => void }) => (
  <Login setTitle={setTitle} />
);

const RegisterPage = ({ setTitle }: { setTitle: (title: string) => void }) => (
  <Register setTitle={setTitle} />
);
const DashboardPage = ({ setTitle }: { setTitle: (title: string) => void }) => (
  <Dashboard setTitle={setTitle} />
);

const AboutPage = ({ setTitle }: { setTitle: (title: string) => void }) => (
  <About setTitle={setTitle} />
);

const ContactPage = ({ setTitle }: { setTitle: (title: string) => void }) => (
  <Contact setTitle={setTitle} />
);

function App() {
  const [title, setTitle] = useState<string>("Willkommen!");

  return (
    <>
      <Provider store={store}>
        <Router>
          <NavBar pageTitle={title} />
          <Routes>
            <Route path="/" element={<LoginPage setTitle={setTitle} />} />
            <Route path="/login" element={<LoginPage setTitle={setTitle} />} />
            <Route
              path="/register"
              element={<RegisterPage setTitle={setTitle} />}
            />
            <Route
              path="/dashboard"
              element={<DashboardPage setTitle={setTitle} />}
            />
            <Route path="/about" element={<AboutPage setTitle={setTitle} />} />
            <Route
              path="/contact"
              element={<ContactPage setTitle={setTitle} />}
            />
          </Routes>
        </Router>
      </Provider>
    </>
  );
}

export default App;
