import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const Hero = ({ title, home, titleSmall }) => {
    const { t } = useTranslation();

    const VIDEO_URLS = [
        "https://res.cloudinary.com/dsc0d352s/video/upload/v1759310991/auto_jww_kqqgwi.mp4",
        "https://res.cloudinary.com/dsc0d352s/video/upload/v1759311345/jww_auto_vu9vfd.mp4"
    ];
    const [videoUrl] = useState(
        VIDEO_URLS[Math.floor(Math.random() * VIDEO_URLS.length)]
    );
    const titleSmalls = Array.isArray(titleSmall) ? titleSmall : [titleSmall];

    return (
        <>
            <div className="slider-area ">
                <div
                    className="single-slider hero-overly slider-height2 d-flex align-items-center"
                >
                    <video
                        className="video-background"
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster="/img/banner/image.png"

                    >
                        <source src={videoUrl} type="video/mp4" />
                    </video>
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-12">
                                <div className="hero-cap pt-100">
                                    <h2>{title}</h2>
                                    <nav aria-label="breadcrumb ">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item">
                                                <a href="/">{home}</a>
                                            </li>
                                            {titleSmalls.length > 0 ? titleSmalls.map((src, index) => (
                                                <li className="breadcrumb-item" key={index + 1}>
                                                    <a>{src}</a>
                                                </li>
                                            )) :
                                                <li className="breadcrumb-item">
                                                    <a>{titleSmall}</a>
                                                </li>
                                            }

                                        </ol>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Hero;