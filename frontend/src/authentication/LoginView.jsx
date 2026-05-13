import { useEffect, useState } from "react"
import { useAuthenticate } from "./useAuthenticate.jsx"
import { useNavigate } from "react-router"

function Login() {
    const navigate = useNavigate()
    const { login, status, user } = useAuthenticate()     
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [counter, setCounter] = useState(0);

return <section className="flex flex-col gap-4 p-10">
          <h1 className="text-3xl font-bold text-center text-white mb-15">Welcome to High Street Fitness</h1>
            <label htmlFor="email" className="text-left">Email:</label>
            <input className="p-1 bg-white text-black focus:outline-0" value={email} onChange={e => setEmail(e.target.value)} type="text"/>

            <label htmlFor="password" className="text-left">Password:</label>
            <input className="p-1 bg-white text-black focus:outline-0" value={password} onChange={e => setPassword(e.target.value)} type="password"/>
            {status && status != "authenticating" && <span className="text-xl font-bold italic text-center">{status}</span>}
            <button className="mt-10 text-2xl bg-sky-300 p-2 w-45 m-auto rounded-2xl" onClick={() => {login(email, password)}}>Login</button>
        </section>
}

export default Login
