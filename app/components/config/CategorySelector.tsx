import Modal from "@/app/components/modal/Modal";
import {Categories, Category} from "@/app/utils/news";
import {IconType} from "react-icons";

type CategorySelectorProps = {
    isOpen: boolean;
    onClose: () => void;
    selected?: Category;
    select: (country: Category) => void;
}

export default function CategorySelector({isOpen, onClose, selected, select}: CategorySelectorProps) {

    if (!isOpen) {
        return null;
    }

    return <Modal title="Select a category" isOpen={isOpen} onClose={onClose}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {
                Categories.map(category => {

                    const isSelected = selected === category;
                    const Icon: IconType = category.icon;

                    return <button
                        key={category.key}
                        onClick={() => {
                            select(category);
                            onClose();
                        }}
                        className={`grid grid-cols-1 justify-items-center text-xl rounded-xl hover:bg-gray-300 bg-gray-200 p-2 ${isSelected ? "outline-dashed outline-2 outline-gray-400" : ""}`}>
                        <Icon className="text-5xl"/>
                        {category.name}
                    </button>;

                })
            }
        </div>
    </Modal>

}