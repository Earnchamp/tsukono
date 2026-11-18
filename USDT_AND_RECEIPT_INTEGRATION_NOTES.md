# GoldPay Admin Demo — Receipt Alerts and BSC USDT

Added to the existing admin demo:
- Receipt Review Alerts: queue of user-uploaded receipts where the related buy order remains pending.
- USDT Deposits: BNB Smart Chain transaction monitoring and wallet-sync status.
- User USDT Deposit screen: preview of a per-user deposit address experience.

## Important: demo versus live operation
All balances, addresses, TXIDs, statuses and counts in these screens are illustrative placeholders.
The “Sync chain” and “Verify TXID” buttons explain the intended workflow; they do not call a blockchain.

## Safe production architecture for USDT on BNB Smart Chain
1. Integrate a reputable custody/wallet infrastructure provider or hardened MPC/HSM key-management
   service to allocate a unique deposit address per GoldPay user. Do not generate private keys in
   frontend code, expose them to admins, or store plaintext private keys in the application DB.
2. Maintain a server-side mapping: user_id, chain_id, token_contract, deposit_address, provider
   wallet reference, created_at and status. The public address can be displayed to the user.
3. Use a trusted BSC RPC provider or indexed event service to monitor the configured official
   token contract's Transfer events. Do not accept a user-submitted TXID as proof by itself.
4. Verify chain ID, transaction receipt success, token contract address, Transfer log, destination
   address, raw token amount/decimals, block hash and confirmation depth. Handle reorgs.
5. Identify each transfer uniquely using chain_id + tx_hash + log_index. Enforce a database
   unique constraint so the same on-chain transfer cannot be credited twice.
6. After required confirmations, write a double-entry ledger credit in one DB transaction and
   mark wallet sync complete. Keep pending/confirming, verified, credited, failed and review states.
7. Run periodic reconciliation between indexed chain transfers, custody provider records and
   GoldPay ledger. Alert on mismatches and stuck wallet-sync tasks.

## Receipt review
A receipt upload/UTR is an unverified user claim. The admin queue is for triage only. Confirm the
payment using an authorized provider transaction record before marking received or crediting.
