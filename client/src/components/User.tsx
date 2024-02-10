import useFetch from "../api/useFetch";

interface User {
    id: number;
    username: string;
    password:string;
}

const User = () => {
    const {
        data, 
        error,
        isPending
    } = useFetch(`http://localhost:3000/user/2`);

    return(
        isPending ? (
        <div className="loading">
            Loading ... 
            </div>
            ) : (
            <>
            {data.user && <div className="userData">User: {data.user.username}</div>}
            {data.user && <div className="userData">Password: {data.user.password}</div>}
            {error && <div className="error">Error : {error}</div>}
            </>
            )
        );

    
}
 
export default User;