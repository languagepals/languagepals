import { Meteor } from 'meteor/meteor';
import { Profiles } from '../../api/profile/profile.js';

/* eslint-disable no-console */

/** Initialize the database with a default data document. */
function addData(data) {
  console.log(`  Adding: ${data.firstName} ${data.lastName} (${data.email})`);
  Profiles.insert(data);
}

/** Initialize the collection if empty. */
if (Profiles.find().count() === 0) {
  if (Meteor.settings.defaultProfiles) {
    console.log('Creating default profiles.');
    Meteor.settings.defaultProfiles.map(data => addData(data));
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
} else {
  console.log('Cannot initialize the database! Profiles.find().count() != 0 ');
}

/** This subscription publishes all the profiles associated with the profiles db */
Meteor.publish('Profiles', function publish() {
  return Profiles.find();
});

