import {
    Users,
    Sprout,
    ShieldCheck,
    BarChart3
} from "lucide-react";


export default function DashboardCards({ stats }) {


    const cards = [

        {
            title:"Total Farmers",
            value: stats?.farmers || 0,
            icon: <Sprout size={30}/>,
        },

        {
            title:"Agricultural Officers",
            value: stats?.officers || 0,
            icon: <Users size={30}/>,
        },

        {
            title:"Admins",
            value: stats?.admins || 0,
            icon: <ShieldCheck size={30}/>,
        },

        {
            title:"Predictions",
            value: stats?.predictions || 0,
            icon: <BarChart3 size={30}/>,
        }

    ];



    return (

        <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-4
            gap-6
        ">


            {
                cards.map((card,index)=>(

                    <div
                        key={index}
                        className="
                            bg-white
                            rounded-3xl
                            shadow-md
                            p-6
                            flex
                            items-center
                            justify-between
                            hover:shadow-xl
                            transition
                        "
                    >

                        <div>

                            <p className="
                                text-gray-500
                                text-sm
                            ">
                                {card.title}
                            </p>


                            <h2 className="
                                text-3xl
                                font-bold
                                mt-2
                                text-gray-800
                            ">
                                {card.value}
                            </h2>

                        </div>


                        <div className="
                            bg-green-100
                            text-green-700
                            p-4
                            rounded-2xl
                        ">

                            {card.icon}

                        </div>


                    </div>


                ))
            }


        </div>

    );

}