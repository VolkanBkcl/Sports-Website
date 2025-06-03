import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Box,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Divider
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import trLocale from 'date-fns/locale/tr';

const Profile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        profile: {
            fullname: '',
            phone: '',
            birthdate: null,
            gender: '',
            address: '',
            city: '',
            district: '',
            interests: []
        }
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                console.log('Profil bilgileri alınıyor...');
                const response = await axios.get('/api/profile/me', {
                    headers: { 'x-auth-token': token }
                });

                console.log('Profil bilgileri alındı:', response.data);
                const userData = response.data;
                setFormData({
                    username: userData.username || '',
                    email: userData.email || '',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                    profile: {
                        fullname: userData.profile?.fullname || '',
                        phone: userData.profile?.phone || '',
                        birthdate: userData.profile?.birthdate ? new Date(userData.profile.birthdate) : null,
                        gender: userData.profile?.gender || '',
                        address: userData.profile?.address || '',
                        city: userData.profile?.city || '',
                        district: userData.profile?.district || '',
                        interests: userData.profile?.interests || []
                    }
                });
            } catch (error) {
                console.error('Profil bilgileri alınamadı:', error.response || error);
                setError(error.response?.data?.message || 'Profil bilgileri alınamadı. Lütfen daha sonra tekrar deneyin.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Şifre değişikliği kontrolü
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setError('Yeni şifreler eşleşmiyor');
            return;
        }

        // Zorunlu alanları kontrol et
        const requiredFields = ['fullname', 'phone', 'birthdate', 'gender', 'address', 'city', 'district'];
        const missingFields = requiredFields.filter(field => !formData.profile[field]);
        
        if (missingFields.length > 0) {
            setError(`Lütfen tüm zorunlu alanları doldurun: ${missingFields.join(', ')}`);
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('/api/profile/profile', formData, {
                headers: { 'x-auth-token': token }
            });

            setSuccess('Profil başarıyla güncellendi');
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        } catch (error) {
            console.error('Profil güncelleme hatası:', error);
            setError(error.response?.data?.message || 'Profil güncellenirken bir hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Profil Bilgileri
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Kullanıcı Adı */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Kullanıcı Adı"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        {/* Email */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }}>
                                <Typography variant="h6" color="text.secondary">
                                    Lütfen aşağıdaki kısmı doldurunuz
                                </Typography>
                            </Divider>
                        </Grid>

                        {/* Ad Soyad */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Ad Soyad"
                                name="profile.fullname"
                                value={formData.profile.fullname}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        {/* Telefon */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Telefon"
                                name="profile.phone"
                                value={formData.profile.phone}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        {/* Doğum Tarihi */}
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={trLocale}>
                                <DatePicker
                                    label="Doğum Tarihi"
                                    value={formData.profile.birthdate}
                                    onChange={(newValue) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            profile: {
                                                ...prev.profile,
                                                birthdate: newValue
                                            }
                                        }));
                                    }}
                                    renderInput={(params) => <TextField {...params} fullWidth required />}
                                />
                            </LocalizationProvider>
                        </Grid>

                        {/* Cinsiyet */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Cinsiyet</InputLabel>
                                <Select
                                    name="profile.gender"
                                    value={formData.profile.gender}
                                    onChange={handleChange}
                                    label="Cinsiyet"
                                >
                                    <MenuItem value="male">Erkek</MenuItem>
                                    <MenuItem value="female">Kadın</MenuItem>
                                    <MenuItem value="other">Diğer</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Adres */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Adres"
                                name="profile.address"
                                value={formData.profile.address}
                                onChange={handleChange}
                                multiline
                                rows={3}
                                required
                            />
                        </Grid>

                        {/* Şehir */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Şehir"
                                name="profile.city"
                                value={formData.profile.city}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        {/* İlçe */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="İlçe"
                                name="profile.district"
                                value={formData.profile.district}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        {/* Şifre Değiştirme */}
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Şifre Değiştir
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Mevcut Şifre"
                                name="currentPassword"
                                type="password"
                                value={formData.currentPassword}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Yeni Şifre"
                                name="newPassword"
                                type="password"
                                value={formData.newPassword}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Yeni Şifre (Tekrar)"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={saving}
                                    sx={{ minWidth: 200 }}
                                >
                                    {saving ? <CircularProgress size={24} /> : 'Kaydet'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default Profile; 