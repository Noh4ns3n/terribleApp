import "./App.css";
import User from "./components/User";
import Navbar from "./components/commons/Navbar";
import Home from "./components/home/Home";
import ParticleSystem1 from "./components/other_applications/ParticleSystem1";
import ProjectsList from "./components/projects/ProjectsList";
import NotFound from "./components/commons/NotFound";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ProjectsList />} />
            <Route path="/users" element={<User />} />
            <Route path="/particleSystem1" element={<ParticleSystem1 folderPath="particleSystem1"/>} />
            <Route path="/particleSystem2" element={<ParticleSystem1 folderPath="particleSystem2"/>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
