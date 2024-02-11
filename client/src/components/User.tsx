import useFetch from "../api/useFetch";
import type {UserT} from "../types/DataTypes";

const User = () => {
  const { data, error, isPending } = useFetch<{user:UserT}>(
    `http://localhost:3000/user/1`
  );

  const currentUser = { ...data?.user };

  return isPending ? (
    <div className="loading">Loading ...</div>
  ) : (
    <>
      {currentUser && (
        <div className="userData">User: {currentUser.username}</div>
      )}
      {currentUser && (
        <div className="userData">Password: {currentUser.password}</div>
      )}
      {error && <div className="error">Error : {error}</div>}
    </>
  );
};

export default User;
