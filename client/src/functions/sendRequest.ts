const sendRequest = async (index: number) : Promise<string> => {
    const response = await fetch("https://desolate-shelf-05978-91a6d7d27461.herokuapp.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ index }),
    }).then(res => res.json())
    return response;
  };

  export default sendRequest;