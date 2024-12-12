import { useState, useEffect } from "react";

const useUserInfoById = (userId) => {
  const [userById, setUserById] = useState(null);
  const [isFetchingUserById, setIsFetchingUserById] = useState(true);
  const [userByIdError, setUserByIdError] = useState(null);

  useEffect(() => {
    const fetchUserById = async () => {
      if (!userId) return; // Do nothing if userId is not provided
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch user details");
        }

        const data = await response.json();
        console.log("Fetched User Data:", data); // Add a debug log
        setUserById(data);
      } catch (error) {
        console.error("Error fetching user by ID:", error.message);
        setUserByIdError(error.message);
      } finally {
        setIsFetchingUserById(false);
      }
    };

    fetchUserById();
  }, [userId]);

  return { userById, isFetchingUserById, userByIdError };
};

export default useUserInfoById;
