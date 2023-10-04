export default function Hero() {
    return (
        <div className="flex flex-col items-center my-12 gap-4">
            <h1 className=" text-gray-800 font-bold text-4xl font-serif tracking-tight max-w-[30ch] text-center">The completely <span className="text-gray-500">Free</span> and <span className="text-gray-500">Open-Source</span> NewsAPI alternative</h1>
            <p className="text-gray-500 text-center">Use our free API or set it up on your own machine, All goes!</p>

            <div className="flex gap-2">
            <button className="bg-gray-800 text-white px-4 py-3 font-semibold text-sm rounded-md">Get a Free API</button>
            <button className="text-gray-800 border border-gray-800 text-white px-4 py-3 font-semibold text-sm rounded-md">Read the docs</button>
            </div>

        </div>
    )
}
