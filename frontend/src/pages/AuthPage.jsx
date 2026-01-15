import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AuthPage = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect if already authenticated
    React.useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    // Get redirect location or default to dashboard
    const from = location.state?.from?.pathname || "/dashboard";

    const [step, setStep] = useState(1); // 1: Setup, 2: Login
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        projectId: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (error) setError(null);
    };

    const handleSetup = async (e) => {
        e.preventDefault();

        // No validation needed, just proceed to OAuth
        setStep(2);
    };

    const handleLogin = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Store project_id in sessionStorage for OAuth callback
            sessionStorage.setItem('oauth_project_id', formData.projectId);

            // Get OAuth authorization URL from backend
            const response = await authAPI.googleAuthorize(formData.projectId);
            const { authorization_url } = response.data;

            // Redirect to Google OAuth consent screen
            window.location.href = authorization_url;
        } catch (err) {
            console.error("OAuth initiation failed:", err);
            setError("Failed to connect to Google. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-electric-blue/10 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] pointer-events-none" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 mb-6 backdrop-blur-xl shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                        <span className="text-4xl">🛡️</span>
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">
                        Cloud RCA <span className="text-electric-blue">Assistant</span>
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 font-mono tracking-wide uppercase">
                        Automated SRE Intelligence Platform
                    </p>
                </div>
            </div>

            <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs font-mono flex items-start animate-pulse">
                            <svg className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {step === 1 && (
                        <form className="space-y-6 relative" onSubmit={handleSetup}>
                            <div>
                                <label htmlFor="projectId" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                                    GCP Project ID
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="projectId"
                                        name="projectId"
                                        type="text"
                                        required
                                        placeholder="project-id-xyz"
                                        className="appearance-none block w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl shadow-inner placeholder-gray-600 text-gray-200 focus:outline-none focus:ring-1 focus:ring-electric-blue focus:border-electric-blue sm:text-sm transition-all"
                                        value={formData.projectId}
                                        onChange={handleChange}
                                    />
                                </div>
                                <p className="mt-3 text-[10px] text-gray-500 font-mono">
                                    Recommended: <span className="bg-white/5 px-1.5 py-0.5 rounded text-gray-300 border border-white/5">project-e2bcb697-e160-439a-a3c</span>
                                </p>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(0,180,255,0.2)] text-sm font-black text-black bg-electric-blue hover:bg-white hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric-blue transition-all uppercase tracking-wider"
                                >
                                    Initialize Setup
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 relative">
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-success-green/10 border border-success-green/20 mb-6 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                                    <svg className="h-8 w-8 text-success-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-white tracking-wide">Connection Ready</h3>
                                <p className="mt-2 text-xs text-gray-400 font-mono">
                                    Linking Project: <span className="text-electric-blue">{formData.projectId}</span>
                                </p>
                            </div>

                            <div className="bg-blue-500/10 border border-electric-blue/20 rounded-xl p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-electric-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <p className="text-xs text-blue-200 leading-relaxed">
                                            You will be redirected to Google for secure authentication. We only request read-only access to specific logging scopes.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleLogin}
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-[0_0_20px_rgba(0,180,255,0.2)] text-sm font-black text-black bg-electric-blue hover:bg-white hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric-blue transition-all uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <LoadingSpinner size="sm" className="text-black" />
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                                        </svg>
                                        Connect GCP Account
                                    </>
                                )}
                            </button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-3 bg-[#0f0f0f] text-gray-500 font-mono tracking-widest uppercase rounded border border-white/5">Internal Preview</span>
                                </div>
                            </div>

                            <button
                                onClick={async () => {
                                    setIsLoading(true);
                                    try {
                                        const res = await authAPI.demoLogin();
                                        login(res.data.token, res.data.user);
                                        navigate('/dashboard');
                                    } catch (err) {
                                        setError("Test account not configured in backend.");
                                    } finally {
                                        setIsLoading(false);
                                    }
                                }}
                                className="w-full flex justify-center py-3 px-4 border border-white/10 rounded-xl shadow-sm text-xs font-bold text-gray-400 bg-white/5 hover:bg-white/10 hover:text-white transition-all uppercase tracking-wider"
                            >
                                Test Account (Real GCP Deployment)
                            </button>

                            <button
                                onClick={() => setStep(1)}
                                className="w-full text-center text-xs text-gray-500 hover:text-electric-blue transition-colors font-mono mt-4"
                            >
                                &lt; Back to Configuration
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                        Secured by Google Identity Services
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
