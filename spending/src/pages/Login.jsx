import {  redirect } from "react-router-dom"
import { authService } from "../services/auth.services"

const Login = () => {
    const submitLogin = () => {
        let email = document.getElementById("email").value
        let password = document.getElementById("password").value
        authService.login(email,password).then(function(response){
            if(response){
                console.log("redirecting")
                window.location.href = `https://${window.location.host}/`
            }else{
                console.log(response)
            }
        })

    } 
    const submitSignup = () => {
        let email = document.getElementById("email").value
        let password = document.getElementById("password").value
        authService.signup(email,password).then(function(response){
            if(response){
                window.location.href = `https://${window.location.host}/`
                return (redirect('/'))
            }else{
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
    </div>
  )
}

export default Login