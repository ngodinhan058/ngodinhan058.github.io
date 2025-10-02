import { useState, useMemo } from "react";
import { useNavigate } from 'react-router-dom';

import ZoomEffect from '../components/ZoomEffect';
import PopupImage from '../components/PopupImage';
const PAGE_SIZE = 6;

function ProjectList({ showAll = [], t, isMobile, admin = false, dataService }) {
    const [visible, setVisible] = useState(PAGE_SIZE);
    const [loading, setLoading] = useState(false);
    
    const data = dataService ? JSON.parse(JSON.stringify(dataService)) : null
    const items = useMemo(() => showAll?.slice(0, visible), [showAll, visible]);
    const canLoadMore = visible < showAll.length;

    const navigate = useNavigate();

    const handleLoadMore = async () => {
        // giả lập loading ngắn cho trải nghiệm (có thể bỏ)
        setLoading(true);
        setTimeout(() => {
            setVisible(v => Math.min(v + PAGE_SIZE, showAll.length));
            setLoading(false);
        }, 350);
    };
    const handleClick = (id, name, img, serviceId, serviceName) => {
        if (admin) {
            navigate(`/admin_akebono/detailProject/${name.jp}`, {
                state: {
                    id,
                    name,
                    img,
                    serviceId,
                    serviceName,
                    data
                },
            });
        } else {
            navigate(`/detailProject/${name.jp}`, {
                state: {
                    id,
                    name,
                    img,
                    serviceName,
                },
            });
        }

        window.scrollTo(0, 0);
    };
    return (
        <>
            <div className="row">
                {items.map((datas) => (
                    <div key={`${""}-${datas?.id}`} className="col-lg-4 col-md-6 fade-in" onClick={() => handleClick(datas?.id, datas?.name, datas?.img, datas?.serviceId, datas?.serviceName)}>
                        <div className="single-project mb-30">
                            <div className="project-img">
                                {isMobile
                                    ? <PopupImage img={datas?.img[0]} />
                                    : <ZoomEffect imageUrl={datas?.img[0]} zoomLevel={3} />
                                }
                            </div>
                            <div className="project-cap">
                                <a className="plus-btn"><i className="ti-plus" /></a>
                                <h4><a>{datas?.name?.[t("i18n")] || datas?.name?.en || datas?.name}</a></h4>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load more */}
            <div className="loadmore-area">
                {canLoadMore ? (
                    <div
                        role="button"
                        tabIndex={0}
                        className={`loadmore-strip ${loading ? "is-loading" : ""}`}
                        onClick={handleLoadMore}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleLoadMore()}
                        aria-busy={loading}
                        aria-label={t?.("loadMore") ?? "Load more"}
                    >
                        {!loading ? (
                            <span className="loadmore-label">{t?.("loadMore") ?? "Load more"}</span>
                        ) : (
                            <span className="loadmore-loading">
                                <span className="spinner" aria-hidden /> {t?.("loading") ?? "Loading…"}
                            </span>
                        )}
                    </div>
                ) : (
                    showAll.length > PAGE_SIZE && (
                        <div className="end-text">
                            {t?.("allLoaded") ?? "Đã hiển thị tất cả"} ({showAll.length})
                        </div>
                    )
                )}
            </div>
        </>
    );
}

export default ProjectList;
