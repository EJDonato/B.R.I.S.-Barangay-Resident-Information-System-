import SearchBar from "./searchBar";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

function Header({ searchQuery, setSearchQuery }: HeaderProps) {
  return (
    <div className="bg-[#c0ffcc] flex flex-col py-8 gap-6 border-b border-green-200 shadow-lg">
      <div className="text-center">
        <h1 className="font-extrabold text-3xl text-green-900 tracking-tight">
          Barangay Resident Information System
        </h1>
        <h2 className="font-bold text-xl text-green-700 mt-1 opacity-80">
          B.R.I.S
        </h2>
      </div>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </div>
  );
}


export default Header;
