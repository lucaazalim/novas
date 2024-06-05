import Featured from "@/app/components/Featured";
import Catalog from "@/app/components/Catalog";
import Sidebar from "@/app/components/Sidebar";

export default function Home() {
    return <>
        <Featured/>
        <div className="mt-10 grid grid-cols-3 gap-5">
            <div className="col-span-2">
                <Catalog/>
            </div>
            <Sidebar/>
        </div>
    </>;
}
