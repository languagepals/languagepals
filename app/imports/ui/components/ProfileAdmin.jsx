import React from 'react';
import { Card, Image, Dropdown, Grid, Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/profile';

/** Renders a single Card in the Directory Page. See pages/ListStuff.jsx. */
class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  deleteCallback(error) {
    if (error) {
      Bert.alert({ type: 'danger', message: `Deactivate failed: ${error.message}` });
    } else {
      Bert.alert({ type: 'success', message: 'Deactivate succeeded' });
    }
  }
  /* When the delete button is clicked, remove the corresponding item from the collection. */
  onClick() {
    Profiles.update(this.props.doc._id, { $set: { active: false } }, this.deleteCallback);
  }

  render() {
    return (
        <Card centered>
          <Card.Content>
            <Image floated='right' size='tiny' rounded src={this.props.profile.picture}/>
            <Card.Header>
              {this.props.profile.firstName} {this.props.profile.lastName}
            </Card.Header>
            <Card.Meta>
              e-mail: {this.props.profile.owner}
            </Card.Meta>
            <Card.Description>
              {this.props.profile.bio}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Grid columns='equal'>
              <Grid.Row>
                <Grid.Column>
                  <Dropdown text='Fluent Languages' floating labeled button icon='world' className='icon'
                            fluid selection options={_.map(
                                this.props.profile.fluentLanguages,
                                language => ({ key: language, text: language }),
                            )}/>
                </Grid.Column>
                <Grid.Column>
                  <Dropdown text='Practice Languages' floating labeled button icon='world' className='icon'
                            fluid selection options={_.map(
                                this.props.profile.practiceLanguages,
                                language => ({ key: language, text: language }),
                            )}/>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Content>
          <Card.Content extra>
            <Link to={`/edit/${this.props.profile._id}`}>Edit</Link>
          </Card.Content>
          <Card.Content extra>
              <Button negative onClick={this.onClick} icon labelPosition='left'>Deactivate Profile
                <Icon name='warning sign'/>
              </Button>
          </Card.Content>
        </Card>
    );
  }
}

/** Require a document to be passed to this component. */
Profile.propTypes = {
  doc: PropTypes.object,
  profile: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withTracker((match) =>
{
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const user = match.params._id;
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('Profiles');
  return {
    doc: Profiles.findOne(user),
    ready: subscription.ready(),
  };
})
