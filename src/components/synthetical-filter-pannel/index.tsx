import "./index.less";

import * as React from "react";
import { render } from "react-dom";

import * as classNames from "classnames";
import * as Lodash from "lodash";

interface FilterConditionOption {
    name: string;
    oid: any;
}
interface FilterConditionProps {
    type: string;
    tid: any;
    options: FilterConditionOption[];
    onChoose(option: FilterConditionOption): void;
}
interface FilterConditionState {
    choosedIndex: number;
}

class FilterCondition extends React.Component<FilterConditionProps, FilterConditionState> {
    static propTypes = {
        type: React.PropTypes.string,
        tid: React.PropTypes.number,
        options: React.PropTypes.array,
        onChoose: React.PropTypes.func,
    }
    initState: FilterConditionState;

    constructor(props: FilterConditionProps, context: FilterConditionState) {
        super(props, context);
        this.state = this.initState = {
            choosedIndex: 0,
        }
    }

    onChoose(index: number) {
        this.setState({
            choosedIndex: index,
        })
        this.props.onChoose(this.props.options[index]);
    }

    onReset() {
        this.setState(this.initState);
    }

    onConfirm() {
        return this.state.choosedIndex;
    }

    render() {
        return (
            <div className="synthetical-filter-condition">
                <strong className="synthetical-filter-condition-type">{ this.props.type }</strong>
                <div className="synthetical-filter-condition-options">
                    { this.props.options.map((option, index) => {
                        return (
                            <span key={ index } className={classNames({
                                "synthetical-filter-condition-option": true,
                                "synthetical-filter-condition-option-choosed": this.state.choosedIndex === index
                            }) } onClick={ this.onChoose.bind(this, index) }>{ option.name }</span>
                        )
                    }) }
                </div>
            </div>
        )
    }
}

interface SyntheticalFilterProps {
    conditions?: {
        type: string;
        tid: any;
        options: {
            name: string;
            oid: any;
        }[];
    }[];
    initConditions?: number[];
    onClose(): void;
}

export default class SyntheticalFilter extends React.Component<SyntheticalFilterProps, any> {
    static propTypes = {
        conditions: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
        initConditions: React.PropTypes.array,
    }
    static defaultProps = {

    }

    constructor(props: SyntheticalFilterProps, context: any) {
        super(props, context);
    }

    // 重置功能
    onReset() {
        Lodash.each(this.refs, (ref: FilterCondition) => {
            ref.onReset();
        })
    }
    // 确定功能
    onConfirm() {
        const choosedIds: number[] = [];

        Lodash.each(this.refs, (ref: FilterCondition) => {
            choosedIds.push(ref.onConfirm());
        })
        console.log("choosedIds: ", choosedIds);

        this.onClose();
        return choosedIds;
    }
    // 选中功能
    onChoose(option: FilterConditionOption) {
        console.log("外部调用选中功能...", option);
    }
    // 关闭功能
    onClose() {
        this.props.onClose();
    }

    render() {
        return (
            <div className="synthetical-filter-pannel">
                { this.props.conditions.map((condition, index) => {
                    return (
                        <FilterCondition ref={ `condition${index}` } key={ index } { ...condition } onChoose={ this.onChoose } />
                    )
                }) }
                <div className="synthetical-filter-action-btns">
                    <span className="synthetical-filter-action-reset-btn" onClick={ this.onReset.bind(this) }>重置</span>
                    <span className="synthetical-filter-action-confirm-btn" onClick={ this.onConfirm.bind(this) }>确定</span>
                </div>
            </div>
        );
    }
}