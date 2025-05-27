import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const sections = [
    { id: "main", label: "Intro", color: "has-background-light" },
    { id: "about", label: "About me", color: "has-background-primary" },
    { id: "links", label: "Links", color: "has-background-link" },
    { id: "skills", label: "Skills", color: "has-background-info" },
    { id: "projects", label: "Projects", color: "has-background-danger" },
];

export default function ScrollMenu() {
    const location = useLocation();
    const [activeId, setActiveId] = useState<string>("main");
    const lastHash = useRef('');

    // Scroll to hash on location change
    useEffect(() => {
        if (location.hash) {
            lastHash.current = location.hash.slice(1);
        }
        if (lastHash.current && document.getElementById(lastHash.current)) {
            setTimeout(() => {
                document
                    .getElementById(lastHash.current)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                lastHash.current = '';
            }, 100);
        }
    }, [location]);

    // Detect scroll and set active section
    useEffect(() => {
        const handleScroll = () => {
            let found = "main";
            for (const section of sections) {
                const el = document.getElementById(section.id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 80) {
                        found = section.id;
                    }
                }
            }
            setActiveId(found);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            style={{
                position: 'fixed',
                top: '50%',
                right: 0,
                left: 'auto',
                transform: 'translateY(-50%)',
                background: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1000,
                borderRadius: '8px 0 0 8px',
                boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
                padding: '0.5rem 0.5rem'
            }}
        >
            <ul
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    alignItems: 'flex-end'
                }}
            >
                {sections.map(({ id, label, color }) => {
                    const isActive = activeId === id;
                    return (
                        <li key={id} style={{ position: "relative" }}>
                            <Link
                                className={color}
                                to={`#${id}`}
                                style={{
                                    display: "block",
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    border: isActive ? "2px solid #333" : "2px solid transparent",
                                    boxShadow: isActive ? "0 0 0 4px rgba(0,0,0,0.15)" : undefined,
                                    transition: "border 0.2s, box-shadow 0.2s",
                                    position: "relative",
                                }}
                                tabIndex={0}
                                aria-label={label}
                                onMouseEnter={e => {
                                    const tooltip = e.currentTarget.nextSibling as HTMLElement;
                                    if (tooltip) tooltip.style.opacity = "1";
                                }}
                                onMouseLeave={e => {
                                    const tooltip = e.currentTarget.nextSibling as HTMLElement;
                                    if (tooltip) tooltip.style.opacity = "0";
                                }}
                                onFocus={e => {
                                    const tooltip = e.currentTarget.nextSibling as HTMLElement;
                                    if (tooltip) tooltip.style.opacity = "1";
                                }}
                                onBlur={e => {
                                    const tooltip = e.currentTarget.nextSibling as HTMLElement;
                                    if (tooltip) tooltip.style.opacity = "0";
                                }}
                            />
                            <span
                                style={{
                                    position: "absolute",
                                    right: "120%",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "rgba(30,30,30,0.85)",
                                    color: "#fff",
                                    padding: "0.25rem 0.75rem",
                                    borderRadius: 6,
                                    whiteSpace: "nowrap",
                                    pointerEvents: "none",
                                    opacity: 0,
                                    transition: "opacity 0.2s",
                                    fontSize: 14,
                                    zIndex: 10,
                                }}
                            >
                                {label}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}