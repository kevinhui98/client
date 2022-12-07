/*==================================================
EditStudentContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchStudentThunk, editStudentThunk } from "../../store/thunks";
import { EditStudentView } from "../views";
import { Redirect } from 'react-router-dom';
class EditStudentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.student.id,
      firstname: this.props.student.firstname,
      lastname: this.props.student.lastname,
      gpa: this.props.student.gpa,
      email: this.props.student.email,
      imageUrl: this.props.student.imageUrl,
      campusId: this.props.student.campusId,
      redirect: false,
      redirectId: null
    };
  }
  // Get student data from back-end database
  componentDidMount() {
    this.props.editStudent(this.props.student);

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
    console.log("EditStudentContainer: handleSubmit: this.props.student = ", this.props.student);
    let student = {
      id: this.state.id,
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      gpa: this.state.gpa,
      email: this.state.email,
      imageUrl: this.state.imageUrl,
      campusId: this.state.campusId
    };
    // changing student in back-end database
    //update student in back-end database
    await this.props.editStudent(student);
    // Update state, and trigger redirect to show the new student
    this.setState({
      firstname: "",
      lastname: "",
      gpa: "",
      email: "",
      imageUrl: null,
      campusId: null,
      redirect: true,
      redirectId: this.props.match.params.id
    });
  }

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
    this.setState({ redirect: false, redirectId: null });
  }
  // Render Student view by passing student data as props to the corresponding View component
  render() {
    // Redirect to edited student's page after submit
    if (this.state.redirect) {
      return (<Redirect to={`/student/${this.state.redirectId}`} />)
    }
    return (
      <div>
        <Header />
        <EditStudentView
          student={this.props.student}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}

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
    fetchStudent: (id) => dispatch(fetchStudentThunk(id)),
    editStudent: (student) => dispatch(editStudentThunk(student)),
  };
};

// Export store-connected container by default
// StudentContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(EditStudentContainer);