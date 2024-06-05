export function timeAgo(dateString: string): string {

    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = [
        {label: 'ano', seconds: 31536000},
        {label: 'mês', seconds: 2592000},
        {label: 'dia', seconds: 86400},
        {label: 'hora', seconds: 3600},
        {label: 'minuto', seconds: 60},
        {label: 'segundo', seconds: 1}
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `Há ${count} ${interval.label}${count > 1 ? 's' : ''}`;
        }
    }

    return 'Agora mesmo';
}