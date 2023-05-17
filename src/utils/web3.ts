import contracts from '@/utils/contracts'
// eslint-disable-next-line import/extensions
import Web3 from 'web3/dist/web3.min.js'

const accounts = localStorage.getItem('address');


// 登录钱包
const login = async () => {
  const { ethereum } = window as any; // 获取小狐狸实例
  return ethereum.request({ method: 'eth_requestAccounts' });
};

// 是否安装metamask
// eslint-disable-next-line consistent-return
const hasMetaMask = async () => {
  const { ethereum } = window as any; // 获取小狐狸实例
  if (!ethereum) {
    return 'No install';
  }
};

const totolsuppl = async (abi: any[], address: string, id?: any) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const web3 = new Web3((Web3 as any).givenProvider);
    const contract = new web3.eth.Contract(abi, address);
    if (id === -1) {
      const res = await contract.methods.totalSupply().call();
      resolve(res);
    } else {
      const res = await contract.methods.totalSupply(id).call();
      resolve(res);
    }
  });
};

const addChain = (chainId: any) => {
  const { ethereum } = window as any; // 获取小狐狸实例
  const web3 = new Web3((window as any).ethereum); // 创建一个新的web3 对象
  // console.log(web3.utils.numberToHex(chainId), 'web3.utils.numberToHex(chainId)');
  let info: any;
  // eslint-disable-next-line eqeqeq
  if (chainId == 43113) {
    info = {
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: web3.utils.numberToHex(43113),
          chainName: 'Avalanche Fuji Testnet',
          nativeCurrency: {
            name: 'AVAX',
            symbol: 'AVAX', // 2-6 characters long
            decimals: 18,
          },
          rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
          blockExplorerUrls: ['https://testnet.snowtrace.io'],
        },
      ],
    };
  } else {
    info = {
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: web3.utils.numberToHex(80001),
          chainName: 'Mumbai',
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC', // 2-6 characters long
            decimals: 18,
          },
          rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
          blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
        },
      ],
    };
  }
  return new Promise((resolve, reject) => {
    ethereum
      .request({
        ...info,
      })
      .then((res: any) => {
        web3.eth.net.getId().then((realChainId: any) => {
          // eslint-disable-next-line eqeqeq
          if (realChainId == info.params[0].chainId) {
            // 通过切换结果判断切换成功 或 失败
            resolve(1);
            return;
          }
          resolve(0);
        });
      });
  });
};

// 原生1155查询资产
const balanceOfBatch = (abi: any, address: any, ids: any) => {
  const tempAccounts: any = []
  const accounts1 = localStorage.getItem('address');
  // eslint-disable-next-line no-restricted-syntax
  for (const iterator of ids) {
      tempAccounts.push(accounts1)
  }
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    // console.log(abi, address);
    const web3 = new Web3((Web3 as any).givenProvider);
    const contract = new web3.eth.Contract(abi, address);
    try {
      const res = await contract.methods.balanceOfBatch(tempAccounts, ids).call();
      resolve(res);
    } catch (error) {
      console.log(error)
      resolve('error')
    }
  });

};



// 资产查询
const batchBalanceOf = (abi:any, address:any) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
      // console.log(abi, address, accounts.value);
      const web3 = new Web3((Web3 as any).givenProvider);
      const contract = new web3.eth.Contract(abi, address)
      const res = await contract.methods.batchBalanceOf(accounts).call();
      resolve(res);
  })
}

// 查询721合约的
const tokensOfOwner = (abi: any, address: any) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
      const web3 = new Web3((Web3 as any).givenProvider);
      const contract = new web3.eth.Contract(abi, address)
      const result = await contract.methods.tokensOfOwner(accounts).call();
      resolve(result);
  })
}

const currentChain = () => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const web3obj = new Web3((Web3 as any).givenProvider);
    const chainId = await web3obj.eth.net.getId()
    resolve(chainId);
  })
  

}

export default {
  login,
  hasMetaMask,
  totolsuppl,
  addChain,
  balanceOfBatch,
  batchBalanceOf,
  tokensOfOwner,
  currentChain,
  contracts
};
