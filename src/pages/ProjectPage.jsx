import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from 'react-responsive';
import axios from "axios";

import Project from '../components/Project';
import ProjectList from '../components/ProjectList';
import Hero from "../components/Hero";

import api from "../api/api.json";
import { BASE_URL } from "../api/config.js";

export default function ProjectPage() {
    const { t } = useTranslation();
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    //getAll
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
            <Hero title={t("projectUs.hero.title")} home={t("projectUs.hero.home")} titleSmall={t("projectUs.hero.titleSmall")} />

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
        </>
    );
}

