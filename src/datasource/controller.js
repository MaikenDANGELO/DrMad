import { items, shopusers, bankaccounts, transactions } from './data'
import {v4 as uuidv4} from 'uuid'
import bcrypt from 'bcryptjs'
/* controllers: les fonctions ci-dessous doivent mimer ce que renvoie l'API en fonction des requêtes possibles.

  Dans certains cas, ces fonctions vont avoir des paramètres afin de filtrer les données qui se trouvent dans data.js
  Ces paramètres sont généralement les mêmes qu'ils faudrait envoyer à l'API, mais pas forcément.

  Exemple 1 : se loguer auprès de la boutique
 */

function shopLogin(data) {
  if ((!data.login) || (!data.password)) return {error: 1, status: 404, data: 'aucun login/pass fourni'}
  // pour simplifier : test uniquement le login
  let user = shopusers.find(e => e.login === data.login && bcrypt.compareSync(data.password, e.password))
  if (!user) return {error: 1, status: 404, data: 'login/pass incorrect'}
  // générer un uuid de session pour l'utilisateur si non existant
  if (!user.session) {
    user.session = uuidv4()
  }
  // retourne uniquement les champs nécessaires
  let u = {
    _id: user._id,
    name: user.name,
    login: user.login,
    email: user.email,
    session: user.session,
    orders: user.orders
  }
  return {error: 0, status: 200, data: u}
}

function getUserOrders(user){
  if(user === null) return {error: 1, status: 404, data: 'utilisateur invalide'}
  let shopuser = shopusers.find(e => e._id === user._id);

  return {error:0, status: 200, data: shopuser.orders}
}

function updateUserCart(cart, user){
  if(cart === null) return {error: 1, status: 404, data: 'panier invalide'}
  if(user === null) return {error: 1, status: 404, data: 'utilisateur invalide'}

  let items = [];
  for(const [key,value] of cart.entries()){
    items.push({item: key, amount: value});
  }
  let shopuser = shopusers.find(e => e._id === user._id);
  shopuser["basket"] = items;
  return {error: 0, status: 200, data: 'panier utilisateur mis à jour'};
}

function getUserCart(user){
  if(user === null) return {error: 1, status: 404, data: 'utilisateur invalide'}
  let shopuser = shopusers.find(e => e._id === user._id);
  let cart = shopuser["basket"];
  let trueCart = new Map()
  for(let a of cart.items){
    trueCart.set(a.item.name,a.amount);
  }
  return {error:0, status: 200, data: trueCart};
}

function passOrder(cart, user){
  if(user === null) return {error: 1, status: 404, data: 'utilisateur invalide'}
  if(cart === null || cart.size <= 0) return {error: 1, status: 404, data: 'panier invalide'}
  let shopuser = shopusers.find(e => e._id === user._id);

  let order = {
    items: [],
    date: {"$date": new Date().toUTCString()},
    total: 0,
    status: 'waiting_payment',
    uuid: uuidv4(),
  }

  let orderItems = [];
  let total = 0;
  for(let [key, value] of cart.entries()){
    let virus = items.find(e => e.name === key);
    let item = {
      item: {
        name: virus.name,
        description: virus.description,
        price: virus.price,
        promotion: virus.promotion,
        object: virus.object,
      },
      amount: value,
    }
    total += value*virus.price
    orderItems.push(item);
  }
  
  order.total = total;
  order.items = orderItems;
  shopuser["orders"].push(order);
  
  return {error: 0, status: 200, data: order.uuid};
}

function payOrder(user, uuid, t_uuid){
  if(user === null) return {error: 1, status: 404, data: 'utilisateur invalide'}
  if(uuid === null) return {error: 1, status: 404, data: 'uuid invalide'}
  if(t_uuid === null)  return {error: 1, status: 404, data: 'transaction uuid invalide'}
  let shopuser = shopusers.find(e => e._id === user._id);
  let order = shopuser.orders.find(e => e.uuid === uuid)
  if(order === null) return {error: 1, status: 404, data: 'commande introuvable'}
  
  let transaction = transactions.find(t => t._id === t_uuid)
  if(transaction === null) return {error: 1, status: 404, data: 'transaction introuvable'}
  if(-parseInt(transaction.amount) === parseInt(order.total)){
    if(transaction.destination && transaction.destination === "65d721c44399ae9c8321832c"){
      order.status = 'finalized'
      return {error: 0, status: 200, data: "commande payée et finalisée"}
    }
  }
  return {error: 0, status: 200, data: "paiement invalide"}
}

function cancelOrder(user, uuid){
  if(user === null) return {error: 1, status: 404, data: 'utilisateur invalide'}
  if(uuid === null) return {error: 1, status: 404, data: 'uuid invalide'}
  let shopuser = shopusers.find(e => e._id === user._id);

  let order = shopuser.orders.find(e => e.uuid === uuid)
  if(order === null) return {error: 1, status: 404, data: 'commande introuvable'}

  order.status = 'cancelled'
  return {error: 0, status: 200, data: "commande annulée"}
}

function getAllViruses() {
  return {error: 0, data: items}
}

function getAccountAmount(number){
  if(number === null) return {error: 1, status: 404, data: 'identifiant incorrect'};
  let nAccount;
  for(const account in bankaccounts){
    if(bankaccounts[account].number === number){
      nAccount = account;
      break;
    }
  }
  if(nAccount != null) return {error: 0, status: 200, data : bankaccounts[nAccount].amount}
  return  {error: 1, status: 404, data: 'identifiant non trouvé'}
}

async function getAccountTransactions(number){
  if(number === null) return {error: 1, status: 404, data: 'identifiant incorrect'};
  let acc = bankaccounts.find(a => a.number === number)
  if(acc === null)  return {error: 1, status: 404, data: 'compte introuvable'};
  let accTransacs = transactions.filter(a => a.account === acc._id);
  return {error: 0, status: 200, data : accTransacs}
}

function getIsAccountValid(number) {
  let isValid = false;
  if ((number.length === 30) && (number[22] === '-')){
    isValid = true;
    for(let i = 23; i < 30; i++){
      if(isNaN(parseInt(number[i]))){
        isValid = false;
        break
      }
    }
  }
  if(isValid) return {error: 0, status: 200, data: isValid}
  else return {error: 1, status: 404, data: "identifiant incorrect : format"};
}

function resetAccountNumber(){
  return {error: 0, status: 200, data: ''};
}

function getAccount(data) {
  return bankaccounts.find((a) => a.number === data.number) ?? {error: 1, status: 403, data: 'Numéro de compte invalide'};
}

function getTransactions(data) {
  let t;
  return (t = transactions.filter((transaction) => transaction.account === data.account)).length !== 0 ? t : {error: 1, status: 403, data: 'Aucune transaction pour ce compte'}
}

function createWithdraw({account, amount}) {
  amount = parseInt(amount)
  const acc = bankaccounts.find((a) => a.number === account)

  if (acc) {
    const id = uuidv4()
    const newTransaction = {
      _id: id,
      account: acc._id,
      date: {
        $date: new Date().toISOString(),
      },
      amount: -amount,
      uuid: id,
    };
    transactions.push(newTransaction);
    acc.amount = acc.amount-amount

    return { error: 0, status: 201, data: { uuid: id, amount: amount } }
  }  else {
    return { error: 1, status: 404, data: 'id de compte invalide' }
  }
}

function createPayment(data) {
  const account = bankaccounts.find((acc) => acc.number === data.account)
  const destinationAccount = bankaccounts.find((dacc) => dacc.number === data.destNumber)

  if (account && destinationAccount) {
    let id = uuidv4()
    const t1 = {
      _id: id,
      account: account._id,
      date: {
        $date: new Date().toISOString(),
      },
      amount: -data.amount,
      destination: destinationAccount._id,
      uuid: id,
    }

    id = uuidv4()
    const t2 = {
      _id: id,
      account: destinationAccount._id,
      date: {
        $date: new Date().toISOString()
      },
      amount: data.amount,
      uuid: id,
    }

    transactions.push(t1)
    transactions.push(t2)
    account.amount -= data.amount
    destinationAccount.amount += data.amount
    return { error: 0, status: 201, data: { uuid: t1.uuid, amount: account.amount } };
  } else if (!account) {
    return { error: 1, status: 404, data: 'id de compte invalide' };
  } else {
    return { error: 1, status: 404, data: 'compte destinataire inexistant' };
  }
}

export default{
  shopLogin,
  getAllViruses,
  getAccountAmount,
  getAccountTransactions,
  getIsAccountValid,
  resetAccountNumber,
  updateUserCart,
  getUserCart,
  passOrder,
  payOrder,
  cancelOrder,
  getUserOrders,
  getAccount,
  getTransactions,
  createWithdraw,
  createPayment
}