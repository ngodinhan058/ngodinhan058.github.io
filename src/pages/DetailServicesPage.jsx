import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from 'react-responsive';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import Hero from "../components/Hero";
import PopupImage from '../components/PopupImage';



export default function DetailPage() {
    const location = useLocation();
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const { id, name, img, categories, content } = location.state || {};
    const { t } = useTranslation();
    const lang = t("i18n");

    const [selectedId, setSelectedId] = useState(categories[0]?.id);
    const selected = content ? content[selectedId] : null;

    const handleClick = (id) => {
        setSelectedId(id)
        window.scrollTo(0, 600);
    };
    return (
        <>
            <Hero title={name[lang]} home={t("projectUs.hero.home")} titleSmall={name[lang]} />

            <div className="services-details-area">
                <div className="container">
                    <div className="single-services section-padding2">
                        <div className="row g-4">
                            <div className="col-lg-3" data-aos="fade-right" data-aos-delay="150">
                                <aside className="price-card make-sticky p-4 border rounded shadow-sm">
                                    <ul className="list-unstyled d-grid gap-2 price-card__picker">
                                        {categories && categories.length > 0 ? categories.map((c) => (
                                            <li key={c.id}>
                                                <button
                                                    type="button"
                                                    className={`picker-item w-100 text-start ${selectedId === c.id ? "active" : ""}`}
                                                    onClick={() => handleClick(c.id)}
                                                >
                                                    <span className="d-block fw-semibold">{c.title[lang]}</span>
                                                    <small className="text-muted">{c.subtitle[lang]}</small>
                                                </button>
                                            </li>
                                        )) : null}
                                    </ul>
                                    <h3 className="price-card__value pt-20 pb-15">
                                        {selected?.price ? selected.price : t("contact")}
                                        {selected?.size && <small className="ms-1">{" / " + selected.size}</small>}
                                    </h3>

                                    {selected?.scale[lang] && <p className="price-card__sub mb-3">{selected.scale[lang]}</p>}

                                    <a href="/contact" className="btn btn-primary w-100 mb-4">
                                        {t("getQuote")}
                                    </a>
                                </aside>
                            </div>

                            <div className="col-lg-9" data-aos="fade-left" data-aos-delay="150">
                                <div className="p-4 border rounded shadow-sm h-100">
                                    <h2 className="mb-3">{selected?.heading[lang]}</h2>

                                    <div className="align-items-center justify-content-between mb-3">
                                        {/* Content */}
                                        {selected ? selected.body.map((src, index) => (
                                            <div key={index} className="position-relative mb-5">
                                                <div
                                                    className="position-absolute bg-dark text-white px-2 py-1 small"
                                                    style={{ opacity: 0.8, borderTopRightRadius: "5px", right: 0, zIndex: 9 }}
                                                >
                                                    {index + 1}/{selected.body.length}
                                                </div>
                                                {isMobile ? <PopupImage img={src} /> :
                                                    <div className="rounded shadow">
                                                        <TransformWrapper>
                                                            <TransformComponent>
                                                                <img
                                                                    src={src}
                                                                    alt={`image_${index}`}
                                                                    className="img-fluid"
                                                                />
                                                            </TransformComponent>
                                                        </TransformWrapper>
                                                    </div>}


                                                {/* Số thứ tự */}

                                            </div>
                                        )) :
                                            <div className="empty-state">
                                                <div className="empty-icon">📂</div>
                                                <h2 className="empty-title">{t("noData")}</h2>
                                                <p className="empty-text">
                                                    {t("noDataContent.1")}<br />
                                                    {t("noDataContent.2")}
                                                </p>
                                            </div>
                                        }


                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

