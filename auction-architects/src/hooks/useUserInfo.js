import { useState, useEffect } from "react";

const useUserInfo = (user) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user?.sub) return; // Ensure user.sub is available before making the request

      try {
        const response = await fetch(`/api/users/${user.sub}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch user info");
        }

        const data = await response.json();
        setUserInfo(data);
      } catch (err) {
        console.error("Error fetching user info:", err.message);
        setFetchError(err.message); // Store the fetch error
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchUserInfo();
  }, [user]);

  return { userInfo, isLoadingData, fetchError };
};

export default useUserInfo;
