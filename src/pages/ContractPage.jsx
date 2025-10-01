import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Hero from "../components/Hero";


export default function ContractPage() {
    const { t } = useTranslation();
    const formRef = useRef(null);
    const [sending, setSending] = useState(false);

    const handleResult = (status) => {
        if (status === "ok") {
            toast.success(t("contactUs.form.sentOk"), {
                position: "top-right",
                autoClose: 2000,
                theme: "colored",
            });
        } else {
            toast.error(t("contactUs.form.sentErr"), {
                position: "top-right",
                autoClose: 2000,
                theme: "colored",
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (sending) return;
        setSending(true);

        emailjs
            .sendForm(
                "service_h05wsgb",  
                "template_j27qrwt",
                formRef.current,
                { publicKey: "mlfxVlQ816AQklFXU" }
            )
            .then(() => {
                setSending(false);
                handleResult("ok");  
                formRef.current?.reset();
            })
            .catch((err) => {
                console.error(err);
                setSending(false);
                handleResult("err");
            });
    };
    return (
        <>
            <Hero title={t("contactUs.hero.title")} home={t("contactUs.hero.home")} titleSmall={t("contactUs.hero.titleSmall")} />

            <section className="contact-section">
                <div className="container">
                    <div className="d-none d-sm-block mb-5 pb-4">
                        <div style={{ height: 480, position: "relative", overflow: "hidden", }}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.5652094232!2d106.726!3d10.830!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175294f2cfxxxx%3A0x123456789!2s21%2F8%20Đường%2035%2C%20Phường%20Hiệp%20Bình%2C%20Thủ%20Đức!5e0!3m2!1svi!2s!4v1692358294000!5m2!1svi!2s"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>


                    <div className="row">
                        <div className="col-12">
                            <h2 className="contact-title">{t("contactUs.getInTouch")}</h2>
                        </div>
                        <div className="col-lg-8">
                            <form
                                ref={formRef}
                                className="form-contact contact_form"
                                id="contactForm"
                                onSubmit={handleSubmit}
                            >
                                <div className="row">
                                    <div className="col-12">
                                        <div className="form-group">
                                            <input
                                                className="form-control"
                                                name="title"
                                                id="title"
                                                type="text"
                                                onFocus={(e) => (e.target.placeholder = "")}
                                                onBlur={(e) => (e.target.placeholder = t("contactUs.form.title"))}
                                                placeholder={t("contactUs.form.title")}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group">
                                            <textarea
                                                style={{ resize: "vertical" }}
                                                className="form-control w-100"
                                                name="message" // <-- giữ nguyên để map trong template
                                                id="message"
                                                cols="30"
                                                rows="9"
                                                onFocus={(e) => (e.target.placeholder = "")}
                                                onBlur={(e) => (e.target.placeholder = t("contactUs.form.message"))}
                                                placeholder={t("contactUs.form.message")}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <input
                                                className="form-control valid"
                                                name="from_name"  // <-- đổi sang from_name để dùng trong template
                                                id="name"
                                                type="text"
                                                onFocus={(e) => (e.target.placeholder = "")}
                                                onBlur={(e) => (e.target.placeholder = t("contactUs.form.name"))}
                                                placeholder={t("contactUs.form.name")}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <input
                                                className="form-control valid"
                                                name="reply_to"    // <-- EmailJS mặc định dùng reply_to
                                                id="email"
                                                type="email"
                                                onFocus={(e) => (e.target.placeholder = "")}
                                                onBlur={(e) => (e.target.placeholder = t("contactUs.form.email"))}
                                                placeholder={t("contactUs.form.email")}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-group">
                                            <input
                                                className="form-control"
                                                name="subject"
                                                id="subject"
                                                type="text"
                                                onFocus={(e) => (e.target.placeholder = "")}
                                                onBlur={(e) => (e.target.placeholder = t("contactUs.form.subject"))}
                                                placeholder={t("contactUs.form.subject")}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group mt-3">
                                    <button type="submit" className="button button-contactForm" disabled={sending}>
                                        {sending ? (t?.("loading") ?? "Loading") : t("contactUs.form.send")}
                                    </button>
                                    {/* {result === "ok" && (
                                        <div className="mt-2 text-success small">
                                            {t?.("contactUs.form.sentOk") ?? "Đã gửi thành công!"}
                                        </div>
                                    )}
                                    {result === "err" && (
                                        <div className="mt-2 text-danger small">
                                            {t?.("contactUs.form.sentErr") ?? "Gửi thất bại. Vui lòng thử lại!"}
                                        </div>
                                    )} */}
                                </div>
                            </form>
                            <ToastContainer />
                        </div>
                        <div className="col-lg-3 offset-lg-1">
                            <div className="media contact-info">
                                <span className="contact-info__icon">
                                    <i className="ti-home"></i>
                                </span>
                                <div className="media-body">
                                    <h3>{t("contactUs.info.company")}</h3>
                                    <p>{t("contactUs.info.city")}</p>
                                </div>
                            </div>

                            <div className="media contact-info">
                                <span className="contact-info__icon">
                                    <i className="ti-tablet"></i>
                                </span>
                                <div className="media-body">
                                    <h3>+84 908 863 459</h3>
                                    <p>{t("contactUs.info.name")}</p>
                                </div>
                            </div>

                            <div className="media contact-info">
                                <span className="contact-info__icon">
                                    <i className="ti-email"></i>
                                </span>
                                <div className="media-body">
                                    <h3>ngochihai08121978@gmail.com</h3>
                                    <p>{t("contactUs.info.note")}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

