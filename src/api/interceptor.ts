import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { getToken, clearToken } from '@/utils/auth';
import useUser from '@/hooks/user';
import { isLogin } from '@/api/user';
import i18n from '../locale';

const { t } = i18n.global;
export interface HttpResponse<T = unknown> {
  status: number;
  msg: string;
  code: number;
  data: T;
}

// axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
// if (import.meta.env.VITE_API_BASE_URL) {
//   axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
// }

// 是否正在刷新的标志
(window as any).isRefreshing = false;
// 存储请求的数组
let cacheRequestArr: any = [];

// 将所有的请求都push到数组中,其实数组是[function(token){}, function(token){},...]
const cacheRequestArrHandle = (cb: any) => {
    cacheRequestArr.push(cb);
}
// 数组中的请求得到新的token之后自执行，用新的token去重新发起请求
const afreshRequest = () => {
    cacheRequestArr.map((cb: any) => cb());
    cacheRequestArr = [];
}

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken();
    const loginApi: Array<string | any> = ['/api/connection/calculateTotalForce','/api/user/logout','/api/user/isLogin','/api/user/doLogin','/api/user/getuser','/api/user/bemail','/api/business/invuser','/api/user/baddress','/api/user/doLoginEmail']
    const index = loginApi.findIndex((item: any) => (config.url as any).includes(item))
    if (token && index < 0 ) {
      if (!(window as any).isRefreshing) {
        (window as any).isRefreshing = true
        isLogin().then((res: any) => {
          if( typeof(res.data) === 'string' ){
            afreshRequest()
          }else{
            Message.error({
              content: t('login.out'),
              duration: 5 * 1000,
            });
            const { logout } = useUser();
            logout();
          }
        }).finally(() => {(window as any).isRefreshing = false;})
      }
      /* 把请求(token)=>{....}都push到一个数组中 */
      const retry = new Promise((resolve, reject) => {
        cacheRequestArrHandle(() => {
          /* 将请求挂起 */
          resolve(config)
        })
      })
      return retry
    }
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);
// add response interceptors
// axios.interceptors.response.use(
//   (response: AxiosResponse<HttpResponse>) => {
//     console.log(response);

//     const res = response.data;

//     // if the custom code is not 20000, it is judged as an error.
//     if (res.code !== 200) {
//       Message.error({
//         content: res.msg || 'Error',
//         duration: 5 * 1000,
//       });
//       // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//       if (
//         [50008, 50012, 50014].includes(res.code) &&
//         response.config.url !== '/api/user/info'
//       ) {
//         Modal.error({
//           title: 'Confirm logout',
//           content:
//             'You have been logged out, you can cancel to stay on this page, or log in again',
//           okText: 'Re-Login',
//           async onOk() {
//             const userStore = useUserStore();

//             await userStore.logout();
//             window.location.reload();
//           },
//         });
//       }
//       return Promise.reject(new Error(res.msg || 'Error'));
//     }
//     return res;
//   },
//   (error) => {
//     Message.error({
//       content: error.msg,
//       duration: 5 * 1000,
//     });
//     return Promise.reject(error);
//   }
// );
