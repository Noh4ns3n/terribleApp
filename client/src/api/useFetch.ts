import { useState, useEffect } from "react";
interface ApiResponse<DataType> {
  data: DataType | null;
  error: string | null;
  isPending: boolean;
}

const useFetch = <DataType>(url : string): ApiResponse<DataType> => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      fetch(url, {
        method:'GET'
      })
        .then((resp) => {
          if (!resp.ok) {
            throw Error("Could not fetch data for that resource");
          }
          return resp.json();
        })
        .then((data) => {
          setData(data);
          setIsPending(false);
          setError(null);
        })
        .catch((error) => {
          if (error.name === "AbortError") {
            console.log("Fetch aborted");
          } else {
            setError(error.message);
            setIsPending(false);
          }
        });
  }, [url]);

  return { data, isPending, error };
};

export default useFetch;
