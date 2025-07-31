import React, { useState } from "react";
import TitlesDropdown from "./TitlesDropdown";

export default function App() {
  const [selectedTitle, setSelectedTitle] = useState(null);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>eCFR Viewer</h1>
      <TitlesDropdown onSelect={setSelectedTitle} />

      {selectedTitle && (
        <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ccc" }}>
          <h2>{selectedTitle.name}</h2>
          <p><b>Number:</b> {selectedTitle.number}</p>
          <p><b>Latest Amended On:</b> {selectedTitle.latest_amended_on}</p>
          <p><b>Issue Date:</b> {selectedTitle.latest_issue_date}</p>
          <p><b>Up to Date As Of:</b> {selectedTitle.up_to_date_as_of}</p>
          <p><b>Reserved:</b> {selectedTitle.reserved ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
}
