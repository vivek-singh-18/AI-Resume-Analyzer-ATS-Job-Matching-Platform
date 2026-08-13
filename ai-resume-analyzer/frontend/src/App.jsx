import Login from "./pages/Login";
import Navbar from "./components/elements/Navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignupForm } from "./pages/Singup";
import { NotFoundPage } from "./components/elements/NotFound";
import FileUploader from "./pages/Upload";
import "./App.css";
import ScrollToTop from "./hooks/useScrollToTop";
import HomePage from "./pages/Home";
import ProfilePage from "./pages/Profile";
import { Toaster } from "sonner";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

const AppContent = () => {
  return (
    <>
      <Toaster
        position="top-center"
        duration={4000}
        richColors
        theme="light"
        closeButton
      />
      <Navbar />
      <main className="flex min-h-[90vh] items-center justify-center ">
        {/* <Login /> */}
        <Routes>
          <Route
            path="/"
            element={
                <HomePage />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/signup"
            element={<SignupForm className="max-w-xl mx-auto w-full" />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <FileUploader />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
