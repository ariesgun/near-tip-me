/*
[View]
- get_accounts()
- get_account()
*/

import { context, ContractPromiseBatch, PersistentVector, u128 } from "near-sdk-as";
import { listedAccounts, TippedAccount, Tip, getTipCollectionName } from "./model";

export function getAccounts(): TippedAccount[] {
  return listedAccounts.values();
}

export function getTippers(accountName: string): Tip[] {
  let allTippers = new PersistentVector<Tip>(getTipCollectionName(accountName));

  let ret = new Array<Tip>();

  for (let i = 0; i < allTippers.length; ++i) {
    let tipper = allTippers[i];
    ret.push(tipper);
  }
  return ret;
}

/*
[Change]
- create() - only owner
- tip(amount, message)
- withdraw() - only owner
- disable() - only owner
- remove() - only owner
*/
export function create(acc: TippedAccount): void {
  let storedAccount = listedAccounts.get(acc.name);
  if (storedAccount !== null) {
    throw new Error(`an account with ${acc.name} already exists`);
  }
  listedAccounts.set(acc.name, TippedAccount.fromPayload(acc));
}

export function tip(to: string, amount: u128, message: string) : void {
  let storedAccount = listedAccounts.get(to);
  if (storedAccount === null) {
    throw new Error(`an account with name ${to} does not exist`);
  }

  if (amount.toString() != context.attachedDeposit.toString()) {
    throw new Error("attached deposit does not the specified amount");
  }

  if (!storedAccount.active) {
    throw new Error(`unable to tip becaues the account ${to} is not active.`);
  }

  let tips = new PersistentVector<Tip>(getTipCollectionName(to));

  let curTip = new Tip();
  curTip.from = context.sender;
  curTip.to   = to;
  curTip.amount = amount;
  storedAccount.total_amount = u128.add(storedAccount.total_amount, amount);
  curTip.message = message;

  tips.push(curTip);
  listedAccounts.set(to, storedAccount);
}

export function withdraw(accName: string) : void {
 let storedAccount = listedAccounts.get(accName);
  if (storedAccount === null) {
    throw new Error(`an account with ${accName} does not exist`);
  }

  if (storedAccount.owner.toString() != context.sender.toString()) {
    throw new Error(`only the owner can withdraw the funds`);
  }

  ContractPromiseBatch.create(storedAccount.owner).transfer(storedAccount.total_amount);
  storedAccount.total_amount = u128.Zero;
  listedAccounts.set(accName, storedAccount);
}

export function disable(accName: string) : void {
  let storedAccount = listedAccounts.get(accName);
  if (storedAccount === null) {
    throw new Error(`an account with ${accName} does not exist`);
  }
  storedAccount.active = false;
  listedAccounts.set(accName, storedAccount);
}

export function activate(accName: string) : void {
  let storedAccount = listedAccounts.get(accName);
  if (storedAccount === null) {
    throw new Error(`an account with ${accName} does not exist`);
  }
  storedAccount.active = true;
  listedAccounts.set(accName, storedAccount);
}

export function remove(accName: string) : void {
  let storedAccount = listedAccounts.get(accName);
  if (storedAccount === null) {
    throw new Error(`an account with ${accName} does not exist`);
  }

  if (storedAccount.owner.toString() != context.sender.toString()) {
    throw new Error(`only the owner can delete the account ${storedAccount.owner} : ${context.sender}`);
  }

  if (storedAccount.total_amount > u128.Zero) {
    ContractPromiseBatch.create(storedAccount.owner).transfer(storedAccount.total_amount);
  }

  listedAccounts.delete(accName);
}


