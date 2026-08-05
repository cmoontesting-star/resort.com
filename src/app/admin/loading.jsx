export default function AdminLoading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-16">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="text-gray-700 font-semibold text-base">Loading dashboard data...</span>
            </div>
        </div>
    );
}
