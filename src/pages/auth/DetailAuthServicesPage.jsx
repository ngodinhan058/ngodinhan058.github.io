import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from 'react-responsive';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import axios from "axios";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Hero from "../../components/Hero";
import PopupImage from '../../components/PopupImage';
import Loading from '../../components/Loading.jsx';

import { BASE_URL } from "../../api/config.js";



export default function DetailPage() {
    const location = useLocation();
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const token = sessionStorage.getItem("accessToken");

    const { id } = location.state || {};
    const { t } = useTranslation();
    const lang = t("i18n");
    const [dataCategories, setDataCategories] = useState([]);
    const [dataContent, setDataContent] = useState({});
    const [selectedId, setSelectedId] = useState();
    useEffect(() => {
        getCategories()
        getContent()
    }, []);
    //getCategories
    const getCategories = () => {
        let apiUrl = `${BASE_URL}/services/${id}/categories`;
        setLoading(true);
        axios.get(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            },
        })
            .then((response) => {
                const data = response.data.data;
                setDataCategories(data);
                setSelectedId(data[0]?.id)
            })
            .catch((error) => {
                if (error.response) {
                    setDataCategories([]);
                    setLoading(true);
                } else {
                    console.error('Error fetching data:', error);
                }
            })
            .finally(() => {
                setLoading(false); // Kết thúc loading
            });
    };
    const getContent = () => {
        let apiUrl = `${BASE_URL}/services/${id}/categories/content`;
        setLoading(true);
        axios.get(apiUrl, {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            },
        })
            .then((response) => {
                const data = response.data.data;

                setDataContent(data);
            })
            .catch((error) => {
                if (error.response) {
                    setDataContent({});
                    setLoading(true);

                } else {
                    console.error('Error fetching data:', error);
                }
            })
            .finally(() => {
                setLoading(false); // Kết thúc loading
            });
    };

    const selected = selectedId ? dataContent[selectedId] : undefined;

    //SetCategories
    const [error, setError] = useState(null);
    const [touched, setTouched] = useState({});
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editSet, setEditSet] = useState(false);
    const [editIdSet, setEditIdSet] = useState(false);
    const [editDataSet, setEditDataSet] = useState(false);

    const dlgRef = useRef(null);
    const dlgRefContent = useRef(null);

    const [values, setValues] = useState({
        title: { jp: "", en: "" },
        subtitle: { jp: "", en: "" },
    });
    const show = () => {
        dlgRef.current?.showModal();
        setOpen(true);
        setEditSet(false);

    };
    const showEdit = (idCate, data) => {
        dlgRef.current?.showModal();
        setOpen(true);
        setEditSet(true);
        setEditIdSet(idCate);
        setEditDataSet(data);

    };
    const close = () => { dlgRef.current?.close(); setOpen(false); };

    const onChange = (e) => {
        const { name, value } = e.target;
        const [group, key] = name.split(".");
        setValues((v) => ({ ...v, [group]: { ...v[group], [key]: value } }));
    };
    const getByPath = (obj, path) => path.split(".").reduce((o, p) => (o ? o[p] : ""), obj);
    const inputClass = (k) => `fi ${touched[k] ? (getByPath(values, k)?.trim() ? "" : "is-invalid") : ""}`;
    const validate = () => {
        const req = ["title.jp", "title.en", "subtitle.jp", "subtitle.en"];
        const empty = req.filter((k) => !getByPath(values, k)?.trim());
        if (empty.length) {
            setTouched((t) => ({ ...t, ...Object.fromEntries(empty.map((k) => [k, true])) }));
            return false;
        }
        return true;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const adjustedValues = {
            ...values,
            title: { ...values.title, vi: values.title.en },
            subtitle: { ...values.subtitle, vi: values.subtitle.en },
        };

        if (!validate()) {
            setError("Vui lòng điền đầy đủ các trường.");
            return;
        }

        try {
            setLoading(true);
            if (editSet) {
                const res = await axios.put(
                    `${BASE_URL}/services/${id}/categories/${editIdSet}`, adjustedValues, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`

                    },
                }
                );
                handleResult("ok", "Sửa Thành Công")
                close();
            } else {
                const res = await axios.post(
                    `${BASE_URL}/services/${id}/categories`, adjustedValues, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`

                    },
                }
                );
                handleResult("ok", "Thêm Thành Công")
                close();
            }
        } catch (err) {
            handleResult("err", "Đã Xảy Ra Lỗi, Vui Lòng Thử Lại");
            console.error("Error creating category:", err.response?.data || err.message);
            throw err;
        } finally {
            setLoading(false);
            getCategories();
        }
    };
    useEffect(() => {
        if (editSet) {

            setValues({
                title: {
                    jp: editDataSet[0].jp ?? "",
                    en: editDataSet[0].en ?? "",
                },
                subtitle: {
                    jp: editDataSet[1].jp ?? "",
                    en: editDataSet[1].en ?? "",
                },
            });
        } else {
            setValues({
                title: { jp: "", en: "" },
                subtitle: { jp: "", en: "" },
            });
        }
    }, [editSet, editDataSet]);
    const handleClick = (id) => {
        setSelectedId(id)
        window.scrollTo(0, 0);
    };
    const deleteCate = (idCate) => {
        let apiUrl = `${BASE_URL}/services/${id}/categories/${idCate}`;
        setLoading(true);
        axios.delete(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`

            },
        })
            .then((response) => {
                const data = response.status;
                if (data == 200 || 201) {
                    handleResult("ok", "Xóa Thành Công")
                    getCategories();
                } else {
                    handleResult("err", "Xóa Thất Bại, Vui Lòng Thử Lại");
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);

            })
            .finally(() => {
                setLoading(false); // Kết thúc loading
            });
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

    //SetContent
    const [valuesContent, setValuesContent] = useState({
        heading: { jp: "", vi: "", en: "" },
        size: "",
        price: "",
        scale: { jp: "", vi: "", en: "" },
    });
    const [files, setFiles] = useState([]);        // <-- nhiều ảnh
    const [touchedContent, setTouchedContent] = useState({});
    const [openContent, setOpenContent] = useState(false);
    const [existingImgs, setExistingImgs] = useState([]);

    const getByPathContent = (obj, path) => path.split(".").reduce((o, p) => (o ? o[p] : ""), obj);
    const inputClassContent = (k) => `fi ${touchedContent[k] ? (getByPathContent(valuesContent, k)?.toString().trim() ? "" : "is-invalid") : ""}`;
    const invalidContent = (k) => touchedContent[k] && (!getByPathContent(valuesContent, k) || !getByPathContent(valuesContent, k).toString().trim());

    const onChangeContent = (e) => {
        const { name, value } = e.target; // ví dụ "heading.jp" | "size" | "scale.en"
        if (name.includes(".")) {
            const [group, key] = name.split(".");
            setValuesContent((v) => ({ ...v, [group]: { ...v[group], [key]: value } }));
        } else {
            setValuesContent((v) => ({ ...v, [name]: value }));
        }
    };

    const showContent = (selected) => {
        dlgRefContent.current?.showModal();
        setOpenContent(true);

        if (selected) {
            setValuesContent({
                heading: {
                    jp: selected.heading?.jp ?? "",
                    vi: selected.heading?.vi ?? "",
                    en: selected.heading?.en ?? "",
                },
                size: selected.size ?? "",
                price: selected.price ?? "",
                scale: {
                    jp: selected.scale?.jp ?? "",
                    vi: selected.scale?.vi ?? "",
                    en: selected.scale?.en ?? "",
                },
            });
            setExistingImgs(selected.body)
        } else {
            setValuesContent({
                heading: { jp: "", vi: "", en: "" },
                size: "",
                price: "",
                scale: { jp: "", vi: "", en: "" },
            });
            setExistingImgs([])
        }
    };
    const closeContent = () => { dlgRefContent.current?.close(); setOpenContent(false); };
    const onFiles = (e) => {
        const list = Array.from(e.target.files || []);
        setFiles(list);
        setTouchedContent((t) => ({ ...t, img: true }));
    };
    const validateContent = () => {
        const req = [
            "heading.jp", "heading.en",
        ];
        const empty = req.filter((k) => !getByPathContent(valuesContent, k)?.toString().trim());
        const fileErr = files.length === 0;
        if (existingImgs?.length === 0) {
            if (empty.length || fileErr) {
                setTouchedContent((t) => ({
                    ...t,
                    ...Object.fromEntries(empty.map((k) => [k, true])),
                    img: true,
                }));
                return false;
            }
        }

        return true;
    };
    const onSubmitContent = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateContent()) {
            setError("Vui lòng điền đầy đủ các trường và chọn ít nhất một ảnh.");
            return;
        }

        const requestPayload = {
            heading: { ...valuesContent.heading, vi: valuesContent.heading.en },
            size: valuesContent.size,
            price: valuesContent.price,
            scale: { ...valuesContent.scale, vi: valuesContent.scale.en },
        };

        const fd = new FormData();
        fd.append(
            "request",
            new Blob([JSON.stringify(requestPayload)], { type: "application/json" })
        );

        files.forEach((file) => fd.append("img", file));
        try {
            setLoading(true);
            const res = await axios.put(
                `${BASE_URL}/services/${id}/categories/${selectedId}/content`,
                fd,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            handleResult("ok", "Thành Công")
            closeContent();
            getContent();
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Có lỗi xảy ra khi gửi dữ liệu.");
            handleResult("err", "Thất Bại, Vui Lòng Thử Lại")

        } finally {
            setLoading(false);
        }
    };




    return (
        <>
            {loading ? <Loading /> : <></>}

            <div className="services-details-area mt-90">
                <div className="container">
                    <div className="single-services section-padding2">
                        <div className="row g-4">
                            <div className="col-lg-3" data-aos="fade-right" data-aos-delay="150">
                                <aside className="price-card make-sticky p-4 border rounded shadow-sm">
                                    <button
                                        type="button"
                                        className={`picker-item w-100 text-start active`}
                                        onClick={show}
                                    >
                                        <span className="d-block fw-semibold">+</span>
                                    </button>
                                    <ul className="list-unstyled d-grid gap-2 price-card__picker">
                                        {dataCategories && dataCategories.length > 0 ? dataCategories.map((c, index) => (
                                            <li key={`${c.id}-${index}`}>
                                                <button
                                                    type="button"
                                                    className={`picker-item w-100 text-start ${selectedId === c.id ? "active" : ""}`}
                                                    onClick={() => handleClick(c.id)}
                                                    style={{ position: 'relative' }}
                                                >
                                                    <span className="d-block fw-semibold">{c.title[lang]}</span>
                                                    <small className="text-muted">{c.subtitle[lang]}</small>
                                                    <div style={{ position: "absolute", left: 5, top: 5, cursor: 'pointer' }} onClick={() => showEdit(c.id, [c.title, c.subtitle])}>
                                                        <i className="bi bi-pen"></i>
                                                    </div>
                                                    <div
                                                        style={{ position: "absolute", right: 5, top: 5, color: 'red', cursor: 'pointer' }}
                                                        onClick={() => {
                                                            if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
                                                                deleteCate(c.id);
                                                            }
                                                        }}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </div>


                                                </button>

                                            </li>

                                        )) : <li>
                                            <button
                                                type="button"
                                                className={`picker-item w-100 text-start`}
                                            >
                                                <span className="d-block fw-semibold">Chưa Có Danh Sách</span>

                                            </button>
                                        </li>}
                                    </ul>
                                    <h3 className="price-card__value pt-20 pb-15">
                                        {selected?.price ? selected?.price : t("contact")}
                                        {selected?.size && <small className="ms-1">{" / " + selected?.size}</small>}
                                    </h3>

                                    {selected?.scale[lang] && <p className="price-card__sub mb-3">{selected.scale[lang]}</p>}




                                </aside>
                            </div>

                            <div className="col-lg-9" data-aos="fade-left" data-aos-delay="150">
                                <div className="p-4 border rounded shadow-sm h-100">
                                    <div className="row">
                                        <div className="col-11">
                                            <h2 className="mb-3" style={{ wordWrap: "break-word" }}>{selected?.heading[lang]}</h2>
                                        </div>
                                        <div className="col-1">

                                            <button type="button" className="btn btn-edit" disabled={loading} style={{ right: 10 }} onClick={() => showContent(selected)}>
                                                {loading ? <span className="spinner" /> : <i className="bi bi-pen"></i>}</button>
                                        </div>
                                    </div>

                                    <div className="align-items-center justify-content-between mb-3">
                                        {selected?.body && selected?.body.length > 0 ? selected?.body.map((src, index) => (
                                            <div key={index} className="position-relative mb-5">
                                                <div
                                                    className="position-absolute bg-dark text-white px-2 py-1 small"
                                                    style={{ opacity: 0.8, borderTopRightRadius: "5px", right: 0, zIndex: 9 }}
                                                >
                                                    {index + 1}/{selected?.body.length}
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
                                            </div>
                                        )) : <h1>Chưa có thông tin</h1>}


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {open && <div className="fd-overlay" onClick={close} />}
            <dialog ref={dlgRef} className="fd-dialog" onClose={close} data-aos="fade-left" data-aos-delay="100">
                <form className="fd-form" onSubmit={onSubmit} method="dialog">
                    <div className="fd-head">
                        {editSet ? <h3>Sửa Danh Mục</h3> : <h3>Thêm Danh Mục</h3>}
                        <button type="button" className="icon-btn" onClick={close} aria-label="Close">✕</button>
                    </div>

                    <div className="fd-grid">
                        <label className="field-form">
                            <span className="flabel">Tiêu Đề (JP) <b>*</b></span>
                            <input
                                className={inputClass("title.jp")}
                                name="title.jp"
                                value={values.title.jp}
                                onChange={onChange}
                                onBlur={() => setTouched((t) => ({ ...t, ["title.jp"]: true }))}
                                placeholder=" "
                                type="text"
                            />
                            <small className="hint">Tiêu đề tiếng Nhật</small>
                        </label>

                        <label className="field-form">
                            <span className="flabel">Subtitle (JP) <b>*</b></span>
                            <input
                                className={inputClass("subtitle.jp")}
                                name="subtitle.jp"
                                value={values.subtitle.jp}
                                onChange={onChange}
                                onBlur={() => setTouched((t) => ({ ...t, ["subtitle.jp"]: true }))}
                                placeholder=" "
                                type="text"
                            />
                            <small className="hint">Phụ đề tiếng Nhật</small>
                        </label>


                        <label className="field-form">
                            <span className="flabel">Title (EN) <b>*</b></span>
                            <input
                                className={inputClass("title.en")}
                                name="title.en"
                                value={values.title.en}
                                onChange={onChange}
                                onBlur={() => setTouched((t) => ({ ...t, ["title.en"]: true }))}
                                placeholder=" "
                                type="text"
                            />
                            <small className="hint">Tiêu đề tiếng Anh</small>
                        </label>


                        <label className="field-form">
                            <span className="flabel">Subtitle (EN) <b>*</b></span>
                            <input
                                className={inputClass("subtitle.en")}
                                name="subtitle.en"
                                value={values.subtitle.en}
                                onChange={onChange}
                                onBlur={() => setTouched((t) => ({ ...t, ["subtitle.en"]: true }))}
                                placeholder=" "
                                type="text"
                            />
                            <small className="hint">Phụ đề tiếng Anh</small>
                        </label>

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

            {openContent && <div className="fd-overlay" onClick={closeContent} />}
            <dialog ref={dlgRefContent} className="fd-dialog" onClose={() => setOpenContent(false)} data-aos="fade-left" data-aos-delay="100">
                <form className="fd-form" onSubmit={onSubmitContent} method="dialog" >
                    <div className="fd-head">
                        <h3>Chi Tiết</h3>
                        <button type="button" className="icon-btn" onClick={closeContent} aria-label="Close">✕</button>
                    </div>
                    <div className="fd-grid">
                        {/* HEADING */}
                        <label className="field-form">
                            <span className="flabel">Heading JP <b>*</b></span>
                            <input
                                className={inputClassContent("heading.jp")}
                                name="heading.jp"
                                value={valuesContent.heading.jp}
                                onChange={onChangeContent}
                                onBlur={() => setTouchedContent((t) => ({ ...t, "heading.jp": true }))}
                                type="text"
                                placeholder=" "
                            />
                        </label>

                        <label className="field-form">
                            <span className="flabel">Heading EN <b>*</b></span>
                            <input
                                className={inputClassContent("heading.en")}
                                name="heading.en"
                                value={valuesContent.heading.en}
                                onChange={onChangeContent}
                                onBlur={() => setTouchedContent((t) => ({ ...t, "heading.en": true }))}
                                type="text"
                                placeholder=" "
                            />
                        </label>

                        {/* SIZE & PRICE */}
                        <label className="field-form">
                            <span className="flabel">Size</span>
                            <input
                                className="fi"
                                name="size"
                                value={valuesContent.size}
                                onChange={onChangeContent}
                                onBlur={() => setTouchedContent((t) => ({ ...t, size: true }))}
                                type="text"
                                placeholder="Ví dụ: 120x60"
                            />
                        </label>
                        <label className="field-form">
                            <span className="flabel">Price</span>
                            <input
                                className="fi"
                                name="price"
                                value={valuesContent.price}
                                onChange={onChangeContent}
                                onBlur={() => setTouchedContent((t) => ({ ...t, price: true }))}
                                type="text"
                                placeholder="Ví dụ: 2000¥"
                            />
                        </label>

                        {/* SCALE */}
                        <label className="field-form">
                            <span className="flabel">Scale JP</span>
                            <input
                                className="fi"
                                name="scale.jp"
                                value={valuesContent.scale.jp}
                                onChange={onChangeContent}
                                onBlur={() => setTouchedContent((t) => ({ ...t, "scale.jp": true }))}
                                type="text"
                                placeholder="スケール10:10"
                            />
                        </label>

                        <label className="field-form">
                            <span className="flabel">Scale EN</span>
                            <input
                                className="fi"
                                name="scale.en"
                                value={valuesContent.scale.en}
                                onChange={onChangeContent}
                                onBlur={() => setTouchedContent((t) => ({ ...t, "scale.en": true }))}
                                type="text"
                                placeholder="Scale 10:10"
                            />
                        </label>


                        <span className="flabel">img (file) <b>*</b></span>
                        <div className={`field-form wide ${invalidContent("img") ? "is-invalid" : ""}`}>
                            <label className="dropzone" onDragOver={(e) => e.preventDefault()}>
                                <input
                                    type="file"
                                    name="img"
                                    accept="image/*"
                                    multiple
                                    onChange={onFiles}
                                    onBlur={() => setTouchedContent((t) => ({ ...t, img: true }))}
                                />
                                <div className="dz-content">
                                    {files.length > 0 ? (
                                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                                            {files.map((f, i) => (
                                                <li key={i}><strong>{f.name}</strong> <span>{Math.round(f.size / 1024)} KB</span></li>
                                            ))}
                                        </ul>
                                    ) : existingImgs?.length > 0 ? (
                                        <ul className="thumbs" style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 12,
                                            margin: 0,
                                            padding: 0,
                                            listStyle: "none",
                                        }}>
                                            {existingImgs.map((src, i) => (
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
                                            <strong>Kéo thả ảnh</strong> hoặc <u>chọn nhiều file</u>
                                        </>
                                    )}
                                </div>
                            </label>
                            <small className="hint">Hỗ trợ nhiều ảnh (jpg, png, webp…)</small>

                        </div>
                    </div>

                    {error && <div className="alert error">⚠️ {String(error)}</div>}


                    <div className="fd-actions">
                        <button type="button" className="btn-back ghost" onClick={closeContent} disabled={loading}>Hủy</button>
                        <button type="submit" className="btn btn-login" disabled={loading}>
                            {loading ? <span className="spinner" /> : "Gửi"}
                        </button>
                    </div>
                </form>
            </dialog>
            <ToastContainer />

        </>
    );
}

