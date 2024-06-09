"use client";

type SidebarWidgetProps = {
    title: React.ReactNode,
    children: React.ReactNode
}

export default function SidebarWidget({title, children}: SidebarWidgetProps) {
    return <div className="bg-white rounded-xl border-2 h-fit">
        <div className="border-b-2 p-4">
            <h1 className="font-bold">
                {title}
            </h1>
        </div>

        <div className="p-4">
            {children}
        </div>
    </div>
}