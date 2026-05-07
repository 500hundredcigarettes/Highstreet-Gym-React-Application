import React, { useState } from "react";
import { useAuthenticate } from "../authentication/useAuthenticate.jsx";
import { fetchAPI } from "../api.mjs";

export function EditProfile() {
  const { user, refresh } = useAuthenticate();
  const id = user.id
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [address, setAddress] = useState(user.address);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gym, setGym] = useState(user.gymId.locationTitle);
  const [status, setStatus] = useState("")
  const [errors, setErrors] = useState({});


  const validateForm = () => {
    const newErrors = {};

    if (!firstName) {
      newErrors.firstName = "This field is required";
    } else if (!/^[a-zA-Z0-9]+(?:[ \'-][a-zA-Z0-9]+)*$/.test(firstName)) {
      newErrors.firstName = "Invalid format";
    }

    if (!lastName) {
      newErrors.lastName = "This field is required";
    } else if (!/^[a-zA-Z0-9]+(?:[ \'-][a-zA-Z0-9]+)*$/.test(lastName)) {
      newErrors.lastName = "Invalid format";
    }

    if (!email) {
      newErrors.email = "This field is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = "This field is required";
    } else if (!/^[0-9]+$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Phone Number can only contain numbers";
    } else if (phoneNumber.length < 10) {
      newErrors.phoneNumber = "Value should be at least 10 characters";
    }

    if (!address) {
      newErrors.address = "This field is required";
    } else if (!/^[a-zA-Z0-9\s]+$/.test(address)) {
      newErrors.address = "Address can only contain letters, numbers, and spaces";
    }

    if (password) {
      if (password.length < 6) {
        newErrors.password = "Value should be at least 6 characters";
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords don't match";
      }
    } else if (confirmPassword) {
      newErrors.password = "Password is required if confirming";
    }

    if (!gym) {
      newErrors.gym = "This field is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      fetchAPI("POST", "/update", {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        password,
        gym,
        id
      }).then(response => setStatus(response.body.message))
      
    } else {
      setStatus("")
    }
  };

  const inputClass = "p-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300";
  const errorInputClass = "p-2 border border-red-500 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500";
  const labelClass = "mb-1 text-left font-medium text-gray-700";
  const errorClass = "text-sm text-red-500 mt-1";

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md">
      <p className="text-sky-300">{status}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="firstName" className={labelClass}>
            First Name:
          </label>
          <input
            className={errors.firstName ? errorInputClass : inputClass}
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            type="text"
          />
          {errors.firstName && <span className={errorClass}>{errors.firstName}</span>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="lastName" className={labelClass}>
            Last Name:
          </label>
          <input
            className={errors.lastName ? errorInputClass : inputClass}
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            type="text"
          />
          {errors.lastName && <span className={errorClass}>{errors.lastName}</span>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className={labelClass}>
            Email:
          </label>
          <input
            className={errors.email ? errorInputClass : inputClass}
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
          />
          {errors.email && <span className={errorClass}>{errors.email}</span>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="phoneNumber" className={labelClass}>
            Phone Number:
          </label>
          <input
            className={errors.phoneNumber ? errorInputClass : inputClass}
            id="phoneNumber"
            name="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            type="text"
          />
          {errors.phoneNumber && <span className={errorClass}>{errors.phoneNumber}</span>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="address" className={labelClass}>
            Address:
          </label>
          <input
            className={errors.address ? errorInputClass : inputClass}
            id="address"
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            type="text"
          />
          {errors.address && <span className={errorClass}>{errors.address}</span>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className={labelClass}>
            Password (keep empty to retain):
          </label>
          <input
            className={errors.password ? errorInputClass : inputClass}
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          {errors.password && <span className={errorClass}>{errors.password}</span>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="confirmPassword" className={labelClass}>
            Confirm Password:
          </label>
          <input
            className={errors.confirmPassword ? errorInputClass : inputClass}
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
          />
          {errors.confirmPassword && <span className={errorClass}>{errors.confirmPassword}</span>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="gym" className={labelClass}>
            Select Gym:
          </label>
          <select
            className={errors.gym ? errorInputClass : inputClass}
            id="gym"
            name="gym"
            value={gym}
            onChange={(e) => setGym(e.target.value)}
          >
            <option value="Ashgrove High Street Gym">Ashgrove High Street Gym</option>
            <option value="City District High Street Gym">City District High Street Gym</option>
            <option value="Chermside High Street Gym">Chermside High Street Gym</option>
          </select>
          {errors.gym && <span className={errorClass}>{errors.gym}</span>}
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <button type="submit"
            className="bg-sky-300 text-white w-40 p-3 text-xl rounded-md hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300"
          >
            Confirm Edit
          </button>

        </div>
      </form>
    </div>
  );
}

export default EditProfile;