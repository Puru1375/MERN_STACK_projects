import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DashBoradPage = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const auth = localStorage.getItem("token");
        if (!auth) {
          navigate("/login");
          return;
        }

        const res = await axios.post("http://localhost:5000/dashboard", {
          token: auth,
        });

        setUser(res.data.user);
        setLoading(false);
      } catch (error) {
        console.error("Dashboard error:", error);
        setLoading(false);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    

    fetchUserData();
  }, [navigate]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">
                Placement Preparation Tracker
              </h1>
            </div>
            <div className="flex items-center">
              {user.role === "student" && (
                <div>
                  <button
                    className="mr-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={() => navigate("/apply-jobs")}
                  >
                    ApplyJobs
                  </button>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center">
            <div className="text-lg text-gray-600">Loading...</div>
          </div>
        ) : (
          <div>
            {user.role === "student" && (
              <div>
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4">
                    Student Dashboard
                  </h2>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Name: <span className="text-gray-900">{user.name}</span>
                    </p>
                    <p className="text-gray-600">
                      Email: <span className="text-gray-900">{user.email}</span>
                    </p>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total Applications
                            </dt>
                            <dd className="flex items-baseline">
                              <div className="text-2xl font-semibold text-gray-900">
                                {count}
                              </div>
                              <div className="ml-2 text-sm font-medium text-gray-500">
                                jobs applied
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                      <div className="text-sm">
                        <button
                          onClick={() => navigate('/jobs')}
                          className="font-medium text-blue-600 hover:text-blue-900"
                        >
                          View all available jobs
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {user.role === "company" && (
              <div>
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4">
                    Company Dashboard
                  </h2>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Name: <span className="text-gray-900">{user.name}</span>
                    </p>
                    <p className="text-gray-600">
                      Email: <span className="text-gray-900">{user.email}</span>
                    </p>
                  </div>
                </div>
                <button
                  className="mt-4 px-4 py-2 w-80 h-40 bg-blue-400 rounded-lg text-white hover:bg-blue-500"
                  onClick={() => navigate("/post-job")}
                >
                  Post a Job
                </button>
              </div>
            )}
            {user.role === "tpo" && (
              <div>
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-4">TPO Dashboard</h2>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Name: <span className="text-gray-900">{user.name}</span>
                    </p>
                    <p className="text-gray-600">
                      Email: <span className="text-gray-900">{user.email}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
            {!user.role && (
              <div className="text-center text-red-600">
                <p>Role not assigned</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashBoradPage;
