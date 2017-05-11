import React from 'react';
import { storiesOf } from '@kadira/storybook';
import MongoShellComponent from '../src/components/Mongo Shell';
import ConnectedMongoShellComponent from '../src/components/';

storiesOf('MongoShellComponent', module)
  .add('connected to store', () => <ConnectedMongoShellComponent />)
  .add('enabled', () => <MongoShellComponent status="enabled" />)
  .add('disabled', () => <MongoShellComponent status="disabled" />);
