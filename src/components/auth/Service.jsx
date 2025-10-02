import { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";

import axios from "axios";

import ZoomEffect from '../../components/ZoomEffect';
import PopupImage from '../../components/PopupImage';

import { BASE_URL } from "../../api/config.js";

const Service = ({ id, name, img, onEditChange, onEditData, onOpen, onService, onLoading }) => {
    const { t } = useTranslation();
    const lang = t("i18n");
    const token = sessionStorage.getItem("accessToken");
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    const handleClick = () => {
        navigate(`/admin_akebono/detail/${name.jp}`, {
            state: {
                id,
                name,
                img,
            },
        });
        window.scrollTo(0, 0);
    };

    const deleteService = () => {
        let apiUrl = `${BASE_URL}/services/${id}`;
        onLoading(true);
        axios.delete(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`

            },
        })
            .then((response) => {
                const data = response.status;
                console.log(data);
                
                if (data == 200 || 201) {
                    handleResult("ok", "Xóa Thành Công")
                } else {
                    handleResult("err", "Xóa Thất Bại, Vui Lòng Thử Lại");

                }
            })
            .catch((error) => {
                handleResult("err", "Xóa Thất Bại, Dự án vẫn còn tồn tại");
                console.error('Error fetching data:', error);

            })
            .finally(() => {
                onService();
                onLoading(false); // Kết thúc loading
            });
    };
    const editService = () => {
        onEditChange(true);
        onEditData([id, name, img])
        onOpen();
    };
    const handleResult = (status, text) => {
        if (status === "ok") {
            toast.success(text, {
                position: "top-right",
                autoClose: 2000,
                theme: "colored",
            });
        } else {
            toast.error(text, {
                position: "top-right",
                autoClose: 2000,
                theme: "colored",
            });
        }
    };
    return (
        <>
            <div className="col-xl-4 col-lg-4 col-md-6" key={id}>
                {isMobile ? (
                    <>
                        <div className="single-service-cap mb-30">
                            <PopupImage img={img} />

                            <div className="service-cap" onClick={handleClick}>
                                <div className="row">
                                    <h4>{name[lang]}</h4>
                                </div>
                                <div className="more-btn">{t("ourServices")} <i className="ti-plus"></i></div>
                            </div>
                            <div className="service-icon">
                                <img src="img/icon/services_icon1.png" alt="" />
                            </div>
                        </div>
                        <button
                            type="button"
                            className="btn btn-delete"

                            onClick={() => {
                                if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
                                    deleteService(); // nhớ gọi hàm
                                }
                            }}
                            style={{ bottom: 100, right: 50 }}
                        >
                            <i className="bi bi-trash"></i>
                        </button>

                        <button type="button" className="btn btn-edit" onClick={editService} style={{ bottom: 150, right: 50 }}>

                            <i className="bi bi-pen"></i></button>
                    </>
                ) : (
                    <>
                        <div className="single-service-cap mb-30" onClick={handleClick}>
                            <ZoomEffect imageUrl={img} zoomLevel={4} />
                            <div className="service-cap">
                                <div className="row">
                                    <h4>{name[lang]}</h4>
                                </div>

                                <div className="more-btn">{t("readmore")} <i className="ti-plus"></i></div>
                            </div>
                            <div className="service-icon">
                                <img src="img/icon/services_icon1.png" alt="" />
                            </div>
                        </div>
                        <button type="button" className="btn btn-delete" onClick={() => {
                            if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
                                deleteService(); // nhớ gọi hàm
                            }
                        }} style={{ bottom: 100, right: 50 }}>

                            <i className="bi bi-trash"></i></button>
                        <button type="button" className="btn btn-edit" onClick={editService} style={{ bottom: 150, right: 50 }}>

                            <i className="bi bi-pen"></i></button>
                    </>
                )}
            </div>
        </>
    );
};

export default Service;