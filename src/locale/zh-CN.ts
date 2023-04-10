import Settings from '@/locale/zh-CN/common/settings';
import MessageBox from '@/components/message-box/locale/zh-CN';

// Message
import SuccessMessage from '@/locale/zh-CN/message/success';
import FailedMessage from '@/locale/zh-CN/message/failed';

// Base Components
import Menu from '@/locale/zh-CN/menu';
import SearchTableAction from '@/locale/zh-CN/common/searchTableAction';

// Views
import Login from '@/locale/zh-CN/login';
import Workplace from '@/locale/zh-CN/workplace';
import Wallet from '@/locale/zh-CN/wallet';
import Assets from '@/locale/zh-CN/assets';
import Agent from '@/locale/zh-CN/agent';
import Promotion from '@/locale/zh-CN/promotion';
import System from '@/locale/zh-CN/systemsetting';
import Purchase from '@/locale/zh-CN/purchase';
import Financial from '@/locale/zh-CN/financial';
import Trade from '@/locale/zh-CN/trade';

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
