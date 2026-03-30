import React, { useState, useEffect } from 'react';
import { DashboardAPI } from '../../common/services/apiClient';
import { useDebounce } from '../../common/hooks/useDebounce';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [previewMedia, setPreviewMedia] = useState(null);
 
  const debouncedSearch = useDebounce(search, 500);
 
  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await DashboardAPI.getUsers(page, 5, debouncedSearch);
      setUsers(res.data);
      setTotalPages(res.totalPages);
      setTotalRecords(res.total);
    } catch (error) {
      console.error('Failed to fetch user entries', error);
    }
    setLoading(false);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl p-8 md:p-12 w-full max-w-4xl mx-auto shadow-2xl">
      <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Dashboard</h2>
      <p className="text-slate-400 mb-8 leading-relaxed">View all registered users.</p>
      
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search by name or email address..." 
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); 
          }}
          className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
        />
      </div>

      <div className="flex justify-between items-center text-sm font-medium text-slate-400 mb-4 px-2">
        <span>{loading ? 'Refreshing database...' : `Found ${totalRecords} users`}</span>
      </div>

      <div className="w-full overflow-x-auto mt-4 border border-slate-700 rounded-2xl bg-slate-900/40 shadow-inner">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="bg-slate-800/80 px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">Full Name</th>
              <th className="bg-slate-800/80 px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">Email Address</th>
              <th className="bg-slate-800/80 px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">KYC Documents</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {users.length > 0 ? (
              users.map(u => (
                <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-slate-200 font-medium text-sm">{u.name}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{u.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {u.kycImageUrl ? (
                        <button onClick={() => setPreviewMedia({ type: 'image', url: u.kycImageUrl })} className="bg-slate-700/60 hover:bg-slate-600/80 border border-slate-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm">View Photo</button>
                      ) : ( 
                        <span className="text-slate-500 text-xs py-1.5 font-medium px-1">No Photo</span>
                      )}
                      {u.kycVideoUrl ? (
                        <button onClick={() => setPreviewMedia({ type: 'video', url: u.kycVideoUrl })} className="bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm">View Video</button>
                      ) : ( 
                        <span className="text-slate-500 text-xs py-1.5 font-medium px-1">No Video</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-10 text-slate-500 font-medium">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center py-6 mt-4 border-t border-slate-700/50">
        <button 
          onClick={handlePrev} 
          disabled={page === 1}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm ${page === 1 ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed border border-transparent' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'}`}
        >
          &larr; Previous
        </button>
        <span className="text-slate-400 font-medium text-sm">
          Page <span className="text-white mx-1">{page}</span> of <span className="text-white mx-1">{totalPages}</span>
        </span>
        <button 
          onClick={handleNext} 
          disabled={page === totalPages || totalPages === 0}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm ${page === totalPages || totalPages === 0 ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed border border-transparent' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'}`}
        >
          Next &rarr;
        </button>
      </div>

      {previewMedia && (
        <div 
          className="fixed inset-0 bg-slate-950/85 flex items-center justify-center z-[1000] p-4 backdrop-blur-md"
          onClick={() => setPreviewMedia(null)} 
        >
          <div 
            className="bg-slate-900 border border-slate-700 p-4 md:p-6 rounded-2xl max-w-4xl w-full relative shadow-[0_0_50px_rgba(0,0,0,0.8)]" 
            onClick={(e) => e.stopPropagation()} 
          >
            <button 
              onClick={() => setPreviewMedia(null)} 
              className="absolute -top-3 -right-3 md:top-4 md:right-4 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full w-8 min-w-8 h-8 min-h-8 flex items-center justify-center transition-colors shadow-lg z-10"
            >
              ✕
            </button>
            <div className="mt-4 md:mt-2 flex justify-center bg-black/50 rounded-xl overflow-hidden">
              {previewMedia.type === 'image' ? (
                <img src={previewMedia.url} alt="KYC Proof" className="max-w-full max-h-[75vh] object-contain rounded-xl" />
              ) : (
                <video src={previewMedia.url} controls autoPlay className="max-w-full max-h-[75vh] rounded-xl" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
