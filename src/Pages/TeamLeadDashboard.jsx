import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../Pages-Css/TeamLeadDashboard.css";
import { getWorkspaceSummary } from "../services/api";

const TeamLeadDashboard = () => {
    const { workspaceId } = useParams();
    const [workspace, setWorkspace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchWorkspace = async () => {
            try {
                const response = await getWorkspaceSummary(workspaceId);
                if (response.success) {
                    setWorkspace(response.data);
                }
            } catch (err) {
                console.error("❌ Error fetching workspace:", err);
                setError("Failed to load workspace data");
            } finally {
                setLoading(false);
            }
        };

        if (workspaceId) {
            fetchWorkspace();
        }
    }, [workspaceId]);

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full"></div>
                <p className="font-bold tracking-tight">Loading your workspace...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-900 dark:text-white p-6">
            <div className="max-w-md w-full bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-card border border-red-100 dark:border-red-900/30 text-center">
                <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
                <Link to="/" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors">
                    Go Back Home
                </Link>
            </div>
        </div>
    );

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-gray-100 antialiased h-screen flex overflow-hidden selection:bg-primary/20 selection:text-primary">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-surface-dark border-r border-border-light dark:border-border-dark flex-col hidden md:flex z-20 shadow-sm">
                <div className="h-16 flex items-center px-6 border-b border-border-light dark:border-border-dark">
                    <div className="flex items-center gap-2">
                        <div className="size-8 text-primary flex items-center justify-center bg-primary/10 rounded-lg">
                            <span className="material-symbols-outlined text-xl">layers</span>
                        </div>
                        <h2 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight">QuickTask</h2>
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    <div className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Workspace</div>
                    <Link className="flex items-center gap-3 px-3 py-2 text-slate-900 dark:text-white bg-slate-100 dark:bg-gray-800 rounded-lg transition-colors group border-l-4 border-primary" to="#">
                        <span className="material-symbols-outlined text-primary">dashboard</span>
                        <span className="font-bold text-sm">Dashboard</span>
                    </Link>
                    
                    <div className="mt-6 px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Team</div>
                    <Link className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-gray-800 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors group" to="#">
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">group</span>
                        <span className="font-medium text-sm">Members</span>
                        <span className="ml-auto bg-slate-100 dark:bg-gray-700 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{workspace?.developerCount || 0}</span>
                    </Link>
                </nav>
                <div className="p-4 border-t border-border-light dark:border-border-dark">
                    <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors text-left group">
                        <div className="size-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                            {workspace?.teamLeadName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'TL'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{workspace?.teamLeadName || 'Team Lead'}</p>
                            <p className="text-xs text-slate-500 truncate group-hover:text-primary transition-colors">Team Lead</p>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 text-lg">unfold_more</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full relative overflow-hidden">
                <header className="h-16 bg-white dark:bg-surface-dark border-b border-border-light dark:border-border-dark flex items-center justify-between px-6 z-10">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <div className="hidden sm:flex items-center text-sm text-slate-500">
                            <span className="hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer">Workspace</span>
                            <span className="material-symbols-outlined text-base mx-2 text-slate-400">chevron_right</span>
                            <span className="font-bold text-slate-900 dark:text-white">{workspace?.name || 'Overview'}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="relative hidden sm:block">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                            <input className="h-9 w-64 pl-10 pr-4 bg-slate-50 dark:bg-gray-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary placeholder:text-slate-400" placeholder="Search tasks, teammates..." type="text" />
                        </div>
                        <button className="size-9 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-full transition-colors relative">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <div className="h-8 w-px bg-slate-200 dark:bg-gray-700 mx-1 hidden sm:block"></div>
                        <button className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-xl">help</span>
                            <span className="hidden sm:inline">Support</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto relative bg-background-light dark:bg-background-dark">
                    <div className="fixed inset-0 bg-grid-pattern [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none z-0 opacity-60"></div>
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 md:p-12">
                        <div className="max-w-2xl w-full mx-auto flex flex-col items-center animate-scale-in">
                            <div className="mb-10 relative group">
                                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-700"></div>
                                <div className="relative w-72 h-64 mx-auto perspective-1000">
                                    <img alt="Empty State 3D Illustration" className="w-full h-full object-contain drop-shadow-2xl animate-float" src="https://lh3.googleusercontent.com/aida-public/AB6AXuACBS8xx7o5jDOLB8o2yDXIB4q15vGPfK93JKFDviLw3Lmey52m3EkAY6QegwwyvpbKoaAFems90W-fIW-vfscV1I6ECvkLFvpCACfgS-KcoVnOE6njtDrdMAShP9zOShQZv4fXTcsr374CvfCHiT-_AwuQt9j1gUvVD-557GY8iqMG9DZ1380nh374yguOQaq-dovD3-BqZR8BEs8V4xqjj9UYoB8DBeHDftW-b6f7qOgVCR2K0pQhCoHRcErIA6CjUZ_NUyLJY-KB" />
                                    <div className="absolute -right-4 top-10 bg-white dark:bg-surface-dark px-4 py-3 rounded-xl shadow-lg border border-slate-100 dark:border-gray-700 flex items-center gap-3 animate-float [animation-delay:1s]">
                                        <div className="flex -space-x-2">
                                            <div className="size-6 rounded-full bg-blue-100 border-2 border-white dark:border-surface-dark"></div>
                                            <div className="size-6 rounded-full bg-purple-100 border-2 border-white dark:border-surface-dark"></div>
                                        </div>
                                        <div className="h-2 w-12 bg-slate-100 rounded-full"></div>
                                    </div>
                                    <div className="absolute -left-6 bottom-12 bg-white dark:bg-surface-dark px-3 py-2 rounded-lg shadow-lg border border-slate-100 dark:border-gray-700 flex items-center gap-2 animate-float [animation-delay:2s]">
                                        <div className="size-8 bg-green-100 text-green-600 rounded-md flex items-center justify-center">
                                            <span className="material-symbols-outlined text-sm">check</span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="h-1.5 w-16 bg-slate-200 rounded-full"></div>
                                            <div className="h-1.5 w-10 bg-slate-100 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center space-y-4 max-w-lg mx-auto">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wide border border-blue-100 dark:border-blue-900/30">
                                    Get Started
                                </span>
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                                    It's quiet in here... too quiet
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
                                    Your dashboard is ready, {workspace?.teamLeadName || 'Team Lead'}, but a team lead needs a team. Add your developers to start tracking sprints, assigning tasks, and measuring velocity.
                                </p>
                            </div>
                            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                                <button className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98] transition-all duration-200 w-full sm:w-auto" type="button" onClick={() => alert("Add Developer Logic Here")}>
                                    <span className="material-symbols-outlined text-xl">person_add</span>
                                    Add Developer
                                    <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-hover:ring-white/30 transition-all pointer-events-none"></div>
                                </button>
                                <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200 w-full sm:w-auto" type="button" onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert("Invite link copied to clipboard!");
                                }}>
                                    <span className="material-symbols-outlined text-xl text-slate-400">link</span>
                                    Copy Invite Link
                                </button>
                            </div>
                            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-gray-800 w-full max-w-sm mx-auto">
                                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mb-2 font-medium uppercase tracking-widest">
                                    Quick Actions
                                </div>
                                <div className="flex justify-center gap-4">
                                    <Link className="text-sm text-slate-500 hover:text-primary transition-colors flex items-center gap-1" to="#">
                                        <span className="material-symbols-outlined text-base">upload_file</span> Import CSV
                                    </Link>
                                    <span className="text-slate-300">|</span>
                                    <Link className="text-sm text-slate-500 hover:text-primary transition-colors flex items-center gap-1" to="#">
                                        <span className="material-symbols-outlined text-base">settings</span> Team Settings
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Chat Widget */}
                <div className="absolute bottom-8 right-8 z-30 flex flex-col items-end gap-4 pointer-events-none">
                    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-200 dark:border-gray-700 w-72 overflow-hidden pointer-events-auto transform translate-y-2 opacity-0 hover:opacity-100 transition-all duration-300 origin-bottom-right group-hover:opacity-100 hover:translate-y-0" id="chat-preview">
                        <div className="bg-slate-900 p-3 px-4 flex justify-between items-center">
                            <h3 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                                <span className="size-2 bg-green-500 rounded-full animate-pulse"></span> Team Chat
                            </h3>
                        </div>
                        <div className="p-6 text-center bg-slate-50 dark:bg-gray-800/50 h-40 flex flex-col items-center justify-center">
                            <span className="material-symbols-outlined text-slate-300 text-3xl mb-2">forum</span>
                            <p className="text-xs text-slate-500 font-medium">No messages yet</p>
                            <button className="mt-3 text-[10px] font-bold text-primary hover:underline">Start a new topic</button>
                        </div>
                    </div>
                    <button className="pointer-events-auto h-14 w-14 bg-slate-900 hover:bg-slate-800 dark:bg-primary dark:hover:bg-primary-dark text-white shadow-lg shadow-slate-900/20 dark:shadow-primary/30 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group relative">
                        <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">chat_bubble</span>
                        <span className="absolute -top-1 -right-1 size-4 bg-red-500 border-2 border-white dark:border-surface-dark rounded-full flex items-center justify-center text-[9px] font-bold">1</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeamLeadDashboard;
