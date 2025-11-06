import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import UseAxiosSecure from "../hook/UseAxiosSecure";

const PaymentSuccess = () => {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const axiosSecure = UseAxiosSecure();

  // URL থেকে enrollmentId পড়ছি
  const enrollmentId = searchParams.get("enrollmentId");

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        // ✅ Backend API call করে payment confirm করা
        const res = await axiosSecure.post("/confirm-payment", { enrollmentId });

        if (res.data.success) {
          setStatus("success");
          setMessage("🎉 Payment successful! Your enrollment is now confirmed.");
        } else {
          setStatus("error");
          setMessage("Payment confirmation failed.");
        }
      } catch (err) {
        console.error("Confirm payment error:", err);
        setStatus("error");
        setMessage("Something went wrong while confirming payment.");
      }
    };

    if (enrollmentId) {
      confirmPayment();
    } else {
      setStatus("error");
      setMessage("Invalid enrollment ID in URL.");
    }
  }, [axiosSecure, enrollmentId]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
      <div className="bg-slate-800 p-10 rounded-2xl shadow-lg text-center">
        {status === "loading" && <p>⏳ Confirming your payment...</p>}
        {status === "success" && (
          <>
            <h1 className="text-3xl font-bold mb-4">Payment Successful ✅</h1>
            <p>{message}</p>
            <a
              href="/my-classes"
              className="mt-6 inline-block bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
            >
              Go to My Classes
            </a>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-3xl font-bold mb-4 text-red-400">Payment Failed ❌</h1>
            <p>{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
