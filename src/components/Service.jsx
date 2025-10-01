import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from "react-i18next";

import ZoomEffect from '../components/ZoomEffect';
import PopupImage from '../components/PopupImage';

const Service = ({ id, name, img, categories, content }) => {
    const { t } = useTranslation();
    const lang = t("i18n");
    
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    
    const handleClick = () => {
        navigate(`/detailServices/${name.jp}`, {
            state: {
                id,
                name,
                img,
                categories,
                content,
            },
        });
        window.scrollTo(0,0);
    };
    return (
        <>
            <div className="col-xl-4 col-lg-4 col-md-6" key={id}>
                {isMobile ? (
                    <>
                        <div className="single-service-cap mb-30">
                            <PopupImage img={img} />

                            <div className="service-cap" onClick={handleClick}>
                                <h4>{name[lang]}</h4>
                                <div className="more-btn">{t("ourServices")} <i className="ti-plus"></i></div>
                            </div>
                            <div className="service-icon">
                                <img src="img/icon/services_icon1.png" alt="" />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="single-service-cap mb-30" onClick={handleClick}>
                            <ZoomEffect imageUrl={img} zoomLevel={4} />
                            <div className="service-cap">
                                <h4>{name[lang]}</h4>
                                <div className="more-btn">{t("readmore")} <i className="ti-plus"></i></div>
                            </div>
                            <div className="service-icon">
                                <img src="img/icon/services_icon1.png" alt="" />
                            </div>
                        </div>
                    </>
                )}

            </div>
        </>
    );
};

export default Service;