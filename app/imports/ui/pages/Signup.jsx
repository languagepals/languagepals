import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Grid, Header, Message, Segment, Dropdown } from 'semantic-ui-react';
import { Accounts } from 'meteor/accounts-base';
import {Profiles, ProfileSchema} from '../../api/profile/profile';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import HiddenField from 'uniforms-semantic/HiddenField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
/**
 * Signup component is similar to signin component, but we attempt to create a new user instead.
 */
export default class Signup extends React.Component {
  /** Initialize state fields. */
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: '', firstName: '', lastName: '', bio: '', picture: '', fluentLanguages: '', practiceLanguages: ''};
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
    const { email, password, firstName, lastName, bio, picture, fluentLanguages, practiceLanguages} = this.state;
    Accounts.createUser({ email, username: email, password, firstName, lastName, bio, picture, fluentLanguages, practiceLanguages}, (err) => {
      if (err) {
        this.setState({ error: err.reason });
      } else {
        // browserHistory.push('/login');
      }
    });
  }

  /** Display the signup form. */
  render() {
    return <Container>
      <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
        <Grid.Column>
          <Header as="h2" textAlign="center">
            Register your account
          </Header>
          <AutoForm schema={ProfileSchema} onSubmit={this.handleSubmit()}>
            <Segment>
              <TextField name='email'/>
              <Form.Input
                  label="Password"
                  icon="lock"
                  iconPosition="left"
                  name="password"
                  placeholder="Password"
                  type="password"
                  onChange={this.handleChange}
              />
              <TextField name='firstName' onChange={this.handleChange}/>
              <TextField name='lastName' onChange={this.handleChange}/>
              <LongTextField name='bio' onChange={this.handleChange}/>
              <TextField name='picture' onChange={this.handleChange}/>
              <SelectField name='fluentLanguages' onChange={this.handleChange}/>
              <SelectField name='practiceLanguages' onChange={this.handleChange}/>
              <SubmitField value='Submit'/>
              <ErrorsField/>
              <HiddenField name='email'/>
            </Segment>
          </AutoForm>
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
