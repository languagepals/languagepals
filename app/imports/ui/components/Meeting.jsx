import React from 'react';
import { Card, Image, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { Meteor } from "meteor/meteor";

/** Renders a single card in the List Contact table. See pages/ListContact.jsx. */
class Meeting extends React.Component {
  render() {
    const ownerProfile = this.props.memberProfiles.find(profile => (profile.owner === this.props.meeting.owner));
    return <Card centered>
      <Card.Content>
        <Card.Header>
          <Header>Owner: {this.props.meeting.owner} {this.props.meeting.lastName}</Header>
        </Card.Header>
        <Image floated='right' size='mini' src={ownerProfile.picture}/>
        <Card.Meta>
          {this.props.meeting.address}
        </Card.Meta>
        <Card.Description>
          {this.props.meeting.description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Link to={`/edit/${this.props.contact._id}`}>Edit</Link>
      </Card.Content>
    </Card>;
  }
}

/** Require a document to be passed to this component. */
Meeting.propTypes = {
  meeting: PropTypes.object.isRequired,
  memberProfiles: PropTypes.array,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withRouter(Meeting);

