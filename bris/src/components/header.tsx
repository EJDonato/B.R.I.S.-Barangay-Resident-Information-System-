import SearchBar from "./searchBar";

function Header() {
  return (
    <div className="bg-[#c0ffcc] flex flex-col py-5 gap-5 border-b shadow-md">
      <div>
        <h1 className="flex justify-center items-center font-bold text-2xl">
          Barangay Resident Information System
        </h1>
        <h2 className="flex justify-center items-center font-bold text-xl">
          B.R.I.S
        </h2>
      </div>
      <SearchBar />
    </div>
  );
}

export default Header;
