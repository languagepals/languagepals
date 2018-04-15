import React from 'react';
import { Grid, Loader, Header, Segment, Form, Container, Button, Divider, Icon } from 'semantic-ui-react';
import { Profiles, ProfileSchema } from '/imports/api/profile/profile';
import { Bert } from 'meteor/themeteorchef:bert';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import HiddenField from 'uniforms-semantic/HiddenField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/** Renders the Page for editing a single document. */
class EditProfile extends React.Component {

  constructor(props) {
    super(props);
    this.renderPage = this.renderPage.bind(this);
  }

  /** On successful submit, insert the data. */
  submit(data) {
    const { firstName, lastName, bio, picture, fluentLanguages, practiceLanguages, _id } = data;
    Profiles.update(
        _id, { $set: { firstName, lastName, bio, picture, fluentLanguages, practiceLanguages } },
        (error) => (error ?
            Bert.alert({ type: 'danger', message: `Update failed: ${error.message}` }) :
            Bert.alert({ type: 'success', message: 'Update succeeded' })),
    );
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    return (
        <Container>
          <Grid container centered padded>
            <Grid.Column>
              <Header as="h2" textAlign="center">Edit Profile</Header>
              <AutoForm schema={ProfileSchema} onSubmit={this.submit} model={this.props.doc}>
                <Segment>
                  <Form.Group widths='equal'>
                    <TextField name='firstName'/>
                    <TextField name='lastName'/>
                  </Form.Group>
                  <TextField name='picture'/>
                  <LongTextField name='bio'/>
                  <Form.Group widths='equal'>
                    <SelectField name='fluentLanguages'/>
                    <SelectField name='practiceLanguages' />
                  </Form.Group>
                  <SubmitField value='Submit'/>
                  <ErrorsField/>
                  <HiddenField name='email'/>
                </Segment>
              </AutoForm>
              <Divider/>
              <Button as={Link} to={`/deleteprofile/${this.props.doc._id}`} icon labelPosition='left' negative compact>
                Delete Profile
                <Icon name='warning sign' />
              </Button>
            </Grid.Column>
          </Grid>
        </Container>
    );
  }
}

/** Require the presence of a profile doc in the props object. Uniforms adds 'model' to the props, which we use. */
EditProfile.propTypes = {
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
    doc: Profiles.findOne(user),
    ready: subscription.ready(),
  };
})(EditProfile);
