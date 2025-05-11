# AirAccount features
V0.2整体目标和所有思考，信息，材料都在solution讨论，这里拆解为features，然后用plan.md分步骤实现，每次更新写入changes.md，涉及初始化和部署、后续维护的内容，放入deploy.md，每次release，形成一个release记录在release.md。
所有文档，请在根目录下的docs目录，如果没有，请新建；如果有相关文档不在目录内，请移动到目录内。

本项目目标是完成demo串联所有流程，逐步完成所有feature测试集成；
完成AirAccount的nodejs npm包（需要新建一个目录），通过skd初始化provider，设置account 服务器ip，用约定接口调用airaccount；

## 阶段1:ERC4337基础流程
1. 用demo页面来串联所有流程，就是本repo
2. 组装交易数据：transfer erc20，领取nft，目前测试这两个类型交易
3. 注册Airaccount，必须使用passkey注册（目前使用google chrome调用系统passkey，后面再修改为不依赖chrome的方案）
4. 注册调用的是airaccount的接口
5. 给生成的测试账户打测试的eth币
6. 登陆，操作账户发起交易
7. 页面会显示相关的debug信息
8. bundler是交易提交对象

## 阶段2: airaccount sdk新features
1. 增加airaccount的eoa绑定（原来默认时email和google account绑定）
2. 账户的签名在支持双签名账户合约内验证通过（原来签名二次，但验证了一个？）

## 阶段3: paymaster新features
1. 在上述流程增加paymaster配置，然后，发起交易，获得paymaster签名，成功交易
2. 增加自定义的bundler和自定义的paymaster relay的签名和验证

4. 增加airaccount的erc20支付gas
5. 增加nft验证然后支付erc20
6. 尝试跨账户支付erc20 gas（链上授权指定链的指定账户，然后签名上链）

## 阶段4: 支持SDSS API
从ens记录的text record读取，另外基于EIP1820来获得支持的接口

## 更多
- Credential Binding：任何凭证的绑定，Web2 account，EOA，Email，SMS
- Account Generation：基于ARM上TEE的加密账户生成和管理
- Double Verification：基于指纹和TEE的二次验证以及增强的AI安全模型校验
- Account Management：基于AA的全生命周期管理：社交恢复、遗嘱执行、日限额等
- Gasless&Seamless
  Transaction：基于AA的无感交互体验：支付、打赏、点赞、NFT等等Web2体验，背后的交易支持
- Decentralization：真去中心账户：你的指纹+TEE+雨计算的Validator，让普通人拥有数据主权
- Ultra Security：针对不同用户，提供分层的安全方案
