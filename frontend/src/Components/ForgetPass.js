import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import auth_bg from "../Assets/bg.png";

export default function ForgetPass() {
    const [formData, setFormData] = useState({ email: '' });
    const [newPassword, setNewPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNewPassword('');
        setErrorMsg('');

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/forgetpassword`, formData);
            console.log('Password reset successful:', response.data);

            if (response.data.newPassword) {
                setNewPassword(response.data.newPassword);
            } else {
                setErrorMsg('No password returned from server.');
            }
        } catch (error) {
            console.error('Password reset failed:', error);
            setErrorMsg('Email not found. Please try again.');
        }
    };

    return (
        <div style={{
            backgroundImage: `url(${auth_bg})`,
            height: "77vh",
            display: "flex",
            alignItems: "center",
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}>
            <div className='d-flex flex-column align-items-center' style={{
                width: '400px',
                margin: '0 auto',
                padding: '20px',
                backgroundColor: "#dacdbc",
                border: "1px solid #483f19",
                borderRadius: "10px"
            }}>
                <h2 style={{ fontWeight: 'bold', color: "#483f19", marginBottom: "20px" }}>Forget Password</h2>
                <form className='form-a d-flex flex-column align-items-end' onSubmit={handleSubmit}>
                    <div className='d-flex flex-column mb-2'>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{ width: '300px', padding: '8px', marginTop: '5px' }}
                        />
                    </div>
                    <Link to="/login">
                        LogIn
                    </Link>
                    <button
                        className='mt-3'
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '10px 20px',
                            backgroundColor: '#483f19',
                            color: '#dacdbc',
                            borderRadius: '10px',
                            cursor: 'pointer'
                        }}
                    >
                        Generate New Password
                    </button>
                </form>
                {newPassword && (
                    <p className='newPass text-success mt-3'>
                        Your new password: <strong>{newPassword}</strong>
                    </p>
                )}
                {errorMsg && (
                    <p className='newPass text-danger mt-3'>{errorMsg}</p>
                )}
            </div>
        </div>
    );
};