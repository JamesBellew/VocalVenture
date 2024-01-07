import { useState,useEffect } from "react";


const ModeMenu = ({ onStartGame,onMode }) => {
    //usestates
    // const [currentMode,setCurrentMode] = useState("classic")
    const [currentMode, setCurrentMode] = useState(() => {
        const savedMode = localStorage.getItem("currentMode");
        return savedMode ? savedMode : "classic";
    });
   
    //arrays
    const modes = [
        {
            name:"classic",
            desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tenetur porro corrupti nostrum velit non tempora facilis quasi, adipisci doloremque, ",
            levels:["easy","medium","hard","reversed"],
            songLengths:["1.5s - 2.5s", "1.2s - 2s"]

        },
        {
            name:"clock",
            desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tenetur porro corrupti nostrum velit non tempora facilis quasi, adipisci doloremque, ",
            levels:["Fighting against the clock"],
            songLengths:["No Length, you stop the clock !"]

        },
        {
            name:"Survival",
            desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tenetur porro corrupti nostrum velit non tempora facilis quasi, adipisci doloremque, consequatur eius iure cupiditate consequuntur repudiandae consectetur, deleniti nemo nulla eligendi!",
            levels:["Fighting against the clock"],
            songLengths:["No Length, you stop the clock !"]

        }
        ,
        {
            name:"Reversed",
            desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tenetur porro corrupti nostrum velit non tempora facilis quasi, adipisci doloremque, consequatur eius iure cupiditate consequuntur repudiandae consectetur, deleniti nemo nulla eligendi!",
            levels:["easy","medium","hard","reversed"],
            songLengths:["1.5s - 2.5s", "1.2s - 2s"]

        }
        
    ]
    const currentModeObject = modes.find(mode => mode.name.toLowerCase() === currentMode.toLowerCase());

    //functions/handlers
    const modeSelectHandler = (mode) => {
        // console.log(mode + "fuck you");
        setCurrentMode(mode);
    };

    const startGameHandler = ()=>{
onStartGame(true)
onMode(currentMode)
    }

    useEffect(() => {
        localStorage.setItem("currentMode", currentMode);
    }, [currentMode]);

    //useeffects
    return (
        <>
        
            <div className="parentDiv h-auto min-h-screen overflow-hidden  w-full bg-white">
                <div className="modeSelector mb-2 h-1/3">
                    <h3 className="text-center text-xl font-semibold pb-3 pt-2">Game Modes</h3>
                    <div onClick={()=>modeSelectHandler("classic")} className={`w-3/4 ${currentMode === "classic" ? "modeActive": "modeNonActive "} modeActive`}>Classic</div>
                    <div onClick={()=>modeSelectHandler("clock")} className={` w-3/4 ${currentMode === "clock" ? "modeActive": "modeNonActive "} modeActive`}>Against the Clock</div>
                    <div onClick={()=>modeSelectHandler("survival")} className={`w-3/4 ${currentMode === "survival" ? "modeActive": "modeNonActive "} modeActive`}>Survival</div>
                    <div onClick={()=>modeSelectHandler("reversed")} className={`w-3/4 ${currentMode === "reversed" ? "modeActive": "modeNonActive "} modeActive`}>Reversed</div>
                   
                </div>
                <hr></hr>
                <div className="modeInfo h-2/3">

                    <h3 className="px-6 py-2 capitalize text-xl mt-2 text-center font-medium"><span className="">{currentMode}</span> Settings</h3>
                    
                    {/* <h3 className="px-6 py-1 text-xl font-medium">Game Mode</h3>
                    <h3 className="px-3 w-32  py-2 text-md border-l-4 shadow-md mx-4 rounded-md border-l-indigo-500 font-normal capitalize ">{currentMode}</h3> */}
                    {/* <br></br> */}
                    <h3 className="px-6 py-2 text-md font-medium">Description</h3>
                    <h3 className="px-3 text-sm border-l-0  mx-4 rounded-md w-auto font-normal capitalize">{modes[0].desc}</h3>
                    {/* <br></br> */}
                    <h3 className="px-6 py-3 text-md font-medium">Levels</h3>
                <div className="flex ml-2 flex-wrap -mx-4">
                    {currentModeObject?.levels.map(level => (
                        <div key={level} className="px-2 py-2 text-md border-l-4 border-indigo-300 shadow-lg ml-2 rounded-md w-auto font-normal capitalize">
                            {level}
                        </div>
                    ))}
                </div>

                <h3 className="px-6 py-3 text-md font-medium">Song Length</h3>
                <div className="flex flex-wrap ml-4 -mx-4">
                    {currentModeObject?.songLengths.map(songLength => (
                        <div key={songLength} className="px-2 py-2 text-md border-l-4 border-indigo-300 shadow-lg mr-4 rounded-md w-auto font-normal capitalize">
                            {songLength}
                        </div>
                    ))}
                </div>

<div class="fixed inset-x-0 bottom-5 flex justify-center">
    <button
    onClick={startGameHandler}
    class="btn bg-indigo-500 px-6 w-auto py-3  text-white font-semibold shadow-md">
        Start
    </button>
</div>


                  
                
                </div>
            </div>
        </>
    );
};

export default ModeMenu;
