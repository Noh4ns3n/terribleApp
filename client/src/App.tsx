import User from "./components/User";
import Navbar from "./components/commons/Navbar";
import Home from "./components/home/Home";
import ParticleSystem from "./components/other_applications/ParticleSystem";
import ProjectsList from "./components/projects/ProjectsList";
import NotFound from "./components/commons/NotFound";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Goblin3000 from "./components/other_applications/Goblin3000";

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
            <Route path="/particleSystem1" element={<ParticleSystem folderPath="particleSystem1"/>} />
            <Route path="/particleSystem2" element={<ParticleSystem folderPath="particleSystem2"/>} />
            <Route path="/goblin3000" element={<Goblin3000/>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
