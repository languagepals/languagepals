import React from 'react';
import { Card, Image, Dropdown, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single Card in the Directory Page. See pages/ListStuff.jsx. */
class Profile extends React.Component {
  render() {
    return (
        <Card centered>
          <Card.Content>
            <Image floated='right' size='mini' src={this.props.profile.picture} />
            <Card.Header>
              {this.props.profile.firstName} {this.props.profile.lastName}
            </Card.Header>
            <Card.Description>
              {this.props.profile.bio}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Grid columns='equal'>
              <Grid.Row>
                <Grid.Column>
                  <Dropdown placholder='Fluent Languages'
                            fluid multiple selection options={this.props.profile.fluentLanguages}/>
                </Grid.Column>
                <Grid.Column>
                  <Dropdown placholder='Practice Languages'
                            fluid multiple selection options={this.props.profile.practiceLanguages}/>
                </Grid.Column>
              </Grid.Row>
            </Grid>
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
