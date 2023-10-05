import Button from "./Button";

import { Link } from 'react-router-dom';

import { useContext } from "react";
import GlobalContext from "../GlobalContext";

export default function Navbar() {
   const globalContext = useContext(GlobalContext);
      
    return (
        <nav className="p-4 flex justify-between items-center max-w-5xl mx-auto">
            <span className="font-bold text-2xl">NewsMan</span>

            <ul className="flex gap-3 justify-center">


                <li> <Link to="/docs" className="text-gray-500"> Documentation </Link> </li>
                <li><a className="text-gray-500" href="https://github.com/aadv1k/newsman" target="_blank">GitHub</a></li>
            </ul>


            <div className="flex gap-2">
                <Button variant="secondary" className="shadow-none">Login</Button>
                <Button variant="primary" className="py-2">Sign Up</Button>
            </div>

        </nav>
    )
}
