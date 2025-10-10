import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    fetch("https://community.samzara.in/getUserByEmail.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email: user.email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.api_status === 200 && data.user_data?.avatar) {
          setAvatarUrl(`https://community.samzara.in/${data.user_data.avatar}`);
        }
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center text-center">
      <p className="text-6xl mb-4">Hello, {user?.name}</p>
     
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="w-40 h-40 rounded-full object-cover"
        />
    
    </div>
  );
};

export default Home;
