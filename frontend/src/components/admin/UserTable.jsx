import {
    Trash2,
    Save
} from "lucide-react";

import {
    deleteUser,
    updateRole
} from "../../services/adminService";

import { useState } from "react";


export default function UserTable({
    users,
    refresh
}) {


    const [roles,setRoles] = useState({});


    const handleRoleChange = (
        id,
        value
    )=>{

        setRoles({
            ...roles,
            [id]:value
        });

    };



    const saveRole = async(id)=>{


        try{


            await updateRole(
                id,
                roles[id]
            );


            alert(
                "Role updated successfully"
            );


            refresh();


        }
        catch(error){

            console.log(error);

        }

    };



    const removeUser = async(id)=>{


        if(
            !window.confirm(
                "Delete this user?"
            )
        )
        return;


        await deleteUser(id);


        refresh();

    };



    return (

        <div className="overflow-x-auto">


        <table className="w-full">


        <thead>

        <tr className="
            border-b
            text-gray-500
        ">

            <th className="py-4">
                Name
            </th>

            <th>
                Email
            </th>

            <th>
                Role
            </th>

            <th>
                Action
            </th>

        </tr>

        </thead>



        <tbody>


        {
        users.map((user)=>(


        <tr
        key={user.id}
        className="
            border-b
            hover:bg-green-50
        "
        >


            <td className="py-4 font-semibold">

                {user.full_name}

            </td>


            <td>

                {user.email}

            </td>


            <td>


            <select

            value={
                roles[user.id]
                ||
                user.role
            }


            onChange={
                (e)=>
                handleRoleChange(
                    user.id,
                    e.target.value
                )
            }


            className="
                border
                rounded-lg
                px-3
                py-2
            "

            >


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


            </td>



            <td className="
                flex
                gap-3
                py-3
            ">


            <button

            onClick={
                ()=>saveRole(user.id)
            }

            className="
                bg-green-600
                text-white
                p-2
                rounded-lg
            "

            >

                <Save size={18}/>

            </button>




            <button

            onClick={
                ()=>removeUser(user.id)
            }


            className="
                bg-red-500
                text-white
                p-2
                rounded-lg
            "

            >

                <Trash2 size={18}/>

            </button>



            </td>



        </tr>


        ))
        }


        </tbody>


        </table>


        </div>

    );

}