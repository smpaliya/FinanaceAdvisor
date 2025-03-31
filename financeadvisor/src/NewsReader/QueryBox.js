import React, { useState } from "react";
import axios from "axios";

function QueryBox({ setResult }) {
  const [query, setQuery] = useState("");

  const askQuestion = async () => {
    if (!query) {
      alert("Please enter a question!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/ask-question/", {
        question: query,
      });
      setResult(response.data);
    } catch (error) {
      alert("Error retrieving answer: " + error.message);
    }
  };

  return (
    <div>
      <h3>Ask a Question:</h3>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your question..."
      />
      <button onClick={askQuestion}>Ask</button>
    </div>
  );
}

export default QueryBox;
