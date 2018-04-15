import React from 'react';
import { Profiles } from '/imports/api/profile/profile';
import { Button, Loader, Container, Icon } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

/** After the user clicks the "Delete" link in the EditProfile Page, log them out and display this page. */
class DeleteProfile extends React.Component {

  constructor(props) {
    super(props);
    this.renderPage = this.renderPage.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const user_id = Meteor.userId();
    Meteor.logout();
    Meteor.loginWithPassword('admin@foo.com', 'changeme', this.deleteCallback);
    Meteor.users.remove(user_id);
    Meteor.logout();
    Profiles.remove(this.props.doc._id, this.deleteCallback);
  }

  deleteCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Delete Profile Failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'Delete Profile Succeeded' });
    }
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader>Getting data</Loader>;
  }

  renderPage() {
    return (
        <Container textAlign='center'>
          <Button negative onClick={this.handleClick} icon labelPosition='left'>
            Delete Profile
            <Icon name='warning sign'/>
          </Button>
        </Container>
    );
  }
}

DeleteProfile.propTypes = {
  doc: PropTypes.object,
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
})(DeleteProfile);
