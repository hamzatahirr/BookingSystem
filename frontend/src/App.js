import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import AuthPageSignUp from "./Components/AuthPageSignUp";
import AuthPageLogIn from "./Components/AuthPageLogIn";
import Home from "./Components/Home";
import Search from "./Components/Search";
import Help from "./Components/Help";
import Results from "./Components/Results";
import ForgetPass from "./Components/ForgetPass";

function App() {
    return (
        <Router>
            <div className="app-container">

                <Navbar title="Bus Booking System" />

                <main className="content">
                    <Routes>

                        {/* Default */}
                        <Route path="/" element={<AuthPageLogIn />} />

                        {/* Auth */}
                        <Route path="/login" element={<AuthPageLogIn />} />
                        <Route path="/signup" element={<AuthPageSignUp />} />
                        <Route path="/forgetpass" element={<ForgetPass />} />

                        {/* System */}
                        <Route path="/home" element={<Home />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/results" element={<Results />} />
                        <Route path="/help" element={<Help />} />

                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;