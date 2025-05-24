import { Link } from "react-router-dom";
import HtmlContent from "../../utils/HtmlContent";


export default function Card({ id, title, Date, excerpt, featuredImage, slug}: any) {
    return (

        <div key={id} className="post">
            <img className="post_image" src={featuredImage} alt={title} />
            <Link to={`/project/${slug}`} className="post_link"><h1 className="post_title">{title}</h1></Link>
            <i className="post_date">{Date}</i>
            <div className="post_content">
                <HtmlContent htmlString={excerpt} />
            </div>
        </div>

    )
}
