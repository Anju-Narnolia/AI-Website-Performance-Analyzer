const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-700';
    return 'text-red-500';
};
const CircularProgress = ({ score, size = 180, strokeWidth = 8 }: { score: number; size?: number; strokeWidth?: number }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 90 ? '#029e3b' : score >= 70 ? '#facc15' : '#ff0303';

    return (
        <div className="relative " style={{ width: size, height: size }}>
            <svg className=" transform -rotate-90" width={size} height={size} >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-slate-700"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out p-1 "
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{Math.round(score)}</span>
            </div>
        </div>
    );
};
export default CircularProgress;