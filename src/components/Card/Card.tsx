import { Link } from "react-router-dom";
import HtmlContent from "../../utils/HtmlContent";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


export default function CardItem({ id, title, date, excerpt, featuredImage, slug }: any) {
    return (


        <Card sx={{ maxWidth: 345 }} key={id}>
            <CardMedia
                sx={{ height: 140 }}
                image={featuredImage}
                title={title}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {!date ? <div className="content"><time>{date}</time></div> : ''}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small"> <Link to={`/project/${slug}`}>View more ▶︎</Link></Button>
            </CardActions>
        </Card>



    )
}
