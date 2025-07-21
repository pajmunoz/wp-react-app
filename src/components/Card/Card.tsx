import { Link } from "react-router-dom";
import HtmlContent from "../../utils/HtmlContent";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


export default function CardItem({ id, title, date, excerpt, featuredImage, slug, isEnglish }: any) {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (cardRef.current) {
            // Hover animations
            const card = cardRef.current;
            
            // Initial state
            gsap.set(card, { 
                transformOrigin: "center center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            });

            // Hover enter animation
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    duration: 0.3,
                    scale: 1.05,
                    y: -10,
                    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                    ease: "power2.out"
                });
            });

            // Hover leave animation
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    duration: 0.3,
                    scale: 1,
                    y: 0,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    ease: "power2.out"
                });
            });

            // Click animation
            card.addEventListener('click', () => {
                gsap.to(card, {
                    duration: 0.1,
                    scale: 0.95,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.out"
                });
            });
        }

        return () => {
            if (cardRef.current) {
                cardRef.current.removeEventListener('mouseenter', () => {});
                cardRef.current.removeEventListener('mouseleave', () => {});
                cardRef.current.removeEventListener('click', () => {});
            }
        };
    }, []);

    return (
        <Card ref={cardRef} key={id} sx={{ 
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
                transform: 'translateY(-5px)',
            }
        }}>
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
                <Button size="small"> 
                    <Link to={`/${slug}`}>
                        {isEnglish ? 'View more ▶︎' : 'Ver más ▶︎'}
                    </Link>
                </Button>
            </CardActions>
        </Card>
    );
}
