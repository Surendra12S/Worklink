import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api.js";


function ViewApplicants() {
    const { requestId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false); // Step 6: Prevent double-clicks

    // We put fetch logic in a function so we can call it again after Accept/Reject
    const fetchApplicants = async () => {
        try {
            const response = await API.get(`/api/applications/request/${requestId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setApplicants(response.data);
        } catch (err) {
            console.error("Fetch Applicants Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicants();
    }, [requestId]);

    // STEP 2 & 3: Handle Accept Logic
    const handleAccept = async (applicationId) => {
        if (!window.confirm("Are you sure? This will reject all other applicants.")) return;
        
        setProcessing(true);
        try {
            await API.put(`/api/applications/accept/${applicationId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            // STEP 4: Success - Re-fetch data to show updated statuses and locked request
            await fetchApplicants();
            alert("Application accepted!");
        } catch (err) {
            alert(err.response?.data?.message || "Error accepting application");
        } finally {
            setProcessing(false);
        }
    };

    // STEP 2 & 3: Handle Reject Logic
    const handleReject = async (applicationId) => {
        setProcessing(true);
        try {
            await API.put(`/api/applications/reject/${applicationId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            await fetchApplicants();
        } catch (err) {
            alert(err.response?.data?.message || "Error rejecting application");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="loader">Loading applicants...</div>;

    return (
        <div className="view-applicants-container">
            <h1>Applicants</h1>
            {applicants.length === 0 ? (
                <p>No one has applied yet.</p>
            ) : (
                <div className="applicants-list">
                    {applicants.map((app) => (
                        <div key={app._id} className="applicant-card">
                            <div className="helper-info">
                                <h3>{app.helperId?.name}</h3>
                                <p>{app.helperId?.email}</p>
                                <span className={`status-tag ${app.status}`}>
                                    {app.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="action-buttons">
                                {/* STEP 5: Conditional Button Disabling */}
                                {app.status === "pending" ? (
                                    <>
                                        <button 
                                            onClick={() => handleAccept(app._id)}
                                            disabled={processing}
                                            className="accept-btn"
                                        >
                                            Accept
                                        </button>
                                        <button 
                                            onClick={() => handleReject(app._id)}
                                            disabled={processing}
                                            className="reject-btn"
                                        >
                                            Reject
                                        </button>
                                    </>
                                ) : (
                                    <span className="processed-text">
                                        Application {app.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ViewApplicants;