export default function SearchBar({
    search,
    setSearch
}) {


    return (

        <input

            type="text"

            placeholder="Search users..."

            value={search}

            onChange={
                (e)=>setSearch(e.target.value)
            }

            className="
                flex-1
                border
                rounded-xl
                px-5
                py-3
                outline-none
                focus:ring-2
                focus:ring-green-600
            "

        />

    );

}