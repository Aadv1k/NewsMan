export default function Navbar() {
    return (
        <nav className="p-4 flex justify-between items-center max-w-5xl mx-auto">
            <span className="font-bold text-2xl">NewsMan</span>

            <ul className="flex gap-3 justify-center">
                <li><a className="text-gray-500" href="#">Service</a></li>
                <li><a className="text-gray-500" href="#">Quickstart</a></li>
                <li><a className="text-gray-500" href="#">Examples</a></li>
            </ul>


            <div className="flex gap-2">
                <button className="text-gray-800  px-4 py-1 rounded-md">Login</button>
                <button className="bg-gray-800 text-white px-4 py-1 text-sm rounded-md shadow shadow-lg">Sign Up</button>
            </div>

        </nav>
    )
}
