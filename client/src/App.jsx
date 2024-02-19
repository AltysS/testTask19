import React, { useState, useCallback } from "react";
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
import sendRequest from "./functions/sendRequest";
import limitRequestsPerSecond from "./functions/limitRequestsPerSecond";

function App() {
  const [count, setCount] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responces, setResponces] = useState([]);

  const handleChange = useCallback((value) => {
    console.log(value);
    setCount(value);
    setError(value < 0 || value > 100);
  }, []);

  const sendRequestAsync = async (index) => {
    const response = await sendRequest(index);
    if (response?.status === 429) {
      setResponces((prev) => [
        ...prev,
        { index: `failed with status ${response.status}` },
      ]);
      return "fulfilled";
    }
    setResponces((prev) => [...prev, { index: response }]);
    // Возвращаем "fulfilled" после выполнения запроса
    return "fulfilled";
  };

  const handleStartClick = async () => {
    if (count.trim() === "" || error) {
      setError(true);
      return;
    }
    setLoading(true);
    const requests = 1000;
    await limitRequestsPerSecond(requests, count, sendRequestAsync);
    setLoading(false);
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
