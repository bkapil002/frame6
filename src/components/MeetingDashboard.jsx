import React, { useState, useEffect } from "react";
import { Trash2,Users } from "lucide-react";

export default function MeetingDashboard() {
  const [activeTab, setActiveTab] = useState("meeting");
  const [meetings, setMeetings] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [removedUsers, setRemovedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/agora/allmeeting", { method: "POST" });
      const data = await res.json();
      setMeetings(data.data || []);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
    setLoading(false);
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/attendance/allattendance", { method: "POST" });
      const data = await res.json();
      setAttendance(data.data || []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
    setLoading(false);
  };

  const fetchRemoved = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/removeduser/allRemovedUser", { method: "POST" });
      const data = await res.json();
      setRemovedUsers(data.data || []);
    } catch (error) {
      console.error("Error fetching removed users:", error);
    }
    setLoading(false);
  };

  const deleteMeeting = async (id) => {
    if (window.confirm("Are you sure you want to delete this meeting?")) {
      await fetch(`http://localhost:5000/api/agora/meetingdelete/${id}`, { method: "DELETE" });
      fetchMeetings();
    }
  };

  const deleteAttendance = async (id) => {
    if (window.confirm("Are you sure you want to delete this attendance record?")) {
      await fetch(`http://localhost:5000/api/attendance/deleteattendance/${id}`, { method: "DELETE" });
      fetchAttendance();
    }
  };

  const deleteRemovedUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      await fetch(`http://localhost:5000/api/removeduser/deleteRemovedUser/${id}`, { method: "DELETE" });
      fetchRemoved();
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

 
  
  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const formatDateTime = (d) => new Date(d).toLocaleString("en-GB");

  const TButton = ({ onClick, children, active }) => (
    <button
      onClick={onClick}
      className={`relative px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
        active
          ? "bg-[#2A2A72] text-white shadow-lg scale-105"
          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
      }`}
    >
      {children}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-b-lg"></div>
      )}
    </button>
  );

  const DeleteButton = ({ onClick }) => (
    <button
      onClick={onClick}
      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
      title="Delete"
    >
      <Trash2 size={18} />
    </button>
  );

  const Badge = ({ children, color = "blue" }) => {
    const colors = {
      blue: "bg-[#2A2A72] bg-opacity-10 text-[#2A2A72]",
      green: "bg-green-100 text-green-700",
      orange: "bg-orange-100 text-orange-700"
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[color]}`}>
        {children}
      </span>
    );
  };

  return (
    <div className="min-h-screen  py-8 px-4 ">
      {/* Header */}
     <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#2A2A72' }}>
              <Users className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Meeting Dashboard</h1>
              <p className="text-gray-500 mt-1">Manage meetings, attendance, and block user </p>
            </div>
          </div>
        </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="flex gap-3 overflow-x-scroll bg-white p-2 rounded-xl shadow-sm">
          <TButton
            onClick={() => {
              setActiveTab("meeting");
              fetchMeetings();
            }}
            active={activeTab === "meeting"}
          >
            Meetings ({meetings.length})
          </TButton>

          <TButton
            onClick={() => {
              setActiveTab("attendance");
              fetchAttendance();
            }}
            active={activeTab === "attendance"}
          >
            Attendance ({attendance.length})
          </TButton>

          <TButton
            onClick={() => {
              setActiveTab("removed");
              fetchRemoved();
            }}
            active={activeTab === "removed"}
          >
            Block Users ({removedUsers.length})
          </TButton>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#2A2A72]"></div>
          </div>
        )}

        {/* MEETING TABLE */}
        {activeTab === "meeting" && !loading && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#2A2A72] text-white">
                    <th className="p-4 text-left font-medium">#</th>
                    <th className="p-4 text-left font-medium">Name</th>
                    <th className="p-4 text-left font-medium">Email</th>
                    <th className="p-4 text-left font-medium">Type</th>
                    <th className="p-4 text-left font-medium">Date</th>
                    <th className="p-4 text-left font-medium">Time</th>
                    <th className="p-4 text-left font-medium">Repeat</th>
                    <th className="p-4 text-left font-medium">Created</th>
                    <th className="p-4 text-center font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {meetings.map((m, index) => (
                    <tr
                      key={m._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 text-gray-500 font-medium">{index + 1}</td>
                      <td className="p-4 text-gray-900 font-medium">{m.user?.name}</td>
                      <td className="p-4 text-gray-600">{m.user?.email}</td>
                      <td className="p-4">
                        <Badge color="">{m.meetingType}</Badge>
                      </td>
                      <td className="p-4 text-gray-600">{formatDate(m.meetingDate)}</td>
                      <td className="p-4 text-gray-600">{m.meetingTime}</td>
                      <td className="p-4">
                        <Badge color="green">{m.meetingRepeat}</Badge>
                      </td>
                      <td className="p-4 text-gray-600">{formatDate(m.createdAt)}</td>
                      <td className="p-4 text-center">
                        <DeleteButton onClick={() => deleteMeeting(m._id)} />
                      </td>
                    </tr>
                  ))}
                  {meetings.length === 0 && (
                    <tr>
                      <td colSpan="9" className="p-12 text-center text-gray-500">
                        No meetings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ATTENDANCE TABLE */}
        {activeTab === "attendance" && !loading && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#2A2A72] text-white">
                    <th className="p-4 text-left font-medium">#</th>
                    <th className="p-4 text-left font-medium">Name</th>
                    <th className="p-4 text-left font-medium">User ID</th>
                    <th className="p-4 text-left font-medium">Email</th>
                    <th className="p-4 text-left font-medium">Type</th>
                    <th className="p-4 text-left font-medium">Meeting ID</th>
                    <th className="p-4 text-left font-medium">Join Time</th>
                    <th className="p-4 text-left font-medium">Leave Time</th>
                    <th className="p-4 text-left font-medium">Created</th>
                    <th className="p-4 text-center font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((a, index) => (
                    <tr
                      key={a._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 text-gray-500 font-medium">{index + 1}</td>
                      <td className="p-4 text-gray-900 font-medium">{a.name}</td>
                      <td className="p-4 text-gray-600">{a.userId}</td>
                      <td className="p-4 text-gray-600">{a.email}</td>
                      <td className="p-4">
                        <Badge color="blue">{a.meetingType}</Badge>
                      </td>
                      <td className="p-4 text-gray-600">{a.meetingId}</td>
                      <td className="p-4 text-gray-600">{formatDateTime(a.joinTime)}</td>
                      <td className="p-4 text-gray-600">
                        {a.leaveTime ? formatDateTime(a.leaveTime) : (
                          <Badge color="orange">Active</Badge>
                        )}
                      </td>
                      <td className="p-4 text-gray-600">{formatDate(a.createdAt)}</td>
                      <td className="p-4 text-center">
                        <DeleteButton onClick={() => deleteAttendance(a._id)} />
                      </td>
                    </tr>
                  ))}
                  {attendance.length === 0 && (
                    <tr>
                      <td colSpan="10" className="p-12 text-center text-gray-500">
                        No attendance records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REMOVED USER TABLE */}
        {activeTab === "removed" && !loading && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#2A2A72] text-white">
                    <th className="p-4 text-left font-medium">#</th>
                    <th className="p-4 text-left font-medium">Name</th>
                    <th className="p-4 text-left font-medium">Meeting Type</th>
                    <th className="p-4 text-left font-medium">Admin</th>
                    <th className="p-4 text-left font-medium">Created</th>
                    <th className="p-4 text-center font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {removedUsers.map((r, index) => (
                    <tr
                      key={r._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 text-gray-500 font-medium">{index + 1}</td>
                      <td className="p-4 text-gray-900 font-medium">{r.name}</td>
                      <td className="p-4">
                        <Badge color="blue">{r.meetingType}</Badge>
                      </td>
                      <td className="p-4 text-gray-600">{r.adminName}</td>
                      <td className="p-4 text-gray-600">{formatDate(r.createdAt)}</td>
                      <td className="p-4 text-center">
                        <DeleteButton onClick={() => deleteRemovedUser(r._id)} />
                      </td>
                    </tr>
                  ))}
                  {removedUsers.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-12 text-center text-gray-500">
                        No removed users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}