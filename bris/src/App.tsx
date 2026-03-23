import { useState, useEffect } from 'react'
import { X, UserPlus, SearchCheck, Download, Upload } from 'lucide-react'
import Header from './components/header'
import ResidentCard from './components/ResidentCard'
import AddResidentModal from './components/AddResidentModal'
import AddTransactionModal from './components/AddTransactionModal'
import { Resident } from './types'

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [residents, setResidents] = useState<Resident[]>([]);
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transactionTarget, setTransactionTarget] = useState<{id: string, name: string} | null>(null);

  const fetchResidents = async () => {
    try {
      const data = searchQuery 
        ? await (window as any).ipcRenderer.db.searchResidents(searchQuery)
        : await (window as any).ipcRenderer.db.getResidents();
      setResidents(data);
      
      // Update selected resident if modal is open to reflect new transactions
      if (selectedResident) {
        const updatedSelected = data.find((r: Resident) => r.id === selectedResident.id);
        if (updatedSelected) setSelectedResident(updatedSelected);
      }
    } catch (error) {
      console.error('Failed to fetch residents:', error);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, [searchQuery]);

  const handleAddResident = async (formData: any) => {
    try {
      await (window as any).ipcRenderer.db.addResident(formData);
      setIsAddModalOpen(false);
      fetchResidents();
    } catch (error) {
      console.error('Failed to add resident:', error);
    }
  };

  const handleAddTransaction = async (formData: any) => {
    try {
      await (window as any).ipcRenderer.db.addTransaction(formData);
      setTransactionTarget(null);
      fetchResidents();
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  const handleBackup = async () => {
    try {
      const success = await (window as any).ipcRenderer.db.backup();
      if (success) {
        alert('Database backup created successfully!');
      }
    } catch (error) {
      console.error('Backup failed:', error);
      alert('Failed to backup database.');
    }
  };

  const handleRestore = async () => {
    if (confirm('Are you sure you want to restore? This will replace your current database.')) {
      try {
        const success = await (window as any).ipcRenderer.db.restore();
        if (success) {
          alert('Database restored successfully!');
          fetchResidents();
        }
      } catch (error) {
        console.error('Restore failed:', error);
        alert('Failed to restore database. Please check the file.');
      }
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col'>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8">
        <div className="mb-8 flex flex-col lg:flex-row justify-between lg:items-center gap-6">
          <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
            <SearchCheck className="w-8 h-8 text-green-600" />
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Recent Residents'}
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={handleBackup}
              title="Backup Database"
              className="flex items-center gap-2 bg-white border-2 border-emerald-200 hover:border-emerald-400 text-emerald-700 px-4 py-3 rounded-2xl font-bold transition-all shadow-sm active:scale-95"
            >
              <Download className="w-5 h-5" />
              Backup
            </button>
            <button 
              onClick={handleRestore}
              title="Restore Database"
              className="flex items-center gap-2 bg-white border-2 border-blue-200 hover:border-blue-400 text-blue-700 px-4 py-3 rounded-2xl font-bold transition-all shadow-sm active:scale-95"
            >
              <Upload className="w-5 h-5" />
              Restore
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-green-200 transition-all active:scale-95"
            >
              <UserPlus className="w-5 h-5" />
              Add New Resident
            </button>
          </div>
        </div>

        {residents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {residents.map(resident => (
              <div 
                key={resident.id} 
                onClick={() => setSelectedResident(resident)}
                className="cursor-pointer transform hover:-translate-y-1 transition-transform duration-300"
              >
                <ResidentCard 
                  resident={resident} 
                  onAddTransaction={(id) => setTransactionTarget({ id, name: resident.name })}
                />
              </div>
            ))}
          </div>
        ) : (
          searchQuery ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <X className="w-12 h-12" />
              </div>
              <p className="text-xl font-medium">No residents found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <h3 className="text-3xl font-bold text-green-800 mb-4 tracking-tight">System Ready</h3>
              <p className="text-gray-600 max-w-md text-lg leading-relaxed">
                Your database is empty. Start by adding your first barangay resident to the system.
              </p>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="mt-8 flex items-center gap-3 bg-white border-2 border-green-600 text-green-700 hover:bg-green-50 px-8 py-4 rounded-3xl font-black transition-all shadow-xl shadow-green-100"
              >
                <UserPlus className="w-6 h-6" />
                Initialize First Resident
              </button>
            </div>
          )
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
                className="p-2 bg-gray-100 font-bold hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="max-h-[85vh] overflow-y-auto">
              <ResidentCard 
                resident={selectedResident} 
                onAddTransaction={(id) => setTransactionTarget({ id, name: selectedResident.name })}
              />
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

      {isAddModalOpen && (
        <AddResidentModal 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={handleAddResident}
        />
      )}

      {transactionTarget && (
        <AddTransactionModal
          residentId={transactionTarget.id}
          residentName={transactionTarget.name}
          onClose={() => setTransactionTarget(null)}
          onAdd={handleAddTransaction}
        />
      )}

      <footer className="py-6 text-center text-gray-400 text-sm border-t border-gray-100 bg-white/30 font-medium">
        &copy; 2026 B.R.I.S. Secure SQLite Environment
      </footer>
    </div>
  );
}




export default App
