import React, { useState,useRef,useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck,faXmark,faPlay,faHeartPulse, faClock, faMusic, faChartBar, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import ModeMenu from './ModeMenu';


function App() {
  const audioRef = useRef(null);
  const [clipUrl, setClipUrl] = useState('');
  const [songName,setSongName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [pickedSong, setPickedSong] = useState('');
  const [answerStyling, setAnswerStyling] = useState();
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [points,setPoints] = useState(10)
  const [score,setScore] = useState(0)
  const [showFilteredSongs, setShowFilteredSongs] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 10); // 10 seconds, in tenths of seconds
  const intervalRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [ currentLevel, setCurrentLevel] = useState(0)
  const [songClipLength,setSongClipLength] = useState(2)
  const [showTopModal,setShowTopModal] = useState(false)
  const [songCoverImg,setSongCoverImg] = useState("")
  const [shouldAnimatePlayBounce, setShouldAnimateBounce] = useState(false);
  const [buttonText,setButtonText] = useState('Lets Start')
  const [selectedSongIndex, setSelectedSongIndex] = useState(-1);
  const [showModeMenu,setShowModeMenu] = useState(true)
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentMode, setCurrentMode] = useState("classic")
  //use refs consts
  const songInputRef = useRef(null);
  const clickyDivRef = useRef(null);
  //arrays
  const levels = [
    "easy","medium","hard"
  ]
  const songArray=[{
    songName: "Silhouttes",
    artist: "Avicii",
    album: "Single"
  },
  {
    songName: "Dear Boy (Avicii By Avicii)",
    artist: "Avicii",
    album: "True (Avicii by Avicii)"
  },
  {
    songName: "Drowning (Avicii Remix)",
    artist: "Avicii",
    album: "Remix"
  },
  {
    songName: "Wake Me Up",
    artist: "Avicii",
    album: "True"
  },
  
  {
    songName: "The Nights",
    artist: "Avicii",
    album: "The Nights / The Days"
  },
  {
    songName: "Waiting For Love",
    artist: "Avicii",
    album: "Stories"
  }

]
//use effects

// timer functions end
useEffect(() => {
  const timer = setTimeout(() => {
    setShowPlayButton(true);
  }, songClipLength*1000); // 2000 milliseconds = 2 seconds

  return () => clearTimeout(timer); // Clear the timer if the component unmounts
}, []); // Empty dependency array to run this effect only once after initial render
//timer use effect
useEffect(() => {
  let interval = null;

  if (isActive && timeLeft > 0) {
    interval = setInterval(() => {
      setTimeLeft(timeLeft => timeLeft - 1);
    }, 1000);
  } else if (!isActive && timeLeft !== 0) {
    clearInterval(interval);
  }

  return () => clearInterval(interval);
}, [isActive, timeLeft]);
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      startTimer()
      setTimeout(() => {
        stopTimer();
      }, songClipLength*1000); // Stop the timer after cliplength of api call
    }
    setShouldAnimateBounce(true)
    // Optionally, reset the state after the animation duration
    setTimeout(() => setShouldAnimateBounce(false), songClipLength*1000); 
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown' && selectedSongIndex < filteredSongs.length - 1) {
        setSelectedSongIndex(selectedSongIndex + 1);
      } else if (event.key === 'ArrowUp' && selectedSongIndex > 0) {
        setSelectedSongIndex(selectedSongIndex - 1);
      } else if (event.key === 'Enter' && selectedSongIndex !== -1) {
        const selectedSong = filteredSongs[selectedSongIndex];
        setPickedSong(selectedSong.songName);
        setSearchTerm(selectedSong.songName);
        setShowFilteredSongs(false);
        songInputRef.current?.blur();
      }
    };
  
    const inputElement = songInputRef.current;
    if (inputElement) {
      inputElement.addEventListener('keydown', handleKeyDown);
    }
  
    return () => {
      if (inputElement) {
        inputElement.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [selectedSongIndex, filteredSongs]);
// useEffect(() => {
//     const inputElement = document.getElementById('songInput');
//     inputElement.addEventListener('keydown', handleKeyDown);

//     return () => {
//       inputElement.removeEventListener('keydown', handleKeyDown);
//     };
// }, [selectedSongIndex, filteredSongs]);
// timer functions
const startTimer = () => {
  if (intervalRef.current !== null) return;

  intervalRef.current = setInterval(() => {
    setTimeLeft((t) => t - 1);
  }, 100); // Update every 100 milliseconds (0.1 second)

  setTimeout(() => {
    stopTimer();
  }, 2000); // Stop the timer after 2 seconds
};
const stopTimer = () => {
  clearInterval(intervalRef.current);
  intervalRef.current = null;
};
const resetTimer = () => {
  setIsActive(false);
  setTimeLeft(60);
};
const addTime = (timeValue) => {
  setTimeLeft(timeLeft => timeLeft + timeValue);
};
const subtractTime = (time) => {
  setTimeLeft(timeLeft => timeLeft - time);
};
const submitSongGuessHandler = ()=>{
  console.log(pickedSong);
  console.log(songName)
  if(pickedSong === songName){
// alert("correct")
setAnswerStyling(true);
setPoints(points+1)
addTime(40)
stopTimer()
setScore(score +1)
  }else{
// alert("Wrong")
setPoints(points-2)
if(points>=9){
  subtractTime(40)
}else if (points>=7 && points<=9){
  subtractTime(40)
}
else if (points>=3 && points<=6){
  subtractTime(20)
}else{
  subtractTime(10)
}

if(timeLeft<=0){
  quitHandler()
}
setAnswerStyling(false)
  }
setShowFilteredSongs(false)
console.log(answerStyling);

// if(score<5 ){
//   setCurrentLevel(0)
//   showModal();
// }
// else 
if(score === 3){
  setCurrentLevel(1)
  showModal();
}
else if (score === 6){
  setCurrentLevel(2)
  showModal()
}else if (score === 9){
  setCurrentLevel(3)
  showModal()
}
else if (score === 12 && currentLevel ===3){
  alert('completed it m8')
}

}
const handleDivClick = () => {
  console.log("Div clicked!");
};
const handleGameStart = (startStatus) => {
  setIsGameStarted(startStatus);
  setShowModeMenu(false)
  fetchRandomClip()
};


const showModal =()=>{
  setShowTopModal(true);
  setTimeout(() => {
    setShowTopModal(false)
  }, 2000); 
}
const handleSearchChange = (e) => {
  const value = e.target.value;
  setSearchTerm(value);

  if (!value) {
    setFilteredSongs([]);
    setShowFilteredSongs(false);
  } else {
    const lowercasedValue = value.toLowerCase();
    const filtered = songArray.filter(song =>
      song.songName.toLowerCase().includes(lowercasedValue) ||
      song.artist.toLowerCase().includes(lowercasedValue) ||
      song.album.toLowerCase().includes(lowercasedValue)
    );
    setFilteredSongs(filtered);
    setShowFilteredSongs(true);
  }
};
const fetchRandomClip = async () => {
    try {
      const level = levels[currentLevel]; // This can be dynamically set based on user input or other logic
      const response = await fetch(`http://localhost:3001/random-clip?level=${level}&nocache=${new Date().getTime()}`);
      
      const data = await response.json();
      setClipUrl(`${data.clipPath}?nocache=${new Date().getTime()}`);
      setSongName(data.songName)
      setSongClipLength(data.songLength)
      // const formattedSongClipLength = songClipLength.toFixed(1);
      setSongCoverImg(data.songCover)
      setShouldAnimateBounce(true)
      // Optionally, reset the state after the animation duration
      setTimeout(() => setShouldAnimateBounce(false), songClipLength*1000); 
    
      setButtonText('Skip')
      setSearchTerm("");
      setPickedSong("")
      setAnswerStyling()
      setFilteredSongs([])
      setAnswerStyling("")
      startTimer()
      
      setTimeout(() => {
        stopTimer();
      }, 2000); // Stop the timer after 2 seconds
    
      
  
      
  setShowFilteredSongs(true);
    } catch (error) {
      console.error('Error fetching random clip:', error);
    }
    setSearchTerm('');
    setPickedSong("")
    setAnswerStyling()
};
const quitHandler = ()=>{
  setClipUrl("");
  setButtonText("Lets Start")
  setPoints(10)
  setPoints(0)
  setScore(0)
  setTimeLeft(100)
  setCurrentLevel(0)
  
}

const modeClickHandler = ()=>{
  setShowModeMenu(true)
}
const ModeHandler = (modePassed)=>{
  setCurrentMode(modePassed);

}
console.log(currentMode);
return (

  <div className='container mx-auto'>
      {showModeMenu ?
    <> 
  <ModeMenu onStartGame={handleGameStart} onMode={ModeHandler}/>
    
    </>
   : <div className='bg-base-200 h-screen w-full bg-white flex justify-center items-center flex-col'>
   {clipUrl && (
     <div className='bg-[url("https://i.pinimg.com/originals/c7/5c/b5/c75cb54db62c80c81855ce07f4c4f856.png")] bg-cover bg-center audioplayer h-screen   w-full bg-image shadow-md shadow-white/20 flex flex-col items-center '>
       {showTopModal &&
       <div className='top-modal absolute w-full  h-auto pb-6  pt-1 custom-gradient-2'>
         <p className='text-center font-semibold text-lg '>Level {levels[currentLevel]}</p>
       </div>
}
       <div className='flex flex-col w-full justify-center items-center flex-grow'>
         <div className='scroboard  mb-36'>
           <div className='userUI p-2 flex items-center bg-white/10 mx-auto rounded w-auto mb-5'>
             <div className='points text-white font-bold text-center mx-auto text-xl self-start'>
               {(timeLeft / 10).toFixed(1)} <FontAwesomeIcon className='text-sm my-auto mb-1' icon={faClock} />
               <span className='ml-5'> {score} <FontAwesomeIcon className='text-sm my-auto mb-1' icon={faMusic} /></span>
               <span className='ml-5'> {currentMode}  <FontAwesomeIcon className='text-sm my-auto mb-1' icon={faMusic} /></span>
               <span className='ml-5'> {levels[currentLevel]} <FontAwesomeIcon className='text-sm my-auto mb-1' icon={faHeartPulse} /></span>
             </div>
           </div>
           <div className="container flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
             {answerStyling === undefined && (
               <div className="flex items-center">
                   <input
   type="text"
   className={`h-11 pr-8 w-72 pl-5 z-50 rounded-md focus:shadow focus:outline-none`}
   placeholder={pickedSong.length > 1 ? pickedSong : "Name of Song..."}
   value={searchTerm}
   onChange={handleSearchChange}
   id="songInput" 
   ref={songInputRef}
   autoComplete="off"
 />
               </div>
             )}
              {showFilteredSongs && (
     <div className='w-72 rounded-md mt-[1px] bg-slate-50 z-50 text-black'>
       {filteredSongs.map((song, index) => (
         <div
           key={index}
           className={`text-black group w-full text-left rounded-md cursor-pointer mb-2 ${index === selectedSongIndex ? 'bg-black/10' : ''}`}
           onClick={() => {
             setPickedSong(song.songName);
             setSearchTerm(song.songName);
             setShowFilteredSongs(false);
           }}
         >
           <p className='w-full px-4 p-2'> <FontAwesomeIcon icon={faMagnifyingGlass} className='text-xs text-black/50'></FontAwesomeIcon>  {song.songName}</p>
         </div>
       ))}
     </div>
   )}
           </div>
         </div>
<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
<div className=" group hover:bg-white/40 delay-100 
bg-white/30 rounded-full h-52 w-52 p-1  mb-4 relative transition-all flex justify-center items-center">
{ answerStyling == undefined &&
<div className='bg-white h-auto w-auto px-3 py-3 absolute text-black rounded-full 
top-[-15px] left-[-5px]'>{songClipLength.toFixed(1)}</div>
}
{answerStyling !== undefined &&
<img src={songCoverImg} className='w-full  rounded-full h-full  duration-150'></img>
}
{answerStyling == undefined && showPlayButton &&
<>
<button className='group-hover:scale-95 absolute text-7xl transition-all duration-150 cursor-pointer text-white ' onClick={playAudio}><FontAwesomeIcon icon={faPlay}/></button>
<div className='absolute flex h-auto w-auto bottom-5'>
<div className={`bg-white h-2 w-2 m-1 rounded-full ${shouldAnimatePlayBounce ? 'animate-bounce1' : ''}`}></div>
<div className={`bg-white h-2 w-2 m-1 rounded-full ${shouldAnimatePlayBounce ? 'animate-bounce2' : ''}`}></div>
<div className={`bg-white h-2 w-2 m-1 rounded-full ${shouldAnimatePlayBounce ? 'animate-bounce3' : ''}`}></div>
<div className={`bg-white h-2 w-2 m-1 rounded-full ${shouldAnimatePlayBounce ? 'animate-bounce4' : ''}`}></div>
</div>


</>
}
{answerStyling !== undefined &&
<p className={`absolute text-white ${
 answerStyling === true ? "bg-green-600" : "bg-red-600 animate-rotate180"
} flex justify-center items-center text-4xl h-20 w-20 rounded-full`}>
 {answerStyling === true ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faXmark} />}
</p>
}

{/* <img 
src="https://i.pinimg.com/originals/c7/5c/b5/c75cb54db62c80c81855ce07f4c4f856.png"
className='w-4/5 rounded-md h-full' alt="" /> */}

</div>


</div>


  
 
 <div className='mb-4 hidden '><audio ref={audioRef} src={clipUrl} controls autoPlay /></div>


</div>
{/* here */}
<div className='custom-gradient left-0 from-white h-2/5 w-full flex flex-col justify-center items-center text-center UserUIBottom'>
{answerStyling !== undefined &&
<div  ref={clickyDivRef} id="clickyDiv"
onClick={handleDivClick} className='mb-1 text-black text-2xl font-bold tracking-wide mt-4'>Avicii</div>
}
<div 

className={`text-lg font-medium text-black  ${answerStyling !== undefined ? (answerStyling === false ? "text-red-600 mb-1 line-through" : "text-gray-900 mb-4") : "mb-4"}`}


> 
{pickedSong}

</div>
{answerStyling === false &&
<div className='mb-8 text-xl '>
{songName}
</div>
}
<div className="flex justify-center items-center w-full space-x-1">
{pickedSong.length > 1 &&  answerStyling === undefined &&

<button onClick={submitSongGuessHandler} class="h-11 w-1/3 px-4 bg-cyan-600  text-white rounded-md focus:outline-none">
     Go
 </button>
 
}
{answerStyling !== undefined &&
<button  onClick={fetchRandomClip}
className=' btn h-11 w-1/3 px-4
bg-blue-500  font-bold text-white  focus:outline-none

button  py-2 mb-5 mt-1 rounded-lg cursor-pointer select-none
 active:translate-y-2  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841]
 active:border-b-[0px]
 transition-all duration-150 [box-shadow:0_10px_0_0_#1b6ff8,0_15px_0_0_#1b70f841]
 border-b-[1px] border-blue-400'>
Next
</button>
}
</div>

</div>


</div>
   )}
  <div className="flex justify-center items-center w-full space-x-1">

  <button className='btn ' onClick={quitHandler}>
 <span class='btnSpan '>Quit</span>
</button>

<button className='btn '>
 <span class='btnSpan '>Settings</span>
</button>

<button className='btn ' onClick={modeClickHandler}>
 <span class='btnSpan '>Mode</span>
</button>

<button className='btn ' onClick={fetchRandomClip}>
 <span class='btnSpan '>{buttonText}</span>
</button>
</div>

 </div>
  }
    
    
    </div>
  );
}

export default App;
