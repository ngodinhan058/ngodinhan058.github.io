import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import ZoomEffect from "../components/ZoomEffect";
import PopupImage from "../components/PopupImage";
import Hero from "../components/Hero";

export default function AboutPage() {
    const { t } = useTranslation();
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

    const aboutUs = t("aboutUs.items", { returnObjects: true }) || [];
    const tools = t("aboutUs.tools.items", { returnObjects: true }) || [];
    const stats = t("aboutUs.stats.items", { returnObjects: true }) || [];

    return (
        <>
            <Hero title={t("aboutUs.hero.title")} home={t("aboutUs.hero.home")} titleSmall={t("aboutUs.hero.titleSmall")} />

            {/* ==== INTRO ==== */}
            <section className="support-company-area fix pt-10">
                <div className="support-wrapper align-items-end">
                    <div className="container">
                        <div className="row">
                            <div className="left-content">
                                <div className="section-tittle section-tittle2 mb-55">
                                    <div className="front-text">
                                        <h2 className="" data-aos="fade-right" data-aos-delay="200">
                                            {t("aboutHeader")}
                                        </h2>
                                    </div>
                                    <span
                                        className="back-text"
                                        data-aos="fade-right"
                                        data-aos-delay="250"
                                    >
                                        {t("aboutHeader")}
                                    </span>
                                </div>

                                <div
                                    className="support-caption"
                                    data-aos="fade-right"
                                    data-aos-delay="250"
                                >
                                    <p className="pera-top">{t("aboutUs.content.content_1")}</p>
                                    <p>{t("aboutUs.content.content_2")}</p>
                                    <p>{t("aboutUs.content.content_3")}</p>
                                    <p>{t("aboutUs.content.content_4")}</p>
                                </div>
                            </div>

                            <div className="right-content">
                                <div className="right-img" data-aos="fade-left" data-aos-delay="200">
                                    <Swiper
                                        modules={[Autoplay]}
                                        loop
                                        autoplay={{ delay: 2500, disableOnInteraction: false }}
                                        style={{
                                            width: "98%",
                                            height: isMobile ? "auto" : 450,
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
                                            marginBottom: 10,
                                            borderRadius: 10,
                                            background: "#fff",
                                        }}
                                        onSwiper={(swiper) => {
                                            swiper.el.addEventListener("mouseenter", () =>
                                                swiper.autoplay.stop()
                                            );
                                            swiper.el.addEventListener("mouseleave", () =>
                                                swiper.autoplay.start()
                                            );
                                        }}
                                    >
                                        {[
                                            "/img/about/data5.png",
                                            "/img/about/data4.png",
                                            "/img/about/data1.png",
                                            "/img/about/data.png",
                                            "/img/about/data3.png",
                                            "/img/about/data2.png",
                                        ].map((src) => (
                                            <SwiperSlide
                                                key={src}
                                                style={{
                                                    height: "100%",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    background: "#fff",
                                                }}
                                            >
                                                {isMobile ? <PopupImage img={src} /> : <ZoomEffect imageUrl={src} zoomLevel={4} about={true}/>}

                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==== STATS STRIP ==== */}
            <section className="me-stats">
                <div className="container">
                    <div className="row justify-content-center">
                        {stats.map((s, idx) => (
                            <div className="col-4 col-md-4 mb-4" key={idx} data-aos="zoom-in" data-aos-delay={150 + idx * 50}>
                                <div className="stat-card">
                                    <div className="stat-number">{s.value}</div>
                                    <div className="stat-label">{s.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ==== SERVICES GRID ==== */}
            <section className="me-services">
                <div className="container">
                    <div className="section-tittle text-center mb-40">
                        <h3 data-aos="fade-up">{t("aboutUs.title")}</h3>
                        <p data-aos="fade-up" data-aos-delay="100">
                            {t("aboutUs.subtitle")}
                        </p>
                    </div>

                    {/* <div className="row">
                        {aboutUs.map((svc, idx) => (
                            <div className="col-md-6 col-lg-4 mb-4" key={idx} data-aos="fade-up" data-aos-delay={150 + idx * 50}>
                                <div className="svc-card">
                                    <div className="svc-icon">🏗️</div>
                                    <div className="svc-body">
                                        <h5 className="svc-title">{svc.title}</h5>
                                        <p className="svc-desc">{svc.desc}</p>
                                        {svc.tools && (
                                            <div className="svc-tools">
                                                {svc.tools.map((tool, i) => (
                                                    <span className="tool-badge" key={i}>
                                                        {tool}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div> */}
                    <div className="row">
                        {aboutUs.slice(0, 3).map((svc, idx) => (
                            <div className="col-md-6 col-lg-4 mb-4" key={idx} data-aos="fade-up" data-aos-delay={150 + idx * 50}>
                                <div className="svc-card">
                                    <div className="svc-icon">🏗️</div>
                                    <div className="svc-body">
                                        <h5 className="svc-title">{svc.title}</h5>
                                        <p className="svc-desc">{svc.desc}</p>
                                        {svc.tools && (
                                            <div className="svc-tools">
                                                {svc.tools.map((tool, i) => (
                                                    <span className="tool-badge" key={i}>
                                                        {tool}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="row justify-content-center">
                        {aboutUs.slice(3).map((svc, idx) => (
                            <div className="col-md-6 col-lg-4 mb-4" key={idx + 3} data-aos="fade-up" data-aos-delay={150 + ((idx + 3) * 50)}>
                                <div className="svc-card">
                                    <div className="svc-icon">🏗️</div>
                                    <div className="svc-body">
                                        <h5 className="svc-title">{svc.title}</h5>
                                        <p className="svc-desc">{svc.desc}</p>
                                        {svc.tools && (
                                            <div className="svc-tools">
                                                {svc.tools.map((tool, i) => (
                                                    <span className="tool-badge" key={i}>
                                                        {tool}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* ==== TOOLSTACK ==== */}
            <section className="me-tools">
                <div className="container">
                    <div className="section-tittle text-center mb-30">
                        <h4 data-aos="fade-up">{t("aboutUs.tools.title")}</h4>
                    </div>
                    <div className="tool-badges" data-aos="fade-up" data-aos-delay="100">
                        {tools.map((tool, idx) => (
                            <span className="tool-chip" key={idx}>
                                {tool}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ==== QUALITY / COMMITMENT ==== */}
            <section className="me-quality">
                <div className="container">
                    <div className="quality-card" data-aos="fade-up">
                        <h3 className="mb-3">{t("aboutUs.quality.title")}</h3>
                        <p className="mb-0">{t("aboutUs.quality.body")}</p>
                    </div>
                </div>
            </section>

            {/* ==== CTA ==== */}
            <section className="me-cta">
                <div className="container">
                    <div className="cta-box" data-aos="zoom-in">
                        <h4 className="mb-2">{t("aboutUs.cta.title")}</h4>
                        <p className="mb-3">{t("aboutUs.cta.desc")}</p>
                        <a className="btn btn-primary" href="/contact">
                            {t("aboutUs.cta.button")}
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
