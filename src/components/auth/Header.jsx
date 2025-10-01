import React, { useState, useEffect, } from 'react';
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from 'react-router-dom';
const Header = () => {
    const { t, i18n } = useTranslation();
    const [selected, setSelected] = useState(null);
    const token = sessionStorage.getItem("accessToken");
    const navigate = useNavigate();

    const options = [
        { value: "JP", label: <><img src="/img/flag/jp.png" width="20" alt="" /> 日本語</> },
        { value: "EN", label: <><img src="/img/flag/us.png" width="20" alt="" /> English</> },
    ];
    const [mobileOpen, setMobileOpen] = useState(false);
    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth >= 992) setMobileOpen(false);
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    useEffect(() => {
        const tokens = ["3ec057cf2163cb", "eb5b90bb77d46a", "013a02a0ac781c"];

        const fetchCountry = async () => {
            for (const tk of tokens) {
                try {
                    const res = await fetch(`https://ipinfo.io/json?token=${tk}`);
                    const data = await res.json();
                    if (data && !data.error && data.country) {
                        const cc = (data.country || "").toUpperCase();
                        const match = options.find(opt => opt.value === cc) || options[0];
                        setSelected(match);
                        i18n.changeLanguage(match.value);
                        return;
                    }
                } catch (e) {
                    setSelected(options[0]);
                    i18n.changeLanguage("JP");
                }
            }

        };

        fetchCountry();
    }, []);
    const handleClick = () => {
        window.scrollTo(0, 0);
    };
    const logout = () => {
        sessionStorage.removeItem("accessToken");
        navigate("/")
    };

    return (
        <>
            <header>
                {/* <!-- Header Start --> */}
                <div className="header-area header-transparent">
                    <div className="main-header">
                        <div className="header-top d-none d-lg-block">
                            <div className="container-fluid">
                                <div className="col-xl-12">
                                    <div className="row d-flex justify-content-between align-items-center bg_header_top">
                                        <div className="header-info-left">
                                            <ul>
                                                <li>ngochihai08121978@gmail.com</li>
                                                <li>{t("openingHours.monSat")}, {t("openingHours.sunday")}</li>
                                            </ul>
                                        </div>
                                        <div className="header-info-right">
                                            <div className="header-right-btn f-right d-none d-lg-block">
                                                <a onClick={logout} className="btn" style={{ cursor: 'pointer', color: '#fff', }}><i className="bi bi-box-arrow-right"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="header-bottom header-sticky">
                            <div className="container-fluid">
                                <div className="row align-items-center">
                                    {/* <!-- Logo --> */}
                                    <div className="col-xl-2 col-lg-2 col-md-1">
                                        <div className="logo">
                                            {/* <!-- logo-1 --> */}
                                            <a href="/" className="big-logo"><img src="/img/logo/logo.png" alt="" width={170} height={80} /></a>
                                            {/* <!-- logo-2 --> */}
                                            <a href="/" className="small-logo"><img src="/img/logo/logo.png" alt="" width={140} height={70} /></a>
                                        </div>
                                    </div>
                                    <div className="col-xl-8 col-lg-8 col-md-8">
                                        {/* <!-- Main-menu --> */}
                                        <div className="main-menu f-right d-none d-lg-block">
                                            <nav>
                                                <ul id="navigation">
                                                    <li><a href="/">Trang Chủ </a></li>
                                                    <li><a href="/admin_akebono">Trang Chủ Admin</a></li>
                                                    <li><Link to="/admin_akebono#service">Dịch Vụ</Link></li>
                                                    <li><Link to="/admin_akebono#project">Dự Án</Link></li>
                                                </ul>
                                            </nav>
                                        </div>
                                    </div>
                                    <div className="col-xl-2 col-lg-2 col-md-3">
                                        <div className="f-right d-none d-lg-block">
                                            <Select
                                                options={options}
                                                value={selected}
                                                isSearchable={false}
                                                onChange={(opt) => {
                                                    if (opt) {
                                                        i18n.changeLanguage(opt.value);
                                                        setSelected(opt)
                                                    }
                                                }}
                                                styles={{
                                                    control: (base) => ({
                                                        ...base,
                                                        backgroundColor: "#fff",
                                                        borderColor: "#00e5ed",
                                                        borderRadius: 8,
                                                        padding: "2px 4px",
                                                        boxShadow: "none",
                                                        "&:hover": {
                                                            borderColor: "#00e5ed",
                                                        },
                                                    }),
                                                    option: (base, state) => ({
                                                        ...base,
                                                        backgroundColor: state.isSelected
                                                            ? "#00e5ed"
                                                            : state.isFocused
                                                                ? "#dcfeffff"
                                                                : "#fff",
                                                        color: state.isSelected ? "#fff" : "#333",
                                                        cursor: "pointer",
                                                    }),
                                                    singleValue: (base) => ({
                                                        ...base,
                                                        color: "#333",
                                                        fontWeight: 500,
                                                    }),
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {/* <!-- Mobile Menu --> */}
                                    <div className="col-12 d-lg-none">
                                        <div className="mobile_menu d-block d-lg-none">
                                            <div className="slicknav_menu" aria-label="Mobile Menu">
                                                <button
                                                    type="button"
                                                    className="slicknav_btn"
                                                    aria-expanded={mobileOpen}
                                                    aria-controls="slicknav_nav"
                                                    onClick={() => setMobileOpen((o) => !o)}
                                                >
                                                    <span className="slicknav_menutxt">MENU</span>
                                                    <span className="slicknav_icon">
                                                        <span className="slicknav_icon-bar" />
                                                        <span className="slicknav_icon-bar" />
                                                        <span className="slicknav_icon-bar" />
                                                    </span>
                                                </button>

                                                <nav
                                                    id="slicknav_nav"
                                                    className="slicknav_nav"
                                                    style={{ display: mobileOpen ? "block" : "none" }}
                                                >
                                                    <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
                                                        <li><a href="/">Trang Chủ </a></li>
                                                        <li><a href="/admin_akebono">Trang Chủ Admin</a></li>
                                                        <li><Link to="/admin_akebono#service">Dịch Vụ</Link></li>
                                                        <li><Link to="/admin_akebono#project">Dự Án</Link></li>
                                                        <li style={{ position: "relative", zIndex: 10000 }}>
                                                            <Select
                                                                options={options}
                                                                value={selected}
                                                                onChange={(opt) => {
                                                                    if (opt) {
                                                                        i18n.changeLanguage(opt.value);
                                                                        setSelected(opt);
                                                                    }
                                                                }}
                                                                isSearchable={false}
                                                                menuPortalTarget={document.body}
                                                                menuPosition="fixed"
                                                                menuShouldBlockScroll={true}
                                                                styles={{
                                                                    menuPortal: (base) => ({ ...base, zIndex: 999999 }), // nổi lên trên cùng
                                                                    control: (base) => ({
                                                                        ...base,
                                                                        backgroundColor: "#fff",
                                                                        borderColor: "#00e5ed",
                                                                        borderRadius: 8,
                                                                        padding: "2px 4px",
                                                                        boxShadow: "none",
                                                                        "&:hover": { borderColor: "#00e5ed" },
                                                                    }),
                                                                    option: (base, state) => ({
                                                                        ...base,
                                                                        backgroundColor: state.isSelected
                                                                            ? "#00e5ed"
                                                                            : state.isFocused
                                                                                ? "#dcfeffff"
                                                                                : "#fff",
                                                                        color: state.isSelected ? "#fff" : "#333",
                                                                        cursor: "pointer",
                                                                    }),
                                                                    singleValue: (base) => ({ ...base, color: "#333", fontWeight: 500 }),
                                                                }}
                                                            />
                                                        </li>

                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- Header End --> */}
            </header>

        </>
    );
};

export default Header;