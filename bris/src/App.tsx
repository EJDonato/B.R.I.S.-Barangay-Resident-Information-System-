import { useState } from 'react'
import { X } from 'lucide-react'
import Header from './components/header'
import ResidentCard from './components/ResidentCard'
import { mockResidents } from './data/mockResidents'
import { Resident } from './types'

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);

  const filteredResidents = mockResidents.filter(resident =>
    resident.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col'>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8">
        {searchQuery ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResidents.length > 0 ? (
              filteredResidents.map(resident => (
                <div 
                  key={resident.id} 
                  onClick={() => setSelectedResident(resident)}
                  className="cursor-pointer transform hover:-translate-y-1 transition-transform duration-300"
                >
                  <ResidentCard resident={resident} />
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
                <div className="bg-gray-100 p-6 rounded-full mb-4">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xl font-medium">No residents found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <h3 className="text-3xl font-bold text-green-800 mb-4 tracking-tight">Welcome to B.R.I.S</h3>
            <p className="text-gray-600 max-w-md text-lg leading-relaxed">
              Scan through the Barangay Resident database. Type a name above to get started.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl shadow-sm border border-green-100 flex items-center gap-4 min-w-[200px]">
                <div className="bg-green-100 p-3 rounded-2xl text-green-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-400 uppercase font-black tracking-widest">Residents</p>
                  <p className="text-2xl font-black text-gray-800">{mockResidents.length}</p>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl shadow-sm border border-blue-100 flex items-center gap-4 min-w-[200px]">
                <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-400 uppercase font-black tracking-widest">Security</p>
                  <p className="text-2xl font-black text-gray-800">Verified</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Resident Detail Modal */}
      {selectedResident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedResident(null)}
          ></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
            <div className="absolute top-4 right-4 z-10">
              <button 
                onClick={() => setSelectedResident(null)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="max-h-[85vh] overflow-y-auto">
              <ResidentCard resident={selectedResident} />
              <div className="p-6 pt-0 border-t border-gray-100 mt-6 bg-gray-50 flex justify-end">
                <button 
                  onClick={() => setSelectedResident(null)}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-200"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      <footer className="py-6 text-center text-gray-400 text-sm border-t border-gray-100 bg-white/30">
        &copy; 2026 Barangay Resident Information System. All Rights Reserved.
      </footer>
    </div>
  );
}


export default App
