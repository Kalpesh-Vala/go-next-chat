import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./context/AuthContext";
import { WebSocketProvider } from "./context/WebSocketContext";
import Register from "./pages/Register";

const App = () => {
    return (
        <AuthProvider>
            <Register />
            <WebSocketProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/chat" element={<ChatPage />} />
                    </Routes>
                </Router>
            </WebSocketProvider>
        </AuthProvider>
    );
};

export default App;
