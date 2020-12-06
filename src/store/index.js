import Vue from "vue";
import Vuex from "vuex";
import API from "./API";

Vue.use(Vuex);
const api = new API();

export default new Vuex.Store({
  state: {
    allChecks: "",
    idCurrentCheck: "",
    noMoney: false,
    isVisibleButton: false,
    idTransaction: null,
    transactionAddPayment: [],
    transactionSpendPayment: []
  },
  mutations: {
    setAllChecks(state, payload) {
      state.allChecks = [];
      payload.forEach(item => {
        state.allChecks.push(item);
      });
      state.allChecks.sort((a, b) => a.id - b.id);
      state.isVisibleButton = state.allChecks.length > 10;
    },
    setIdCurrentCheck(state, payload) {
      state.idCurrentCheck = payload;
    },
    setIdTransaction(state, payload) {
      state.idTransaction = payload;
    },
    changeNoMoney(state) {
      state.noMoney = !state.noMoney;
    },
    setTransactionAddPayment(state, payload) {
      state.transactionAddPayment = payload.data;
    },
    setTransactionSpendPayment(state, payload) {
      state.transactionSpendPayment = payload.data;
    }
  },
  actions: {
    getUserAccounts(context) {
      api
        .getAllChecks()
        .then(response => {
          context.commit("setAllChecks", response.data);
        })
        .catch(reject => console.log("getUserAccounts: " + reject));
    },
    deletePay(context, id) {
      api
        .deletePayment(id)
        .then(() => {
          context.dispatch("getUserAccounts");
        })
        .catch(reject => console.log("deletePay: " + reject));
    },
    createNewCheck(context) {
      api
        .addNewChecks()
        .then(() => {
          context.dispatch("getUserAccounts");
        })
        .catch(reject => console.log("createNewCheck: " + reject));
    },
    addPayment(context, payload) {
      api.addPayment(payload.account, payload.amount).then(() => {
        context.dispatch("getUserAccounts");
      });
    },
    spendServicePayment(context, payload) {
      api
        .spendMoneyFromAccount(
          payload.account,
          payload.merchant,
          payload.amount
        )
        .then(() => {
          context.dispatch("getUserAccounts");
        })
        .catch(reject => {
          if (reject.response.data.error) {
            context.commit("changeNoMoney");
          }
        });
    },
    async showAllAddPayment(context) {
      let result = await api.getAllPayments();
      context.commit("setTransactionAddPayment", result);
      return result.data;
    },
    async showAllPurchases(context) {
      let result = await api.getAllPurchases();
      context.commit("setTransactionSpendPayment", result);
      return result;
    },
    getTransactionCheck(context) {
      return new Promise(resolve => {
        let addPaymentTransation = context.state.transactionAddPayment.filter(
          item => item.account === context.state.idTransaction
        );
        let spendPaymentTransation = context.state.transactionSpendPayment.filter(
          item => item.account === context.state.idTransaction
        );
        resolve({ add: addPaymentTransation, spend: spendPaymentTransation });
      });
    },

    async getTransactionTEST(context) {
      await context.dispatch("showAllAddPayment", context.state.idTransaction);
      await context.dispatch("showAllPurchases", context.state.idTransaction);
      let result = await context.dispatch("getTransactionCheck");
      await context.dispatch("getUserAccounts");
      return result;
    }
  },
  modules: {},
  getters: {
    getAllChecks(state) {
      return state.allChecks;
    },
    getIdCurrentCheck(state) {
      return state.idCurrentCheck;
    },
    getMoneyEnough(state) {
      return state.noMoney;
    },
    getTransactionCheck(state) {
      return state.transactionAddPayment + state.transactionSpendPayment;
    }
  }
});
