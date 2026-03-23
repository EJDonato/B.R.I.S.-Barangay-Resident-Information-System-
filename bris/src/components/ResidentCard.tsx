import { Resident } from '../types';
import { Calendar, Phone, MapPin, Briefcase, UserCheck, Plus, FileText } from 'lucide-react';

interface ResidentCardProps {
  resident: Resident;
  onAddTransaction?: (residentId: string) => void;
}

function ResidentCard({ resident, onAddTransaction }: ResidentCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100">
      <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
        {resident.imageUrl ? (
          <img src={resident.imageUrl} alt={resident.name} className="w-24 h-24 rounded-3xl object-cover ring-4 ring-green-50 shadow-inner" />
        ) : (
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-black text-4xl shadow-lg">
            {resident.name.charAt(0)}
          </div>
        )}
        <div>
          <h3 className="text-3xl font-black text-gray-800 tracking-tight">{resident.name}</h3>
          <p className="text-green-600 font-bold flex items-center gap-2 mt-1">
            <Briefcase className="w-4 h-4" />
            {resident.occupation}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="space-y-1">
          <p className="text-xs text-gray-400 font-black uppercase tracking-widest flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Birthday
          </p>
          <p className="font-bold text-gray-700">{resident.birthday}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-400 font-black uppercase tracking-widest flex items-center gap-1">
            <Phone className="w-3 h-3" /> Telephone
          </p>
          <p className="font-bold text-gray-700">{resident.telephone || 'None Listed'}</p>
        </div>
        <div className="sm:col-span-2 space-y-1">
          <p className="text-xs text-gray-400 font-black uppercase tracking-widest flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Address
          </p>
          <p className="font-bold text-gray-700 leading-relaxed">{resident.address}</p>
        </div>
        <div className="sm:col-span-2">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-black ${resident.isVoter ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <UserCheck className="w-4 h-4" />
            {resident.isVoter ? 'REGISTERED VOTER' : 'UNREGISTERED'}
          </div>
        </div>
      </div>

      <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-5">
          <h4 className="font-black text-gray-800 flex items-center gap-2 uppercase tracking-tight">
            <FileText className="w-5 h-5 text-blue-500" />
            Transaction Logs
            <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full ring-1 ring-blue-200">{resident.transactions.length}</span>
          </h4>
          {onAddTransaction && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddTransaction(resident.id);
              }}
              className="p-1.5 bg-white hover:bg-blue-500 hover:text-white text-blue-600 rounded-xl transition-all shadow-sm ring-1 ring-blue-100 group"
              title="New Transaction"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {resident.transactions.length > 0 ? (
          <div className="space-y-3">
            {resident.transactions.map((transaction) => (
              <div key={transaction.id} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
                <div>
                  <p className="font-black text-gray-700 text-sm tracking-tight">{transaction.type}</p>
                  {transaction.purpose && <p className="text-[11px] text-gray-400 font-bold uppercase mt-1">{transaction.purpose}</p>}
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg italic">{transaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">No previous history</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResidentCard;

