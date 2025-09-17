import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import API from "../api/api";

export default function Profile() {
  const { user, login } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({ current: "", newPassword: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);


  useEffect(() => {
    if (user) setFormData({ name: user.name, email: user.email });
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [user]);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!formData.name || !formData.email) return alert("All fields are required");
    setIsSaving(true);
    try {
      const res = await API.put("/auth/update-profile", formData);
      login(res.data);
      alert("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.current || !passwordData.newPassword)
      return alert("All fields are required");
    setIsChangingPassword(true);
    try {
      await API.put("/auth/change-password", passwordData);
      alert("Password changed successfully");
      setPasswordData({ current: "", newPassword: "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-indigo-500 border-r-purple-500 border-b-pink-500 border-l-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Not Logged In</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your profile</p>
          <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:-translate-y-0.5 shadow-md">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Profile</h1>
        <p className="text-gray-600 mb-8">Manage your account information</p>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold backdrop-blur-sm">
                {formData.name.charAt(0).toUpperCase()}
              </div>
              <div className="ml-6 flex flex-col">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="text-2xl font-bold text-gray-900 rounded p-1 mb-1"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="text-indigo-900 rounded p-1"
                    />
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold">{formData.name}</h2>
                    <p className="text-indigo-100">{formData.email}</p>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={isEditing ? handleSaveProfile : handleEditToggle}
              disabled={isSaving}
              className={`px-5 py-2 rounded-lg text-white font-medium ${isEditing ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                } transition-colors`}
            >
              {isEditing ? (isSaving ? "Saving..." : "Save") : "Edit Profile"}
            </button>
          </div>

          {/* Password Change */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Change Password</h3>
              <div className="flex flex-col space-y-2">
                <input
                  type="password"
                  name="current"
                  placeholder="Current Password"
                  value={passwordData.current}
                  onChange={handlePasswordChange}
                  className="p-2 border rounded"
                />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="p-2 border rounded"
                />
                <button
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
                >
                  {isChangingPassword ? "Changing..." : "Change Password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
