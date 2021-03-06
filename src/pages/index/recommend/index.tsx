import "./index.less";

import * as React from "react";
import { render } from "react-dom";
import { Link } from "react-router";
import * as Swipeable from "react-swipeable";
import * as store from "store";

import LoadingToast from "../../../components/toast/index";
import EmptyList from "../../../components/empty-list/index";
import ProfileCard from "../../../components/profile-card/index";
import ActivityModal from "../../../components/index-activity-modal";
import BackToTop from "../../../components/back-to-top";

import { getRecommendList } from "../../../js/store/index";
import { RecommendListBasic } from '../../../js/interface/common';

interface RecommendPannelState {
    loading?: boolean;
    loadingMore?: boolean;
    list?: RecommendListBasic[];
    currentPage?: number;
    totalPage?: number;
    showActivityModal?: boolean;
    showBackToTop?: boolean;
}
export default class RecommendPannel extends React.Component<any, RecommendPannelState> {
    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            loading: false,
            loadingMore: false,
            list: [],
            currentPage: 0,
            totalPage: 1,
            showActivityModal: false,
            showBackToTop: false,
        }

    }

    private preloadActivityImage: HTMLImageElement;

    handleLoadMore() {
        this.setState({
            loadingMore: true,
        })

        getRecommendList(this.state.currentPage + 1)
            .then(data => {
                if (data.list && data.list.length) {
                    this.setState({
                        list: this.state.list.concat(data.list),
                        currentPage: data.page,
                        totalPage: Math.ceil(data.total / data.perPage),
                    })
                }
            })
            .handle(() => {
                this.setState({
                    loadingMore: false,
                })
            })
    }

    handleSwipedUp() {
        if (document.body.scrollTop > window.screen.height && !this.state.showBackToTop) {
            this.setState({
                showBackToTop: true,
            })
        }

        if (this.state.currentPage >= this.state.totalPage) return;
        if (this.state.loadingMore) return;
        if (document.body.scrollTop < document.body.clientHeight - window.screen.height * 2) return;

        this.handleLoadMore();
    }

    handleSwipedDown() {
        if (document.body.scrollTop < window.screen.height && this.state.showBackToTop) {
            this.setState({
                showBackToTop: false,
            })
        }
    }

    handleCloseActivityModal() {
        let hmt = (window as any)._hmt;
        if (hmt) {
            hmt.push(["_trackEvent", "入口", "点击关闭", "移动端纳斯投票活动入口"]);
        }

        this.setState({
            showActivityModal: false,
        }, () => {
            store.set("nasi-activity-vote", true);
        })
    }

    handleActivityModalGo(link: string) {
        store.set("nasi-activity-vote", true);

        let hmt = (window as any)._hmt;
        if (hmt) {
            hmt.push(["_trackEvent", "入口", "点击", "移动端纳斯投票活动入口"]);
        }

        location.href = link;
    }

    componentDidMount() {
        let activityModalHadShowed: boolean = store.get("nasi-activity-vote");

        if (!activityModalHadShowed) {
            this.preloadActivityImage = new Image();
            this.preloadActivityImage.src = require("../../../img/activity_min.png");
        }


        this.setState({
            loading: true,
        })

        getRecommendList()
            .then(data => {
                this.setState({
                    loading: false,
                    list: data.list,
                    totalPage: Math.ceil(data.total / data.perPage),
                    currentPage: data.page,
                })
            })
            .handle(() => {
                this.setState({
                    loading: false,
                    showActivityModal: !activityModalHadShowed,
                })
            })
    }

    render() {
        const { loading, loadingMore, list, currentPage, totalPage, showActivityModal, showBackToTop } = this.state;
        const loadingToastProps = {
            tip: "加载中...",
            iconClassName: "icon-loading",
            isOpen: loading,
        };
        const activityModalProps = {
            visible: false && showActivityModal,
            handlerClose: this.handleCloseActivityModal.bind(this),
            handlerActivityModalGo: this.handleActivityModalGo.bind(this, "http://qmin91.com/mobile/activities/vote/42"),
            image: {
                ele: this.preloadActivityImage,
                alt: "“纳斯杯”动漫日语配音大赛拉开序幕",
            },
        };
        const backToTopProps = {
            showed: showBackToTop,
            onBackToTop: () => {
                this.setState({
                    showBackToTop: false,
                })
            }
        };

        if (loading) {
            return (
                <LoadingToast { ...loadingToastProps }/>
            )
        } else {
            return (
                <div>
                    <ActivityModal { ...activityModalProps }/>
                    <Swipeable
                        onSwipedUp={ this.handleSwipedUp.bind(this) }
                        onSwipedDown={ this.handleSwipedDown.bind(this) }
                        preventDefaultTouchmoveEvent={ false }
                        stopPropagation={ true }
                        >
                        {
                            list.length ?
                                <div className="recommend-list">

                                    { list.map((teacher, index) => {
                                        return (
                                            <ProfileCard { ...teacher } key={ index } />
                                        )
                                    }) }
                                    { currentPage == totalPage ? <div className="end-line">贤师都被你一览无余了</div> : (loadingMore ? <div className="load-more"><i className="iconfont iconloading"></i>正在加载...</div> : null) }
                                </div> :
                                <EmptyList tip="暂无推荐的机构和老师" />
                        }
                    </Swipeable>
                    <BackToTop { ...backToTopProps } />
                </div>
            )
        }
    }
}


