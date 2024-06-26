/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { SimpleAccountAPI } from "./sdk";
import styles from "./Demo.module.css";
import { StackupPayMasterAPI } from "./sdk/StackupPayMasterAPI";
import { LoadingButton } from "@mui/lab";
import { FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import _ from "lodash";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { SmartAccount } from "./sdk/AAStarAccount";
const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

const factoryAddress = "0x9406Cc6185a346906296840746125a0E44976454";
// const rpcUrl = "https://public.stackup.sh/api/v1/node/ethereum-sepolia";
// const paymasterUrl =
//   "https://api.stackup.sh/v1/paymaster/e008121e92221cb49073b5bca65d434fbeb2162e73f42a9e3ea01d00b606fcba"; // Optional - you can get one at https://app.stackup.sh/

const TestnetERC20ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "_upgradedAddress", type: "address" }],
    name: "deprecate",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "deprecated",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "_evilUser", type: "address" }],
    name: "addBlackList",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_from", type: "address" },
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "upgradedAddress",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "balances",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "maximumFee",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "unpause",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "receiver", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "_mint",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "_maker", type: "address" }],
    name: "getBlackListStatus",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "", type: "address" },
      { name: "", type: "address" },
    ],
    name: "allowed",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "paused",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "who", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "pause",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getOwner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "newBasisPoints", type: "uint256" },
      { name: "newMaxFee", type: "uint256" },
    ],
    name: "setParams",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "amount", type: "uint256" }],
    name: "issue",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "amount", type: "uint256" }],
    name: "redeem",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_owner", type: "address" },
      { name: "_spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "remaining", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "basisPointsRate",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "isBlackListed",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "_clearedUser", type: "address" }],
    name: "removeBlackList",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "MAX_UINT",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "_blackListedUser", type: "address" }],
    name: "destroyBlackFunds",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "amount", type: "uint256" }],
    name: "_giveMeATokens",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "_initialSupply", type: "uint256" },
      { name: "_name", type: "string" },
      { name: "_symbol", type: "string" },
      { name: "_decimals", type: "uint256" },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "amount", type: "uint256" }],
    name: "Issue",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "amount", type: "uint256" }],
    name: "Redeem",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "newAddress", type: "address" }],
    name: "Deprecate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "feeBasisPoints", type: "uint256" },
      { indexed: false, name: "maxFee", type: "uint256" },
    ],
    name: "Params",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "_blackListedUser", type: "address" },
      { indexed: false, name: "_balance", type: "uint256" },
    ],
    name: "DestroyedBlackFunds",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "_user", type: "address" }],
    name: "AddedBlackList",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "_user", type: "address" }],
    name: "RemovedBlackList",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "owner", type: "address" },
      { indexed: true, name: "spender", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  { anonymous: false, inputs: [], name: "Pause", type: "event" },
  { anonymous: false, inputs: [], name: "Unpause", type: "event" },
];
const TestUSDT = "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06";
const getWallet = () => {
  const signingKey = localStorage.getItem("signingKey");
  let signer: ethers.Wallet | null = null;
  if (signingKey) {
    signer = new ethers.Wallet(signingKey);
  } else {
    signer = ethers.Wallet.createRandom();
    localStorage.setItem("signingKey", signer.privateKey);
  }
  return signer;
};

const getSimpleAccount = (wallet: ethers.Wallet, bundlerUrl: string, paymasterUrl: string) => {
  const accountAPI = new SimpleAccountAPI({
    provider: new ethers.providers.JsonRpcProvider(bundlerUrl),
    entryPointAddress,
    owner: wallet,
    factoryAddress,
    paymasterAPI: new StackupPayMasterAPI(paymasterUrl, entryPointAddress),
  });
  return accountAPI;
};
interface MintItem {
  account: string;
  amount: string | null;
  balance: string | null;
  loading?: boolean;
  mintBtnText: string;
}

interface TransactionLog {
  userOpHash: string
  transactionHash: string
}

function Demo() {
  const [transactionLogs, setTransactionLogs] = useState<TransactionLog[]>([])
  const [bundler, setBundler] = useState("https://public.stackup.sh/api/v1/node/ethereum-sepolia");
  const [payMaster, setPayMaseter] = useState("https://api.stackup.sh/v1/paymaster/e008121e92221cb49073b5bca65d434fbeb2162e73f42a9e3ea01d00b606fcba");
  const [batchLoading, setBatchLoading] = useState(false);
  const [mintList, setMintList] = useState<MintItem[]>([
    {
      account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      amount: null,
      balance: null,
      mintBtnText: "Mint USDT"
    },
    {
      account: "0x6Ecbe1DB9EF729CBe972C83Fb886247691Fb6beb",
      amount: null,
      balance: null,
      mintBtnText: "Mint USDT"
    },
    {
      account: "0x5409ED021D9299bf6814279A6A1411A7e866A631",
      amount: null,
      balance: null,
      mintBtnText: "Mint USDT"
    },
    {
      account: "0x47E51256Fc9C7e87fd23b3444091D7A877C919B4",
      amount: null,
      balance: null,
      mintBtnText: "Mint USDT"
    },
  ]);
  const [, setCurrentWalletAddress] = useState<string>(
    ethers.constants.AddressZero
  );
  //  const [currentSmartAccount, setCurrentSmartAccount] = useState<BaseAccountAPI | null>(null)
  const [, setCurrentSmartAccountAddress] =
    useState<string>(ethers.constants.AddressZero);
  useEffect(() => {
    const init = async () => {
      const wallet = getWallet();
      setCurrentWalletAddress(wallet.address);
      const simpleAccount = getSimpleAccount(wallet, bundler, payMaster);
      // setCurrentSmartAccount(accountAPI);
      const smartAddress = await simpleAccount.getCounterFactualAddress();
      setCurrentSmartAccountAddress(smartAddress);
    };
    init();
  }, []);
  const updateUSDTBalance = async () => {
    const TestnetERC20 = new ethers.Contract(
      TestUSDT,
      TestnetERC20ABI,
      new ethers.providers.JsonRpcProvider(bundler)
    );
    for (let i = 0, l = mintList.length; i < l; i++) {
      TestnetERC20.balanceOf(mintList[i].account).then(
        (value: ethers.BigNumber) => {
          setMintList((items) => {
            const newItems = [...items];
            const newItem = newItems[i];
            newItem.balance = ethers.utils.formatUnits(value, 6);
            return newItems;
          });
        }
      );
    }
  };
  const mintUSDT = async (data: MintItem) => {
    const wallet = getWallet();
  
    // const smartAccountContract = await smartAccount._getAccountContract();
    const TestnetERC20 = new ethers.Contract(
      TestUSDT,
      TestnetERC20ABI,
    
    );
    // Encode the calls
    const callTo = [TestUSDT];
    const callData = [
      TestnetERC20.interface.encodeFunctionData("_mint", [
        data.account,
        ethers.utils.parseUnits(data.amount ? data.amount : "0", 6),
      ]),
    ];
    // const encodeCallData = smartAccountContract.interface.encodeFunctionData("executeBatch", [callTo, callData]);
    //console.log([callTo, callData], encodeCallData)
    const smartAccount = new SmartAccount({
      bundler: {
        provider: bundler.includes("stackup") ? "stackup": bundler.includes("pimlico") ? "pimlico" : "zerodev" ,
        config: {
          url: bundler
        }
      },
      paymaster: {
        provider:  payMaster.includes("stackup") ? "stackup": bundler.includes("stackup") ? "pimlico" : "zerodev" ,
        config: {
          url: payMaster
        }
      }
    })
    const userOp = await smartAccount.sendUserOperation(wallet, callTo, callData);
    console.log("Waiting for transaction..." + userOp?.userOpHash);
    const result = await userOp?.wait()
    console.log(`Transaction hash: ${result?.transactionHash}`);
    await updateUSDTBalance();
    setMintList((items) => {
      const newItems = [...items];
      const newItem: any = _.find(newItems, (mintItem: any) => {
        return mintItem.account === data.account;
      });
      if (newItem) {
        newItem.loading = false;
        newItem.mintBtnText = "Mint USDT"
      }
      return newItems;
    });
    setTransactionLogs((items) => {
      const newItems = [...items]
      if (userOp?.userOpHash && result?.transactionHash) {
        newItems.unshift({
          userOpHash: userOp?.userOpHash,
          transactionHash: `${result?.transactionHash}`
        })
        localStorage.setItem("TransactionLogs", JSON.stringify(newItems))
      }

      return newItems;
    })
    //console.log(`View here: https://jiffyscan.xyz/userOpHash/${userOpHash}`);
  };
  const batchMintUSDT = async () => {
    setBatchLoading(true);
    const wallet = getWallet();

    // const smartAccountContract = await smartAccount._getAccountContract();
    const TestnetERC20 = new ethers.Contract(
      TestUSDT,
      TestnetERC20ABI,
      
    );
    // Encode the calls

    const callTo = mintList.map(() => {
      return TestUSDT
    });
    const callData = mintList.map((item) => {
      return  TestnetERC20.interface.encodeFunctionData("_mint", [
        item.account,
        ethers.utils.parseUnits(item.amount ? item.amount : "0", 6),
      ])
    })
    // const encodeCallData = smartAccountContract.interface.encodeFunctionData("executeBatch", [callTo, callData]);
    //console.log([callTo, callData], encodeCallData)
    const smartAccount = new SmartAccount({
      bundler: {
        provider: "stackup",
        config: {
          url: bundler
        }
      },
      paymaster: {
        provider: "stackup",
        config: {
          url: payMaster
        }
      }
    })
    const userOp = await smartAccount.sendUserOperation(wallet, callTo, callData);
    console.log("Waiting for transaction..." + userOp?.userOpHash);
    const result = await userOp?.wait()
    console.log(`Transaction hash: ${result?.transactionHash}`);
    await updateUSDTBalance();
    setBatchLoading(false);
    setTransactionLogs((items) => {
      const newItems = [...items]
      if (userOp?.userOpHash && result?.transactionHash) {
        newItems.unshift({
          userOpHash: userOp?.userOpHash,
          transactionHash: `${result?.transactionHash}`
        })
        localStorage.setItem("TransactionLogs", JSON.stringify(newItems))
      }

      
      return newItems;
    })
   
    //console.log(`View here: https://jiffyscan.xyz/userOpHash/${userOpHash}`);
  };
  
  useEffect(() => {
    updateUSDTBalance();
    const TransactionLogs = localStorage.getItem("TransactionLogs");
    if (TransactionLogs) {
      setTransactionLogs(JSON.parse(TransactionLogs))
    }
  }, []);
  const code = ` const TestnetERC20 = new ethers.Contract(
      TestUSDT,
      TestnetERC20ABI,
      
    );

    const callTo = mintList.map(() => {
      return TestUSDT
    });
    const callData = mintList.map((item) => {
      return  TestnetERC20.interface.encodeFunctionData("_mint", [
        item.account,
        ethers.utils.parseUnits(item.amount ? item.amount : "0", 6),
      ])
    })

    const smartAccount = new SmartAccount({
      bundler: {
        provider: "${bundler.includes("stackup") ? "stackup": bundler.includes("pimlico") ? "pimlico" : "zerodev" }",
        config: {
          url: "${bundler}"
        }
      },
      paymaster: {
        provider: "${payMaster.includes("stackup") ? "stackup": payMaster.includes("pimlico") ? "pimlico" : "zerodev" }",
        config: {
          url: "${payMaster}"
        }
      }
    })
    const userOp = await smartAccount.sendUserOperation(wallet, callTo, callData);
    const result = await userOp?.wait(); `
  return (
    <div className={styles.root}>
      {/* <div>EOA Account: {currentWalletAddress}</div>
      <div>Smart Account: {currentSmartAccountAddress}</div> */}
      <a className={styles.contractLink} href="https://sepolia.etherscan.io/address/0x7169d38820dfd117c3fa1f22a697dba58d90ba06" target="_blank">Contract : {TestUSDT}</a>
      <div className={styles.selectRow}>
        <FormControl fullWidth>
          <InputLabel id="bundler-label">Bundler</InputLabel>
          <Select labelId="bundler-label" label="Bundler" value={bundler} onChange={(event) => {
            setBundler(event.target.value as string);
          }}>
            <MenuItem value={"https://public.stackup.sh/api/v1/node/ethereum-sepolia"}>Stackup</MenuItem>
            <MenuItem value={"https://api.pimlico.io/v2/11155111/rpc?apikey=7dc438e7-8de7-47f0-9d71-3372e57694ca"}>Pimlico</MenuItem>
            <MenuItem value={"https://rpc.zerodev.app/api/v2/bundler/1d0e8ee2-84e0-4b5b-852b-d57b6573a627"}>ZeroDev</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="paymaster-label">Paymaster</InputLabel>
          <Select labelId="paymaster-label" label="Paymaster"  value={payMaster} onChange={(event) => {
            setPayMaseter(event.target.value as string);
          }}>
            <MenuItem value={"https://api.stackup.sh/v1/paymaster/e008121e92221cb49073b5bca65d434fbeb2162e73f42a9e3ea01d00b606fcba"}>Stackup</MenuItem>
            <MenuItem value={"https://api.pimlico.io/v2/11155111/rpc?apikey=7dc438e7-8de7-47f0-9d71-3372e57694ca"}>Pimlico</MenuItem>
            <MenuItem value={"https://rpc.zerodev.app/api/v2/paymaster/1d0e8ee2-84e0-4b5b-852b-d57b6573a627"}>ZeroDev</MenuItem>
            <MenuItem value={"111"}>AAStar</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className={styles.mintList}>
        {mintList.map((item) => {
          return (
            <div className={styles.mintRow}>
              <TextField
                label="Account"
                fullWidth
                defaultValue={item.account}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="USDT balance"
                defaultValue={0}
                value={item.balance ? item.balance : 0}
                InputProps={{
                  readOnly: true,
                }}
              />

              <TextField
                label="Amount"
                value={item.amount}
                onChange={(event) => {
                  setMintList((items) => {
                    const newItems = [...items];
                    const newItem: any = _.find(newItems, (mintItem: any) => {
                      return mintItem.account === item.account;
                    });
                    if (newItem) {
                      newItem.amount = event.target.value;
                    }

                    return newItems;
                  });
                }}
              ></TextField>
              <LoadingButton
                variant="contained"
                loading={item.loading ? item.loading : false}
                onClick={() => {
                  setMintList((items) => {
                    const newItems = [...items];
                    const newItem: any = _.find(newItems, (mintItem: any) => {
                      return mintItem.account === item.account;
                    });
                    if (newItem) {
                      newItem.loading = true;
                      newItem.mintBtnText = "Wait...";
                    }
                    return newItems;
                  });
                  mintUSDT(item);
                }}
              >
                {item.mintBtnText}
              </LoadingButton>
            </div>
          );
        })}
      </div>
      <SyntaxHighlighter language="javascript" style={dark}>{code}</SyntaxHighlighter>
      <div className={styles.batchMintUsdtBtn}>
        <LoadingButton
          loading={batchLoading}
          size="large"
          variant="contained"
          onClick={() => {
            batchMintUSDT();
          }}
        >
          Batch Mint USDT
        </LoadingButton>
      </div>
      <TableContainer component={Paper}>
      <Table size="small" >
        <TableHead>
          <TableRow>
            <TableCell>User Op Hash</TableCell>
            <TableCell>Transaction</TableCell>
         
          </TableRow>
        </TableHead>
        <TableBody>
          {transactionLogs.map((row) => (
            <TableRow
              key={row.userOpHash}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell >
                {row.userOpHash}
              </TableCell>
              <TableCell > <a href={`https://sepolia.etherscan.io/tx/${row.transactionHash}`} target="_blank">{row.transactionHash}</a></TableCell>
            
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}

export default Demo;
