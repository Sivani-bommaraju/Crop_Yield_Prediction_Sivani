import {
    useState
} from "react";

import {
    sendAdvisory
} from "../../services/officerService";



export default function AdvisoryModal({
    farmer,
    close
}){


    const [form,setForm]=useState({

        title:"",

        message:""

    });



    const submit = async()=>{


        try{


            await sendAdvisory({

    farmer_id: farmer.user_id,

    title: form.title,

    message: form.message

});



            alert(
                "Advisory sent successfully"
            );


            close();


        }
        catch(error){

            console.log(error);

        }


    };



    return (

        <div className="
            fixed
            inset-0
            bg-black/40
            flex
            items-center
            justify-center
            z-50
        ">


            <div className="
                bg-white
                rounded-3xl
                p-8
                w-full
                max-w-md
            ">


                <h2 className="
                    text-2xl
                    font-bold
                    mb-2
                ">

                    Send Advisory

                </h2>


                <p className="
                    text-gray-500
                    mb-6
                ">

                    To: {farmer.name}

                </p>



                <input

                    placeholder="Title"

                    className="
                        w-full
                        border
                        rounded-xl
                        px-4
                        py-3
                        mb-4
                    "


                    onChange={
                        e=>
                        setForm({
                            ...form,
                            title:e.target.value
                        })
                    }

                />




                <textarea

                    placeholder="Write recommendation..."

                    className="
                        w-full
                        border
                        rounded-xl
                        px-4
                        py-3
                        h-32
                    "


                    onChange={
                        e=>
                        setForm({
                            ...form,
                            message:e.target.value
                        })
                    }

                />




                <div className="
                    flex
                    gap-4
                    mt-6
                ">


                    <button

                    onClick={close}

                    className="
                        flex-1
                        border
                        rounded-xl
                        py-3
                    "

                    >

                        Cancel

                    </button>




                    <button

                    onClick={submit}

                    className="
                        flex-1
                        bg-green-600
                        text-white
                        rounded-xl
                        py-3
                    "

                    >

                        Send

                    </button>


                </div>



            </div>


        </div>

    );

}