"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CheckoutPage() {
  const { id } = useParams(); // Resolve params dynamically
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`/api/cars/${id}`);
        if (!response.ok) throw new Error("Failed to fetch car details");
        const data = await response.json();
        setCar(data);
      } catch (error) {
        console.error("Error fetching car details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCarDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!car) {
    return <p>Car details not found.</p>;
  }

  return (
    <div>
      <h1>Checkout for {car.model}</h1>
      <p>Price: ${car.price}</p>
      <button
        onClick={async () => {
          try {
            const response = await fetch("/api/checkout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                carId: car._id,
                price: car.price,
                description: car.description,
                model: car.model,
                imageUrl: car.imageUrl,
              }),
            });

            const data = await response.json();
            if (response.ok) {
              window.location.href = data.url; // Redirect to Stripe Checkout
            } else {
              console.error("Checkout error:", data.error);
            }
          } catch (error) {
            console.error("Checkout error:", error);
          }
        }}
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
