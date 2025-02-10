import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Home from "./pages/Home.jsx";
import CreateEvent from "./pages/CreateEvent.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Navbar from "./pages/Navbar.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import EventDetails from "./pages/EventDetails.jsx";

function App() {
    return (
        <ChakraProvider>
            <AuthProvider>
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/user" element={<ProfilePage />} />
                        <Route path="/event/:id" element={<EventDetails />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/create-event" element={<CreateEvent />} />
                        <Route path="/edit/:id" element={<CreateEvent />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </ChakraProvider>
    );
}

export default App;
