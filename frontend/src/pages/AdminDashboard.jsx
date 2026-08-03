import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import DashboardCards from "../components/admin/DashboardCards";
import UserTable from "../components/admin/UserTable";
import SearchBar from "../components/admin/SearchBar";
import RoleFilter from "../components/admin/RoleFilter";

import {
    getDashboard,
    getUsers
} from "../services/adminService";


export default function AdminDashboard() {

    const [dashboard, setDashboard] = useState(null);

    const [users, setUsers] = useState([]);

    const [filteredUsers, setFilteredUsers] = useState([]);

    const [search, setSearch] = useState("");

    const [role, setRole] = useState("all");

    const [loading, setLoading] = useState(true);


    const loadData = async () => {

        try {

            const dashboardData =
                await getDashboard();


            const usersData =
                await getUsers();


            setDashboard(dashboardData);

            setUsers(usersData);

            setFilteredUsers(usersData);


        } catch(error){

            console.log(
                "Dashboard Error:",
                error
            );

        }
        finally{

            setLoading(false);

        }
    };


    useEffect(()=>{

        loadData();

    },[]);



    useEffect(()=>{


        let data = users;


        if(search){

            data =
            data.filter(user =>

                user.full_name
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )

                ||

                user.email
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )

            );

        }


        if(role !== "all"){

            data =
            data.filter(
                user =>
                user.role === role
            );

        }


        setFilteredUsers(data);


    },[
        search,
        role,
        users
    ]);



    if(loading){

        return (

            <div className="
                min-h-screen
                bg-green-50
                flex
                items-center
                justify-center
            ">

                <h1 className="
                    text-xl
                    font-semibold
                    text-green-700
                ">
                    Loading Admin Dashboard...
                </h1>

            </div>

        );

    }



    return (

        <div className="
            min-h-screen
            bg-gradient-to-br
            from-green-50
            to-lime-100
        ">


            <Navbar />


            <main className="
                max-w-7xl
                mx-auto
                px-8
                py-8
            ">


                <div className="mb-8">


                    <h1 className="
                        text-4xl
                        font-bold
                        text-gray-800
                    ">
                        Admin Dashboard
                    </h1>


                    <p className="
                        text-gray-600
                        mt-2
                    ">
                        Manage users, monitor
                        predictions and control
                        the YieldSense AI platform.
                    </p>


                </div>



                <DashboardCards
                    stats={
                        dashboard?.stats
                    }
                />



                <div className="
                    bg-white
                    rounded-3xl
                    shadow-lg
                    p-6
                    mt-8
                ">


                    <div className="
                        flex
                        justify-between
                        items-center
                        mb-6
                    ">


                        <h2 className="
                            text-2xl
                            font-bold
                        ">
                            User Management
                        </h2>


                    </div>



                    <div className="
                        flex
                        gap-4
                        mb-6
                    ">


                        <SearchBar
                            search={search}
                            setSearch={setSearch}
                        />


                        <RoleFilter
                            role={role}
                            setRole={setRole}
                        />


                    </div>




                    <UserTable

                        users={
                            filteredUsers
                        }

                        refresh={
                            loadData
                        }

                    />



                </div>


            </main>


        </div>

    );

}