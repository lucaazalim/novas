import {FaArrowUpRightFromSquare} from "react-icons/fa6";

export default function Footer() {

    return <footer className="bg-primary">
        <div className="max-w-[1200px] px-5 py-10 mx-auto text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <FooterBlock className="flex justify-center">
                    <img src="/logo.svg" alt="logo" className="w-32"/>
                </FooterBlock>
                <FooterBlock>
                    <h1 className="font-bold text-xl mb-3">About</h1>
                    <p className="font-extralight">Novas is your go-to source for the latest updates around the world.
                        Our news are sourced from
                        reputable third parties, ensuring you receive a diverse and comprehensive view of current
                        events.</p>
                </FooterBlock>
                <FooterBlock className="flex flex-col justify-between gap-3">
                    <div>
                        <h1 className="font-bold text-xl mb-3">Open-source</h1>
                        <p className="font-extralight">Novas was built as a side project and is completely open-source.
                            Feel
                            free to contribute.</p>
                    </div>
                    <a about="_blank" href="https://github.com/lucaazalim/novas">
                        <button
                            className="flex items-center rounded-xl bg-white hover:bg-gray-100 text-primary font-bold p-3">
                            GitHub repository <FaArrowUpRightFromSquare className="ml-2"/>
                        </button>
                    </a>
                </FooterBlock>
            </div>
        </div>
    </footer>;

}

type FooterBlockProps = {
    children: React.ReactNode;
    className?: string;
}

function FooterBlock({children, className}: FooterBlockProps) {
    return <div
        className={`bg-gradient-to-tr from-secondary to-primary bg-opacity-15 rounded-xl p-5 ${className}`}>
        {children}
    </div>;
}