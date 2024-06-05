import Image from "next/image";

export default function Navbar() {
    return <nav className="bg-primary py-3">
        <div className="container mx-auto flex justify-center w-full">
            <Image src="/g2.svg" alt="" width="60" height="60"/>
        </div>
    </nav>;
}