import { useEffect, useState } from "react";
import API from "../api.js";
import "./MyApplications.css";

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyApplications = async () => {
            try {
                const response = await API.get("/api/applications/my-applications", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setApplications(response.data);
            } catch (err) {
                console.error("Error fetching applications:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyApplications();
    }, []);

    if (loading) return <div className="loader">Loading your applications...</div>;

    return (
        <div className="my-apps-container">
            <h1>My Applications</h1>
            
            {applications.length === 0 ? (
                <div className="empty-state">
                    <p>You haven't applied to any requests yet.</p>
                </div>
            ) : (
                <div className="apps-list">
                    {applications.map((app) => (
                        <div key={app._id} className="app-card">
                            <div className="app-card-header">
                                {/* Accessing populated request data */}
                                <span className="category-tag">
                                    {app.requestId?.category || "N/A"}
                                </span>
                                
                                {/* Using the Application status */}
                                <span className={`status-badge ${app.status}`}>
                                    {app.status.toUpperCase()}
                                </span>
                            </div>

                            <h3>{app.requestId?.title || "Deleted Request"}</h3>
                            <p className="location-text">📍 {app.requestId?.location}</p>
                            
                            <div className="app-card-footer">
                                <span className="date-text">
                                    Applied on: {new Date(app.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyApplications;