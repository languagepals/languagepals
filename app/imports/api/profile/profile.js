import SimpleSchema from 'simpl-schema';
import { Mongo } from 'meteor/mongo';
import { Tracker } from 'meteor/tracker';
import { languageList } from '../languageList.js';
import { daysOfTheWeek } from '../daysOfTheWeek.js';

/** Create a Meteor collection. */
const Profiles = new Mongo.Collection('Profiles');

/** Create a schema to constrain the structure of documents associated with this collection. */
const ProfileSchema = new SimpleSchema({
  firstName: String,
  lastName: String,
  owner: String,
  active: Boolean,
  bio: { type: String, optional: true },
  picture: { type: String, optional: true },
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
  days: {
    type: Array,
    optional: true,
  },
  'days.$': {
    type: String,
    allowedValues: daysOfTheWeek,
  },
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Profiles.attachSchema(ProfileSchema);

/** Make the collection and schema available to other code. */
export { Profiles, ProfileSchema };
