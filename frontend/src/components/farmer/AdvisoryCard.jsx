import {
    Bell
} from "lucide-react";


export default function AdvisoryCard({
    advisories
}){


return (

<div className="
bg-white
rounded-3xl
shadow-lg
p-6
mt-8
">


<h2 className="
text-2xl
font-bold
mb-5
flex
items-center
gap-2
">

<Bell
className="text-green-700"
/>

Officer Recommendations

</h2>



{

advisories.length===0 ?

<p className="
text-gray-500
">

No recommendations yet

</p>


:


advisories.map((item)=>(


<div

key={item.id}

className="
border
rounded-2xl
p-5
mb-4
bg-green-50
"


>


<h3 className="
font-bold
text-lg
">

{item.title}

</h3>



<p className="
text-gray-700
mt-2
">

{item.message}

</p>



<span className="
inline-block
mt-3
px-3
py-1
rounded-full
bg-green-200
text-green-800
text-sm
">

{item.status}

</span>


</div>


))


}


</div>


);


}