export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] bg-slate-50/50 py-16">
            <div className="relative flex items-center justify-center">
                <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute w-8 h-8 bg-blue-600/10 rounded-full animate-ping"></div>
            </div>
            <p className="mt-6 text-gray-600 font-semibold tracking-wide text-sm animate-pulse">
                Loading luxury experiences...
            </p>
        </div>
    );
}
