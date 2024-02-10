import { useState, useEffect } from "react";

const useFetch = (url : string) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      fetch(url)
        .then((resp) => {
          if (!resp.ok) {
            throw Error("could not fetch data for that resource");
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
            console.log("fetch aborted");
          } else {
            setError(error.message);
            setIsPending(false);
          }
        });
  }, [url]);

  return { data, isPending, error };
};

export default useFetch;
