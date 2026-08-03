import { useState } from "react";
import { MessageSquare, Search } from "lucide-react";

import AdvisoryModal from "./AdvisoryModal";


export default function FarmerTable({ farmers }) {


    const [search, setSearch] = useState("");

    const [selectedFarmer, setSelectedFarmer] = useState(null);



    const filteredFarmers = farmers.filter(
        (farmer) =>

        farmer.name
        ?.toLowerCase()
        .includes(
            search.toLowerCase()
        )

        ||

        farmer.village
        ?.toLowerCase()
        .includes(
            search.toLowerCase()
        )

    );



    return (

        <div>


            {/* Search */}

            <div className="
                flex
                items-center
                gap-3
                border
                rounded-xl
                px-4
                py-3
                mb-6
            ">

                <Search
                    size={20}
                    className="text-gray-400"
                />


                <input

                    placeholder="Search farmer or village..."

                    value={search}

                    onChange={
                        (e)=>setSearch(
                            e.target.value
                        )
                    }

                    className="
                        outline-none
                        w-full
                    "

                />

            </div>



            <div className="
                overflow-x-auto
            ">


                <table className="
                    w-full
                    text-left
                ">


                    <thead>

                        <tr className="
                            border-b
                            text-gray-500
                        ">

                            <th className="py-4">
                                Farmer
                            </th>

                            <th>
                                Location
                            </th>

                            <th>
                                Crops
                            </th>

                            <th>
                                Action
                            </th>


                        </tr>

                    </thead>



                    <tbody>


                    {

                    filteredFarmers.length === 0 ?

                    (

                        <tr>

                            <td
                            colSpan="4"
                            className="
                                text-center
                                py-8
                                text-gray-500
                            "
                            >

                                No farmers found

                            </td>


                        </tr>

                    )


                    :

                    filteredFarmers.map(
                        (farmer)=>(


                        <tr

                        key={farmer.id}

                        className="
                            border-b
                            hover:bg-green-50
                        "

                        >


                            <td className="py-4">


                                <p className="
                                    font-semibold
                                ">

                                    {farmer.name}

                                </p>


                            </td>




                            <td>


                                <p>

                                {farmer.village}

                                </p>


                                <p className="
                                    text-sm
                                    text-gray-500
                                ">

                                {farmer.district},
                                {farmer.state}

                                </p>


                            </td>




                            <td>


                                {

                                farmer.crops?.length

                                ?

                                farmer.crops.join(", ")

                                :

                                "Not added"

                                }


                            </td>




                            <td>


                            <button

                            onClick={
                                ()=>setSelectedFarmer(
                                    farmer
                                )
                            }


                            className="
                                bg-green-600
                                hover:bg-green-700
                                text-white
                                px-4
                                py-2
                                rounded-xl
                                flex
                                items-center
                                gap-2
                            "

                            >

                                <MessageSquare
                                    size={18}
                                />

                                Advisory


                            </button>


                            </td>



                        </tr>


                    ))


                    }


                    </tbody>


                </table>


            </div>



            {
                selectedFarmer &&

                <AdvisoryModal

                    farmer={selectedFarmer}

                    close={
                        ()=>setSelectedFarmer(null)
                    }

                />

            }


        </div>

    );

}