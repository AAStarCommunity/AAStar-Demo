
# AirAccount v0.2

## 架构概述

AirAccount v0.2基本架构不变：

### 1. 基础SDK

1. AirAccount npm 包，就是下面的接口list
2. 一个demo（clark之前写的）：https://github.com/AAStarCommunity/AAStar-Demo
3. 参考：https://github.com/cipher-flow/mcp-wrapper/blob/main/scripts/generateSignedTx.js
   这是签名的脚本, 可以做参考实现自己的签名逻辑
   https://github.com/cipher-flow/mcp-wrapper/blob/main/src/server.js#L196
   https://github.com/cipher-flow/mcp-wrapper/blob/main/src/server.js#L143
   Generate transaction data using the constructTransactionData tool

### 2. 后端服务

1. Go 主进程，响应接口，作为CA
2. postgresql数据库，存储账户关联信息
3. TEE服务，TA，生成TEE私钥，TEE签名

服务流程：

1. bind：为一个初始凭证创建多链的合约账户，默认值创建OP链；后续可以围绕初始凭证增加更多凭证，例如初始化是Email，后续可以增加手机号、社交媒体、Web2、EOA等。
2. create：创建账户的过程是指纹的密钥对挑战并记录的过程，也是TEE生成对应的keypair的过程，输出passkey公钥和合约账户地址。
3. sign：基于ERC4337的交易数据标准，改造了交易签名部分：是passkey签名验证后的BLS签名和TEE签名的组合，只有特定的验证函数才可以验证改造过的签名；
   sign分为两个单独的签名：passkey签名和TEE签名（也会验证passkey再签），分别请求不同的API获得。
4. sign：基于ERC4337的交易数据标准，改造了交易签名部分：是passkey签名验证后的BLS签名和TEE签名的组合，只有特定的验证函数才可以验证改造过的签名；
   sign分为两个单独的签名：passkey签名和TEE签名（也会验证passkey再签），分别请求不同的API获得。
5. verify：不是链上的验证，而是validator对于passkey签名的随机选择3个验证者进行的2/3验证，确保是用户passkey签名，然后多个validator签名。
6. submit：和常规ERC4337的useroperation一样，提交给bundler，bundler提交给entrypoint，执行合约账户代码，包括核心的EIP1271的isValidSignature的自定义签名验证。
7. 链上verify：合约账户内集成的isValidSignature的自定义验证函数对BLS聚合签名和TEE私钥签名Feb进行验证，通过后交易正常执行

### 3. 账户合约

1. 基于Alchemy的SimpleAccount
2. 更新签名验证部分，支持调用预编译的EIP2537
3. 重载social recovery部分代码，用来搬家，recovery需要收集到3类签名
4. 三类签名：自己的备用（其他手指指纹，EOA等），亲友（若干个），社区（社区声誉高的3人），D-validator（50%以上）

### 4. 完整描述

#### EOA场景

此部分生成整体流程和合约交互场景，包括solution和features

1. EOA通过和delegate合约交互，签名授权，授权范围：gas代付，通知支付网关协议转账PNTs协议的任何代币，拒收任何ETH或者native
   token
2. EOA绑定生成AirAccount账户，需要绑定passkey，和上面流程一致，获得账户地址。
3. 通过社区面板，获得白板sbt和社区积分。
4. EOA通过dApp，生成交易数据（useroperation），EOA私签名交易依赖EOA所在钱包，passkey签名
5. 提交给paymaster，验证是否有sbt(没有sbt和绑定airaccount的积分余额，无法赞助），签名sponsor许可，最终提交给bundler
6. bundler提交给entrypoint（因为是伪合约账户），执行合约账户代码，包括核心的EIP1271的isValidSignature的自定义签名验证。
7. 交易目标分为两种：支配EOA账户内的余额，EOA签名即可，支配EOA绑定的合约账户余额(AirAccount)，需要TEE签名
8. 对应签名也分为两种：不包括paymaster过程签名，分为EOA+passkey签名和TEE+passkey签名，两个type，对应两个validateMethod
9. 链上verify：一个是EOA绑定的临时合约账户（代码授权），另一个是AirAccount的合约账户，实现两个validateMethod
10. 走ERC4337流程，提交给bundler，忽略中间过程，完成验证，上链，支付
11. EOA依靠paymaster对绑定合约账户sbt的唯一验证，来保障了支付的安全性（只私钥签名无法交易），因为拒收ETH，只有paymaster可以sponsor交易
12. sbt无法转移，配合授权的支付网关，私钥忘记/泄露依然可以转移资产，而黑客需要进入小团体获得sbt（难度很高，需要老成员介绍）
13. EOA基于EIP7702的授权，如果拥有私钥，可以移除和更换么？需要确认权限问题，另外如何永久授权?

## 1:userRegister

### userCredential

#### SMS

#### Email

#### GoogleAccount/

#### Web2 Account

#### EOA

#### passkey/fingerprint

#### multisig+social recovery

### verifyCredential

#### SMS: semi-decentralized

#### Email/Account: rely on platform API

#### EOA: decentralized validator

#### fingerprint: decentralized validator

register challenge: decentralized validator(register node and other nodes)

#### multisig+contract: decentralized validator+public guardian

100 nodes : just set 5/10 number to pay guardian fee, will from 100 to random 50
and then random 10, to verify 5

### generateAccountCredential

#### record bind relation

central+EOA+?(at least one), fingerprint(must) central credential: read
fingerprint: launch transaction EOA: easy to lost, so read

#### multisig

threshold signature to change contract private key different chain, different
contract, we select OP as account chain

#### contract init

d-validator register as guardian and execute the change request

## 2:accountManagement

### generateAccount

#### CA

TEE generate private key: only sign

#### TA

TEE generate private key: only sign

### read(history or bindings)

read: any credential can view history read bindings: should verify finger print

### set ENS

set(change) ENS: use finger print(set database and launch transaction)

### change bindings

#### change central credential

use old central credential or use fingerprint to launch a replace verification
it will modify the record in same community nodes database

### change private key

change community nodes/reset private key/social recovery: select random
number(5/10) from 100 d-validators

threshold verification: 5/30, register 30 validators into contract, if verified,
change the new address(new private will be passed verify)

#### social recovery

1. generate change key request(anyone)
2. option: change node to save, no change default
3. verify your backup credential(self-host or community friends with
   pre-setting, offline relation, will be publish to public)
4. bind your finger with old or new node
5. get a URL transaction on a form, send to any node to spread with payment
6. send to guardians(anonymous sending)
7. recovery ok

## 3:signTransaction

### Sign transaction

依赖指纹签名和TEE私钥签名的双重签名，以及Dvalidator的BLS汇总验证和链上二次验证
特殊交易：更换私钥（address），需要依赖合约账户的预设更换验证规则，次交易需要收集完整的签名，走特定合约验证接口（跳过了指纹和私钥签名的双验证）
