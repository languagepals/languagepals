import React from 'react';
import { Card, Image, Header, Divider, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { _ } from 'meteor/underscore';

/** Renders a single card in the List Contact table. See pages/ListContact.jsx. */
class Meeting extends React.Component {
  render() {
    const ownerProfile = this.props.memberProfiles.find(profile => (profile.owner === this.props.meeting.owner));
    const members = _.difference(this.props.memberProfiles, [ownerProfile]);
    return (
        <Card centered>
          <Card.Content>
            <Image floated='right' size='mini' src={ownerProfile.picture}/>
            <Card.Header>
              <Header>Created By: {ownerProfile.firstName} {ownerProfile.lastName}</Header>
            </Card.Header>
            <Card.Meta>
              e-mail: {ownerProfile.owner}
            </Card.Meta>
            <Card.Meta>
              Created On: {this.props.meeting.createdAt.toDateString()}
            </Card.Meta>
            <Divider horizontal><Icon name="time"/>Time and Place</Divider>
            <Card.Content extra>
              {this.props.meeting.setting} : {this.props.meeting.meetingTime.toDateString()}
            </Card.Content>
            <Divider horizontal><Icon name="users"/>Members</Divider>
            <Card.Content extra>
              {members.map(function (profile, index) {
                return (
                    <div key={index}>
                      <Image src={profile.picture} avatar />
                      <span>{profile.firstName} {profile.lastName}</span>
                    </div>);
              })}
            </Card.Content>
            <Divider horizontal><Icon name="write square"/>Meeting Notes</Divider>
            <Card.Description>
              {this.props.meeting.minutes}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Link to={`/edit/${this.props.meeting._id}`}>Edit</Link>
          </Card.Content>
        </Card>);
  }
}

/** Require a document to be passed to this component. */
Meeting.propTypes = {
  meeting: PropTypes.object.isRequired,
  memberProfiles: PropTypes.array,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withRouter(Meeting);

