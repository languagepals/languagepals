import React from 'react';
import { Container, Grid, Header, Segment, Loader } from 'semantic-ui-react';
import { Profiles, ProfileSchema } from '/imports/api/profile/profile';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import HiddenField from 'uniforms-semantic/HiddenField';
import { Bert } from 'meteor/themeteorchef:bert';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

/**
 * Create Profile component
 */
class CreateProfile extends React.Component {

  /** Initialize state fields. */
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.insertCallback = this.insertCallback.bind(this);
    this.renderPage = this.renderPage.bind(this);
  }

  /** Notify the user of the results of the submit. If successful, clear the form. */
  insertCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Profile Registration failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'Profile Registration succeeded' });
    }
  }

  /** Handle submission  */
  submit(data) {
    const { firstName, lastName, bio, picture, fluentLanguages, practiceLanguages, _id } = data;
    Profiles.update(
        _id, { $set: { firstName, lastName, bio, picture, fluentLanguages, practiceLanguages, active: true } },
        (error) => (error ?
            Bert.alert({ type: 'danger', message: `Profile Activation failed: ${error.message}` }) :
            Bert.alert({ type: 'success', message: 'Profile Activation Succeeded' })),
    );
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader>Getting data</Loader>;
  }

  /** Display the form. */
  renderPage() {
    return <Container>
      <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
        <Grid.Column>
          <Header as="h2" textAlign="center">
            Register your account
          </Header>
          <AutoForm schema={ProfileSchema} onSubmit={this.submit} model={this.props.doc} placeholder={true}>
            <Segment>
              <TextField name='firstName'/>
              <TextField name='lastName'/>
              <LongTextField name='bio'/>
              <TextField name='picture'/>
              <SelectField name='fluentLanguages'/>
              <SelectField name='practiceLanguages'/>
              <SubmitField value='Submit'/>
              <ErrorsField/>
              <HiddenField name='owner'/>
              <HiddenField name='active'/>
            </Segment>
          </AutoForm>
        </Grid.Column>
      </Grid>
    </Container>;
  }
}

/** Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use. */
CreateProfile.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const user = match.params._id;
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('Profiles');
  return {
    doc: Profiles.findOne({ owner: user }),
    ready: subscription.ready(),
  };
})(CreateProfile);
