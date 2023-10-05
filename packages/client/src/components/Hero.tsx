import Button from "./Button";

export default function Hero() {
    return (
        <div className="flex flex-col items-center mt-12 mb-10 gap-6 px-2">
            <h1 className="text-gray-800 font-bold text-5xl font-serif tracking-tight max-w-[30ch] text-center">The completely <span className="text-gray-500">Free</span> & <span className="text-gray-500">Open-Source</span> NewsAPI alternative</h1>
            <p className="text-gray-500 text-center max-w-[60ch] leading-normal">Use the (mostly) free and unlimited API or host it on your on machine, supports a vast catalog of continuously growing news sources</p>
            <Button className="w-1/2 py-3 font-semibold sm:w-1/4" variant="primary">Get a Free API Key</Button>
        </div>
    )
}
