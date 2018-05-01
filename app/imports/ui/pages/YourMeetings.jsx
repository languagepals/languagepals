import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader, Card } from 'semantic-ui-react';
import { Meetings } from '/imports/api/meeting/meeting';
import { Profiles } from '/imports/api/profile/profile';
import Meeting from '/imports/ui/components/Meeting';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class YourMeetings extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    return (
        <Container>
          <Header as="h2" textAlign="center" inverted>You Meetings</Header>
          <Card.Group itemsPerRow={2}>
            {this.props.meetings.map((meeting, index) =>
                <Meeting key={index} meeting={meeting}
                         memberProfiles={
                           this.props.profiles.filter(profile =>
                               _.intersection([profile.owner], meeting.members).length !== 0)}/>)
            }
          </Card.Group>
        </Container>
    );
  }
}

/** Require an array of Stuff documents in the props. */
YourMeetings.propTypes = {
  meetings: PropTypes.array.isRequired,
  profiles: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const subscription1 = Meteor.subscribe('Meetings');
  const subscription2 = Meteor.subscribe('Profiles');
  return {
    meetings: Meetings.find({}).fetch().filter(meeting =>
        _.intersection([Meteor.user().username], meeting.members).length !== 0),
    profiles: Profiles.find({}).fetch(),
    ready: (subscription1.ready() && subscription2.ready()),
  };
})(YourMeetings);
