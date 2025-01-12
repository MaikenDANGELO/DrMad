import LocalSource from "@/datasource/controller";

function getAccountAmountFromLocalSource(number){
    return LocalSource.getAccountAmount(number);
}

function getAccountFromLocalSource(number) {
    return LocalSource.getAccount({ number })
}

async function getAccountAmount(number){
    let response;
    try{
        response = await getAccountAmountFromLocalSource(number);
    }catch(err){
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupérer le montant du compte'  };
    }
    return response;
}

function getAccountTransactionsFromLocalSource(number){
    return LocalSource.getAccountTransactions(number);
}

function getTransactionsFromLocaleSource(number) {
    return LocalSource.getTransactions({ account: number })
}

function createWithdrawFromLocalSource(account, amount) {
    return LocalSource.createWithdraw({ account, amount })
}

function createPaymentFromLocalSource(account, amount, destNumber) {
    return LocalSource.createPayment({ account, amount, destNumber })
}

async function getAccountTransactions(number){
    let response;
    try{
        response = await getAccountTransactionsFromLocalSource(number);
    }catch(err){
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupérer les transactions du compte'}
    }
    return response;
}

async function getIsAccountValid(number){
    return LocalSource.getIsAccountValid(number);
}

async function resetAccountNumber(){
    return LocalSource.resetAccountNumber();
}

async function getAccount(number) {
    try {
        var response = await getAccountFromLocalSource(number);
    } catch (e) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupérerer le compte'}
    }

    return response
}

async function getTransactions(number) {
    try {
        var response = await getTransactionsFromLocaleSource(number);
    } catch (e) {
        response = {error: 1, status: 404, data: 'erreur réseau, impossible de récupérerer le compte'}
    }

    return response
}

async function createPayment(account, amount, destNumber) {
    try {
        var response = await createPaymentFromLocalSource(account, amount, destNumber)
    } catch (e) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de créer un paiement' }
    }

    return response
}

async function createWithdraw(account, amount) {
    try {
        var response = await createWithdrawFromLocalSource(account, amount)
    } catch (e) {
        response = { error: 1, status: 404, data: 'erreur réseau, impossible de faire un débit' }
    }

    return response
}

export default {
    getAccountAmount,
    getAccountTransactions,
    getIsAccountValid,
    resetAccountNumber,
    getAccount,
    getTransactions,
    createWithdraw,
    createPayment
};