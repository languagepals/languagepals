import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Segment, Header, Loader, Form, Sidebar, Card, Divider, Container, Menu, Button } from 'semantic-ui-react';
import { Profiles } from '/imports/api/profile/profile';
import AutoForm from 'uniforms-semantic/AutoForm';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import BoolField from 'uniforms-semantic/BoolField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import Profile from '/imports/ui/components/Profile';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { languageList } from '/imports/api/languageList.js';
import { _ } from 'meteor/underscore';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Create a schema to constrain the structure of documents associated with this collection. */
const SearchSchema = new SimpleSchema({
  All: {
    type: Boolean,
    allowedValues: [true, false],
    optional: true,
  },
  fluentLanguages: {
    type: Array,
    optional: true,
  },
  'fluentLanguages.$': {
    type: String,
    allowedValues: languageList,
  },
  practiceLanguages: {
    type: Array,
    optional: true,
  },
  'practiceLanguages.$': {
    type: String,
    allowedValues: languageList,
  },
}, { tracker: Tracker });

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class Directory extends React.Component {

  /** Bind 'this' so that a ref to the Form can be saved in formRef and communicated between render() and submit(). */
  constructor(props) {
    super(props);
    this.state = { All: true, fluentLanguages: [], practiceLanguages: [],
      search: false, matches: false, visible: false };
    this.submit = this.submit.bind(this);
    this.renderPage = this.renderPage.bind(this);
    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.setMatchesOn = this.setMatchesOn.bind(this);
    this.setMatchesOff = this.setMatchesOff.bind(this);
  }

  toggleVisibility() {
    this.setState({ visible: !this.state.visible });
  }

  setMatchesOn() {
    this.setState({ All: false, matches: true, search: false });
  }

  setMatchesOff() {
    this.setState({ All: true, matches: false, search: false });
  }

  /** Update the form controls each time the user interacts with them. */
  submit(data) {
    const { fluentLanguages, practiceLanguages, All } = data;
    this.setState({ fluentLanguages: fluentLanguages, practiceLanguages: practiceLanguages, All: All,
      matches: true, search: true });
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const languageOptions = _.map(languageList.languageList, language => ({ key: language, text: language }));
    const searchResults = this.props.profiles.filter(profile => (
        _.intersection(profile.fluentLanguages, this.state.fluentLanguages).length !== 0
        && _.intersection(profile.practiceLanguages, this.state.practiceLanguages).length !== 0));
    languageOptions.unshift({ key: 'All', text: 'All' });
    const currentUserProfile = this.props.profiles.find(profile => (profile.owner === this.props.currentUser));
    const matches = this.props.profiles.filter(profile => (
        _.intersection(profile.fluentLanguages, currentUserProfile.practiceLanguages).length !== 0
        && _.intersection(profile.practiceLanguages, currentUserProfile.fluentLanguages).length !== 0
    ));
    return (
        <div>
          <Segment padded>
            {this.state.matches === false ? (
                <Button primary fluid onClick={this.setMatchesOn}>Click For Your Matches</Button>)
            : (<Button primary fluid onClick={this.setMatchesOff}>Click To Display All Pals</Button>)}
            <Divider horizontal>OR</Divider>
            <Button secondary onClick={this.toggleVisibility} fluid>
              Search For Pals
            </Button></Segment>
          <Sidebar.Pushable as={Segment} padded>
            <Sidebar as={Menu} animation='push' visible={this.state.visible} icon='labeled' vertical inverted>
              <Segment inverted><Header as="h2" textAlign="center" inverted dividing>Search</Header></Segment>
              <Menu.Item>
                <AutoForm schema={SearchSchema} onSubmit={this.submit} model={this.state} placeholder={true}>
                  <Segment>
                    <BoolField name='All'/>
                    <Divider/>
                    <Form.Group>
                      <SelectField name='fluentLanguages'/>
                      <SelectField name='practiceLanguages'/>
                    </Form.Group>
                    <SubmitField value='Submit'/>
                    <ErrorsField/>
                  </Segment>
                </AutoForm>
              </Menu.Item>
            </Sidebar>

            <Sidebar.Pusher>
              <Container>
                <Segment raised padded={'very'}>
                  <Divider horizontal section>
                    <Header as="h2" textAlign="center">Pals</Header>
                  </Divider>
                  {this.state.All === true ? (
                          <Card.Group itemsPerRow={2}>
                            {this.props.profiles.map((profile, index) => <Profile key={index} profile={profile}/>)}
                          </Card.Group>)
                      : this.state.matches === true ? (<Card.Group itemsPerRow={2}>
                            {matches.map((profile, index) => <Profile key={index} profile={profile}/>)}
                          </Card.Group>)
                          : (<Card.Group itemsPerRow={2}>
                            {searchResults.map((profile, index) => <Profile key={index} profile={profile}/>)}
                          </Card.Group>)}
                </Segment>
              </Container>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </div>
    );
  }
}

/** Require an array of Profile documents in the props. */
Directory.propTypes = {
  currentUser: PropTypes.string,
  profiles: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Profile documents.
  const subscription = Meteor.subscribe('Profiles');
  return {
    currentUser: Meteor.user() ? Meteor.user().username : '',
    profiles: Profiles.find({ active: true }).fetch(),
    ready: subscription.ready(),
  };
})(Directory);
