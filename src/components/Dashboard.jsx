import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { name } = useParams(); // 👈 get `name` not `email`
  const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

  const { user, login } = useAuth(); // get user from context

  useEffect(() => {
    if (!name) {
      setError("No name provided in URL");
      setLoading(false);
      return;
    }

    const doLogin = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/users/auth/${encodeURIComponent(name)}`,
          {
            method: "GET",
            credentials: "include", // ✅ allow cookies
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Authentication failed");
        }

        // ✅ Save user in context (global state)
        login({ ...data.user, token: data.token });

        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    doLogin();
  }, [name, login]);

  // ✅ UI states
  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>❌ {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>✅ Logged in as {user?.name || user?.email}</h1>
      {user?.imageUrls && (
        <img
          src={user.imageUrls}
          alt="profile"
          width={100}
          style={{ borderRadius: "50%" }}
        />
      )}
    </div>
  );
}
