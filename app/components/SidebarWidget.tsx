type SidebarWidgetProps = {
    title: string,
    children: React.ReactNode
}

export default async function SidebarWidget({title, children}: SidebarWidgetProps) {
    return <div className="bg-white p-4 rounded-xl h-fit">
        <h1 className="font-bold text-xl mb-4">
            {title}
        </h1>
        {children}
    </div>
}