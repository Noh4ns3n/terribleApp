import useFetch from "../api/useFetch";

interface User {
  id: number;
  username: string;
  password: string;
}
interface DataType {
  user: User;
}

const User = () => {
  const { data, error, isPending } = useFetch<DataType>(
    `http://localhost:3000/user/3`
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
