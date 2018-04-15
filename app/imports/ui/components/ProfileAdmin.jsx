import React from 'react';
import { Card, Image, Dropdown, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { _ } from 'meteor/underscore';

/** Renders a single Card in the Directory Page. See pages/ListStuff.jsx. */
class Profile extends React.Component {
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
        </Card>
    );
  }
}

/** Require a document to be passed to this component. */
Profile.propTypes = {
  profile: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(Profile);
