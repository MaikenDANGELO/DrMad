import LocalSource from "@/datasource/controller";

async function shopLoginFromLocalSource(data) {
  // récupération auprès de la source locale
  return LocalSource.shopLogin(data)
}
/*
async function shopLoginFromAPI(data) {
  // a écrire quand l'API est fonctionnelle
  return {}
}
 */

async function getAllVirusesFromLocalSource() {
  // récupération auprès de la source locale
  return LocalSource.getAllViruses()
}

/*
async function getAllVirusesFromAPI() {
  // a écrire quand l'API est fonctionnelle
  return {}
}
*/

async function getUserCartFromLocalSource(user){
  return LocalSource.getUserCart(user);
}

async function getUserCart(user){
  let response = null;
  try {
    response = await getUserCartFromLocalSource(user);
  }
  catch(err){
    response = {error: 1, status: 500, data: 'erreur réseau, impossible de récupérer le panier'}
  }
  return response
}

async function updateUserCartFromLocalSource(cart, user){
  return LocalSource.updateUserCart(cart, user);
}

async function updateUserCart(cart, user){
  let response = null;
  try {
    response = await updateUserCartFromLocalSource(cart, user);
  }
  catch(err){
    response = {error: 1, status: 500, data: 'erreur réseau, impossible de modifier le panier'}
  }
  return response
}

async function shopLogin(data) {
  let response = null;
  try {
    // changer la méthode appelée quand cette fonctionnalité l'API est prête
    response = await shopLoginFromLocalSource(data)
  }
    // NB: le catch n'aura lieu que pour des requête vers l'API, s'il y a une erreur réseau
  catch(err) {
    response = {error: 1, status: 404, data: 'erreur réseau, impossible de se loguer'  }
  }
  return response
}


async function getAllViruses() {
  let response = null;
  try {
    // changer la méthode appelée quand cette fonctionnalité l'API est prête
    response = await getAllVirusesFromLocalSource()
  }
  // NB: le catch n'aura lieu que pour des requête vers l'API, s'il y a une erreur réseau
  catch(err) {
    response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupérer la liste des viruses'  }
  }
  return response
}

async function passOrderFromLocalSource(user, cart){
  return LocalSource.passOrder(user, cart);
}

async function passOrder(user, cart){
  let response;
  try{
    response = await passOrderFromLocalSource(user, cart)
  }catch(error){
    response = {error: 1, status: 500, data: 'erreur, impossible de passer la Ordere'}
  }
  return response;
}

async function payOrderFromLocalSource(user, uuid, t_uuid){
  return LocalSource.payOrder(user, uuid, t_uuid);
}

async function payOrder(user, uuid, t_uuid){
  let response;
  try{
    response = await payOrderFromLocalSource(user, uuid, t_uuid)
  }catch(error){
    response = {error: 1, status: 500, data: 'erreur, impossible de payer la Ordere'}
  }
  return response;
}

async function cancelOrderFromLocalSource(user, uuid){
  return LocalSource.cancelOrder(user, uuid);
}

async function cancelOrder(user, uuid){
  let response;
  try{
    response = cancelOrderFromLocalSource(user, uuid);
  }catch(error){
    response = {error: 1, status: 500, data: 'erreur, impossible d\'annuler la commande'}
  }
  return response;
}

async function getUserOrdersFromLocalSource(user){
  return LocalSource.getUserOrders(user);
}

async function getUserOrders(user){
  let response;
  try{
    response = getUserOrdersFromLocalSource(user);
  }catch(error){
    response = {error: 1, status: 500, data: "erreur, impossible de récupérer les commandes de l'utilisateur"};
  }
  return response;
}

export default {
  shopLogin,
  getAllViruses,
  updateUserCart,
  getUserCart,
  passOrder,
  payOrder,
  cancelOrder,
  getUserOrders
}