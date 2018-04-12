import React from 'react';
import { Grid, Header } from 'semantic-ui-react';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    return (
        <div className='languagepals-landing-background'>
        <Grid verticalAlign='middle' textAlign='center' container>

          <Grid.Column width={6}>
            <Header as={'h1'} inverted>Language Pals</Header>
            <Header as={'h3'} inverted>
              Learn a new language by finding study partners fluent in the language you want!
            </Header>
            <Header as={'h3'} inverted>
              Make an account and list the language you're fluent in and the language you would like to learn.
              You can browse our directory of language speakers and contact them to schedule study sessions!
            </Header>
          </Grid.Column>

        </Grid>
        </div>
    );
  }
}

export default Landing;
