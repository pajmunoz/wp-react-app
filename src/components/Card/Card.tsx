import { Link } from "react-router-dom";
import HtmlContent from "../../utils/HtmlContent";


export default function Card({ id, title, date, excerpt, featuredImage, slug }: any) {
    return (

        <div className="card" key={id}>
            <div className="card-image">


                <figure className="image is-4by3">
                    <img
                        src={featuredImage} alt={title}
                    />
                </figure>
            </div>
            <div className="card-content">
                <div className="media">
                    <div className="media-left">
                        <Link to={`/project/${slug}`}><h1>{title}</h1></Link>
                    </div>
                </div>



                {!date ? <div className="content"><time>{date}</time></div> : ''}

            </div>
        </div>

    )
}
