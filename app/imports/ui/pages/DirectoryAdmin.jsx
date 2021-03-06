import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader, Card, Segment, Menu, Divider, Sidebar, Form, Button } from 'semantic-ui-react';
import { Profiles } from '/imports/api/profile/profile';
import AutoForm from 'uniforms-semantic/AutoForm';
import SelectField from 'uniforms-semantic/SelectField';
import SubmitField from 'uniforms-semantic/SubmitField';
import BoolField from 'uniforms-semantic/BoolField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import ProfileAdmin from '/imports/ui/components/ProfileAdmin';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Tracker } from 'meteor/tracker';
import { languageList } from '/imports/api/languageList.js';
import { _ } from 'meteor/underscore';
import SimpleSchema from 'simpl-schema';

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
class DirectoryAdmin extends React.Component {

  /** Bind 'this' so that a ref to the Form can be saved in formRef and communicated between render() and submit(). */
  constructor(props) {
    super(props);
    this.state = { All: true, fluentLanguages: [], practiceLanguages: [], visible: false };
    this.submit = this.submit.bind(this);
    this.renderPage = this.renderPage.bind(this);
    this.toggleVisibility = this.toggleVisibility.bind(this);
  }

  toggleVisibility() {
    this.setState({ visible: !this.state.visible });
  }

  /** Update the form controls each time the user interacts with them. */
  submit(data) {
    const { fluentLanguages, practiceLanguages, All } = data;
    this.setState({ fluentLanguages: fluentLanguages, practiceLanguages: practiceLanguages, All: All });
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
    return (
        <div>
          <Segment padded>
            <Button secondary onClick={this.toggleVisibility} fluid>
              Search For Pals
            </Button>
          </Segment>
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
                  <Header as="h2" textAlign="center">Pals</Header>
                  {this.state.All === true ? (
                          <Card.Group itemsPerRow={2}>
                            {this.props.profiles.map((profile, index) => <ProfileAdmin key={index} profile={profile}/>)}
                          </Card.Group>)
                      : (<Card.Group itemsPerRow={2}>
                        {searchResults.map((profile, index) => <ProfileAdmin key={index} profile={profile}/>)}
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
DirectoryAdmin.propTypes = {
  profiles: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Profile documents.
  const subscription = Meteor.subscribe('Profiles');
  return {
    profiles: Profiles.find({}).fetch(),
    ready: subscription.ready(),
  };
})(DirectoryAdmin);
