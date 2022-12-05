/*==================================================
EditStudentContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import React, { Component } from "react";
import { connect } from "react-redux";
import { editStudentThunk } from "../../store/thunks";
import { EditStudentView } from "../views";
import { Redirect } from 'react-router-dom';
class EditStudentContainer extends Component {
  // Get student data from back-end database
  componentDidMount() {
    //getting student ID from url
    this.props.editStudent(this.props.match.params.id);
  }
  // Capture input data when it is entered
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  // Take action after user click the submit button
  handleSubmit = async event => {
    event.preventDefault();  // Prevent browser reload/refresh after submit.

    let student = {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      gpa: this.state.gpa,
      email: this.state.email,
      imageUrl: this.state.imageUrl,
      campusId: this.state.campusId
    };
    if (student.imageUrl === null) {
      student.imageUrl = this.state.imageUrl
    }
    // Add new student in back-end database
    let EditStudent = await this.props.EditStudent(student);

    // Update state, and trigger redirect to show the new student
    this.setState({
      firstname: "",
      lastname: "",
      gpa: "",
      email: "",
      imageUrl: null,
      campusId: null,
      redirect: true,
      redirectId: EditStudent.id
    });
  }

  // Unmount when the component is being removed from the DOM:
  // componentWillUnmount() {
  //   this.setState({ redirect: false, redirectId: null });
  // }
  // Render Student view by passing student data as props to the corresponding View component
  render() {
    // Redirect to new student's page after submit
    if (this.state.redirect) {
      return (<Redirect to={`/student/${this.state.redirectId}`} />)
    }
    return (
      <div>
        <Header />
        <EditStudentView
          student={this.props.student}
        // handleChange={this.handleChange}
        // handleSubmit={this.handleSubmit} 

        />
      </div>
    );
  }
}

// The following 2 input arguments are passed to the "connect" function used by "StudentContainer" to connect to Redux Store.  
// The following 2 input arguments are passed to the "connect" function used by "AllCampusesContainer" component to connect to Redux Store.
const mapState = (state) => {
  return {
    student: state.student,  // Get the State object from Reducer "student"
  };
};
// 2. The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
  return {
    editStudent: (student) => dispatch(editStudentThunk(student)),
  };
};

// Export store-connected container by default
// StudentContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(EditStudentContainer);