
function SearchBar() {

    return (
       <div className="flex justify-center items-center">
        <div className="flex bg-white p-2 gap-3 rounded-2xl border w-[30vw] px-3 transition-all duration-300 ease-in-out focus-within:ring-1 focus-within:ring-blue-500 focus-within:shadow-md">
            <img src="/public/images/searchIcon.png" alt="Search Icon" className="w-5" />
            <input type="text" placeholder="Search for name.." className="w-full border-none outline-none bg-transparent shadow-none appearance-none"/>    
        </div>
       </div>
    )
}

export default SearchBar;