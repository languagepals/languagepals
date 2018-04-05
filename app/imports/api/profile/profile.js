import SimpleSchema from 'simpl-schema';
import { Mongo } from 'meteor/mongo';
import { Tracker } from 'meteor/tracker';
import { languageList } from './languageList.js';

/** Create a Meteor collection. */
const Profiles = new Mongo.Collection('Profiles');

/** Create a schema to constrain the structure of documents associated with this collection. */
const ProfileSchema = new SimpleSchema({
  name: String,
  email: String,
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
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Profiles.attachSchema(ProfileSchema);

/** Make the collection and schema available to other code. */
export { Profiles, ProfileSchema };
