import { useEffect, useState } from "react"
import { useAuthenticate } from "./useAuthenticate.jsx"
import { useNavigate } from "react-router"

function Signup() {
    const navigate = useNavigate()
    const { signup } = useAuthenticate()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [address, setAddress] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [gym, setGym] = useState("Ashgrove High Street Gym")

return <section className="flex flex-col gap-4 p-10">
          <h1 className="text-3xl font-bold text-center text-white mb-15">Register Today!</h1>
            <label htmlFor="firstName" className="text-left">First Name:</label>
            <input className="p-1 bg-white text-black focus:outline-0" name="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} type="text"/>

            <label htmlFor="lastName" className="text-left">Last Name:</label>
            <input className="p-1 bg-white text-black focus:outline-0" name="lastName" value={lastName} onChange={e => setLastName(e.target.value)} type="text"/>

            <label htmlFor="email" className="text-left">Email:</label>
            <input className="p-1 bg-white text-black focus:outline-0" name="email" value={email} onChange={e => setEmail(e.target.value)} type="text"/>

            <label htmlFor="phoneNumber" className="text-left">Phone Number:</label>
            <input className="p-1 bg-white text-black focus:outline-0" name="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} type="text"/>

            <label htmlFor="address" className="text-left">Address:</label>
            <input className="p-1 bg-white text-black focus:outline-0" name="address" value={address} onChange={e => setAddress(e.target.value)} type="text"/>

            <label htmlFor="password" className="text-left">Password:</label>
            <input className="p-1 bg-white text-black focus:outline-0" name="password" value={password} onChange={e => setPassword(e.target.value)} type="password"/>

            <label htmlFor="confirmPassword" className="text-left">Confrim Password:</label>
            <input className="p-1 bg-white text-black focus:outline-0" name="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type="password"/>

            <label htmlFor="gym" className="text-left">Select Gym:</label>
            <select className="p-1 bg-white text-black focus:outline-0" name="gym" onChange={e => setGym(e.target.value)}>
              <option value="Ashgrove High Street Gym">Ashgrove High Street Gym</option>
              <option value="City District High Street Gym">City District High Street Gym</option>
              <option value="Chermside High Street Gym">Chermside High Street Gym</option>
            </select>
            <button className="mt-10 text-2xl bg-sky-300 p-2 w-45 m-auto rounded-2xl" onClick={() => {signup(firstName, lastName, email, phoneNumber, address, password, confirmPassword, gym)}}>Signup</button>
        </section>
}

export default Signup