import { useEffect, useState } from "react";
import API from "../../api.js";
import "./MyPost.css";

function MyPost() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

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
                <p>No posts yet. Go create one!</p>
            ) : (
                <div className="posts-grid">
                    {posts.map((post) => (
                        <div key={post._id} className="post-card">
                            <h3>{post.title}</h3>
                            <span className={`status-badge ${post.status}`}>
                                {post.status}
                            </span>
                            <p className="category">{post.category}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyPost;