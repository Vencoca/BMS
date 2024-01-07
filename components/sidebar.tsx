export default function Sidebar({children}: {children?: React.ReactNode}){
    return <div className="w-1/4 sticky h-screen bg-blue-400 border-r-2 border-blue-700 p-8 flex-shrink-0">
        {children}
    </div>
}