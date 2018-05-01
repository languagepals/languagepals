import { Meteor } from 'meteor/meteor';
import { Meetings } from '../../api/meeting/meeting.js';

/* eslint-disable no-console */

/** Initialize the database with a default data document. */
function addData(data) {
  console.log(`  Adding Meeting For: ${data.owner}`);
  Meetings.insert(data);
}

/** Initialize the collection if empty. */
if (Meetings.find().count() === 0) {
  if (Meteor.settings.defaultMeetings) {
    console.log('Creating default meetings.');
    Meteor.settings.defaultMeetings.map(data => addData(data));
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
} else {
  console.log('Cannot initialize the database! Meetings.find().count() != 0 ');
}

/** This subscription publishes all the profiles associated with the profiles db */
Meteor.publish('Meetings', function publish() {
  return Meetings.find();
});

