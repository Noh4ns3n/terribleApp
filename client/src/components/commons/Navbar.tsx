import {Link} from "react-router-dom";

const Navbar = () => {
    return ( 
        <nav className="navbar">
            <h1>My terrible web application</h1>
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/projects">Projects</Link>
                <Link to="/users">Users</Link>
                <Link to="/particleSystem1">Particle System 1</Link>
                <Link to="/particleSystem2">Particle System 2</Link>
            </div>
        </nav>
     );
}
 
export default Navbar;

