import SimpleSchema from 'simpl-schema';
import { Mongo } from 'meteor/mongo';
import { Tracker } from 'meteor/tracker';
import { languageList } from '../languageList.js';

/** Create a Meteor collection. */
const Meetings = new Mongo.Collection('Meetings');

/** Create a schema to constrain the structure of documents associated with this collection. */
const MeetingSchema = new SimpleSchema({
  owner: String,
  createdAt: Date,
  meetingTime: Date,
  setting: String,
  minutes: { type: String, optional: true },
  members: {
    type: Array,
    optional: true,
  },
  'Members.$': {
    type: String,
  },
  Languages: {
    type: Array,
    optional: true,
  },
  'Languages.$': {
    type: String,
    allowedValues: languageList,
  },
}, { tracker: Tracker });

/** Attach this schema to the collection. */
Meetings.attachSchema(MeetingSchema);

/** Make the collection and schema available to other code. */
export { Meetings, MeetingSchema };
