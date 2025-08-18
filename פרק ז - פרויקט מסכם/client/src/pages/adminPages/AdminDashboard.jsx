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

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, Filler);

export default function AdminDashboard({ socket }) {
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [purchaseFeed, setPurchaseFeed] = useState([]);
  const [salesPoints, setSalesPoints] = useState([]);
  const [error, setError] = useState("");
  const [timeUnit, setTimeUnit] = useState("hour");
  const [minDate, setMinDate] = useState("");
  
  // Regroup sales points when timeUnit or purchaseFeed changes
  useEffect(() => {
    setSalesPoints(groupSalesByUnit(purchaseFeed, timeUnit));
  }, [timeUnit, purchaseFeed]);

  useEffect(() => {
    if (!socket) {
      setError("❌ שגיאה: אין חיבור לשרת או נתונים זמינים");
      return;
    }

    setError("");
    // 🔴 Listen for events via socketService
    const appSocket = socket;

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

  

    const handleOnlineUsers = (data) => {
      setOnlineUsers(data.users);
    }

    // Helper to group sales by selected time unit
    const groupSalesByUnit = (feed, unit) => {
      const counts = {};
      feed.forEach((p) => {
        const date = new Date(p.time);
        let key;
        if (unit === "hour") {
          date.setMinutes(0, 0, 0);
          key = date.getTime();
        } else if (unit === "day") {
          date.setHours(0, 0, 0, 0);
          key = date.getTime();
        } else if (unit === "week") {
          // Set to start of week (Sunday)
          const day = date.getDay();
          date.setDate(date.getDate() - day);
          date.setHours(0, 0, 0, 0);
          key = date.getTime();
        } else if (unit === "month") {
          date.setDate(1);
          date.setHours(0, 0, 0, 0);
          key = date.getTime();
        }
        counts[key] = (counts[key] || 0) + 1;
      });
      return Object.entries(counts).map(([x, y]) => ({ x: Number(x), y }));
    };

    const handlePurchaseFeedBulk = (feed) => {
      setPurchaseFeed(feed);
      setSalesPoints(groupSalesByUnit(feed, timeUnit));
      if ((!feed || feed.length === 0) && (!onlineUsers || onlineUsers === 0)) {
        setError("ℹ️ אין נתונים זמינים על משתמשים או מכירות");
      }
    };

    const handlePurchaseFeed = (purchase) => {
      setPurchaseFeed((prev) => [purchase, ...prev]);
      setSalesPoints((_) => {
        // Add new purchase to previous feed and regroup
        const updatedFeed = [purchase, ...purchaseFeed];
        return groupSalesByUnit(updatedFeed, timeUnit);
      });
    };

  // Chart.js data
  const chartData = {
    datasets: [
      {
        label: `מכירות (${timeUnit === "hour" ? "לשעה" : timeUnit === "day" ? "ליום" : timeUnit === "week" ? "לשבוע" : "לחודש"})`,
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
        time: { unit: timeUnit },
        min: minDate ? new Date(minDate).toISOString() : undefined,
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

        <div className="mb-3">
          <label className="me-2 ms-2">יחידת זמן לגרף:</label>
          <select
            value={timeUnit}
            onChange={e => setTimeUnit(e.target.value)}
            className="form-select w-auto d-inline"
          >
            <option value="hour">שעה</option>
            <option value="day">יום</option>
            <option value="week">שבוע</option>
            <option value="month">חודש</option>
          </select>
          <label className="ms-2 me-2">תאריך מינימלי:</label>
          <input
            type="date"
            value={minDate}
            onChange={e => setMinDate(e.target.value)}
            className="form-control w-auto d-inline"
            min="2000-01-01"
            max={new Date().toISOString().slice(0,10)}
          />
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
