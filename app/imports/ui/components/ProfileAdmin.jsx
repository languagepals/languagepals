import React from 'react';
import { Card, Image, Dropdown, Grid, Button, Icon, Header, Table, Divider } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { _ } from 'meteor/underscore';

/** Renders a single Card in the Directory Page. See pages/ListStuff.jsx. */
class ProfileAdmin extends React.Component {
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
            <Grid.Row>
              <Grid.Column>
                <Divider horizontal>Availability</Divider>
                <Table columns={7} celled singleLine>
                  <Table.Body>
                    <Table.Row>
                      {_.intersection(this.props.profile.days, ['Mon.']).length === 1 ? (
                              <Table.Cell><Header color={'green'}>Mon.</Header></Table.Cell>
                          ) :
                          (<Table.Cell><Header disabled>Mon.</Header></Table.Cell>)}
                      {_.intersection(this.props.profile.days, ['Tues.']).length === 1 ? (
                              <Table.Cell><Header color={'green'}>Tues.</Header></Table.Cell>
                          ) :
                          (<Table.Cell><Header disabled>Tues.</Header></Table.Cell>)}
                      {_.intersection(this.props.profile.days, ['Wed.']).length === 1 ? (
                              <Table.Cell><Header color={'green'}>Wed.</Header></Table.Cell>
                          ) :
                          (<Table.Cell><Header disabled>Wed.</Header></Table.Cell>)}
                      {_.intersection(this.props.profile.days, ['Thurs.']).length === 1 ? (
                              <Table.Cell><Header color={'green'}>Thurs.</Header></Table.Cell>
                          ) :
                          (<Table.Cell><Header disabled>Thurs.</Header></Table.Cell>)}
                      {_.intersection(this.props.profile.days, ['Fri.']).length === 1 ? (
                              <Table.Cell><Header color={'green'}>Fri.</Header></Table.Cell>
                          ) :
                          (<Table.Cell><Header disabled>Fri.</Header></Table.Cell>)}
                      {_.intersection(this.props.profile.days, ['Sat.']).length === 1 ? (
                              <Table.Cell><Header color={'green'}>Sat.</Header></Table.Cell>
                          ) :
                          (<Table.Cell><Header disabled>Sat.</Header></Table.Cell>)}
                      {_.intersection(this.props.profile.days, ['Sun.']).length === 1 ? (
                              <Table.Cell><Header color={'green'}>Sun.</Header></Table.Cell>
                          ) :
                          (<Table.Cell><Header disabled>Sun.</Header></Table.Cell>)}
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Grid.Column>
            </Grid.Row>
          </Card.Content>
          <Card.Content extra>
            <Table celled columns={2}>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <Button as={Link} to={`/edit/${this.props.profile._id}`}>Edit</Button>
                  </Table.Cell>
                  <Table.Cell textAlign='right'>
                    <Button as={Link} to={`/deactivateprofile/${this.props.profile._id}`}
                            icon labelPosition='left' negative compact>
                      Deactivate Profile
                      <Icon name='warning sign'/>
                    </Button>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Card.Content>
        </Card>
    );
  }
}

/** Require a document to be passed to this component. */
ProfileAdmin.propTypes = {
  profile: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(ProfileAdmin);
