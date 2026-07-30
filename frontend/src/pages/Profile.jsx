import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {saveProfile,getProfile,} from "../services/profileService";
import { saveFarmerProfile } from "../services/farmerService";
import {getFarmerProfile} from "../services/farmerService";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Users,
  MapPin,
  Tractor,
  Building2,
  Sparkles,
  Save,
} from "lucide-react";



export default function Profile() {
  const token = localStorage.getItem("token");

  const [saved, setSaved] = useState(false);

  

const navigate = useNavigate();
  if (!token) return <Navigate to="/" />;

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const [form, setForm] =useState({

  // Personal
  full_name:user.full_name || "",
  email:user.email || "",
  phone:"",
  age:"",
  gender:"",

  // Farm
  farm_name:"",
  state:"",
  district:"",
  village:"",
  land_size:"",

  // Soil
  soil_type:"",
  soil_ph:"",
  nitrogen:"",
  phosphorus:"",
  potassium:"",
  organic_carbon:"",

  // Water
  irrigation:"",
  water_source:"",
  annual_rainfall:"",

  // Crop
  primary_crop:"",
  secondary_crop:"",
  season:"",
  crop_rotation:"",

  // Equipment
  tractor:false,
  harvester:false,
  seeder:false,
  sprayer:false,
  sensors:false,

});


useEffect(() => {

  const loadProfile = async () => {

    try {

      const data = await getFarmerProfile();

      if (!data) return;

      setForm({

        ...form,

        // Personal
        phone: data.personal?.phone || "",
        age: data.personal?.age || "",
        gender: data.personal?.gender || "",

        // Farm
        farm_name: data.farm?.farm_name || "",
        state: data.farm?.state || "",
        district: data.farm?.district || "",
        village: data.farm?.village || "",
        land_size: data.farm?.land_size || "",

        // Soil
        soil_type: data.soil?.soil_type || "",
        soil_ph: data.soil?.soil_ph || "",
        nitrogen: data.soil?.nitrogen || "",
        phosphorus: data.soil?.phosphorus || "",
        potassium: data.soil?.potassium || "",
        organic_carbon: data.soil?.organic_carbon || "",

        // Water
        irrigation: data.water?.irrigation || "",
        water_source: data.water?.water_source || "",
        annual_rainfall: data.water?.annual_rainfall || "",

        // Crop
        primary_crop: data.crop?.primary_crop || "",
        secondary_crop: data.crop?.secondary_crop || "",
        season: data.crop?.season || "",
        crop_rotation: data.crop?.crop_rotation || "",

        // Equipment
        tractor: data.equipment?.tractor || false,
        harvester: data.equipment?.harvester || false,
        seeder: data.equipment?.seeder || false,
        sprayer: data.equipment?.sprayer || false,
        sensors: data.equipment?.sensors || false,

      });

    }

    catch (err) {

      console.log("First time profile");

    }

  };

  loadProfile();

}, []);
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };



  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const completion = () => {
    const total = Object.keys(form).length;

    let filled = 0;

    Object.values(form).forEach((value) => {
      if (value !== "") filled++;
    });

    return Math.round((filled / total) * 100);
  };

//   const handleSave = async () => {

//     try {

//         const payload = {

//             state: form.state,
//             district: form.district,
//             village: form.village,

//             land_size: Number(form.land_size),

//             soil_type: form.soil_type,

//             irrigation: form.irrigation,

//             preferred_crops: [
//                 form.primary_crop,
//                 form.secondary_crop,
//             ].filter(Boolean),

//         };

//         await saveFarmerProfile(payload);

//         alert("Profile Saved Successfully!");

//     } catch (err) {

//         console.error(err);

//         alert("Unable to save profile");

//     }

// };
const handleSave = async () => {

  try {

    await saveFarmerProfile(form);

    alert("Profile saved successfully!");

  }

  catch (err) {

    console.error(err);

    alert("Unable to save profile");

  }

};
const loadProfile = async () => {

    try{

        const profile = await getProfile();

        setForm(prev=>({

            ...prev,

            state: profile.state,

            district: profile.district,

            village: profile.village,

            land_size: profile.land_size,

            soil_type: profile.soil_type,

            irrigation: profile.irrigation,

            primary_crop:
                profile.preferred_crops?.[0] || "",

            secondary_crop:
                profile.preferred_crops?.[1] || "",

        }));

    }

    catch{

        console.log("New farmer.");

    }

};

  const percent = completion();

  return (
    <div className="min-h-screen bg-slate-100">

      <Navbar
        user={user}
        logout={logout}
      />

      {/* Header */}

      <section className="bg-gradient-to-r from-green-700 via-emerald-600 to-green-500 text-white">

        <div className="max-w-7xl mx-auto px-8 py-12 flex justify-between items-center flex-wrap gap-8">

          <div className="flex items-center gap-6">

            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-4xl font-bold">

              {user.full_name?.charAt(0)}

            </div>

            <div>

              <h1 className="text-4xl font-bold">

                {user.full_name}

              </h1>

              <p className="text-green-100 mt-2 text-lg">

                Farmer Profile Management

              </p>

            </div>

          </div>

          {/* AI Score */}

          <div className="bg-white text-gray-800 rounded-3xl shadow-xl p-6 w-80">

            <div className="flex items-center gap-3">

              <Sparkles
                className="text-green-700"
                size={28}
              />

              <h2 className="font-bold text-xl">

                AI Readiness

              </h2>

            </div>

            <div className="mt-6">

              <div className="flex justify-between">

                <span>Profile Completion</span>

                <span>{percent}%</span>

              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 mt-2">

                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${percent}%`,
                  }}
                ></div>

              </div>

              <p className="text-sm text-gray-500 mt-4">

                Complete your profile for more accurate
                AI predictions.

              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Body */}

      <section className="max-w-7xl mx-auto py-12 px-8 space-y-10">

        {/* PERSONAL */}

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <div className="flex items-center gap-3 mb-8">

            <User
              className="text-green-700"
              size={30}
            />

            <h2 className="text-2xl font-bold">

              Personal Information

            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-8">

            <div>

              <label className="font-medium">

                Full Name

              </label>

              <div className="relative mt-2">

                <User className="absolute left-4 top-4 text-gray-400"/>

                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  className="w-full border rounded-xl py-3 pl-12 pr-4"
                />

              </div>

            </div>

            <div>

              <label>Email</label>

              <div className="relative mt-2">

                <Mail className="absolute left-4 top-4 text-gray-400"/>

                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border rounded-xl py-3 pl-12 pr-4"
                />

              </div>

            </div>

            <div>

              <label>Phone</label>

              <div className="relative mt-2">

                <Phone className="absolute left-4 top-4 text-gray-400"/>

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border rounded-xl py-3 pl-12 pr-4"
                />

              </div>

            </div>

            <div>

              <label>Age</label>

              <div className="relative mt-2">

                <Calendar className="absolute left-4 top-4 text-gray-400"/>

                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  className="w-full border rounded-xl py-3 pl-12 pr-4"
                />

              </div>

            </div>

            <div>

              <label>Gender</label>

              <div className="relative mt-2">

                <Users className="absolute left-4 top-4 text-gray-400"/>

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full border rounded-xl py-3 pl-12 pr-4"
                >

                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>

                </select>

              </div>

            </div>

          </div>

        </div>

        {/* FARM */}

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <div className="flex items-center gap-3 mb-8">

            <Tractor
              className="text-green-700"
              size={30}
            />

            <h2 className="text-2xl font-bold">

              Farm Information

            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-8">

            <div>

              <label>Farm Name</label>

              <div className="relative mt-2">

                <Building2 className="absolute left-4 top-4 text-gray-400"/>

                <input
                  name="farm_name"
                  value={form.farm_name}
                  onChange={handleChange}
                  className="w-full border rounded-xl py-3 pl-12 pr-4"
                />

              </div>

            </div>

            <div>

              <label>State</label>

              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                className="w-full border rounded-xl py-3 px-4 mt-2"
              />

            </div>

            <div>

              <label>District</label>

              <input
                name="district"
                value={form.district}
                onChange={handleChange}
                className="w-full border rounded-xl py-3 px-4 mt-2"
              />

            </div>

            <div>

              <label>Village</label>

              <input
                name="village"
                value={form.village}
                onChange={handleChange}
                className="w-full border rounded-xl py-3 px-4 mt-2"
              />

            </div>

            <div>

              <label>Land Size (Acres)</label>

              <input
                type="number"
                name="land_size"
                value={form.land_size}
                onChange={handleChange}
                className="w-full border rounded-xl py-3 px-4 mt-2"
              />

            </div>

          </div>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">

<div className="flex items-center gap-3 mb-8">

<h2 className="text-2xl font-bold text-green-700">
🌱 Soil Health
</h2>

</div>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

<div>
<label>Soil Type</label>

<select
name="soil_type"
value={form.soil_type}
onChange={handleChange}
className="w-full border rounded-xl mt-2 p-3"
>

<option value="">Select</option>
<option>Black Soil</option>
<option>Red Soil</option>
<option>Clay</option>
<option>Loamy</option>
<option>Sandy</option>

</select>
</div>

<div>

<label>pH Value</label>

<input
type="number"
step="0.1"
name="soil_ph"
value={form.soil_ph}
onChange={handleChange}
className="w-full border rounded-xl mt-2 p-3"
/>

</div>

<div>

<label>Nitrogen (kg/ha)</label>

<input
type="number"
name="nitrogen"
value={form.nitrogen}
onChange={handleChange}
className="w-full border rounded-xl mt-2 p-3"
/>

</div>

<div>

<label>Phosphorus</label>

<input
type="number"
name="phosphorus"
value={form.phosphorus}
onChange={handleChange}
className="w-full border rounded-xl mt-2 p-3"
/>

</div>

<div>

<label>Potassium</label>

<input
type="number"
name="potassium"
value={form.potassium}
onChange={handleChange}
className="w-full border rounded-xl mt-2 p-3"
/>

</div>

<div>

<label>Organic Carbon (%)</label>

<input
type="number"
step="0.1"
name="organic_carbon"
value={form.organic_carbon}
onChange={handleChange}
className="w-full border rounded-xl mt-2 p-3"
/>

</div>

</div>

</div>


<div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

<h2 className="text-2xl font-bold text-blue-700 mb-8">

💧 Water & Irrigation

</h2>

<div className="grid md:grid-cols-3 gap-6">

<div>

<label>Water Source</label>

<select
name="water_source"
value={form.water_source}
onChange={handleChange}
className="w-full border rounded-xl mt-2 p-3"
>

<option value="">Select</option>
<option>Borewell</option>
<option>Canal</option>
<option>River</option>
<option>Rainwater</option>

</select>

</div>

<div>

<label>Irrigation</label>

<select
name="irrigation"
value={form.irrigation}
onChange={handleChange}
className="w-full border rounded-xl mt-2 p-3"
>

<option value="">Select</option>
<option>Drip</option>
<option>Sprinkler</option>
<option>Flood</option>

</select>

</div>

<div>

<label>Annual Rainfall (mm)</label>

<input
type="number"
name="annual_rainfall"
value={form.annual_rainfall}
onChange={handleChange}
className="w-full border rounded-xl mt-2 p-3"
/>

</div>

</div>

</div>


<div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

<h2 className="text-2xl font-bold text-yellow-700 mb-8">

🌾 Crop Information

</h2>

<div className="grid md:grid-cols-2 gap-6">

<div>

<label>Primary Crop</label>

<input
name="primary_crop"
value={form.primary_crop}
onChange={handleChange}
className="w-full border rounded-xl mt-2 p-3"
/>

</div>

<div>

<label>Secondary Crop</label>

<input
name="secondary_crop"
value={form.secondary_crop}
onChange={handleChange}
className="w-full border rounded-xl mt-2 p-3"
/>

</div>

<div>

<label>Growing Season</label>

<select
name="season"
value={form.season}
onChange={handleChange}
className="w-full border rounded-xl mt-2 p-3"
>

<option value="">Select</option>
<option>Kharif</option>
<option>Rabi</option>
<option>Zaid</option>

</select>

</div>

<div>

<label>Crop Rotation</label>

<input
name="crop_rotation"
value={form.crop_rotation}
onChange={handleChange}
className="w-full border rounded-xl mt-2 p-3"
/>

</div>

</div>

</div>


<div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

<h2 className="text-2xl font-bold text-gray-700 mb-8">

🚜 Farm Equipment

</h2>

<div className="grid md:grid-cols-3 gap-6">

<label>
<input
type="checkbox"
name="tractor"
checked={form.tractor}
onChange={(e)=>
setForm({...form,tractor:e.target.checked})
}
/>

<span className="ml-3">Tractor</span>

</label>

<label>

<input
type="checkbox"
name="harvester"
checked={form.harvester}
onChange={(e)=>
setForm({...form,harvester:e.target.checked})
}
/>

<span className="ml-3">

Harvester

</span>

</label>

<label>

<input
type="checkbox"
name="seeder"
checked={form.seeder}
onChange={(e)=>
setForm({...form,seeder:e.target.checked})
}
/>

<span className="ml-3">

Seeder

</span>

</label>

<label>

<input
type="checkbox"
name="sprayer"
checked={form.sprayer}
onChange={(e)=>
setForm({...form,sprayer:e.target.checked})
}
/>

<span className="ml-3">

Sprayer

</span>

</label>

<label>

<input
type="checkbox"
name="sensors"
checked={form.sensors}
onChange={(e)=>
setForm({...form,sensors:e.target.checked})
}
/>

<span className="ml-3">

IoT Sensors

</span>

</label>

</div>

</div>

        {/* Save */}

        <div className="flex justify-end">

         <button
onClick={handleSave}
className="bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-2xl flex items-center gap-3 shadow-lg"
>

<Save size={22}/>

Save Profile

</button>
        </div>

      </section>

      <Footer />

    </div>
  );
}


