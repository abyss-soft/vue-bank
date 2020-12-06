import axios from "axios";

export default class API {
  constructor() {
    this.allChecksUser = "/api/bank/account/";
    this.allTopUpAccount = "/api/bank/action/";
    this.transactionFromAccount = "/api/bank/transaction/";
    this.deleteAccount = "/api/bank/account/";
    this.headersAPI = {
      headers: {
        Authorization: `token ${"30c378d3b40f1f520f9604f7532814e132477b07"}`
      }
    };
  }

  async getAllChecks() {
    return axios
      .get(this.allChecksUser, this.headersAPI)
      .then(response => response);
  }

  async addNewChecks() {
    return axios
      .post(this.allChecksUser, {}, this.headersAPI)
      .then(response => response);
  }

  async getAllPayments() {
    return axios.get(this.allTopUpAccount, this.headersAPI);
  }

  async addPayment(account, amount) {
    return axios
      .post(
        this.allTopUpAccount,
        { account: account, amount: amount },
        this.headersAPI
      )
      .then(response => response);
  }

  async getAllPurchases() {
    return axios
      .get(this.transactionFromAccount, this.headersAPI)
      .then(response => response);
  }

  async spendMoneyFromAccount(account, merchant, amount) {
    return axios
      .post(
        this.transactionFromAccount,
        { account: account, merchant: merchant, amount: amount },
        this.headersAPI
      )
      .then(response => response);
  }

  async deletePayment(id) {
    return axios.delete(this.deleteAccount + id, this.headersAPI);
  }
}
