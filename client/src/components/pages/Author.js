import React from 'react';
import axios from 'axios';

class Author extends React.Component {
  state = {
    firstname: '',
    lastname: '',
    email: '',
    posts:[]
  };
  componentDidMount = async () => {
    // darom uzklausa i backend, gave duomenis updateinam state
    const res = await axios.get('/api/users/' + this.props.match.params.id);
    console.log(res.data);
    // set state
    const {firstname, lastname, email} = res.data[0];
    this.setState({firstname, lastname, email})
  };

  render() {
    if(!this.state.firstname) return <div>Loading user...</div>
    const {firstname, lastname, email} = this.state;
    return (
        <div className="Author">
          <h1>{firstname} {lastname}</h1>
          <h2>{email}</h2>
        </div>
    );
  }
}
export default Author