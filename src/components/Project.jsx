import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from "react-i18next";

import ZoomEffect from '../components/ZoomEffect';
import PopupImage from '../components/PopupImage';

const Project = ({ id, name, img, serviceId, serviceName }) => {

    const { t } = useTranslation();
    const lang = t("i18n");

    const navigate = useNavigate();
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    
    const handleClick = () => {
        navigate(`/detailProject/${name.jp}`, {
            state: {
                id,
                name,
                img,
                serviceId,
                serviceName,
            },
        });
        window.scrollTo(0, 0);
    };
    return (
        <>
            <div className="col-lg-4 col-md-6">
                <div
                    className="single-project mb-30"
                    onClick={() => handleClick()}
                >
                    <div className="project-img">
                        {isMobile
                            ? <PopupImage img={img[0]} />
                            : <ZoomEffect imageUrl={img[0]} zoomLevel={3} />
                        }
                    </div>
                    <div className="project-cap">
                        <a className="plus-btn"><i className="ti-plus"></i></a>
                        <h4><a>{name[lang]}</a></h4>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Project;