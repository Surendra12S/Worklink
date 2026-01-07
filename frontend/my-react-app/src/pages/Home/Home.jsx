import { useEffect, useState } from "react";
import API from "../../api.js";
import "./Home.css";

function Home() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    // STEP 1: Track which requests the user just applied to in this session
    const [appliedRequestIds, setAppliedRequestIds] = useState([]);

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

    // STEP 2: The Apply Function
    const handleApply = async (requestId) => {
        try {
            // Optimistic UX: we could disable the button here
            const response = await API.post("/api/applications/apply", 
                { requestId }, 
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            if (response.status === 201) {
                // STEP 3: Add the ID to our local "applied" list
                setAppliedRequestIds((prev) => [...prev, requestId]);
                alert("Application sent successfully!");
            }
        } catch (err) {
            console.error("Apply Error:", err.response?.data?.message || err.message);
            alert(err.response?.data?.message || "Failed to apply");
        }
    };

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
                    {requests.map((req) => {
                        // STEP 4: Check if this specific card is "applied"
                        const isApplied = appliedRequestIds.includes(req._id);

                        return (
                            <div key={req._id} className="request-card">
                                <div className="card-header">
                                    <span className="category-tag">{req.category}</span>
                                    <span className="location-text">📍 {req.location}</span>
                                </div>
                                <h3>{req.title}</h3>
                                <p className="date-text">
                                    Posted on: {new Date(req.createdAt).toLocaleDateString()}
                                </p>

                                {/* STEP 5: Conditional Rendering of the Button */}
                                {isApplied ? (
                                    <button className="applied-btn" disabled>
                                        Applied (Pending)
                                    </button>
                                ) : (
                                    <button onClick={() => handleApply(req._id)}>
                                        I can help
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Home;