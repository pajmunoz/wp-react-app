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
    const [visible, setVisible] = useState<boolean>(true);
    const [showButton, setShowButton] = useState<boolean>(false);
    const lastScrollY = useRef<number>(window.scrollY);
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

    // Hide menu on scroll down, show on scroll up
    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            if (currentY > lastScrollY.current + 10) {
                setVisible(false);
                setShowButton(true);
            } else if (currentY < lastScrollY.current - 10) {
                setVisible(true);
                setShowButton(false);
            }
            lastScrollY.current = currentY;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Animations styles
    const navStyle: React.CSSProperties = {
        position: 'fixed',
        top: '50%',
        right: 0,
        left: 'auto',
        transform: visible ? 'translateY(-50%) translateX(0)' : 'translateY(-50%) translateX(120%)',
        opacity: visible ? 1 : 0,
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        borderRadius: '8px 0 0 8px',
        boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
        padding: '0.5rem 0.5rem',
        transition: 'transform 0.4s cubic-bezier(.4,2,.6,1), opacity 0.4s cubic-bezier(.4,2,.6,1)',
        pointerEvents: visible ? 'auto' : 'none'
    };

    const buttonStyle: React.CSSProperties = {
        position: 'fixed',
        top: '50%',
        right: 10,
        transform: 'translateY(-50%)',
        zIndex: 1100,
        background: '#222',
        color: '#fff',
        border: 'none',
        borderRadius: '50%',
        width: 48,
        height: 48,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        opacity: showButton ? 1 : 0,
        pointerEvents: showButton ? 'auto' : 'none',
        transition: 'opacity 0.3s'
    };

    return (
        <>
            <nav style={navStyle}>
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
            <button
                style={buttonStyle}
                aria-label="Show menu"
                onClick={() => {
                    setVisible(true);
                    setShowButton(false);
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2" fill="none"/>
                    <path d="M8 12h8M12 8v8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </button>
        </>
    );
}