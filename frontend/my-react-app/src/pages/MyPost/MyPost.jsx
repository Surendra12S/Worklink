import { useEffect, useState } from "react";
import API from "../../api.js";
import "./MyPost.css";
import { useNavigate } from "react-router-dom";

function MyPost() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyPosts = async () => {
            try {
                const response = await API.get("/api/requests/my-posts", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setPosts(response.data);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyPosts();
    }, []);

    if (loading) return <div className="loader">Loading your posts...</div>;

    return (
        <div className="my-posts-container">
            <h2>My Requests</h2>
            {posts.length === 0 ? (
                <div className="empty-state">
                    <p>No posts yet. Go create one!</p>
                </div>
            ) : (
                <div className="posts-grid">
                    {posts.map((post) => (
                        <div key={post._id} className="post-card">
                            <div className="card-header">
                                <h3>{post.title}</h3>
                                <span className={`status-badge ${post.status}`}>
                                    {post.status}
                                </span>
                            </div>
                            
                            <p className="category">Category: {post.category}</p>
                            <p className="location">📍 {post.location}</p>
                            
                            {/* FIXED: Changed 'req._id' to 'post._id' 
                               to match the variable name in .map()
                            */}
                            <button 
                                className="view-apps-btn"
                                onClick={() => navigate(`/my-posts/${post._id}/applications`)}
                            >
                                View Applications
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyPost;