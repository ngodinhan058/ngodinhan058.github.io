import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from 'react-responsive';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import Hero from "../components/Hero";
import PopupImage from '../components/PopupImage';


export default function DetailPage() {
    const location = useLocation();
    const { id, name, img, serviceName } = location.state || {};
    const { t } = useTranslation();
    const lang = t("i18n");
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });


    return (
        <>
            <Hero title={name[lang]} home={t("projectUs.hero.home")} titleSmall={[serviceName[lang], name[lang]]} detail={true} />

            <div className="services-details-area">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="single-services section-padding2">
                                {/* <div className="details-img mb-40">
                                    <img src={img} alt="" />
                                </div> */}
                                {img && img.length > 0 ? img.map((src, index) => (
                                    <div key={index} className="position-relative mb-5">
                                        <div
                                            className="position-absolute bg-dark text-white px-2 py-1 small"
                                            style={{ opacity: 0.8, borderTopRightRadius: "5px", right: 0, zIndex: 5 }}
                                        >
                                            {index + 1}/{img.length}
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
                                {/* <div className="details-caption">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore.</p>

                                    <p className="mb-50">Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore.</p>

                                    <h3>Lorem</h3>
                                    <p className="mb-50">Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore.</p>

                                    <h3>Lorem</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore.Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore.</p>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

