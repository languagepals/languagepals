import React from 'react';
import { Grid, Loader, Header, Segment, Form, Button, Divider, Icon } from 'semantic-ui-react';
import { Meetings, MeetingSchema } from '/imports/api/meeting/meeting';
import { Bert } from 'meteor/themeteorchef:bert';
import AutoForm from 'uniforms-semantic/AutoForm';
import DateField from 'uniforms-semantic/DateField';
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
class EditMeeting extends React.Component {

  constructor(props) {
    super(props);
    this.renderPage = this.renderPage.bind(this);
  }

  /** On successful submit, insert the data. */
  submit(data) {
    const { meetingTime, setting, minutes, Languages,  _id } = data;
    Meetings.update(
        _id, { $set: { meetingTime, setting, minutes, Languages,  _id } },
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
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Edit Meeting</Header>
            <AutoForm schema={MeetingSchema} onSubmit={this.submit} model={this.props.doc}>
              <Segment>
                <DateField label='When?' name='meetingTime'/>
                <TextField label='Where?' name='setting'/>
                <LongTextField label='Meeting Notes' name='minutes'/>
                <SelectField label='Practice Languages' name='Languages'/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
                <HiddenField name='owner' value='fakeuser@foo.com'/>
                <HiddenField name='createdAt' value={Date.now()}/>
              </Segment>
            </AutoForm>
          </Grid.Column>
        </Grid>
    );
  }
}

/** Require the presence of a profile doc in the props object. Uniforms adds 'model' to the props, which we use. */
EditMeeting.propTypes = {
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const user = match.params._id;
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('Meetings');
  return {
    doc: Meetings.findOne(user),
    ready: subscription.ready(),
  };
})(EditMeeting);
