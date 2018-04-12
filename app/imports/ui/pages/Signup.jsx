import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { Accounts } from 'meteor/accounts-base';
import { Profiles } from '/imports/api/profile/profile';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { Bert } from 'meteor/themeteorchef:bert';
import SimpleSchema from 'simpl-schema';
import { languageList } from '../../api/profile/languageList';

/** Create a schema to constrain the structure of documents associated with this collection. */
const SignupSchema = new SimpleSchema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  bio: { type: String, optional: true },
  picture: { type: String, optional: true },
  fluentLanguages: {
    type: Array,
    optional: true,
  },
  'fluentLanguages.$': {
    type: String,
    allowedValues: languageList,
  },
  practiceLanguages: {
    type: Array,
    optional: true,
  },
  'practiceLanguages.$': {
    type: String,
    allowedValues: languageList,
  },
});

/**
 * Signup component is similar to signin component, but we attempt to create a new user instead.
 */
export default class Signup extends React.Component {

  /** Initialize state fields. */
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.insertCallback = this.insertCallback.bind(this);
    this.formRef = null;
  }

  /** Notify the user of the results of the submit. If successful, clear the form. */
  insertCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Registration failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'Registration succeeded' });
      this.formRef.reset();
    }
  }

  /** Handle Signup submission using Meteor's account mechanism. */
  submit(data) {
    const { email, password, firstName, lastName, bio, picture, fluentLanguages, practiceLanguages } = data;
    Accounts.createUser({ email, username: email, password }, this.insertCallback);
    Profiles.insert(
{ email, password, firstName, lastName, bio, picture, fluentLanguages, practiceLanguages },
        this.insertCallback,
);
  }

  /** Display the signup form. */
  render() {
    return <Container>
      <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
        <Grid.Column>
          <Header as="h2" textAlign="center">
            Register your account
          </Header>
          <AutoForm ref={(ref) => { this.formRef = ref; }} schema={SignupSchema} onSubmit={this.submit}>
            <Segment>
              <TextField name='email'/>
              <TextField name='password'/>
              <TextField name='firstName'/>
              <TextField name='lastName' />
              <LongTextField name='bio' />
              <TextField name='picture' />
              <SelectField name='fluentLanguages'/>
              <SelectField name='practiceLanguages'/>
              <SubmitField value='Submit'/>
              <ErrorsField/>
            </Segment>
          </AutoForm>
          <Message>
            Already have an account? Login <Link to="/signin">here</Link>
          </Message>
        </Grid.Column>
      </Grid>
    </Container>;
  }
}
