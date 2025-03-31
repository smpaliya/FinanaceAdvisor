import React, { useState } from "react";
import axios from "axios";

function URLInput() {
  const [urls, setUrls] = useState(["", "", ""]);

  const handleURLChange = (index, value) => {
    const updatedUrls = [...urls];
    updatedUrls[index] = value;
    setUrls(updatedUrls);
  };
  //https://economictimes.indiatimes.com/markets/stocks/news/concurrent-gainers-8-stocks-that-gain-for-5-days-in-a-row/slideshow/119704121.cms?from=mdr
//https://www.moneycontrol.com/news/business/elon-musk-sells-x-to-his-own-xai-for-usd-33-billion-in-all-stock-deal-12979261.html
//https://www.financialexpress.com/business/investing-abroad-us-stock-market-fall-again-and-hard-heres-why-3792407/
  const processURLs = async () => {
    const validUrls = urls.filter((url) => url.trim() !== "");
    if (validUrls.length === 0) {
      alert("Please enter at least one valid URL!");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/process-urls/", { urls: validUrls });
      alert("FAISS index created successfully!");
    } catch (error) {
      alert("Error processing URLs: " + error.message);
    }
  };

  return (
    <div>
      <h3>Enter News Article URLs:</h3>
      {urls.map((url, index) => (
        <input
          key={index}
          type="text"
          value={url}
          onChange={(e) => handleURLChange(index, e.target.value)}
          placeholder={`URL ${index + 1}`}
        />
      ))}
      <button onClick={processURLs}>Process URLs</button>
    </div>
  );
}

export default URLInput;
