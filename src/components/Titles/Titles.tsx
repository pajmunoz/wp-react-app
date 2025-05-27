import './Titles.scss'
export default function Titles({title, color}: { title: string, color: string }) {
    return (
        <p className="title">{title}<span className={`dot has-text-black ${color}`}>.</span></p>
    )
}