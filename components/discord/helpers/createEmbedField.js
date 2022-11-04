import { isRequired } from '~/utilities/validators.js';
import { nanoid } from 'nanoid';
export default function createEmbedField() {
  return {
    id: nanoid(),
    name: {
      value: '',
      rules: [isRequired('Field')],
    },
    valid: true,
    value: '',
    inline: false,
  };
}
