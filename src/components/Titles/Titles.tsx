import './Titles.scss'
export default function Titles({title, color, themeMode, titleColor}: { title: string, color: string, themeMode: boolean, titleColor?: string }) {
    return (
        <p className={`title ${titleColor} ${themeMode?'has-text-white':'has-text-black'}`}>{title}<span className={`dot ${color}`}>.</span></p>
    )
}