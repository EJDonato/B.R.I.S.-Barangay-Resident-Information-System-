import { useState } from 'react';
import { X, FileText, Calendar, HelpCircle } from 'lucide-react';
import { TransactionType } from '../types';

interface AddTransactionModalProps {
  residentId: string;
  residentName: string;
  onClose: () => void;
  onAdd: (transaction: any) => void;
}

function AddTransactionModal({ residentId, residentName, onClose, onAdd }: AddTransactionModalProps) {
  const [formData, setFormData] = useState({
    residentId,
    type: 'Brgy Clearance' as TransactionType,
    date: new Date().toISOString().split('T')[0],
    purpose: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-50">
          <div>
            <h2 className="text-xl font-black text-blue-900 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              New Transaction
            </h2>
            <p className="text-xs font-bold text-blue-600 mt-0.5">FOR: {residentName.toUpperCase()}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-blue-100 rounded-full text-blue-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-4 h-4" /> Document Type
            </label>
            <select 
              required
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-bold text-gray-700 appearance-none cursor-pointer"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value as TransactionType})}
            >
              <option value="Brgy Clearance">Barangay Clearance</option>
              <option value="Indigency">Certificate of Indigency</option>
              <option value="Special Cert">Special Certification</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Issuance Date
            </label>
            <input 
              required
              type="date" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-bold text-gray-700"
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <HelpCircle className="w-4 h-4" /> Purpose / Remarks
            </label>
            <input 
              required
              type="text" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-bold text-gray-700"
              placeholder="e.g. Employment, Scholarship, etc."
              value={formData.purpose}
              onChange={e => setFormData({...formData, purpose: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full p-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-2xl transition-all shadow-xl shadow-blue-200 active:scale-[0.98]"
            >
              Record Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTransactionModal;
