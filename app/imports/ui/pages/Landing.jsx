import React from 'react';
import { Grid, Header } from 'semantic-ui-react';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    return (
        <div className='languagepals-landing-background'>
        <Grid container stackable centered columns={3}>

          <Grid.Column textAlign = 'center'>
            <img src={'/images/world.jpg'} width={'250px'}></img>
            <Header as={'h1'} inverted>Learn a Language!</Header>
          </Grid.Column>

          <Grid.Column textAlign = 'center'>
            <h1 className={'h1'}>Language Pals</h1>
            <img src={'/images/friends.png'} width={'340px'}></img>
            <Header as={'h1'} inverted>Make Friends!</Header>
            <Header as={'h3'} inverted>
              Learn a new language by finding study partners fluent in the language you want!
            </Header>
            <Header as={'h3'} inverted>
              Make an account and list the language you're fluent in and the language you would like to learn.
              You can browse our directory of language speakers and contact them to schedule study sessions!
            </Header>
          </Grid.Column>

          <Grid.Column textAlign = 'center'>
            <img src={'/images/teach.jpg'} width={'300px'}></img>
            <Header as={'h1'} inverted>Teach a Language!</Header>
          </Grid.Column>

        </Grid>
        </div>
    );
  }
}

export default Landing;
