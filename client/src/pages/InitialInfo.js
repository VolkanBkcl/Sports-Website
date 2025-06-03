import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    CircularProgress
} from '@mui/material';

const InitialInfo = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        height: '',
        weight: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Boy ve kilo bilgilerini localStorage'a kaydet
            localStorage.setItem('initialHeight', formData.height);
            localStorage.setItem('initialWeight', formData.weight);

            // Kayıt sayfasına yönlendir
            navigate('/register');
        } catch (error) {
            console.error('Bilgi kaydetme hatası:', error);
            setError('Bilgiler kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Kişisel Bilgileriniz
                </Typography>

                <Typography variant="body1" sx={{ mb: 4 }} align="center">
                    Size özel program oluşturabilmemiz için lütfen aşağıdaki bilgileri doldurun.
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Box sx={{ mb: 3 }}>
                        <TextField
                            fullWidth
                            label="Boy (cm)"
                            name="height"
                            type="number"
                            value={formData.height}
                            onChange={handleChange}
                            required
                            inputProps={{ min: 100, max: 250 }}
                            helperText="Örnek: 175"
                        />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <TextField
                            fullWidth
                            label="Kilo (kg)"
                            name="weight"
                            type="number"
                            value={formData.weight}
                            onChange={handleChange}
                            required
                            inputProps={{ min: 30, max: 300 }}
                            helperText="Örnek: 70"
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            disabled={loading}
                            sx={{ minWidth: 200 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Devam Et'}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default InitialInfo; 