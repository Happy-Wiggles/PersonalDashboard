import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Provider } from "react-redux";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { store } from "./store/store";
import type { AppDispatch } from "./store/store";

import { initializeAuth } from "./features/auth/AuthSlice";

import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import About from "./components/About";
import Contact from "./components/Contact";
import Profile from "./components/Profile";
import ToDoLists from "./components/ToDo/ToDoLists";
import ToDoDetails from "./components/ToDo/ToDoDetails";
import Privacy from "./components/Privacy";

const LoginPage = ({ setTitle }: { setTitle: (title: string) => void }) => (
  <Login setTitle={setTitle} />
);

const RegisterPage = ({ setTitle }: { setTitle: (title: string) => void }) => (
  <Register setTitle={setTitle} />
);

const DashboardPage = ({ setTitle }: { setTitle: (title: string) => void }) => (
  <Dashboard setTitle={setTitle} />
);

const ToDoPage = ({ setTitle }: { setTitle: (title: string) => void }) => (
  <ToDoLists setTitle={setTitle} />
);

const ToDoDetailsPage = ({
  setTitle,
}: {
  setTitle: (title: string) => void;
}) => <ToDoDetails setTitle={setTitle} />;

const ProfilePage = ({ setTitle }: { setTitle: (title: string) => void }) => (
  <Profile setTitle={setTitle} />
);

const PrivacyPage = ({ setTitle }: { setTitle: (title: string) => void }) => (
  <Privacy setTitle={setTitle} />
);

const AboutPage = ({ setTitle }: { setTitle: (title: string) => void }) => (
  <About setTitle={setTitle} />
);

const ContactPage = ({ setTitle }: { setTitle: (title: string) => void }) => (
  <Contact setTitle={setTitle} />
);

// Inner App component that has access to Redux hooks
function AppContent() {
  const [title, setTitle] = useState<string>("Willkommen!");
  const dispatch = useDispatch<AppDispatch>();

  // Initialize user auth state on app mount - restore from localStorage if available
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
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
          path="/userprofile"
          element={<ProfilePage setTitle={setTitle} />}
        />
        {/* Protect the dashboard route - only authenticated users can access */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage setTitle={setTitle} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/todolists"
          element={
            <ProtectedRoute>
              <ToDoPage setTitle={setTitle} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/todo/:listId"
          element={<ToDoDetailsPage setTitle={setTitle}></ToDoDetailsPage>}
        />
        <Route path="/about" element={<AboutPage setTitle={setTitle} />} />
        <Route path="/contact" element={<ContactPage setTitle={setTitle} />} />
        <Route path="/privacy" element={<PrivacyPage setTitle={setTitle} />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </>
  );
}

export default App;
