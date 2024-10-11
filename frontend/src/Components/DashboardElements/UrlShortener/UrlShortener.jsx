import React from "react";
import "./UrlShortener.css";
import Topbar from "../Topbar/Topbar";
import { useState, useEffect } from "react";

const UrlShortener = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState("");
  const [editingUrl, setEditingUrl] = useState(null);
  const [newOriginalUrl, setNewOriginalUrl] = useState("");
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await fetch(`http://${localIP}:8000/api/shortened-urls`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setUrls(data);
    } catch (err) {
      setError("Failed to fetch URLs");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setShortenedUrl("");

    try {
      const response = await fetch(`http://${localIP}:8000/api/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ original_url: originalUrl }),
      });

      const responseText = await response.text();
      const data = JSON.parse(responseText);

      if (response.ok) {
        setShortenedUrl(data.short_url);
        fetchUrls(); // Refresh the list of URLs
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await fetch(
        `http://${localIP}:8000/api/shortened-urls/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ original_url: newOriginalUrl }),
        }
      );

      if (response.ok) {
        setEditingUrl(null);
        setNewOriginalUrl("");
        fetchUrls(); // Refresh the list of URLs
      } else {
        setError("Failed to update URL");
      }
    } catch (err) {
      setError("Failed to update URL");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://${localIP}:8000/api/shortened-urls/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        fetchUrls(); // Refresh the list of URLs
      } else {
        setError("Failed to delete URL");
      }
    } catch (err) {
      setError("Failed to delete URL");
    }
  };

  return (
    <>
      <Topbar />
      <div className="main-urlshortener">
        <div className="card-urlshortener">
          <div className="shortener-container">
            <div className="shortener-header">
              <h1>URL Shortener</h1>
            </div>
            <form className="shortener-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter URL to shorten"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
              />
              <button type="submit">Shorten URL</button>
              {error && <p className="shortener-error">{error}</p>}
            </form>
            {shortenedUrl && (
              <div className="shortened-url">
                <p>
                  Shortened URL:{" "}
                  <a
                    href={shortenedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {shortenedUrl}
                  </a>
                </p>
              </div>
            )}
            <div className="url-management">
              <h2>Manage Your URLs</h2>
              {urls.length === 0 && <p>No URLs found</p>}
              {urls.map((url) => (
                <div key={url.id} className="url-item">
                  <p>Original URL: <a href={url.original_url} target="_blank" rel="noopener noreferrer">{url.original_url}</a>
                    <br />
                     Shortened URL: <a href={shortenedUrl} target="_blank" rel="noopener noreferrer">{shortenedUrl} </a>
                  </p>
                  {editingUrl === url.id ? (
                    <div className="url-edit">
                      <input
                        type="text"
                        value={newOriginalUrl}
                        onChange={(e) => setNewOriginalUrl(e.target.value)}
                      />
                      <button onClick={() => handleEdit(url.id)}>Update</button>
                      <button onClick={() => setEditingUrl(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="url-actions">
                      <button
                        onClick={() => {
                          setEditingUrl(url.id);
                          setNewOriginalUrl(url.original_url);
                        }}
                      >
                        Edit
                      </button>
                      <button  onClick={() => handleDelete(url.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UrlShortener;
