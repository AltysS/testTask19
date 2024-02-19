import React, { useState, useCallback, useEffect } from "react";
import "./App.css";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Input,
  Typography,
} from "@mui/joy";

function App() {
  const [count, setCount] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responces, setResponces] = useState([]);
  const [quene, setQuene] = useState(0);

  const handleChange = useCallback((value) => {
    setCount(value);
    setError(value < 0 || value > 100);
  }, []);

  const sendRequest = async (index) => {
    const response = await fetch("http://localhost:3000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ index }),
    }).then((res) => {
      if (res.status === 429) {
        setResponces((prev) => [
          ...prev,
          { index: `failed with status ${res.status}` },
        ]);
        return;
      }
      return res.json();
    });

    setQuene((quene) => quene - 1);

    setResponces((prev) => [...prev, { index: response }]);
    return response;
  };

  const handleStartClick = async () => {
    setLoading(true);
    const concurrencyLimit = parseInt(count);
    const rate = parseInt(count);
    let counter = 0;
    const totalRequests = 1000;

    //
    const timeRequested = [];
    //
    const ativeRequest = [];

    for (let i = 0; i <= totalRequests; i++) {
      if (counter >= rate) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        counter = 0;
      }

      const zalupaEta = (timeRequested) => {
        const secondAgo = Date.now() - 1000;
        let requestCount = 0;

        timeRequested.map((time) => {
          if (time >= secondAgo) {
            requestCount++;
          }
        });
        if (requestCount >= rate) {
          return 1000;
        } else {
          return 0;
        }
      };
      //

      setTimeout(() => {
        const request = sendRequest(i).then(() => {
          const index = ativeRequest.indexOf(request);
          if (index !== -1) {
            ativeRequest.splice(index, 1);
          }
        });
        ativeRequest.push(request);
      }, zalupaEta(timeRequested));

      //
      timeRequested.push(Date.now());
      //

      counter++;
      if (concurrencyLimit <= ativeRequest.length) {
        await Promise.race(ativeRequest);
      }
    }
    await Promise.all(ativeRequest);
  };

  return (
    <>
      <Container>
        <FormControl error={error}>
          <Input
            id="name"
            color="primary"
            type="number"
            value={count}
            error={error}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Enter value from 1 to 100"
            sx={{
              "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                {
                  "-webkit-appearance": "none",
                  margin: 0,
                },
              "& input[type=number]": {
                "-moz-appearance": "textfield",
              },
            }}
            endDecorator={
              <Button disabled={loading} onClick={handleStartClick}>
                {loading ? "Loading..." : "Start"}
              </Button>
            }
          />
          {error && (
            <FormHelperText sx={{ justifyContent: "center" }}>
              Error: Value must be between 0 and 100
            </FormHelperText>
          )}
        </FormControl>
      </Container>
      <Box>
        <Typography component="h2" variant="h2">
          Requests:
        </Typography>
        <Typography
          sx={{ display: "flex", flexDirection: "column" }}
          component="ul"
          variant="ul"
        >
          {responces.map((responce, index) => (
            <Typography component="li" variant="li" key={index}>
              Response {responce.index}
            </Typography>
          ))}
        </Typography>
      </Box>
    </>
  );
}

export default App;

// const handleStartClick = async () => {
//   setLoading(true);
//   const concurrencyLimit = parseInt(count);
//   const rate = parseInt(count);
//   let counter = 0;
//   const totalRequests = 1000;

//   const ativeRequest = [];

//   for (let i = 0; i <= totalRequests; i++) {
//     if (counter >= rate) {
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       counter = 0;
//     }

//     const request = sendRequest(i).then(() => {
//       const index = ativeRequest.indexOf(request);
//       if (index !== -1) {
//         ativeRequest.splice(index, 1);
//       }
//     });
//     ativeRequest.push(request);
//     counter++;
//     if (concurrencyLimit <= ativeRequest.length) {
//       await Promise.race(ativeRequest);
//     }
//   }
//   await Promise.all(ativeRequest);
// };
