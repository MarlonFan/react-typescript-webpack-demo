import "./index.less";
import * as React from "react";
import { render } from "react-dom";
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

// store
import { getTeacherCourses } from "../../../../store/teacher";
// interface
import {
    TeacherResBasic,
    CoursesResBasic,
    CourseBasic
} from '../../../../common/teacher';

class Course extends React.Component<any, any> {
    constructor(props: CourseBasic, context: any) {
        super(props, context);
    }

    render() {
        return (
            <li>
                <img src={ this.props.cover } alt={ this.props.title }/>
                <div>
                    <strong>{ this.props.title }</strong>
                    <p>{ this.props.detail }</p>
                </div>
            </li>
        )
    }
}

class CourseList extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
    }

    render() {
        return (
            <ul id="course-list">
                { this.props.courses.map((course: CourseBasic, index: number) => {
                    return (
                        <Course key={ course.cid } {...course} />
                    )
                }) }
            </ul>
        )
    }

}

export default class TeacherCourses extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            courses: []
        }
    }

    componentDidMount() {
        let _this = this;

        if (!_this.state.courses.length) {
            getTeacherCourses()
                .then(courseList => {
                    let data: CoursesResBasic = courseList;

                    _this.setState({
                        courses: data.courses,
                    })
                })
        }
    }

    render() {
        console.log('构建课程列表');
        return (
            <CourseList courses={ this.state.courses } />
        )
    }
}

