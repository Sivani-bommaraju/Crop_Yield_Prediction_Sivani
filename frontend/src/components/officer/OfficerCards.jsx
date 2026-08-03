import {
    Users,
    Bell,
    CalendarDays,
    Sprout
} from "lucide-react";


export default function OfficerCards({stats}){


const cards=[


{
title:"Farmers",
value:stats.farmers || 0,
icon:<Users/>
},


{
title:"Pending Advisories",
value:stats.advisories || 0,
icon:<Bell/>
},


{
title:"Field Visits",
value:stats.visits || 0,
icon:<CalendarDays/>
},


{
title:"Predictions",
value:stats.predictions || 0,
icon:<Sprout/>
}


];



return(

<div className="
grid
grid-cols-1
md:grid-cols-2
lg:grid-cols-4
gap-6
mt-8
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
justify-between
items-center
"
>


<div>

<p className="
text-gray-500
">

{card.title}

</p>


<h2 className="
text-3xl
font-bold
mt-2
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