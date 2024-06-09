import Modal from "@/app/components/modal/Modal";
import {Countries, Country} from "@/app/utils/news";
import {getFlagEmoji} from "@/app/utils/emoji";

type CountrySelectorProps = {
    isOpen: boolean;
    onClose: () => void;
    selected: Country;
    select: (country: Country) => void;
}

export default function CountrySelector({isOpen, onClose, selected, select}: CountrySelectorProps) {

    if (!isOpen) {
        return null;
    }

    return <Modal title="Select a country" isOpen={isOpen} onClose={onClose}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {
                Countries.map(country => {

                    const isSelected = selected === country;

                    return <button
                        key={country.code}
                        onClick={() => {
                            select(country);
                            onClose();
                        }}
                        className={`text-left text-xl rounded-xl hover:bg-gray-300 bg-gray-200 p-2 ${isSelected ? "outline-dashed outline-2 outline-gray-400" : ""}`}>
                        {getFlagEmoji(country.code)} {country.name}
                    </button>;

                })
            }
        </div>
    </Modal>

}