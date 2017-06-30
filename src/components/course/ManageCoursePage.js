import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as courseActions from '../../actions/courseActions';
import CourseForm from './CourseForm';
import toastr from 'toastr';

toastr.options.progressBar = true;

class ManageCoursePage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      course: Object.assign({}, props.initialCourse),
      errors: {},
      saving : false
    };
    this.updateCourseState = this.updateCourseState.bind(this);
    this.saveCourse = this.saveCourse.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.initialCourse.id != nextProps.initialCourse.id) {
      //Populate form when existing course is loaded directly
      this.setState({course: Object.assign({}, nextProps.initialCourse)});
    }
  }

  updateCourseState(event) {
    const field = event.target.name;
    let course = Object.assign({}, this.state.course);
    course[field] = event.target.value;
    return this.setState({course: course});
  }

  saveCourse(event) {
    event.preventDefault();
    this.setState({saving:true});
    this.props.actions.saveCourse(this.state.course)
      .then(() => this.redirect())
      .catch(error => {
        toastr.error(error);
        this.setState({saving:false});
      });
  }

  redirect() {
    this.setState({saving:false});
    toastr.success('Course saved');
    this.context.router.push('/courses');
  }

  render() {
    return (
      <CourseForm
        allAuthors={this.props.authors}
        course={this.state.course}
        errors={this.state.errors}
        onChange={this.updateCourseState}
        onSave={this.saveCourse}
        saving={this.state.saving}
      />
    );
  }
}

ManageCoursePage.propTypes = {
  initialCourse: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  authors: PropTypes.array.isRequired
};

ManageCoursePage.contextTypes = {
  router: PropTypes.object
};

function getCourseById(courses, id) {
  const course = courses.filter(course => course.id == id);
  if(course.length) return course [0];
  return null;
}

function mapStateToProps(state, ownProps) {
  const courseId = ownProps.params.id;

  let course = {id: '', watchHref: '', title: '', authorId: '', category: '', length: ''};

  if(courseId && state.courses.length > 0) {
    course = getCourseById(state.courses, courseId);
  }

  const authorsFormattedForDropdown = state.authors.map(author => {
    return {
      value: author.id,
      text: author.firstName + ' ' + author.lastName
    };
  });

  return {
    initialCourse: course,
    authors: authorsFormattedForDropdown
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(courseActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);
