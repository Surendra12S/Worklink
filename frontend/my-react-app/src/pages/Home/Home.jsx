import { useEffect, useState } from "react";
import API from "../../api.js";
import "./Home.css";

function Home() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeFeed = async () => {
            try {
                const response = await API.get("/api/requests/home", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setRequests(response.data);
            } catch (err) {
                console.error("Error fetching feed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeFeed();
    }, []);

    if (loading) return <div className="loader">Finding opportunities...</div>;

    return (
        <div className="home-container">
            <h1>Available Requests</h1>
            {requests.length === 0 ? (
                <div className="empty-state">
                    <p>No new requests found from others. Check back later!</p>
                </div>
            ) : (
                <div className="requests-list">
                    {requests.map((req) => (
                        <div key={req._id} className="request-card">
                            <div className="card-header">
                                <span className="category-tag">{req.category}</span>
                                <span className="location-text">📍 {req.location}</span>
                            </div>
                            <h3>{req.title}</h3>
                            <p className="date-text">
                                Posted on: {new Date(req.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;