import React, { useState } from "react";
import URLInput from "./URLInput";
import QueryBox from "./QueryBox";
import ResultDisplay from "./ResultDisplay";


function NewsReader() {
  const [result, setResult] = useState(null);

  return (
    <div className="app-container">
      <h1>RockyBot: News Research Tool 📚</h1>
      <div className="main-content">
        <URLInput />
        <QueryBox setResult={setResult} />
        {result && <ResultDisplay result={result} />}
      </div>
    </div>
  );
}

export default NewsReader;
