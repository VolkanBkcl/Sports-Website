import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button,
    Paper
} from '@mui/material';

const Home = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleStartFree = () => {
        navigate('/initial-info');
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Spor ve Sağlıklı Yaşama Hoş Geldiniz!
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 4 }}>
                    Kişisel antrenörünüz ve sağlık koçunuz ile birlikte hedeflerinize ulaşın.
                </Typography>

                {!isLoggedIn && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleStartFree}
                            sx={{ minWidth: 200 }}
                        >
                            Ücretsiz Başla
                        </Button>
                    </Box>
                )}

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Neler Sunuyoruz?
                    </Typography>
                    <Typography variant="body1" paragraph>
                        • Kişiselleştirilmiş antrenman programları
                    </Typography>
                    <Typography variant="body1" paragraph>
                        • Beslenme danışmanlığı
                    </Typography>
                    <Typography variant="body1" paragraph>
                        • İlerleme takibi
                    </Typography>
                    <Typography variant="body1" paragraph>
                        • 7/24 destek
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Home; 