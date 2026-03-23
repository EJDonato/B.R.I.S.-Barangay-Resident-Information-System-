import { useState, useMemo } from 'react';
import { Resident, TransactionType } from '../types';
import { Calendar, Phone, MapPin, Briefcase, UserCheck, Plus, FileText, LayoutGrid, Trash2, Pencil } from 'lucide-react';

interface ResidentCardProps {
  resident: Resident;
  onAddTransaction?: (residentId: string) => void;
  onDelete?: (residentId: string) => void;
  onEdit?: (resident: Resident) => void;
  onDeleteTransaction?: (transactionId: string) => void;
  isDetail?: boolean;
}

function ResidentCard({ resident, onAddTransaction, onDelete, onEdit, onDeleteTransaction, isDetail }: ResidentCardProps) {
  const [filter, setFilter] = useState<TransactionType | 'All'>('All');

  const sortedTransactions = useMemo(() => {
    return [...resident.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [resident.transactions]);

  const filteredTransactions = useMemo(() => {
    if (filter === 'All') return sortedTransactions;
    return sortedTransactions.filter(t => t.type === filter);
  }, [sortedTransactions, filter]);

  const filterTypes: (TransactionType | 'All')[] = ['All', 'Brgy Clearance', 'Indigency', 'Special Cert'];

  return (
    <div className={`bg-white rounded-3xl shadow-xl transition-all duration-300 border border-gray-100 ${isDetail ? 'w-full shadow-none p-6 md:p-8 pt-6 pb-4' : 'p-8 hover:shadow-2xl'}`}>
      <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
        <div className="flex items-center gap-6">
          {isDetail && (resident.imageUrl ? (
            <img src={resident.imageUrl} alt={resident.name} className="w-24 h-24 rounded-3xl object-cover ring-4 ring-green-50 shadow-inner" />
          ) : (
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-black text-4xl shadow-lg">
              {resident.name.charAt(0)}
            </div>
          ))}
          <div>
            <h3 className="text-3xl font-black text-gray-800 tracking-tight">{resident.name}</h3>
            <p className="text-green-600 font-bold flex items-center gap-2 mt-1 uppercase text-xs tracking-wider">
              <Briefcase className="w-4 h-4" />
              {resident.occupation}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-sm">
        <div className="space-y-1">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Birthday
          </p>
          <p className="font-bold text-gray-700">{resident.birthday}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1">
            <Phone className="w-3 h-3" /> Telephone
          </p>
          <p className="font-bold text-gray-700">{resident.telephone || 'None Listed'}</p>
        </div>
        <div className="sm:col-span-2 space-y-1">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Address
          </p>
          <p className="font-bold text-gray-700 leading-relaxed text-xs">{resident.address}</p>
        </div>
        <div className="sm:col-span-2">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black ${resident.isVoter ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <UserCheck className="w-3 h-3" />
            {resident.isVoter ? 'REGISTERED VOTER' : 'UNREGISTERED'}
          </div>
        </div>
      </div>

      {isDetail && (
        <div className="bg-gray-50/70 rounded-3xl p-6 border border-gray-100 ring-1 ring-gray-100/50">
          <div className="flex justify-between items-center mb-5">
            <h4 className="font-black text-gray-800 text-sm flex items-center gap-2 uppercase tracking-tight">
              <FileText className="w-4 h-4 text-blue-500" />
              Transactions
              <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full ring-1 ring-blue-200">{resident.transactions.length}</span>
            </h4>
            <div className="flex items-center gap-2">
              {onAddTransaction && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddTransaction(resident.id);
                  }}
                  className="p-1.5 bg-white hover:bg-blue-500 hover:text-white text-blue-600 rounded-xl transition-all shadow-sm ring-1 ring-blue-100 group"
                  title="New Transaction"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filters - Only show in detail mode or when showAll is active */}
          {resident.transactions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5 p-1 bg-gray-100/50 rounded-2xl border border-gray-200/50">
              {filterTypes.map((t) => (
                <button
                  key={t}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilter(t);
                  }}
                  className={`flex-1 min-w-fit px-3 py-2 rounded-xl text-[10px] font-black transition-all ${
                    filter === t 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                      : 'text-gray-500 hover:bg-white hover:text-blue-600'
                  }`}
                >
                  {t === 'All' ? <LayoutGrid className="w-3.5 h-3.5 mx-auto" /> : t}
                </button>
              ))}
            </div>
          )}
          
          {filteredTransactions.length > 0 ? (
            <div className="space-y-3 transition-all duration-300 p-1 px-1.5 pb-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-gray-100 hover:border-blue-200 transition-all hover:shadow-md group">
                  <div className="flex items-center gap-3">
                     <div className={`p-2 rounded-xl text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white transition-colors`}>
                        <FileText className="w-4 h-4" />
                     </div>
                     <div>
                      <p className="font-black text-gray-800 text-xs tracking-tight">{transaction.type}</p>
                      {transaction.purpose && <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{transaction.purpose}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg italic border border-blue-100">{transaction.date}</p>
                    </div>
                    {onDeleteTransaction && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Delete this transaction record?')) {
                            onDeleteTransaction(transaction.id);
                          }
                        }}
                        className="p-1.5 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-2xl bg-white/50">
              <p className="text-gray-400 font-bold text-[10px] upper tracking-widest flex flex-col items-center gap-2 uppercase">
                 <FileText className="w-6 h-6 opacity-20" />
                 NO {filter !== 'All' ? `${filter} ` : ''}HISTORY
              </p>
            </div>
          )}
        </div>
      )}

      {isDetail && (onEdit || onDelete) && (
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
          {onEdit && (
            <button 
              onClick={() => onEdit(resident)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border-2 border-blue-600 text-blue-700 hover:bg-blue-50 rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-50 active:scale-95"
            >
              <Pencil className="w-4 h-4" />
              Edit Resident Profile
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => {
                if (confirm(`Are you sure you want to delete ${resident.name}? This action cannot be undone.`)) {
                  onDelete(resident.id);
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-red-100 active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              Delete Resident
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ResidentCard;
