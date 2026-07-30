
// import {
//   User,
//   MapPin,
//   Tractor,
//   Droplets,
//   Sprout,
//   Wheat,
//   Pencil,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";


// export default function FarmerProfileCard({ user, profile }) {
//   const navigate = useNavigate();


//   console.log("USER:", user);
// console.log("PROFILE:", profile);


//   if (!profile) {
//     return (
//       <div className="bg-white rounded-3xl shadow-lg p-8">
//         Loading Profile...
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-3xl shadow-lg p-8 h-full hover:shadow-2xl transition duration-300">

//       {/* Header */}

//       <div className="flex justify-between items-center">

//         <div className="flex items-center gap-4">

//           <div className="bg-green-100 p-3 rounded-2xl">
//             <User className="text-green-700" size={28} />
//           </div>

//           <div>

//             <h2 className="text-2xl font-bold text-gray-800">
//               Farmer Profile
//             </h2>

//             <p className="text-gray-500">
//               Personal Information
//             </p>

//           </div>

//         </div>

//         <button
//           onClick={() => navigate("/profile")}
//           className="bg-green-100 hover:bg-green-200 text-green-700 p-3 rounded-xl transition"
//         >
//           <Pencil size={20} />
//         </button>

//       </div>

//       {/* Avatar */}

//       <div className="mt-8 flex items-center gap-5">

//         <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">

//           {user?.full_name?.charAt(0).toUpperCase()}

//         </div>

//         <div>

//           <h3 className="text-2xl font-bold text-gray-800">
//             {user?.full_name}
//           </h3>

//           <p className="capitalize text-green-700 font-semibold">
//             {user?.role}
//           </p>

//           <p className="text-gray-500 text-sm">
//             {user?.email}
//           </p>

//         </div>

//       </div>

//       {/* Divider */}

//       <hr className="my-8" />

//       {/* Farm Details */}

//       <div className="space-y-5">

//         <div className="flex items-center gap-4">

//           <MapPin className="text-green-700" size={22} />

//           <div>
//             <p className="text-gray-500 text-sm">
//               Location
//             </p>

//             <p className="font-semibold">
//               {profile.village}, {profile.district}, {profile.state}
//             </p>
//           </div>

//         </div>

//         <div className="flex items-center gap-4">

//           <Tractor className="text-green-700" size={22} />

//           <div>
//             <p className="text-gray-500 text-sm">
//               Land Size
//             </p>

//             <p className="font-semibold">
//               {profile.land_size} Acres
//             </p>
//           </div>

//         </div>

//         <div className="flex items-center gap-4">

//           <Sprout className="text-green-700" size={22} />

//           <div>
//             <p className="text-gray-500 text-sm">
//               Soil Type
//             </p>

//             <p className="font-semibold">
//               {profile.soil_type}
//             </p>
//           </div>

//         </div>

//         <div className="flex items-center gap-4">

//           <Droplets className="text-green-700" size={22} />

//           <div>
//             <p className="text-gray-500 text-sm">
//               Irrigation
//             </p>

//             <p className="font-semibold">
//               {profile.irrigation}
//             </p>
//           </div>

//         </div>

//         <div className="flex items-center gap-4">

//           <Wheat className="text-green-700" size={22} />

//           <div>
//             <p className="text-gray-500 text-sm">
//               Preferred Crops
//             </p>

//             <p className="font-semibold">
//               {profile.preferred_crops?.join(" • ")}
//             </p>
//           </div>

//         </div>

//       </div>

//     </div>
//   );
// }


import {
  User,
  MapPin,
  Tractor,
  Droplets,
  Sprout,
  Wheat,
  Pencil,
} from "lucide-react";

import { useNavigate } from "react-router-dom";


export default function FarmerProfileCard({ user, profile }) {

  const navigate = useNavigate();


  if (!profile) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8">
        Loading Profile...
      </div>
    );
  }


  return (

    <div className="bg-white rounded-3xl shadow-lg p-8 h-full hover:shadow-2xl transition duration-300">


      {/* Header */}

      <div className="flex justify-between items-center">

        <div className="flex items-center gap-4">

          <div className="bg-green-100 p-3 rounded-2xl">
            <User 
              className="text-green-700" 
              size={28} 
            />
          </div>


          <div>

            <h2 className="text-2xl font-bold text-gray-800">
              Farmer Profile
            </h2>

            <p className="text-gray-500">
              Personal Information
            </p>

          </div>

        </div>


        <button
          onClick={() => navigate("/profile")}
          className="bg-green-100 hover:bg-green-200 text-green-700 p-3 rounded-xl transition"
        >
          <Pencil size={20}/>
        </button>


      </div>



      {/* Avatar Section */}


      <div className="mt-8 flex items-center gap-5">


        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-600 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">


          {user?.full_name
            ? user.full_name.charAt(0).toUpperCase()
            : "F"
          }


        </div>



        <div>


          <h3 className="text-2xl font-bold text-gray-800">

            {user?.full_name || "Farmer"}

          </h3>



          <p className="capitalize text-green-700 font-semibold">

            {user?.role || "farmer"}

          </p>



          <p className="text-gray-500 text-sm">

            {user?.email || "No email"}

          </p>


        </div>


      </div>




      <hr className="my-8"/>




      {/* Farm Details */}


      <div className="space-y-5">



        {/* Location */}

        <div className="flex items-center gap-4">


          <MapPin 
            className="text-green-700"
            size={22}
          />


          <div>


            <p className="text-gray-500 text-sm">
              Location
            </p>


            <p className="font-semibold">

              {profile.farm?.village},
              {" "}
              {profile.farm?.district},
              {" "}
              {profile.farm?.state}

            </p>


          </div>


        </div>





        {/* Land Size */}


        <div className="flex items-center gap-4">


          <Tractor
            className="text-green-700"
            size={22}
          />


          <div>


            <p className="text-gray-500 text-sm">
              Land Size
            </p>


            <p className="font-semibold">

              {profile.farm?.land_size || 0} Acres

            </p>


          </div>


        </div>





        {/* Soil */}


        <div className="flex items-center gap-4">


          <Sprout
            className="text-green-700"
            size={22}
          />


          <div>


            <p className="text-gray-500 text-sm">
              Soil Type
            </p>


            <p className="font-semibold">

              {profile.soil?.soil_type || "Not provided"}

            </p>


          </div>


        </div>





        {/* Irrigation */}


        <div className="flex items-center gap-4">


          <Droplets
            className="text-green-700"
            size={22}
          />


          <div>


            <p className="text-gray-500 text-sm">
              Irrigation
            </p>


            <p className="font-semibold">

              {profile.water?.irrigation || "Not provided"}

            </p>


          </div>


        </div>






        {/* Crops */}



        <div className="flex items-center gap-4">


          <Wheat
            className="text-green-700"
            size={22}
          />



          <div>


            <p className="text-gray-500 text-sm">
              Preferred Crops
            </p>



            <p className="font-semibold capitalize">


              {profile.crop?.primary_crop || "N/A"}

              {" • "}

              {profile.crop?.secondary_crop || "N/A"}


            </p>



          </div>



        </div>



      </div>


    </div>

  );

}