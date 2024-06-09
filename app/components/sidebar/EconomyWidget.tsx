"use client";

import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';

import {Line} from "react-chartjs-2";
import {formatPrice, Quote} from "@/app/utils/economy";
import {useEffect, useState} from "react";
import Loading from "@/app/components/Loading";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            ticks: {
                display: false
            }
        },
        y: {
            ticks: {
                display: false
            }
        }
    },
    plugins: {
        legend: {
            display: false
        }
    },
    interaction: {
        intersect: false,
        mode: "index"
    },
};

type EconomyWidgetProps = {
    symbol: string;
    displaySymbol?: string;
    displayName?: string;
}

export default function EconomyWidget({symbol, displaySymbol = symbol, displayName}: EconomyWidgetProps) {

    const [data, setData] = useState<Quote>();

    useEffect(() => {
        fetch('/api/economy?symbol=' + symbol)
            .then((response) => response.json())
            .then((data) => setData(data));
    }, []);

    if (!data) {
        return <Loading className="h-28"/>;
    }

    const {
        shortName,
        lastPrice,
        changePercent,
        historicalPrices
    } = data;

    if (!displayName) {
        displayName = shortName;
    }

    const color = changePercent < 0 ? "#ae0a0a" : "#099f09";
    const tailwindColor = changePercent < 0 ? "text-[#ae0a0a]" : "text-[#099f09]";

    const chartLabels = historicalPrices.map((price) => {
        // Not sure why I need to convert it back to Date here.
        return new Date(price.date).toLocaleDateString("en-GB");
    });

    const chartData = {
        labels: chartLabels,
        datasets: [
            {
                label: displaySymbol,
                data: historicalPrices.map((price) => price.close),
                borderColor: color,
                pointRadius: 0,
                tension: 0.1,
            },
        ],
    };

    return <div className="flex flex-col">
        <div className="flex justify-between mb-3">
            <div>
                <p className="font-bold break-words">{displaySymbol}</p>
                <p className="text-sm">{displayName}</p>
            </div>
            <div className="text-right">
                <p className={`text-xl font-bold ${tailwindColor}`}>{changePercent.toFixed(2)}%</p>
                <p className="text-sm">{formatPrice(lastPrice, symbol)}</p>
            </div>
        </div>
        <div className="col-span-4 h-24">
            {/* @ts-ignore */}
            <Line data={chartData} options={options}/>
        </div>
    </div>;

}