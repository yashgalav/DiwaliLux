

export default function ProductSkeleton() {
    return (
        <div className="rounded-xl relative overflow-hidden border-0 shadow-md bg-white/80 backdrop-blur-sm animate-pulse">
            <div className="p-0">
                <div className="relative group">
                    <div className="w-full h-64 bg-gray-300" />
                    <div className="absolute top-4 right-4 bg-white/60 backdrop-blur-sm rounded-lg h-8 w-8" />
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="h-5 bg-gray-300 rounded w-1/2" />
                        <div className="h-4 bg-gray-200 rounded w-16" />
                    </div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4" />
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="h-6 bg-gray-300 rounded w-16" />
                        <div className="h-5 bg-gray-200 rounded w-14" />
                        <div className="h-4 bg-gray-300 rounded w-12" />
                    </div>
                    <ul className="space-y-2 mb-6">
                        {[1, 2, 3].map((i) => (
                            <li key={i} className="h-4 bg-gray-200 rounded w-full" />
                        ))}
                    </ul>
                    <div className="flex gap-2">
                        <div className="h-10 rounded-lg bg-gray-300 w-full" />
                        <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    )
}
