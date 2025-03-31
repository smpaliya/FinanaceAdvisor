import React from "react";

function ResultDisplay({ result }) {
  return (
    <div>
      <h3>Answer:</h3>
      <p>{result.answer}</p>
      <h4>Sources:</h4>
      <ul>
        {result.sources.map((source, index) => (
          <li key={index}>{source}</li>
        ))}
      </ul>
    </div>
  );
}

export default ResultDisplay;
