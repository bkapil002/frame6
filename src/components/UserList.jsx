import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Check, X, Users, AlertCircle } from "lucide-react";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("http://localhost:5000/api/users/alluser", {
        withCredentials: true,
      });
      // Sort users alphabetically by name (case-insensitive)
      const sortedUsers = (res.data.users || []).sort((a, b) => 
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      setUsers(sortedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/deleteuser/${id}`, {
          withCredentials: true,
        });
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  // Handle edit
  const handleEdit = (user) => {
    setEditUser(user._id);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/updateuser/${id}`,
        { name: editName, email: editEmail },
        { withCredentials: true }
      );
      setEditUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  const handleCancel = () => {
    setEditUser(null);
    setEditName("");
    setEditEmail("");
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent" style={{ borderColor: '#2A2A72', borderTopColor: 'transparent' }}></div>
          <p className="mt-4 text-gray-600 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br  py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#2A2A72' }}>
              <Users className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
              <p className="text-gray-500 mt-1">Manage and edit user information</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-red-500" size={24} />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* User Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-white" style={{ background: 'linear-gradient(to right, #2A2A72, #1f1f58)' }}>
                  <th className="py-4 px-6 text-left font-semibold">#</th>
                  <th className="py-4 px-6 text-left font-semibold">Name</th>
                  <th className="py-4 px-6 text-left font-semibold">Email</th>
                  <th className="py-4 px-6 text-left font-semibold">Created At</th>
                  <th className="py-4 px-6 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    className="hover:bg-purple-50 transition-colors duration-150"
                  >
                    <td className="py-4 px-6 text-gray-700 font-medium">
                      {index + 1}
                    </td>

                    {/* Editable name cell */}
                    <td className="py-4 px-6">
                      {editUser === user._id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="border-2 outline-none px-3 py-2 rounded-lg w-full transition-colors"
                          style={{ borderColor: '#2A2A72' }}
                          placeholder="Enter name"
                        />
                      ) : (
                        <span className="text-gray-800 font-medium">{user.name}</span>
                      )}
                    </td>

                    {/* Editable email cell */}
                    <td className="py-4 px-6">
                      {editUser === user._id ? (
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="border-2 outline-none px-3 py-2 rounded-lg w-full transition-colors"
                          style={{ borderColor: '#2A2A72' }}
                          placeholder="Enter email"
                        />
                      ) : (
                        <span className="text-gray-600">{user.email}</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-gray-600 text-sm">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        {editUser === user._id ? (
                          <>
                            <button
                              onClick={() => handleUpdate(user._id)}
                              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                              title="Save changes"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                              title="Cancel"
                            >
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(user)}
                              className="text-white p-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                              style={{ backgroundColor: '#2A2A72' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1f1f58'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2A2A72'}
                              title="Edit user"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                              title="Delete user"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && !loading && (
                  <tr>
                    <td colSpan="5" className="py-12 text-center">
                      <Users className="mx-auto text-gray-300 mb-3" size={48} />
                      <p className="text-gray-500 text-lg">No users found.</p>
                      <p className="text-gray-400 text-sm mt-1">
                        Users will appear here once they're added.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {users.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                Total Users: <span className="font-semibold text-gray-800">{users.length}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;