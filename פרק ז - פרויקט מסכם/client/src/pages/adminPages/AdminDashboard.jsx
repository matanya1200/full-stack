import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "chartjs-adapter-date-fns";
import Navbar from "../../components/Navbar";
import socketService from "../../services/socketService"; // ✅ use your service

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, Filler);

export default function AdminDashboard({ socket }) {
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [purchaseFeed, setPurchaseFeed] = useState([]);
  const [salesPoints, setSalesPoints] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!socket) {
      console.log("No socket yet, waiting...");
      setError("❌ שגיאה: אין חיבור לשרת או נתונים זמינים");
      return;
    }

    setError("");
    console.log("AdminDashboard useEffect fired with socket: ", socketService.socket);
    // 🔴 Listen for events via socketService
    const appSocket = socket;

    const handleOnlineUsers = (data) => {
      console.log("received users notify!");
      setOnlineUsers(data.users);
    }

    // Helper to group sales by hour
    const groupSalesByHour = (feed) => {
      const counts = {};
      feed.forEach((p) => {
        const hour = new Date(p.time);
        hour.setMinutes(0, 0, 0);
        const key = hour.getTime();
        counts[key] = (counts[key] || 0) + 1;
      });
      // Convert to Chart.js format
      return Object.entries(counts).map(([x, y]) => ({ x: Number(x), y }));
    };

    const handlePurchaseFeedBulk = (feed) => {
      console.log("received feed bulk: ", feed);
      setPurchaseFeed(feed);
      setSalesPoints(groupSalesByHour(feed));
      if ((!feed || feed.length === 0) && (!onlineUsers || onlineUsers === 0)) {
        setError("ℹ️ אין נתונים זמינים על משתמשים או מכירות");
      }
    };

    const handlePurchaseFeed = (purchase) => {
      setPurchaseFeed((prev) => [purchase, ...prev]);
      setSalesPoints((_) => {
        // Add new purchase to previous feed and regroup
        const updatedFeed = [purchase, ...purchaseFeed];
        return groupSalesByHour(updatedFeed);
      });
    };

    console.log("loading listeners...");

    appSocket.on("onlineUsers", handleOnlineUsers);
    const onlineUsersInit = JSON.parse(sessionStorage.getItem('onlineUsers') || '{"users":0}');
    handleOnlineUsers(onlineUsersInit);
    //appSocket.on("purchaseFeedBulk", handlePurchaseFeedBulk);
    const feedBulk = JSON.parse(sessionStorage.getItem('purchaseFeed') || "[]");
    handlePurchaseFeedBulk(feedBulk);
    appSocket.on("purchaseFeed", handlePurchaseFeed);

    return () => {
      appSocket.off("onlineUsers", handleOnlineUsers);
      //appSocket.off("purchaseFeedBulk", handlePurchaseFeedBulk);
      appSocket.off("purchaseFeed", handlePurchaseFeed);
    };
  }, [socket]);

  // Chart.js data
  const chartData = {
    datasets: [
      {
        label: "מכירות (לשעה)",
        data: salesPoints,
        parsing: false,
        borderWidth: 2,
        fill: false,
        tension: 0,
        borderColor: "blue",
        backgroundColor: "rgba(0,123,255,0.2)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    animation: false,
    scales: {
      x: {
        type: "time",
        time: { unit: "hour" },
        min: '2025-08-16 00:00:00',
      },
      y: {
        beginAtZero: true,
        suggestedMax: 5,
        ticks: { precision: 0 },
      },
    },
  };

  return (
    <>
      <Navbar />
      <div className="container my-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="mb-0">📊 מעקב מכירות</h2>
          <span className="badge bg-primary fs-6">
            משתמשים מחוברים: {onlineUsers}
          </span>
        </div>

        {error && (
          <div className="alert alert-danger text-center">
            {error}
          </div>
        )}

        <div className="card mb-4">
          <div className="card-header">גרף מכירות מתעדכן</div>
          <div className="card-body">
            <Line data={chartData} options={chartOptions} height={80} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">מכירות אחרונות</div>
          <ul className="list-group list-group-flush">
            {purchaseFeed.length === 0 && (
              <li className="list-group-item text-muted">לא התבצעו מכירות</li>
            )}
            {purchaseFeed.map((p, idx) => (
              <li key={idx} className="list-group-item">
                <div className="d-flex justify-content-between">
                  <div>
                    <span className="me-2">🛒</span>
                    <strong>{p.buyer}</strong> ביצע/ה הזמנה{" "}
                    <span className="text-muted">#{p.orderId}</span>{" "}
                    <span className="ms-2">במחיר כולל: ₪{Number(p.total).toFixed(2)}</span>
                  </div>
                  <small className="text-nowrap">
                    {new Date(p.time).toLocaleTimeString()}
                  </small>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
