<template>
  <div id="app">
    <h1 class="user-check__title">Счета пользователя</h1>
    <button class="button-setting" @click="createNewCheck()">
      Создать новый счет
    </button>
    <topup-account ref="topup">
      <template v-slot:title>
        <h3 class="window__title">Пополнить счет</h3>
      </template>
      <template v-slot:body>
        <div class="window__content">
          <label class="window__label"
            >Сумма:
            <input class="window__input" type="text" v-model="count" />
          </label>
        </div>
      </template>
      <template v-slot:footer>
        <div class="window__footer">
          <button class="window__footer__button" @click="addPayment">
            Сохранить
          </button>
        </div>
      </template>
    </topup-account>
    <topup-account ref="spend">
      <template v-slot:title>
        <h3 class="window__title">Потратить</h3>
      </template>
      <template v-slot:body>
        <div class="window__content">
          <label class="window__label"
            >Название услуги
            <input class="window__input" type="text" v-model="serviceName" />
          </label>
          <label
            >Сумма:
            <input class="window__input" type="text" v-model="count" />
          </label>
        </div>
      </template>
      <template v-slot:footer>
        <div class="window__footer">
          <button class="window__footer__button" @click="spendServicePayment">
            Потратить
          </button>
        </div>
      </template>
    </topup-account>

    <transaction-window ref="showWindowTransactions">
      <template v-slot:title>
        <h3 class="window__title">Транзакции по счету</h3>
      </template>
      <template v-slot:body>
        <div class="window__content">
          <ul>
            <li
              class="window__row"
              v-for="(item, id) in checkTransaction"
              :key="id"
            >
              <p class="window__transaction">{{ item.action }}</p>
              <p class="window__transaction">на сумму: {{ item.amount }}</p>
              <p class="window__transaction">{{ item.date }}</p>
            </li>
          </ul>
        </div>
      </template>
    </transaction-window>

    <topup-account ref="nomoney">
      <template v-slot:title>
        <h3 class="window__title">Недостаточно денег на счете</h3>
      </template>
    </topup-account>

    <ul class="user-check">
      <li
        class="user-check__item"
        v-for="item in getAllPaysUser"
        :key="item.id"
      >
        <div class="user-check__left">
          <button class="check-setting" @click="showTransactions(item.id)">
            Счет №{{ item.id }}
          </button>
          Баланс: {{ item.balance }}
        </div>
        <div class="user-check__right">
          <button
            class="button-setting button-alert"
            @click="deleteCheck(item.id)"
          >
            Удалить счет
          </button>
          <button class="button-setting button-add" @click="addCheck(item.id)">
            Пополнить счет
          </button>
          <button class="button-setting" @click="spendCheck(item.id)">
            Потратить
          </button>
        </div>
      </li>
    </ul>
    <button
      class="download-more"
      v-show="isVisibleButton"
      @click="changeCountPage()"
    >
      Загрузить еще счета
    </button>
  </div>
</template>

<script>
import TopupAccount from "./components/TopupAccount-window.vue";
import TransactionWindow from "./components/Transaction-window.vue";
export default {
  name: "App",
  components: { TopupAccount, TransactionWindow },
  data: () => ({
    show: false,
    showWindowTransactions: false,
    count: "",
    serviceName: "",
    isVisibleButton: false,
    checkTransaction: [],
    countPage: 1,
    showChecks: []
  }),
  computed: {
    countPages() {
      return this.$store.state.isVisibleButton;
    },
    getAllPaysUser() {
      return this.$store.getters.getAllChecks.slice(0, this.countPage * 10);
    },
    noMoney() {
      return this.$store.getters.getMoneyEnough;
    }
  },
  methods: {
    async showTransactions(val) {
      this.$store.commit("setIdTransaction", val);
      let result = await this.$store.dispatch("getTransactionTEST", val);
      this.checkTransaction = [];
      result.add.forEach(item => {
        this.checkTransaction.push({
          action: "пополнение",
          amount: item.amount,
          date: item.date
        });
      });
      result.spend.forEach(item => {
        this.checkTransaction.push({
          action: "списание",
          amount: item.amount,
          date: item.date
        });
      });
    },
    deleteCheck(val) {
      this.$store.dispatch("deletePay", val);
    },
    addCheck(id) {
      this.$store.commit("setIdCurrentCheck", id);
      this.$refs.topup.show = true;
    },
    spendCheck(id) {
      this.$store.commit("setIdCurrentCheck", id);
      this.$refs.spend.show = true;
    },
    createNewCheck() {
      this.$store.dispatch("createNewCheck");
    },
    addPayment() {
      if (Number(this.count)) {
        this.$store
          .dispatch("addPayment", {
            account: this.$store.getters.getIdCurrentCheck,
            amount: Number(this.count)
          })
          .then(() => {
            this.count = null;
            this.$refs.topup.show = false;
          });
      }
    },
    spendServicePayment() {
      if (Number(this.count)) {
        this.$store.dispatch("spendServicePayment", {
          account: this.$store.getters.getIdCurrentCheck,
          merchant: this.serviceName,
          amount: Number(this.count)
        });

        this.count = null;
        this.serviceName = "";
        this.$refs.spend.show = false;
      }
    },
    changeCountPage() {
      if (this.$store.state.allChecks.length / (this.countPage * 10) > 1) {
        this.countPage = this.countPage + 1;
      } else this.$store.state.isVisibleButton = false;
    }
  },
  watch: {
    noMoney: {
      deep: true,
      handler() {
        if (this.$store.getters.getMoneyEnough) {
          this.$refs.nomoney.show = true;
          this.$store.commit("changeNoMoney");
        }
      }
    },
    countPages: {
      deep: true,
      handler() {
        this.isVisibleButton = !this.isVisibleButton;
      }
    },
    checkTransaction: {
      deep: true,
      handler() {
        if (this.checkTransaction.length >= 1) {
          this.$refs.showWindowTransactions.show = true;
        }
      }
    }
  },
  created() {
    this.$store.dispatch("getUserAccounts");
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 1rem;
  min-width: 320px;
}

.user-check {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__item {
    display: flex;
    border-bottom: 1px dotted #2c3e50;
    margin: 0.4rem;
    font-size: 1.3rem;
    min-height: 4rem;
    align-items: center;
    justify-content: space-between;
  }

  &__left {
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;

    @include respond-to(tablets) {
      flex-direction: column;
      font-size: 1.3rem;
    }
    @include respond-to(desktop) {
      flex-direction: row;
      font-size: 1.6rem;
    }
  }

  &__right {
    margin-left: 2.5rem;
    display: flex;
    justify-content: space-around;
    flex-direction: column;

    @include respond-to(tablets) {
      flex-direction: column;
      font-size: 1.3rem;
    }
    @include respond-to(desktop) {
      flex-direction: row;
      font-size: 1.6rem;
    }
  }

  &__title {
    font-size: 2rem;
    margin-bottom: 1.2rem;
  }
}

.button-setting {
  font-size: 1rem;
  border-radius: 7px;
  background-color: #d2e5f7;
  color: #0c0c0c;
  min-height: 2rem;
  padding: 0.7em;
  margin: 0.5rem;
}

.button-alert {
  background-color: #ef767f;
}

.button-add {
  background-color: #a8ef76;
}
.check-setting {
  font-size: 1rem;
  border-radius: 7px;
  color: #0a0a0a;
  min-height: 2rem;
  padding: 0.5em;
  margin: 0.5rem 1.4rem;
}

.download-more {
  padding: 0.5rem;
  border-radius: 8px;
  margin: 1rem;
}
</style>
