import LocalSource from "@/datasource/controller";

function getAccountAmountFromLocalSource(number){
    return LocalSource.getAccountAmount(number);
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

export default {
    getAccountAmount,
    getAccountTransactions,
    getIsAccountValid,
    resetAccountNumber,
};