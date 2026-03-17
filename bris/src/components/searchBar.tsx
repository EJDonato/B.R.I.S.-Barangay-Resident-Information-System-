
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <div className="flex justify-center items-center px-4 w-full">
      <div className="group flex items-center bg-white/80 backdrop-blur-sm p-3 gap-3 rounded-2xl border border-green-200 w-full max-w-xl transition-all duration-300 ease-in-out focus-within:ring-2 focus-within:ring-green-500 focus-within:shadow-xl focus-within:bg-white">
        <Search className="w-5 h-5 text-green-600 group-focus-within:scale-110 transition-transform duration-300" />
        <input 
          type="text" 
          placeholder="Search resident by name..." 
          className="w-full border-none outline-none bg-transparent shadow-none appearance-none text-gray-700 placeholder:text-gray-400 font-medium"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />    
      </div>
    </div>
  );
}

export default SearchBar;