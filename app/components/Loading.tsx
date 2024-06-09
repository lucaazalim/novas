type LoadingProps = {
    className?: string;
}

export default function Loading({className}: LoadingProps) {
    return <div className={`bg-gray-300 rounded-xl animate-pulse ${className}`}/>
}