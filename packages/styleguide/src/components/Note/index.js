import React from 'react';

import Note from './Note';

export const NoteWarning = props => <Note variant="warning" {...props} />;
NoteWarning.displayName = 'NoteWarning';

export const NoteError = props => <Note variant="error" {...props} />;
NoteError.displayName = 'NoteError';

export const NoteInfo = props => <Note variant="info" {...props} />;
NoteInfo.displayName = 'NoteInfo';

export const Dos = props => <Note variant="success" title="Do's" {...props} />;
Dos.displayName = 'Dos';

export const Donts = props => (
  <Note variant="error" title="Dont's" {...props} />
);
Donts.displayName = 'Donts';

export default Note;
