import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

export default function TitlesDropdown() {
  const [titles, setTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [error, setError] = useState("");

  // Fetch list of titles
  useEffect(() => {
    fetch("/data/titles.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setTitles(data);
        else if (Array.isArray(data.titles)) setTitles(data.titles);
        else setError("Invalid data format in titles.json");
      })
      .catch((err) => {
        console.error("Error loading titles:", err);
        setError("Failed to load titles.json");
      });
  }, []);

  // Fetch details for selected title
  const fetchTitleData = (titleNumber) => {
    if (!titleNumber) {
      setSelectedData(null);
      return;
    }

    const url = `/data/versions-title-${titleNumber}.json`;
    console.log("Fetching:", url);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setSelectedData(data);
      })
      .catch((err) => {
        console.error("Error fetching title details:", err);
        setSelectedData({ error: "Failed to load details for this title." });
      });
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const titleObj = titles.find((t) => String(t.number) === value);
    setSelectedTitle(titleObj || null);
    fetchTitleData(value);
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3">Select a Title</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <select
        className="form-select mb-4"
        onChange={handleChange}
        defaultValue=""
      >
        <option value="" disabled>
          -- Choose a Title --
        </option>
        {titles.map((t) => (
          <option key={t.number} value={t.number}>
            {t.name} (Title {t.number})
          </option>
        ))}
      </select>

      {selectedTitle && (
        <Card className="shadow-sm">
          <Card.Body>
            <Card.Title>{selectedTitle.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Title {selectedTitle.number}
            </Card.Subtitle>
            <p>
              <strong>Latest Amended:</strong> {selectedTitle.latest_amended_on}
            </p>
            <p>
              <strong>Issue Date:</strong> {selectedTitle.latest_issue_date}
            </p>
            <p>
              <strong>Up-to-date As Of:</strong> {selectedTitle.up_to_date_as_of}
            </p>
          </Card.Body>
        </Card>
      )}

      {selectedData && (
        <Card className="mt-4 border-info">
          <Card.Body>
            <Card.Title>Details for Title {selectedTitle?.number}</Card.Title>
            <pre className="bg-light p-3 rounded">
              {JSON.stringify(selectedData, null, 2)}
            </pre>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
