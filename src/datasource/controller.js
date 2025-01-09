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

function payOrder(user, uuid){
  if(user === null) return {error: 1, status: 404, data: 'utilisateur invalide'}
  if(uuid === null) return {error: 1, status: 404, data: 'uuid invalide'}
  let shopuser = shopusers.find(e => e._id === user._id);

  let order = shopuser.orders.find(e => e.uuid === uuid)
  if(order === null) return {error: 1, status: 404, data: 'commande introuvable'}

  order.status = 'finalized'
  return {error: 0, status: 200, data: "commande payée et finalisée"}
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

function getAccountTransactions(number){
  if(number === null) return {error: 1, status: 404, data: 'identifiant incorrect'};
  const accTransacs = [];
  let nAccount;
  for(const account in bankaccounts){
    if(bankaccounts[account].number === number){
      nAccount = account;
      break;
    }
  }
  if(nAccount != null) {
    let accountID = bankaccounts[nAccount]._id
    for(const n in transactions){
      if(transactions[n].account === accountID){
        accTransacs.push(transactions[n])
      }
    }
  }
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
}