import { useState } from "react";
import TextInput from "../commons/TextInput";
import {UserT} from "../../types/DataTypes";

const Auth = () => {
  const [user, setUser] = useState<UserT>();

  const handleChange = (event : any) => {
    
  };

  return (
    <div className="loginForm">
      <TextInput
        name="username"
        label="username"
        onChange={handleChange}
        value={user?.username}
      />
      <TextInput
        name="password"
        label="password"
        onChange={handleChange}
        value={user?.password}
      />

      {/* <button type="submit" disabled={saving} className="btn btn-primary">
        {saving ? "Saving..." : "Save"}
      </button> */}
    </div>
  );
};

export default Auth;
