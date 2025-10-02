import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from 'react-responsive';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import axios from "axios";

import Service from '../components/Service';
import Project from '../components/Project';
import Loading from '../components/Loading.jsx';
import ProjectList from '../components/ProjectList';

import ZoomEffect from '../components/ZoomEffect';
import PopupImage from '../components/PopupImage';

import api from "../api/api.json";
import { BASE_URL } from "../api/config.js";

export default function HomePage() {
    const { t } = useTranslation();

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const VIDEO_URLS = [
        "https://res.cloudinary.com/dsc0d352s/video/upload/v1759310991/auto_jww_kqqgwi.mp4",
        "https://res.cloudinary.com/dsc0d352s/video/upload/v1759311345/jww_auto_vu9vfd.mp4"
    ];
    const [videoUrl] = useState(
        VIDEO_URLS[Math.floor(Math.random() * VIDEO_URLS.length)]
    );

    //getService
    const [dataService, setDataService] = useState([]);
    const [dataProject, setDataProject] = useState([]);
    const [loading, setLoading] = useState(false);

    const getService = () => {
        let apiUrl = `${BASE_URL}/services/all`;
        setLoading(true);
        axios.get(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            },
        })
            .then((response) => {
                const data = response.data.data;
                setDataService(data);
            })
            .catch((error) => {
                setDataService(api.data);
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    //getProject
    const getProject = () => {
        let apiUrl = `${BASE_URL}/projects/user`;
        setLoading(true);
        axios.get(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            },
        })
            .then((response) => {
                const data = response.data.data;
                setDataProject(data);
            })
            .catch((error) => {
                setDataProject(api.projects);
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    useEffect(() => {
        getService()
        getProject()
    }, []);
    const groups = dataProject.reduce((acc, p) => {
        (acc[p.serviceId] ||= []).push(p);
        return acc;
    }, {});
    return (
        <>
            {loading ? <Loading /> : <></>}

            <main>
                <div className="slider-area">
                    <div className="slider-active">
                        <div className="single-slider  hero-overly slider-height d-flex align-items-center">
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
                                    <div className="col-lg-11">
                                        <div className="hero__caption">
                                            <div className="stock-text" data-aos="fade-up" data-aos-delay="500">
                                                <h2>Akebono</h2>
                                                <h2>Akebono</h2>
                                            </div>
                                            <div className="line"><h2 data-aos="fade-right" data-aos-delay="700">kensetsuden</h2></div>
                                            <div className="line"><h3 data-aos="fade-left" data-aos-delay="800">service</h3></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="services-area1 section-padding30">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="section-tittle mb-55" data-aos="fade-up" data-aos-delay="150">
                                    <div className="front-text">
                                        <h2 className="">{t("ourServices")}</h2>
                                    </div>
                                    <span className="back-text">{t("ourServices")}</span>
                                </div>
                            </div>
                        </div>
                        <div className="row" data-aos="fade-up" data-aos-delay="150">
                            {dataService.map((item, index) => (
                                <Service
                                    key={`${item.id}-${index}`}
                                    id={item.id}
                                    name={item.name}
                                    img={item.img}
                                    project={item.project}
                                    categories={item.categories}
                                    content={item.content}
                                />
                            ))}

                        </div>
                    </div>
                </div>
                <section className="support-company-area fix pt-10">
                    <div className="support-wrapper align-items-end">
                        <div className="container">
                            <div className="row">
                                <div className="left-content">
                                    <div className="section-tittle section-tittle2 mb-55">
                                        <div className="front-text">
                                            <h2 className="" data-aos="fade-right" data-aos-delay="200">{t("aboutHeader")}</h2>
                                        </div>
                                        <span className="back-text" data-aos="fade-right" data-aos-delay="250">{t("aboutHeader")}</span>
                                    </div>
                                    <div className="support-caption" data-aos="fade-right" data-aos-delay="250">
                                        <p className="pera-top">{t("aboutUs.content.content_2")}</p>
                                        <p dangerouslySetInnerHTML={{ __html: t("aboutUs.content.content_5").replace(/\n/g, "<br />") }} />

                                        <a href="/about" className="btn red-btn2" data-aos="fade-right" data-aos-delay="100">{t("readmore")}</a>
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
                                                borderRadius: 10
                                            }}
                                            onSwiper={(swiper) => {
                                                swiper.el.addEventListener("mouseenter", () => swiper.autoplay.stop());
                                                swiper.el.addEventListener("mouseleave", () => swiper.autoplay.start());
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
                                                >{isMobile ? <PopupImage img={src} /> : <ZoomEffect imageUrl={src} zoomLevel={4} about={true} />}
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>


                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="project-area  section-padding30">
                    <div className="container">
                        <div className="project-heading mb-35" data-aos="fade-up" data-aos-delay="200">
                            <div className="row align-items-end">
                                <div className="col-lg-6">
                                    {/* <!-- Section Tittle --> */}
                                    <div className="section-tittle section-tittle3">
                                        <div className="front-text">
                                            <h2 className="">{t("ourProjects")}</h2>
                                        </div>
                                        <span className="back-text">{t("ourProjects")}</span>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="properties__button">
                                        <nav>
                                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                                <a className="nav-item nav-link active" id="all-tab" data-toggle="tab" href="#all" role="tab" aria-controls="all" aria-selected="false"> {t("showAll")} </a>
                                                {dataService.map((datas, index) => (
                                                    <a key={`${datas.id}-${index}`} className="nav-item nav-link" id={datas.countProject ? `${datas.id}-tab` : `0-tab`} data-toggle="tab" href={datas.countProject ? `#${datas.id}` : '#0'} role="tab" aria-controls={datas.countProject ? datas.id : 0} aria-selected="false"> {datas.name[t("i18n")]}</a>
                                                ))}

                                            </div>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="tab-content active" id="nav-tabContent" data-aos="fade-up" data-aos-delay="200">
                                    <div className="tab-pane fade active show" id="all" role="tabpanel" aria-labelledby="all-tab">
                                        <div className="project-caption">
                                            <ProjectList showAll={dataProject} t={t} isMobile={isMobile} />
                                        </div>
                                    </div>
                                    {Object.entries(groups).map(([sid, items]) => (
                                        <div className="tab-pane fade" id={sid} role="tabpanel" aria-labelledby={`${sid}-tab`} key={`${sid}`}>
                                            <div className="project-caption">
                                                <div className="row">
                                                    {items.map((dataP, indexP) => (
                                                        <Project
                                                            key={`${dataP.id}-${indexP}`}
                                                            id={dataP.id}
                                                            name={dataP.name}
                                                            img={dataP.img}
                                                            serviceId={dataP.serviceId}
                                                            serviceName={dataP.serviceName}
                                                        />

                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="tab-pane fade empty-state" id="0" role="tabpanel" aria-labelledby="0-tab">
                                        <div className="empty-icon">📂</div>
                                        <h2 className="empty-title">{t("noData")}</h2>
                                        <p className="empty-text">
                                            {t("noDataContent.1")}<br />
                                            {t("noDataContent.2")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
