import {
    useEffect,
    useState
} from "react";


import Navbar from "../components/Navbar";


import OfficerCards from "../components/officer/OfficerCards";

import FarmerTable from "../components/officer/FarmerTable";


import {
    getOfficerDashboard,
    getFarmers
} from "../services/officerService";



export default function AgriculturalOfficerDashboard(){


    const [stats,setStats] = useState({});

    const [farmers,setFarmers] = useState([]);


    const loadData = async()=>{


        try{


            const dashboard =
                await getOfficerDashboard();


            const farmerData =
                await getFarmers();



            setStats(dashboard);

            setFarmers(farmerData);



        }
        catch(error){

            console.log(error);

        }

    };



    useEffect(()=>{

        loadData();

    },[]);



    return(

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



                <h1 className="
                    text-4xl
                    font-bold
                    text-gray-800
                ">

                    Agricultural Officer Dashboard

                </h1>



                <p className="
                    mt-2
                    text-gray-600
                ">

                    Monitor farmers, provide guidance and manage agricultural activities.

                </p>



                <OfficerCards
                    stats={stats}
                />



                <div className="
                    bg-white
                    rounded-3xl
                    shadow-lg
                    mt-8
                    p-6
                ">


                    <h2 className="
                        text-2xl
                        font-bold
                        mb-6
                    ">

                        Farmers

                    </h2>



                    <FarmerTable
                        farmers={farmers}
                    />



                </div>



            </main>



        </div>

    );

}