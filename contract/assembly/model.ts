import { context, PersistentUnorderedMap, PersistentVector, u128 } from "near-sdk-as";

@nearBindgen
export class TippedAccount {
  name: string;
  description: string;
  total_amount: u128;
  active: bool;
  owner: string;

  public static fromPayload(payload: TippedAccount): TippedAccount {
    const tippedAccount = new TippedAccount;
    tippedAccount.name = payload.name;
    tippedAccount.description = payload.description;
    tippedAccount.active = true;
    tippedAccount.owner = context.sender;
    tippedAccount.total_amount = u128.Zero;

    return tippedAccount;
  }

}

@nearBindgen
export class Tip {
  from: string;
  to: string;
  amount: u128;
  message: string;
  blockId : number;

  public static fromPayload(payload: Tip): Tip {
    const tip = new Tip();
    tip.from = context.sender;
    tip.to = payload.to;
    tip.amount = payload.amount;
    tip.message = payload.message;
    tip.blockId = context.blockTimestamp;

    return tip;
  }
  
}

export const listedAccounts = new PersistentUnorderedMap<string, TippedAccount>("TIPPED_ACCOUNT");

export function getTipCollectionName(accountName: string): string {
  return "TIP" + ":" + accountName;
}