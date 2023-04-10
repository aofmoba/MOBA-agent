import Settings from '@/locale/en-US/common/settings';
import MessageBox from '@/components/message-box/locale/en-US';

// Message
import SuccessMessage from '@/locale/en-US/message/success';
import FailedMessage from '@/locale/en-US/message/failed';

// Base Components
import Menu from '@/locale/en-US/menu';
import SearchTableAction from '@/locale/en-US/common/searchTableAction';

// Views
import Login from '@/locale/en-US/login';
import Workplace from '@/locale/en-US/workplace';
import Wallet from '@/locale/en-US/wallet';
import Assets from '@/locale/en-US/assets';
import Agent from '@/locale/en-US/agent';
import Promotion from '@/locale/en-US/promotion';
import System from '@/locale/en-US/systemsetting';
import Purchase from '@/locale/en-US/purchase';
import Financial from '@/locale/en-US/financial';
import Trade from '@/locale/en-US/trade';

export default {
  // Examples are shown above, and real business is shown below
  ...Menu,
  ...Settings,
  ...MessageBox,
  ...SuccessMessage,
  ...FailedMessage,
  ...SearchTableAction,
  ...Login,
  ...Workplace,
  ...Wallet,
  ...Assets,
  ...Agent,
  ...Promotion,
  ...System,
  ...Purchase,
  ...Financial,
  ...Trade,
};
