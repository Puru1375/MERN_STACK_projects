import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const JobDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const res = await axios.get(`http://localhost:5000/dashboard/jobs/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setJob(res.data.job);
            } catch (error) {
                console.error('Error fetching job details:', error);
                setError('Failed to load job details');
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [id, navigate]);

    const handleApply = async () => {
        try {
            setApplying(true);
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/dashboard/jobs/${id}/apply`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/dashboard');
        } catch (error) {
            setError(error.response?.data?.message );
            
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading job details...</div>
            </div>
        );
    }

  


    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate('/jobs')}
                                className="flex items-center text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Jobs
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="py-8">
                
                {!job && (
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center text-gray-600">
                            Job details not available.
                        </div>
                    </div>
                )}
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                                    <p className="mt-1 text-lg text-gray-800">{job.createdBy.name}</p>
                                </div>
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold bg-green-100 text-green-800">
                                    {job.salary} LPA
                                </span>
                            </div>

                            <div className="mt-6">
                                <h2 className="text-lg font-semibold text-gray-900">Job Description</h2>
                                <p className="mt-2 text-gray-600 whitespace-pre-line">{job.description}</p>
                            </div>

                            <div className="mt-6">
                                <h2 className="text-lg font-semibold text-gray-900">Required Skills</h2>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {job.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <h2 className="text-sm font-medium text-gray-500">Location</h2>
                                    <p className="mt-1 text-lg text-gray-900">{job.location}</p>
                                </div>
                                <div>
                                    <h2 className="text-sm font-medium text-gray-500">Experience Required</h2>
                                    <p className="mt-1 text-lg text-gray-900">{job.experience} years</p>
                                </div>
                                <div>
                                    <h2 className="text-sm font-medium text-gray-500">Minimum CGPA Required</h2>
                                    <p className="mt-1 text-lg text-gray-900">{job.CGPA}</p>
                                </div>
                                <div>
                                    <h2 className="text-sm font-medium text-gray-500">Application Deadline</h2>
                                    <p className="mt-1 text-lg text-gray-900">
                                        {new Date(job.applicationDeadline).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {error && (
                                <div className="mt-6 p-4 bg-red-50 rounded-md">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            )}

                            <div className="mt-8 flex justify-center">
                                <button
                                    onClick={handleApply}
                                    disabled={applying}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                                >
                                    {applying ? 'Applying...' : 'Apply for this Position'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default JobDetailsPage;
