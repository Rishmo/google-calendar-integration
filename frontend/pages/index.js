"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const eventColors = {
  birthday: "bg-pink-500",
  important: "bg-red-500",
  meeting: "bg-blue-500",
  other: "bg-green-500",
};

const eventEmojis = {
  birthday: "🎂",
  important: "🔔",
  meeting: "📅",
  other: "✨",
};

export default function Home() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", dateTime: "", location: "" });
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  const handleAddEvent = async () => {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });

    if (res.ok) {
      const event = await res.json();
      setEvents([...events, event]);
      setNewEvent({ title: "", dateTime: "", location: "" });
    }
  };

  const getEventType = (title) => {
    if (title.toLowerCase().includes("birthday")) return "birthday";
    if (title.toLowerCase().includes("important")) return "important";
    if (title.toLowerCase().includes("meeting")) return "meeting";
    return "other";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-black text-white flex flex-col items-center p-10">
      {/* Background Animation */}
      <motion.div
        className="absolute inset-0 z-[-1] bg-[url('/background.svg')] bg-cover bg-center opacity-30"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>

      {/* Header */}
      <h1 className="text-5xl font-extrabold mb-8 tracking-wide animate-pulse">
        📅 Google Calendar Events
      </h1>

      {/* Events Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {events.map((event) => {
          const type = getEventType(event.title);
          return (
            <motion.div
              key={event.id}
              className={`${eventColors[type]} p-4 rounded-xl shadow-xl cursor-pointer transition-transform transform hover:scale-105`}
              onClick={() => setSelectedEvent(event)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <h2 className="text-xl font-semibold flex items-center">
                {eventEmojis[type]} {event.title}
              </h2>
              <p className="text-gray-100">{event.dateTime}</p>
              {event.location && <p className="text-gray-300">@ {event.location}</p>}
            </motion.div>
          );
        })}
      </div>

      {/* Add Event Section */}
      <div className="mt-10 w-full max-w-lg bg-gray-800 p-6 rounded-xl shadow-lg">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 mb-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
        <input
          type="datetime-local"
          className="w-full p-2 mb-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={newEvent.dateTime}
          onChange={(e) => setNewEvent({ ...newEvent, dateTime: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          className="w-full p-2 mb-3 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={newEvent.location}
          onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
        />
        <motion.button
          className="w-full bg-purple-500 p-3 rounded-md text-white font-semibold hover:bg-purple-600 transition-all"
          onClick={handleAddEvent}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ➕ Add Event
        </motion.button>
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedEvent(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white text-black p-8 rounded-2xl shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            <h2 className="text-2xl font-bold mb-4">
              {eventEmojis[getEventType(selectedEvent.title)]} {selectedEvent.title}
            </h2>
            <p className="text-gray-700 mb-2">
              📅 {selectedEvent.dateTime}
            </p>
            {selectedEvent.location && (
              <p className="text-gray-500">📍 {selectedEvent.location}</p>
            )}
            <button
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
              onClick={() => setSelectedEvent(null)}
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
