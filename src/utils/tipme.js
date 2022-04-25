const GAS = 100000000000000; // 1 Tgas (14 decs)


export async function createAccount(tippedAccount) {
  console.log("Tip ", tippedAccount);
  return await window.contract.create({ acc: tippedAccount }, GAS);
}

export function getAccounts() {
  return window.contract.getAccounts();
}

export async function getTippers({name}) {
  return await window.contract.getTippers({ accountName: name });
}

export async function withdraw({name}) {
  return await window.contract.withdraw({accName: name}, GAS);
}

export async function disable({name}) {
  return await window.contract.disable({accName: name}, GAS);
}

export async function activate({name}) {
  return await window.contract.activate({accName: name}, GAS);
}

export async function tip({name, amount, message}) {
  console.log("Tip ", name);
  console.log("Tip ", amount);
  console.log("Tip ", message);
  await window.contract.tip({to: name, amount: amount, message: message}, GAS, amount);
}