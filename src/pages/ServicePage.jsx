import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from 'react-responsive';
import axios from "axios";


import Service from '../components/Service';
import Hero from "../components/Hero";

import api from "../api/api.json";
import { BASE_URL } from "../api/config.js";

export default function ServicePage() {
    const { t } = useTranslation();

    const [dataService, setDataService] = useState([]);
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
    useEffect(() => {
        getService()
    }, []);
    return (
        <>
            <Hero title={t("servicesUs.hero.title")} home={t("servicesUs.hero.home")} titleSmall={t("servicesUs.hero.titleSmall")} />

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
        </>
    );
}

