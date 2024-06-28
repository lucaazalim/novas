type DivisorProps = {
    className?: string;
}

export default function Divisor({className}: DivisorProps) {
    return <div className={`border ${className}`}/>;
}