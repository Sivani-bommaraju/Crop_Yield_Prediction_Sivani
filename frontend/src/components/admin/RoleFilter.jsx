export default function RoleFilter({
    role,
    setRole
}) {


    return (

        <select

            value={role}

            onChange={
                (e)=>setRole(e.target.value)
            }

            className="
                border
                rounded-xl
                px-5
                py-3
                bg-white
                outline-none
                focus:ring-2
                focus:ring-green-600
            "

        >

            <option value="all">
                All Roles
            </option>


            <option value="farmer">
                Farmer
            </option>


            <option value="agricultural_officer">
                Agricultural Officer
            </option>


            <option value="admin">
                Admin
            </option>


        </select>

    );

}
