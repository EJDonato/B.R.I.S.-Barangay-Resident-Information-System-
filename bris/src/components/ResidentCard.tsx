import { Resident } from '../types';

interface ResidentCardProps {
  resident: Resident;
}

function ResidentCard({ resident }: ResidentCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
        {resident.imageUrl ? (
          <img src={resident.imageUrl} alt={resident.name} className="w-20 h-20 rounded-full object-cover border-2 border-green-100" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-2xl border-2 border-green-200">
            {resident.name.charAt(0)}
          </div>
        )}
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{resident.name}</h3>
          <p className="text-gray-500">{resident.occupation}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-400 font-medium">Birthday</p>
          <p className="font-semibold text-gray-700">{resident.birthday}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400 font-medium">Telephone</p>
          <p className="font-semibold text-gray-700">{resident.telephone || 'N/A'}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-sm text-gray-400 font-medium">Address</p>
          <p className="font-semibold text-gray-700">{resident.address}</p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-sm text-gray-400 font-medium">Voter Status</p>
          <p className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold mt-1 ${resident.isVoter ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {resident.isVoter ? 'Registered Voter' : 'Not Registered'}
          </p>
        </div>
      </div>

      <div>
        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          Transaction History
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{resident.transactions.length}</span>
        </h4>
        {resident.transactions.length > 0 ? (
          <div className="space-y-3">
            {resident.transactions.map((transaction) => (
              <div key={transaction.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center border border-gray-100">
                <div>
                  <p className="font-semibold text-gray-700">{transaction.type}</p>
                  {transaction.purpose && <p className="text-xs text-gray-500 mt-1">{transaction.purpose}</p>}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-600">{transaction.date}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-sm">No recorded transactions.</p>
        )}
      </div>
    </div>
  );
}

export default ResidentCard;
