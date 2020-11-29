import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';

const BlueSwitch = withStyles({
  switchBase: {
    color: '#9bceff',
    '&$checked': {
      color: '#9bceff',
    },
    '&$checked + $track': {
      backgroundColor: '#9ed0e1',
    },
  },
  checked: {},
  track: {},
})(Switch);

export default BlueSwitch;
