import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Grid, Header, Message, Segment, Dropdown } from 'semantic-ui-react';
import { Accounts } from 'meteor/accounts-base';
import {Profiles, ProfileSchema} from '../../api/profile/profile';
import { _ } from 'meteor/underscore';
import languageList from '../../api/profile/languageList';
/**
 * Signup component is similar to signin component, but we attempt to create a new user instead.
 */
export default class Signup extends React.Component {
  /** Initialize state fields. */
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: '' };
    // Ensure that 'this' is bound to this component in these two functions.
    // https://medium.freecodecamp.org/react-binding-patterns-5-approaches-for-handling-this-92c651b5af56
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  /** Update the form controls each time the user interacts with them. */
  handleChange(e, { name, value }) {
    this.setState({ [name]: value });
  }

  /** Handle Signup submission using Meteor's account mechanism. */
  handleSubmit() {
    const { email, password } = this.state;
    Accounts.createUser({ email, username: email, password }, (err) => {
      if (err) {
        this.setState({ error: err.reason });
      } else {
        // browserHistory.push('/login');
      }
    });
  }

  submit(data) {
    const { lastName, firstName, email, bio, picture, fluentLanguages, practiceLanguages } = data;
    const owner = Meteor.user().username;
    Profiles.insert({ lastName, firstName, email, bio, picture, fluentLanguages, practiceLanguages }, this.insertCallback);
  }

  /** Display the signup form. */
  render() {
    return <Container>
      <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
        <Grid.Column>
          <Header as="h2" textAlign="center">
            Register your account
          </Header>
          <Form onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                  label="Email"
                  icon="envelope"
                  iconPosition="left"
                  name="email"
                  type="email"
                  placeholder="E-mail address"
                  onChange={this.handleChange}
              />
              <Form.Input
                  label="Password"
                  icon="lock"
                  iconPosition="left"
                  name="password"
                  placeholder="Password"
                  type="password"
                  onChange={this.handleChange}
              />
              <Form.Input
                  label="First Name"
                  icon="user"
                  iconPosition="left"
                  name="firstname"
                  placeholder="First Name"
                  onChange={this.handleChange}
              />
              <Form.Input
                  label="Last Name"
                  icon="user"
                  iconPosition="left"
                  name="lastname"
                  placeholder="Last Name"
                  onChange={this.handleChange}
              />
              <div class="ui form" onChange={this.handleChange}>
                <div class="field">
                  <label>Bio</label>
                  <textarea></textarea>
                </div>
              </div>
              <Form.Input
                  label="Picture"
                  icon="user circle"
                  iconPosition="left"
                  name="picture"
                  placeholder="Picture"
                  type="picture"
                  onChange={this.handleChange}
              />
              <Dropdown text='Fluent Languages' labeled button icon='world' className='icon' fluid selection options={languageList} onChange={this.handleChange}>
              </Dropdown>
              <Dropdown text='Practice Languages' labeled button icon='world' className='icon' fluid selection options={languageList} onChange={this.handleChange}>
              </Dropdown>
              <Form.Button content="Submit"/>
            </Segment>
          </Form>
          <Message>
            Already have an account? Login <Link to="/signin">here</Link>
          </Message>
          {this.state.error === '' ? (
              ''
          ) : (
              <Message
                  error
                  header="Registration was not successful"
                  content={this.state.error}
              />
          )}
        </Grid.Column>
      </Grid>
    </Container>;
  }
}
