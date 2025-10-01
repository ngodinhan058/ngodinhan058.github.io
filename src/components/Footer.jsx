// Footer.js
import React from 'react';
import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t } = useTranslation();

    return (
        <>
            <footer>
                {/* <!-- Footer Start--> */}
                <div className="footer-main">
                    <div className="footer-area footer-padding">
                        <div className="container">
                            <div className="row  justify-content-between">
                                <div className="col-lg-4 col-md-4 col-sm-8">
                                    <div className="single-footer-caption mb-30">
                                        {/* <!-- logo --> */}
                                        <div className="footer-logo">
                                            <a href="/">
                                                <div style={{ display: "flex", flexDirection: "row", }}>
                                                    <img src="/img/logo/logo2_footer.png" alt="" width={130} height={50} />
                                                    <h4
                                                        style={{
                                                            marginLeft: "10px",
                                                            color: "#fff",
                                                            fontSize: "35px",
                                                            fontWeight: 500,
                                                            fontFamily: '"Teko", sans-serif',

                                                        }}
                                                    >
                                                        Akebono
                                                    </h4>

                                                </div>
                                            </a>
                                        </div>
                                        <div className="footer-tittle">
                                            <div className="footer-pera">
                                                <p className="info1">{t("footerContent")}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-4 col-sm-5">
                                    <div className="single-footer-caption mb-50">
                                        <div className="footer-tittle">
                                            <h4>{t("quickLinks")}</h4>
                                            <ul>
                                                <li><a href="/about">{t("aboutHeader")}</a></li>
                                                <li><a href="/project">{t("projects")}</a></li>
                                                <li><a href="/services">{t("servicesHeader")}</a></li>
                                                <li><a href="/contact">{t("contact")}</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-4 col-sm-7">
                                    <div className="single-footer-caption mb-50">
                                        <div className="footer-tittle">
                                            <h4>{t("contact")}</h4>
                                            <div className="footer-pera">
                                                <p className="info1">21/8 Đường 35 Phường Hiệp Bình, Thủ Đức </p>
                                            </div>
                                            <ul>
                                                <li><a href="tel:+84908863459">{t("phone")}</a></li>
                                                <li><a href="tel:+84908863459">{t("cell")}</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-8">
                                    <div className="single-footer-caption mb-50">
                                        {/* <!-- Map --> */}
                                        <div className="map-footer">
                                            <iframe
                                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.5652094232!2d106.726!3d10.830!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175294f2cfxxxx%3A0x123456789!2s21%2F8%20Đường%2035%2C%20Phường%20Hiệp%20Bình%2C%20Thủ%20Đức!5e0!3m2!1svi!2s!4v1692358294000!5m2!1svi!2s"
                                                width="100%"
                                                height="100%"
                                                style={{ border: 0 }}
                                                allowFullScreen=""
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                            ></iframe>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            {/* <!-- Copy-Right --> */}
                            <div className="row align-items-center">
                                <div className="col-xl-12 ">
                                    <div style={{ color: '#fff', fontFamily: '"Teko", sans-serif', fontSize: "16px", fontWeight: 500, }}>
                                        Copyright &copy;2025 Akebonovn.com <br />All rights reserved
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
                {/* <!-- Footer End--> */}
            </footer >
        </>
    );
};

export default Footer;