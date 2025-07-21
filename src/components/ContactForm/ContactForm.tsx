import React, { useState } from 'react';
import { Button, TextField, Alert, CircularProgress, Box, Typography } from '@mui/material';
import { useLanguage } from '../../context/LanguageContext';
import './ContactForm.scss';

interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

interface ContactFormProps {
    isDarkMode: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({ isDarkMode }) => {
    const language = useLanguage();
    const isEnglish = language.language === 'en';

    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage('');

        try {
            const response = await fetch('https://portfolio-server-nine-green.vercel.app/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            } else {
                const errorData = await response.json();
                setSubmitStatus('error');
                setErrorMessage(errorData.message || 'Something went wrong');
            }
        } catch (error) {
            setSubmitStatus('error');
            setErrorMessage('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box className="container is-max-desktop">
            <div className="hero-body is-flex-wrap-wrap is-align-content-center">

            {submitStatus === 'success' && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    {isEnglish ? 'Message sent successfully! I\'ll get back to you soon.' : '¡Mensaje enviado con éxito! Te responderé pronto.'}
                </Alert>
            )}

            {submitStatus === 'error' && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {errorMessage || (isEnglish ? 'Failed to send message. Please try again.' : 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.')}
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
                <TextField
                    fullWidth
                    label={isEnglish ? 'Name' : 'Nombre'}
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    margin="normal"
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                            },
                            '&:hover fieldset': {
                                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                        },
                        '& .MuiInputBase-input': {
                            color: isDarkMode ? 'white' : 'black',
                        },
                    }}
                />

                <TextField
                    fullWidth
                    label={isEnglish ? 'Email' : 'Correo Electrónico'}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    margin="normal"
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                            },
                            '&:hover fieldset': {
                                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                        },
                        '& .MuiInputBase-input': {
                            color: isDarkMode ? 'white' : 'black',
                        },
                    }}
                />

                <TextField
                    fullWidth
                    label={isEnglish ? 'Subject' : 'Asunto'}
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    margin="normal"
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                            },
                            '&:hover fieldset': {
                                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                        },
                        '& .MuiInputBase-input': {
                            color: isDarkMode ? 'white' : 'black',
                        },
                    }}
                />

                <TextField
                    fullWidth
                    label={isEnglish ? 'Message' : 'Mensaje'}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    margin="normal"
                    variant="outlined"
                    multiline
                    rows={6}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
                            },
                            '&:hover fieldset': {
                                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                        },
                        '& .MuiInputBase-input': {
                            color: isDarkMode ? 'white' : 'black',
                        },
                    }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{
                        mt: 3,
                        mb: 2,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        backgroundColor: '#00d1b2',
                        '&:hover': {
                            backgroundColor: '#00c4a7',
                        },
                        '&:disabled': {
                            backgroundColor: '#ccc',
                        },
                    }}
                >
                    {isSubmitting ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        isEnglish ? 'Send Message' : 'Enviar Mensaje'
                    )}
                </Button>
            </form>
            </div>
        </Box>

    );
};

export default ContactForm; 