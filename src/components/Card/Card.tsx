import { Link } from "react-router-dom";
import HtmlContent from "../../utils/HtmlContent";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


export default function CardItem({ id, title, date, excerpt, featuredImage, slug, isEnglish }: any) {
    return (


        <Card key={id}>
            <CardMedia
                sx={{ height: 110 }}
                image={featuredImage}
                title={title}
            />
            <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                    {title}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small"> <Link to={`/project/${slug}`}>{isEnglish?'View more ▶︎':'Ver más ▶︎'}  </Link></Button>
            </CardActions>
        </Card>



    )
}
