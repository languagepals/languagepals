import React from 'react';
import { Grid, Loader, Header, Segment, Form, Divider, Container, Button } from 'semantic-ui-react';
import { Meetings } from '/imports/api/meeting/meeting';
import { Profiles } from '/imports/api/profile/profile';
import AutoForm from 'uniforms-semantic/AutoForm';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { Bert } from 'meteor/themeteorchef:bert';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';

const AddMemberSchema = new SimpleSchema({
  new_members: {
    type: Array,
    optional: true,
  },
  'new_members.$': {
    type: String,
  },
}, { tracker: Tracker });

/** Renders the Page for editing a single document. */
class AddMembers extends React.Component {

  constructor(props) {
    super(props);
    this.renderPage = this.renderPage.bind(this);
    this.submit = this.submit.bind(this);
  }

  /** On successful submit, insert the data. */
  submit(data) {
    const { new_members, _id } = data;
    const members = _.uniq(_.union(this.props.doc.members, new_members));
    console.log(new_members);
    Meetings.update(
        _id, { $set: { members } },
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
    const potential_new_members = this.props.profiles.filter(profile =>
        _.intersection([profile.owner], this.props.doc.members).length === 0)
    const profile_username_list =
        _.object(_.pluck(potential_new_members, 'owner'), _.pluck(potential_new_members, 'owner'));
    console.log(potential_new_members);
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Add Members</Header>
            <AutoForm schema={AddMemberSchema} onSubmit={this.submit} model={this.props.doc}>
              <Segment>
                <SelectField label='Members' name='new_members' options={profile_username_list}/>
                <SubmitField value='Submit'/>
                <ErrorsField/>
              </Segment>
            </AutoForm>
            <Divider/>
            <Button positive as={Link} to={'/YourMeetings'}>
              Return to Your Meetings
            </Button>
          </Grid.Column>
        </Grid>
    );
  }
}

/** Require the presence of a profile doc in the props object. Uniforms adds 'model' to the props, which we use. */
AddMembers.propTypes = {
  profiles: PropTypes.array.isRequired,
  doc: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const meeting = match.params._id;
  // Get access to Stuff documents.
  const subscription1 = Meteor.subscribe('Profiles');
  const subscription2 = Meteor.subscribe('Meetings');
  return {
    profiles: Profiles.find({}).fetch(),
    doc: Meetings.findOne(meeting),
    ready: (subscription1.ready() && subscription2.ready()),
  };
})(AddMembers);
