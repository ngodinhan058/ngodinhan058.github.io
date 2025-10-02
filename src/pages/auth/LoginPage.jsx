

import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BASE_URL } from "../../api/config.js";
import Loading from '../../components/Loading.jsx';

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);


    const VIDEO_URLS = "https://res.cloudinary.com/dsc0d352s/video/upload/v1759311345/jww_auto_vu9vfd.mp4";
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        const value = {
            userName: email,
            userPassword: password,
        };
        try {
            setLoading(true);
            await axios.post(
                `${BASE_URL}/auth/login`, value)
                .then((response) => {
                    const data = response.data.data;
                    if (data) {
                        sessionStorage.setItem("accessToken", data.accessToken); 
                        navigate(`/admin_akebono/`);
                    }
                })
        } catch (err) {
            handleResult("err", "Sai Mật Khẩu hoặc Tài Khoản");
            console.warn("Error creating category:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };
    const handleResult = (status, text) => {
        if (status === "ok") {
            toast.success(text, {
                position: "top-right",
                autoClose: 2000,
                theme: "colored",
            });
        } else {
            toast.error(text, {
                position: "top-right",
                autoClose: 2000,
                theme: "colored",
            });
        }
    };
    return (
        <>
            {loading ? <Loading /> : <></>}

            <div className="login-page">
                <video className="bg-video" src={VIDEO_URLS} autoPlay loop muted playsInline poster="/img/banner/image.png"/>
                <div className="center">
                    <div className="card glass">
                        <h4><i className="bi bi-lock"></i> Login</h4>
                        <hr />
                        <form onSubmit={onSubmit} className="form">
                            <label className="label-login">User
                                <div className="field">
                                    <span className="icon"><i className="bi bi-person"></i></span>
                                    <input
                                        type="text"
                                        placeholder="User"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </label>

                            <label className="label-login">Password
                                <div className="field">
                                    <span className="icon"><i className="bi bi-lock"></i></span>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </label>
                            <div className="actions">
                                <button type="button" className="btn-back ghost" onClick={() => window.history.back()}>
                                    Back
                                </button>
                                <button type="submit" className="btn-login" disabled={loading}>
                                    {loading ? "Loading…" : "Login"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />

        </>


    );
}

