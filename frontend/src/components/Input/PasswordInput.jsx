import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash} from "react-icons/fa6"

const PasswordInput = ({value, onChange, placeholder }) => {

    const [isVisiblePassword, setIsVisiblePassword] = useState(false);

    const togglePassword = () => {
        setIsVisiblePassword(!isVisiblePassword);
    }

  return  (
    <div className="flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3 outline-none">
        <input 
            value={value}
            onChange={onChange}
            type={isVisiblePassword ? "text" : "password"}
            placeholder={placeholder || "Password"}
            className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
        />

        {isVisiblePassword ? <FaRegEye   
            size={22}
            className="text-primary cursor-pointer"
            onClick={() => togglePassword()}
        /> : <FaRegEyeSlash 
            size={22}
            className="text-slate-400 cursor-pointer"
            onClick={() => togglePassword()}
        />}
    </div>
  )
};

export default PasswordInput