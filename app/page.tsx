"use client";

import Catalog from "@/app/components/Catalog";
import {
    Categories,
    Category,
    Country,
    getCategoryByKey,
    getCountryByCode,
    NewsResponse,
    UnitedStates
} from "@/app/integrations/news/news";
import {useEffect, useState} from "react";
import Featured from "@/app/components/Featured";
import CountrySelector from "@/app/components/config/CountrySelector";
import {FaEdit} from "react-icons/fa";
import CategorySelector from "@/app/components/config/CategorySelector";
import Sidebar from "@/app/components/sidebar/Sidebar";
import Loading from "@/app/components/Loading";
import fetchNews from "@/app/integrations/news/fetchNews";

export default function Home() {

    const [country, setCountry] = useState<Country>();
    const [category, setCategory] = useState<Category>();
    const [news, setNews] = useState<NewsResponse | undefined>(undefined);
    const [isCountrySelectorOpen, setCountrySelectorOpen] = useState(false);
    const [isCategorySelectorOpen, setCategorySelectorOpen] = useState(false);

    useEffect(() => {
        const storedCountryCode = localStorage.getItem("country");
        if (storedCountryCode) {
            const storedCountry = getCountryByCode(storedCountryCode);
            if (storedCountry) {
                setCountry(storedCountry);
            }
        } else {
            setCountry(UnitedStates);
        }
    }, []);

    useEffect(() => {
        const storedCategoryKey = localStorage.getItem("category");
        if (storedCategoryKey) {
            const storedCategory = getCategoryByKey(storedCategoryKey);
            if (storedCategory) {
                setCategory(storedCategory);
            }
        } else {
            setCategory(Categories[0]);
        }
    }, []);

    useEffect(() => {

        if (!country || !category) {
            return;
        }

        fetchNews(country.code, category.key)
            .then(data => setNews(data));

    }, [country, category]);

    return <>
        {isCountrySelectorOpen && (
            <CountrySelector
                isOpen={isCountrySelectorOpen}
                onClose={() => setCountrySelectorOpen(false)}
                selected={country}
                select={(country) => {
                    localStorage.setItem("country", country.code);
                    setCountry(country);
                }}
            />
        )}

        {isCategorySelectorOpen && (
            <CategorySelector
                isOpen={isCategorySelectorOpen}
                onClose={() => setCategorySelectorOpen(false)}
                selected={category}
                select={(category) => {
                    localStorage.setItem("category", category.key);
                    setCategory(category);
                }}
            />
        )}

        <div
            className="bg-white rounded-xl border-2 p-3 mb-5 inline-flex w-full gap-2 items-center justify-center">

            {!country || !category
                ? <Loading className="h-10 w-full"/>
                : <>
                    <span className="hidden sm:block">You are viewing news from</span>

                    <button
                        onClick={() => setCountrySelectorOpen(true)}
                        className="font-bold bg-gray-200 p-2 rounded-xl hover:bg-gray-300"
                    >
                        <div className="flex flex-row items-center gap-2">
                            <span>{country?.name}</span>
                            <FaEdit/>
                        </div>
                    </button>

                    <span className="hidden sm:block">about</span>

                    <button
                        onClick={() => setCategorySelectorOpen(true)}
                        className="font-bold bg-gray-200 p-2 rounded-xl hover:bg-gray-300"
                    >
                        <div className="flex flex-row items-center gap-2">
                            <span>{category?.name}</span>
                            <FaEdit/>
                        </div>
                    </button>
                </>
            }

        </div>

        <Featured news={news}/>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
                <Catalog news={news}/>
            </div>
            <div className="hidden lg:block">
                <Sidebar/>
            </div>
        </div>
    </>;
}
