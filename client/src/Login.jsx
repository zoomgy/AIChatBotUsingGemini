import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [error,setError] = useState("");
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [login,setLogin] = useState("Login");

  useEffect( ()=>{
    try {
      (async ()=>{
        const response = await fetch("https://aichatbotusinggeminibackend.onrender.com/verify-token",{
          credentials: 'include'
        });
        const isAuthenticated = await response.json();
        if((isAuthenticated.message === 'Token is valid')){
            navigate("/");
        }
      })();
    } catch (error) {
      console.log(error);
    }
  },[]);




  if(error!==""){
    setTimeout(()=>{
      setError("");
    },4000);
  }
  const handleClick = (event)=>{
    if(event.target.innerHTML==="Login"){
      setLogin("Register");
    }else{
      setLogin("Login");
    }
  }
  const handleSubmit = async (event)=>{
    event.preventDefault();
    let payload = {};
    if(login === "Register"){
      payload = {
        email,password
      }
      const response = await fetch("https://aichatbotusinggeminibackend.onrender.com/login",{
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      const m = await response.json();
      setError(m.error || "");
      if(m.error === undefined){
        navigate("/");
      }
    }else{
      payload = {
        email,name,password
      }
      const response = await fetch("https://aichatbotusinggeminibackend.onrender.com/register",{
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      const m = await response.json();
      setError(m.error || "");
      if(m.error === undefined){
        navigate("/");
      }
    }
  }
  return (
    <div className='flex justify-center items-center w-full h-screen bg-gray-100 font-mono transition-all'>
        <div className='w-full max-w-sm h-3/6 bg-white rounded-lg shadow-lg'>
            <form onSubmit={handleSubmit} className='w-full h-full flex flex-col gap-3 items-center justify-center'>
                {login === "Login" && <input onChange={(event)=>setName(event.target.value)} id="name" className='focus:outline-none text-2xl text-center hover:border p-3 rounded-lg' type="text" placeholder='Name' />}
                <input onChange={(event)=>setEmail(event.target.value)} id="email" className='focus:outline-none text-2xl text-center hover:border p-3 rounded-lg' type="text" placeholder='Email' />
                <input onChange={(event)=>setPassword(event.target.value)} id='password' className='focus:outline-none text-2xl text-center hover:border p-3 rounded-lg' type="password" placeholder='Password' />
                <button className='bg-blue-200 p-3 hover:bg-blue-300 hover:rounded-lg transition-all'>Submit</button>
            </form>
            <div className='items-center min-h-10 flex gap-2 p-1 justify-center'>
                {!(error==="") && <p className='text-red-500'>{error}</p>}
            </div>
            <div className='flex gap-2 p-1 justify-center'>
              <p>{login === "Login" ? "Already Have An Account?" : "Dont Have An Account?"}</p>
              <button className='text-blue-600 hover:opacity-70' onClick={handleClick} type='button'>{login}</button>
            </div>
        </div>
    </div>
  )
}

export default Login