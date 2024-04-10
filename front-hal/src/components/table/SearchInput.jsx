const SearchInput = ({ searchValue, onSearchChange }) => {
    return (
        <input
            type="text"
            name="id"
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search by ID..."
            className="border-2 border-gray-300 bg-white h-10 px-2 rounded-lg text-sm focus:outline-none"
        />
    );
};

export default SearchInput
