import React, { useEffect, useState } from "react";
import { Form, Card, Container, Row, Col, Alert } from "react-bootstrap";

export default function TitlesDropdown() {
  const [titles, setTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [error, setError] = useState("");

  // Load titles.json
  useEffect(() => {
    fetch("/data/titles.json")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTitles(data);
        } else if (Array.isArray(data.titles)) {
          setTitles(data.titles);
        } else {
          setError("Invalid data format in titles.json");
        }
      })
      .catch((err) => setError("Failed to load titles.json"));
  }, []);

  // Load version file for a specific title
  const fetchTitleData = (titleNumber) => {
    if (!titleNumber) return;
    const url = `/data/versions-title-${titleNumber}.json`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setSelectedData(data))
      .catch(() =>
        setSelectedData({ error: "Failed to load details for this title." })
      );
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const titleObj = titles.find((t) => String(t.number) === value);
    setSelectedTitle(titleObj || null);
    fetchTitleData(value);
  };

  // Extract result_count from possible locations
  const getResultCount = () => {
    if (!selectedData) return null;
    if (selectedData.result_count !== undefined) return selectedData.result_count;
    if (selectedData.meta?.result_count !== undefined)
      return selectedData.meta.result_count;
    return null;
  };

  return (
    <Container className="my-4">
      <Row>
        <Col md={6}>
          <h3 className="mb-3">Select a Title</h3>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Select
            className="mb-4"
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
          </Form.Select>

          {selectedTitle && (
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Card.Title>{selectedTitle.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Title {selectedTitle.number}
                </Card.Subtitle>
                <Card.Text>
                  <strong>Latest Amended:</strong>{" "}
                  {selectedTitle.latest_amended_on}
                </Card.Text>
                <Card.Text>
                  <strong>Issue Date:</strong>{" "}
                  {selectedTitle.latest_issue_date}
                </Card.Text>
                <Card.Text>
                  <strong>Up-to-date As Of:</strong>{" "}
                  {selectedTitle.up_to_date_as_of}
                </Card.Text>
              </Card.Body>
            </Card>
          )}

          {selectedData && !selectedData.error && (
            <Card border="info">
              <Card.Body>
                <Card.Title>
                  Details for Title {selectedTitle?.number}
                </Card.Title>
                {getResultCount() !== null && (
                  <Card.Text>
                    <strong>Result Count:</strong> {getResultCount()}
                  </Card.Text>
                )}
              </Card.Body>
            </Card>
          )}

          {selectedData?.error && (
            <Alert variant="warning" className="mt-3">
              {selectedData.error}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
}
