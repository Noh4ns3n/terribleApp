import "./App.css";
import User from "./components/User";
import Auth from "./components/auth/Auth";
const App = () => {
  return (
    <>
      <div className="user">
        <User />
        <Auth />
      </div>
    </>
  );
};

export default App;
