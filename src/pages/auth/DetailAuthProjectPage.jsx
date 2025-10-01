import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from 'react-responsive';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

import PopupImage from '../../components/PopupImage';
import Hero from '../../components/Hero';
import Loading from '../../components/Loading';

import { BASE_URL } from "../../api/config.js";

export default function DetailPage() {
    const token = sessionStorage.getItem("accessToken");

    const location = useLocation();
    const navigate = useNavigate();

    const { id, name, img, serviceId, serviceName, data } = location.state || {};

    const { t } = useTranslation();
    const lang = t("i18n");

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const dlgRefProject = useRef(null);
    const [valuesProject, setValuesProject] = useState({
        jp: "",
        en: "",
        serviceId: "",
    });

    const [fileProject, setFileProject] = useState([]);
    const [touchedProject, setTouchedProject] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [openProject, setOpenProject] = useState(false);

    const [editSetProject, setEditSetProject] = useState(false);
    const [editDataProject, setEditDataProject] = useState(null); // {id, name:{jp,en,vi}, imageUrl, serviceId}


    // ----- helpers -----
    const invalidProject = (k) =>
        touchedProject[k] &&
        !(k === "img" ? fileProject : (valuesProject[k] ?? "").trim());

    const inputClassProject = (k) => `fi ${invalidProject(k) ? "is-invalid" : ""}`;

    const showProject = () => {
        dlgRefProject.current?.showModal();
        setOpenProject(true);
        setEditSetProject(false);
        setEditDataProject(null);
        setValuesProject({ jp: name?.jp, en: name?.en, vi: name?.vi, serviceId: serviceId });
        setFileProject([]);
        setTouchedProject({});
        setError(null);
    };

    const closeProject = () => {
        dlgRefProject.current?.close();
        setOpenProject(false);
    };

    const onChangeProject = (e) => {
        const { name, value } = e.target;
        setValuesProject((v) => ({ ...v, [name]: value }));
    };

    const onFileProject = (e) => {
        const list = Array.from(e.target.files || img);
        setFileProject(list);
        setTouchedProject((t) => ({ ...t, img: true }));
    };

    const validateProject = () => {
        const fields = ["jp", "en", "serviceId"];
        const empty = fields.filter((k) => !(valuesProject[k] ?? "").trim());

        if (!editSetProject && !fileProject) empty.push("img");

        if (empty.length) {
            setTouchedProject((t) => ({
                ...t,
                ...Object.fromEntries(empty.map((k) => [k, true])),
                img: true,
            }));
            return false;
        }
        return true;
    };


    // ----- submit -----
    const onSubmitProject = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateProject()) {
            setError("Vui lòng điền đầy đủ các trường.");
            return;
        }

        // chỉ nhập EN => vi = en
        const payload = {
            name: {
                jp: valuesProject.jp,
                en: valuesProject.en,
                vi: valuesProject.en,   // auto set
            },
            serviceId: valuesProject.serviceId,
        };

        const form = new FormData();
        form.append(
            "request",
            new Blob([JSON.stringify(payload)], { type: "application/json" })
        );
        fileProject.forEach((file) => form.append("images", file));

        try {
            setLoading(true);

            await axios.put(`${BASE_URL}/projects/${id}`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            handleResult("ok", "Thêm thành công");
            navigate(-1);
            closeProject();
        } catch (err) {
            console.log(err.response?.data || err.message);
            setError("Đã xảy ra lỗi, vui lòng thử lại.");
            handleResult("err", "Đã xảy ra lỗi, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const deleteProject = () => {
        let apiUrl = `${BASE_URL}/projects/${id}`;
        setLoading(true);
        axios.delete(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`

            },
        })
            .then((response) => {
                const data = response.status;
                if (data == 200 || 201) {
                    setLoading(false);
                    handleResult("ok", "Xóa Thành Công")
                    navigate(-1)
                } else {
                    handleResult("err", "Xóa Thất Bại, Vui Lòng Thử Lại");
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);

            })
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
            {loading ? <Loading /> : <></>}
            <Hero title={name[lang]} home={t("projectUs.hero.home")} titleSmall={[serviceName[lang], name[lang]]} detail={true} />

            <div className="services-details-area">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="btn btn-edit" style={{ position: "absolute", left: 5, top: 15, cursor: 'pointer' }} onClick={() => showProject()}>
                                <i className="bi bi-pen"></i>
                            </div>
                            <div
                                className="btn btn-delete"
                                style={{ position: "absolute", right: 5, top: 15, cursor: 'pointer' }}
                                onClick={() => {
                                    if (window.confirm("Bạn có chắc chắn muốn xóa dự án này không?")) {
                                        deleteProject()
                                    }
                                }}
                            >
                                <i className="bi bi-trash"></i>
                            </div>
                            <div className="single-services section-padding2">
                                {/* <div className="details-img mb-40">
                                    <img src={img} alt="" />
                                </div> */}
                                {img && img?.length > 0 ? img?.map((src, index) => (
                                    <div key={index} className="position-relative mb-5">
                                        <div
                                            className="position-absolute bg-dark text-white px-2 py-1 small"
                                            style={{ opacity: 0.8, borderTopRightRadius: "5px", right: 0, zIndex: 5 }}
                                        >
                                            {index + 1}/{img.length}
                                        </div>
                                        {isMobile ? <PopupImage img={src} /> :
                                            <div className="rounded shadow" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
            {openProject && <div className="fd-overlay" onClick={closeProject} />}

            <dialog
                ref={dlgRefProject}
                className="fd-dialog"
                onClose={() => setOpenProject(false)}
                data-aos="fade-left"
                data-aos-delay="100"
            >
                <form className="fd-form" onSubmit={onSubmitProject} method="dialog">
                    <div className="fd-head">
                        <h3>Edit Project</h3>
                        <button
                            type="button"
                            className="icon-btn"
                            onClick={closeProject}
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="fd-grid">
                        <label className="field-form">
                            <span className="flabel">
                                jp <b>*</b>
                            </span>
                            <input
                                className={inputClassProject("jp")}
                                name="jp"
                                value={valuesProject.jp}
                                onChange={onChangeProject}
                                onBlur={() =>
                                    setTouchedProject((t) => ({ ...t, jp: true }))
                                }
                                placeholder=" "
                                type="text"
                            />
                            <small className="hint">Tiêu đề tiếng Nhật</small>
                        </label>

                        <label className="field-form">
                            <span className="flabel">
                                en <b>*</b>
                            </span>
                            <input
                                className={inputClassProject("en")}
                                name="en"
                                value={valuesProject.en}
                                onChange={onChangeProject}
                                onBlur={() =>
                                    setTouchedProject((t) => ({ ...t, en: true }))
                                }
                                placeholder=" "
                                type="text"
                            />
                            <small className="hint">Tiêu đề tiếng Anh</small>
                        </label>

                        <label className="field-form wide">
                            <span className="flabel">
                                Service <b>*</b>
                            </span>
                            <select
                                className={inputClassProject("serviceId")}
                                name="serviceId"
                                value={valuesProject.serviceId}
                                onChange={onChangeProject}
                                onBlur={() =>
                                    setTouchedProject((t) => ({ ...t, serviceId: true }))
                                }
                            >
                                {data?.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name?.[lang] ?? s.name?.en ?? s.id}
                                    </option>
                                ))}
                            </select>
                            <small className="hint">Chọn loại dự án từ danh sách</small>
                        </label>

                        <span className="flabel">
                            img (file) <b>{editSetProject ? "" : "*"}</b>
                        </span>
                        <div
                            className={`field-form wide ${invalidProject("img") ? "is-invalid" : ""
                                }`}
                        >
                            <label
                                className="dropzone"
                                onDragOver={(e) => e.preventDefault()}
                            >
                                <input
                                    type="file"
                                    name="img"
                                    multiple
                                    accept="image/*"
                                    onChange={onFileProject}
                                    onBlur={() =>
                                        setTouchedProject((t) => ({ ...t, img: true }))
                                    }
                                />
                                <div className="dz-content">
                                    <div className="dz-text">
                                        {fileProject.length > 0 ? (
                                            <>
                                                <ul style={{ margin: 0, paddingLeft: 16 }}>
                                                    {fileProject.map((f, i) => (
                                                        <li key={i}><strong>{f.name}</strong> <span>{Math.round(f.size / 1024)} KB</span></li>
                                                    ))}
                                                </ul>
                                            </>
                                        ) : img && img.length > 0 ? (
                                            <ul className="thumbs" style={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                gap: 12,
                                                margin: 0,
                                                padding: 0,
                                                listStyle: "none",
                                            }}>
                                                {img.map((src, i) => (
                                                    <li key={i} style={{ textAlign: "center" }}>
                                                        <img
                                                            src={src}
                                                            alt={`existing-${i}`}
                                                            style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8 }}
                                                        />
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <>
                                                <strong>Kéo thả ảnh</strong> hoặc <u>chọn file</u>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </label>
                        </div>
                        <small className="hint">Hỗ trợ ảnh (jpg, png, webp…)</small>
                    </div>

                    {error && <div className="alert error">⚠️ {String(error)}</div>}

                    <div className="fd-actions">
                        <button
                            type="button"
                            className="btn-back ghost"
                            onClick={closeProject}
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="btn btn-login"
                            disabled={loading}
                        >
                            {loading ? <span className="spinner" /> : "Gửi"}
                        </button>
                    </div>
                </form>
            </dialog>
            <ToastContainer />
        </>
    );
}

