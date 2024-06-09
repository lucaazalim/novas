import {useEffect, useRef} from "react";
import ReactPortal from "@/app/components/modal/ReactPortal";
import {FaX} from "react-icons/fa6";

type ModalProps = {
    title?: string
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

export default function Modal({title, isOpen, onClose, children}: ModalProps) {

    const modalRef = useRef<HTMLDivElement>(null);

    // Handle ESC key
    useEffect(() => {
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.body.addEventListener("keydown", closeOnEscape);

        return () => {
            document.body.removeEventListener("keydown", closeOnEscape);
        };
    }, [onClose]);

    // Prevent scrolling
    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <ReactPortal wrapperId="react-portal-modal-container">

            {/* Modal Background */}
            <div className="fixed top-0 left-0 w-screen h-screen z-40 bg-black/30 backdrop-blur"/>

            {/* Modal */}
            <div
                className="fixed flex flex-col w-auto md:h-fit max-h-screen overflow-y-auto inset-0 z-50 bg-white md:rounded-xl md:m-10">
                <div className="flex items-center justify-between p-3 bg-gray-200">
                    <h1 className="text-xl font-semibold">{title}</h1>
                    <button className="rounded-xl p-2 bg-white hover:scale-110 transition-transform">
                        <FaX/>
                    </button>
                </div>
                <div
                    ref={modalRef}
                    className="p-5"
                >
                    {children}
                </div>
            </div>

        </ReactPortal>
    );
}
