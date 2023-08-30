import { useNavigate } from "react-router-dom"
import { authService } from "../services/auth.services"
import { useState } from "react"

const Login = () => {
    const [sc,setSc] = useState('none')
    const close = () => {
        setSc("none")
    }
    const [content,setContent] = useState("loading...")
    const navigate = useNavigate()
    const submitLogin = () => {
        let email = document.getElementById("email").value
        let password = document.getElementById("password").value
        setSc('loading')
        setContent("loading...")
        authService.login(email,password).then(function(response){
            if(response === true){
                setSc("done")
                console.log(response)
                navigate('/')
            }else{
                setContent(response)
                console.log(response)
            }
        })

    } 
    const submitSignup = () => {
        let email = document.getElementById("email").value
        let password = document.getElementById("password").value
        setSc('loading')
        setContent("loading...")
        authService.signup(email,password).then(function(response){
            if(response === true){
                navigate('/')
            }else{
                setContent(response)
                console.log(response)
            }
        })

    }
  return (
    <div className="absolute w-full h-full bg-primary flex justify-around">
        <div className="absolute h-[50%] top-[25%] w-[400px]">
            <p className="text-white ubuntu text-[16px]">Email</p>
            <input className="w-full mt-3 border-2 border-positive rounded-[8px] bg-primary focus:outline-none text-white pl-2 focus:border-white"  type="text" name="amount" id="email"/>
            <p className="text-white ubuntu text-[16px] mt-3">Password</p>
            <input className="w-full mt-3 border-2 border-positive rounded-[8px] bg-primary focus:outline-none text-white pl-2 focus:border-white"  type="password" name="amount" id="password"/>
            <button className="w-[100%] bg-positive text-white h-[48px] ubuntu font-semibold rounded-[8px] mt-6" onClick={submitLogin}>Log in</button>
            <button className="w-[100%] bg-positive text-white h-[48px] ubuntu font-semibold rounded-[8px] mt-6" onClick={submitSignup}>Sign Up</button>
        </div>
        <div className={`flex flex-col justify-between absolute top-0 bg-primary border rounded-[20px] w-[400px] h-[40%] top-[25%] p-6 ${sc === 'loading'? 'block':'hidden'} ${content === "loading..."?"border-positive":"border-negative"}`}>
            <div className="flex justify-end">
                <button className={`text-white bg-negative w-[22px] h-[22px] rounded-[50%] ${content != 'loading...'?'block':"hidden"}`} onClick={close}>X</button>
            </div>
            <div className="m-auto">
                <p className="text-white text-[20px] ubuntu">{content}</p>
            </div>      
      </div>
    </div>
  )
}

export default Login