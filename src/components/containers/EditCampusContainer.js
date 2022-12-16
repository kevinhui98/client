/*==================================================
EditStudentContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchCampusThunk, editCampusThunk } from "../../store/thunks";
import { EditCampusView } from "../views";
import { Redirect } from 'react-router-dom';
class EditCampusContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.campus.id,
      address: this.props.campus.address,
      name: this.props.campus.name,
      description: this.props.campus.description,
      imageUrl: this.props.campus.imageUrl,
      redirect: false,
      redirectId: null
    };
  }
  // Get student data from back-end database
  componentDidMount() {
    this.props.editCampus(this.props.campus);

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
    // console.log("EditStudentContainer: handleSubmit: this.props.student = ", this.props.student);
    let campus = {
      id: this.state.id,
      address: this.state.address,
      name: this.state.name,
      description: this.state.description,
      imageUrl: this.state.imageUrl,
    };
    // changing student in back-end database
    //update student in back-end database
    await this.props.editCampus(campus);
    // Update state, and trigger redirect to show the new student
    this.setState({
      name: "",
      address: "",
      imageUrl: null,
      description: null,
      redirect: true,
      redirectId: this.props.match.params.id
    });
  }

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
    this.setState({ redirect: false, redirectId: null });
  }
  // Render Campus view by passing campus data as props to the corresponding View component
  render() {
    // Redirect to edited campus's page after submit
    if (this.state.redirect) {
      return (<Redirect to={`/campus/${this.state.redirectId}`} />)
    }
    return (
      <div>
        <Header />
        <EditCampusView
          campus={this.props.campus}
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
    campus: state.campus,  // Get the State object from Reducer "student"
  };
};
// 2. The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
  return {
    fetchCampus: (id) => dispatch(fetchCampusThunk(id)),
    editCampus: (campus) => dispatch(editCampusThunk(campus)),
  };
};

// Export store-connected container by default
// StudentContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(EditCampusContainer);