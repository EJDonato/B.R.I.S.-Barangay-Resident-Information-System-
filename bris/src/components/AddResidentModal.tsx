import { useState } from 'react';
import { X, User, Calendar, MapPin, Phone, Briefcase, CheckCircle } from 'lucide-react';

interface AddResidentModalProps {
  onClose: () => void;
  onAdd: (resident: any) => void;
}

function AddResidentModal({ onClose, onAdd }: AddResidentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    birthday: '',
    address: '',
    telephone: '',
    isVoter: false,
    occupation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-green-50">
          <h2 className="text-2xl font-black text-green-900 flex items-center gap-2">
            <User className="w-6 h-6" />
            New Resident Profile
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-green-100 rounded-full text-green-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <User className="w-4 h-4" /> Full Name
            </label>
            <input 
              required
              type="text" 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all font-medium text-gray-700"
              placeholder="Enter complete name"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Birthday
              </label>
              <input 
                required
                type="date" 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all font-medium text-gray-700"
                value={formData.birthday}
                onChange={e => setFormData({...formData, birthday: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Phone className="w-4 h-4" /> Telephone
              </label>
              <input 
                type="tel" 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all font-medium text-gray-700"
                placeholder="0917-000-0000"
                value={formData.telephone}
                onChange={e => setFormData({...formData, telephone: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Current Address
            </label>
            <textarea 
              required
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all font-medium text-gray-700 min-h-[100px]"
              placeholder="Street, Barangay, City/Municipality"
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Occupation
              </label>
              <input 
                required
                type="text" 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all font-medium text-gray-700"
                placeholder="Job or NIL"
                value={formData.occupation}
                onChange={e => setFormData({...formData, occupation: e.target.value})}
              />
            </div>
            <div 
              onClick={() => setFormData({...formData, isVoter: !formData.isVoter})}
              className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${formData.isVoter ? 'bg-green-100 border-green-300 text-green-800' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
            >
              <span className="font-bold">Registered Voter?</span>
              <CheckCircle className={`w-6 h-6 ${formData.isVoter ? 'text-green-600' : 'text-gray-300'}`} />
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              className="w-full p-5 bg-green-600 hover:bg-green-700 text-white font-black text-lg rounded-2xl transition-all shadow-xl shadow-green-200 active:scale-[0.98]"
            >
              Securely Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddResidentModal;
