import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from 'react-responsive';
import { useLocation } from "react-router-dom";
import axios from "axios";
import 'react-loading-skeleton/dist/skeleton.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Service from '../../components/auth/Service';
import Project from '../../components/auth/Project';
import ProjectList from '../../components/ProjectList';
import Loading from '../../components/Loading.jsx';

import api from "../../api/api.json";
import { BASE_URL } from "../../api/config.js";

export default function AdminPage() {
    const token = sessionStorage.getItem("accessToken");

    const location = useLocation();
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace("#", "");
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [location]);

    const { t } = useTranslation();
    const lang = t("i18n");

    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const [loading, setLoading] = useState(false);


    //getService
    const [dataService, setDataService] = useState([]);
    const [dataProject, setDataProject] = useState([]);
    const getService = () => {
        let apiUrl = `${BASE_URL}/services`;
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
        let apiUrl = `${BASE_URL}/projects`;
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
                // setDataProject(api.project);
                console.error('Error fetching data:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };


    // setAxios
    const dlgRef = useRef(null);
    const dlgRefProject = useRef(null);
    // setServices
    const [values, setValues] = useState({
        jp: "",
        en: "",
    });
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [touched, setTouched] = useState({});
    const [open, setOpen] = useState(false);
    const [editSet, setEditSet] = useState(false);
    const [editData, setEditData] = useState([]);
    const show = () => {
        dlgRef.current?.showModal();
        setOpen(true);
        setValues({
            jp: "",
            en: "",
        });
        setFile(null)
        setEditSet(false)
    };
    const showEdit = () => {
        dlgRef.current?.showModal();
        setOpen(true);
        setFile(null)

    };
    const close = () => { dlgRef.current?.close(); setOpen(false); };

    const onChange = (e) => {
        const { name, value } = e.target;
        setValues((v) => ({ ...v, [name]: value }));
    };

    const onFile = (e) => {
        setFile(e.target.files?.[0] ?? null)
    };

    const validate = () => {
        const empty = Object.entries(values).filter(([_, v]) => !v.trim()).map(([k]) => k);
        if (!editSet) {
            if (!file) empty.push("img");
        }
        if (empty.length) {
            setTouched((t) => ({ ...t, ...Object.fromEntries(empty.map((k) => [k, true])) }));
        }
        return empty.length === 0;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!validate()) { setError("Vui lòng điền đầy đủ các trường."); return; }

        const form = new FormData();
        form.append("jp", values.jp);
        form.append("en", values.en);
        form.append("vi", values.en);

        form.append("img", file);

        try {
            setLoading(true);
            if (editSet) {
                const res = await axios.put(`${BASE_URL}/services/${editData[0]}`, form,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${token}`
                        }
                    });
                handleResult("ok", "Sửa Thành Công")
                getService()
                close();


            }
            else {
                const res = await axios.post(`${BASE_URL}/services`, form, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                    }
                });
                handleResult("ok", "Thêm Thành Công")
                getService()
                close();
            }
        } catch (err) {
            setError("Đã Xảy Ra Lỗi, Vui Lòng Thử Lại");
            console.log(err.response?.data || err.message);
            handleResult("err", "Đã Xảy Ra Lỗi, Vui Lòng Thử Lại");
        } finally {
            setLoading(false);

        }
    };

    const invalid = (k) => touched[k] && !(k === "img" ? file : values[k]?.trim());
    const inputClass = (k) => `fi ${invalid(k) ? "is-invalid" : ""}`;


    //setProject
    const [valuesProject, setValuesProject] = useState({
        jp: "",
        en: "",
        serviceId: "",
    });

    const [fileProject, setFileProject] = useState([]);
    const [touchedProject, setTouchedProject] = useState({});
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
        setValuesProject({ jp: "", en: "", vi: "", serviceId: "" });
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
        const list = Array.from(e.target.files || []);
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

            await axios.post(`${BASE_URL}/projects`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            handleResult("ok", "Thêm thành công");
            getProject?.();
            closeProject();
        } catch (err) {
            console.log(err.response?.data || err.message);
            setError("Đã xảy ra lỗi, vui lòng thử lại.");
            handleResult("err", "Đã xảy ra lỗi, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
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
    useEffect(() => {
        if (editData && editData.length > 0) {
            setValues({
                jp: editData[1].jp,
                en: editData[1].en,
                vi: editData[1].vi,
            });
        }
    }, [editData]);
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

            <div className="services-area1 section-padding mt-80" id="service">
                <div className="container">
                    {/* <!-- section tittle --> */}
                    <div className="row">
                        <div className="col-lg-11">
                            <div className="section-tittle mb-55" data-aos="fade-up" data-aos-delay="150">
                                <div className="front-text">
                                    <h2 className="">{t("ourServices")}</h2>

                                </div>
                                <span className="back-text">{t("ourServices")}</span>
                            </div>
                        </div>
                        {isMobile ? <div className="btn btn-plus" onClick={show} style={{ width: "100%", marginTop: 15, marginBottom: 15 }}><h1>+</h1></div>
                            : <div className="col-1 btn btn-plus" onClick={show} style={{ width: 80, height: 86, marginTop: 15, marginBottom: 15 }}><h1>+</h1></div>}
                    </div>
                    {/* <Skeleton height={170} width={170} /> */}
                    <div className="row" data-aos="fade-up" data-aos-delay="150">
                        {
                            dataService.map((item, index) => (
                                <Service
                                    key={`${item.id}-${index}`}
                                    id={item.id}
                                    name={item.name}
                                    img={item.img}
                                    onEditChange={setEditSet}
                                    onEditData={setEditData}
                                    onOpen={showEdit}
                                    onService={getService}
                                    onLoading={setLoading}
                                />
                            ))
                        }


                    </div>
                </div>
            </div>
            {/* <div className="services-area1 section-padding" id="user">
                <h1>User</h1>
            </div> */}
            <section className="project-area  section-padding10 pt-100 mb-30" id="project">
                <div className="container">
                    <div className="project-heading mb-35" data-aos="fade-up" data-aos-delay="200">
                        <div className="row align-items-end">
                            <div className="col-lg-11">
                                {/* <!-- Section Tittle --> */}
                                <div className="section-tittle section-tittle3">
                                    <div className="front-text">
                                        <h2 className="">{t("ourProjects")}</h2>
                                    </div>
                                    <span className="back-text">{t("ourProjects")}</span>
                                </div>
                            </div>
                            <div className="col-lg-1 btn btn-plus" onClick={showProject}>
                                <h1>+</h1>
                            </div>
                            <div className="properties__button">
                                <nav>
                                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                        <a className="nav-item nav-link active" id="all-tab" data-toggle="tab" href="#all" role="tab" aria-controls="all" aria-selected="false"> {t("showAll")} </a>
                                        {dataService.map((datas, index) => {
                                            const shortSid = datas.id.substring(0, 8);

                                            return (
                                                <a key={`${shortSid}-${index}`} className="nav-item nav-link" id={datas.countProject ? `${shortSid}-tab` : `0-tab`} data-toggle="tab" href={datas.countProject ? `#${shortSid}` : '#0'} role="tab" aria-controls={datas.countProject ? shortSid : 0} aria-selected="false"> {datas.name[t("i18n")]}</a>

                                            )
                                        }
                                        )}
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            {/* <!-- Nav Card --> */}
                            <div className="tab-content active" id="nav-tabContent" data-aos="fade-up" data-aos-delay="200">
                                <div className="tab-pane fade active show" id="all" role="tabpanel" aria-labelledby="all-tab">
                                    <div className="project-caption">
                                        <ProjectList showAll={dataProject} t={t} isMobile={isMobile} admin={token ? true : false} dataService={dataService} />
                                    </div>
                                </div>
                                {Object.entries(groups).map(([sid, items]) => {
                                    const shortSid = sid.substring(0, 8);
                                    return (<div className="tab-pane fade" id={shortSid} role="tabpanel" aria-labelledby={`${shortSid}-tab`} key={`${sid}`}>
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
                                                        dataService={dataService}
                                                    />

                                                ))}
                                            </div>
                                        </div>
                                    </div>);

                                })}

                                <div className="tab-pane fade empty-state" id="0" role="tabpanel" aria-labelledby="0-tab">
                                    <div className="empty-icon">📂</div>
                                    <h2 className="empty-title">Chưa có dữ liệu</h2>
                                    <p className="empty-text">
                                        Hiện chưa có dự án nào trong danh mục này. Bạn có thể thêm mới để bắt đầu.
                                    </p>
                                    <button className="btn-add">
                                        <span className="plus">＋</span> Thêm dự án
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Overlay */}
            {open && <div className="fd-overlay" onClick={close} />}
            <dialog ref={dlgRef} className="fd-dialog" onClose={() => setOpen(false)} data-aos="fade-left" data-aos-delay="100">
                <form className="fd-form" onSubmit={onSubmit} method="dialog" >
                    <div className="fd-head">
                        {editSet ? <h3>Edit Service</h3> : <h3>Create Service</h3>}

                        <button type="button" className="icon-btn" onClick={close} aria-label="Close">✕</button>
                    </div>

                    <div className="fd-grid">
                        <label className="field-form">
                            <span className="flabel">jp <b>*</b></span>
                            <input
                                className={inputClass("jp")}
                                name="jp"
                                value={values.jp}
                                onChange={onChange}
                                onBlur={() => setTouched((t) => ({ ...t, jp: true }))}
                                placeholder=" "
                                type="text"
                            />

                            <small className="hint">Tiêu đề tiếng Nhật</small>
                        </label>

                        <label className="field-form">
                            <span className="flabel">en <b>*</b></span>
                            <input
                                className={inputClass("en")}
                                name="en"
                                value={values.en}
                                onChange={onChange}
                                onBlur={() => setTouched((t) => ({ ...t, en: true }))}
                                placeholder=" "
                                type="text"
                            />
                            <small className="hint">Tiêu đề tiếng Anh</small>
                        </label>

                        <span className="flabel">img (file) <b>*</b></span>
                        <div className={`field-form wide ${invalid("img") ? "is-invalid" : ""}`}>
                            <label className="dropzone" onDragOver={(e) => e.preventDefault()}>
                                <input
                                    type="file"
                                    name="img"
                                    accept="image/*"
                                    onChange={onFile}
                                    onBlur={() => setTouched((t) => ({ ...t, img: true }))}
                                />
                                <div className="dz-content">
                                    <div className="dz-text">
                                        {file ? (
                                            <>
                                                <strong>{file.name}</strong>
                                                <span>{Math.round(file.size / 1024)} KB</span>
                                            </>

                                        ) : editSet ? (
                                            <> <img
                                                src={editData[2]}
                                                alt="preview"
                                                style={{
                                                    maxWidth: "100%",
                                                    height: 270,
                                                    objectFit: "contain",

                                                }}
                                            />
                                            </>
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
                        <button type="button" className="btn-back ghost" onClick={close} disabled={loading}>Hủy</button>
                        <button type="submit" className="btn btn-login" disabled={loading}>
                            {loading ? <span className="spinner" /> : "Gửi"}
                        </button>
                    </div>
                </form>
            </dialog>


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
                        {editSetProject ? <h3>Edit Project</h3> : <h3>Create Project</h3>}
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
                                <option value="">-- Chọn loại dự án --</option>
                                {dataService.map((s) => (
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
                                        ) : editSetProject && editDataProject?.imageUrl ? (
                                            <img
                                                src={editDataProject.imageUrl}
                                                alt="preview"
                                                style={{
                                                    maxWidth: "100%",
                                                    height: 270,
                                                    objectFit: "contain",
                                                }}
                                            />
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

