<template>
  <div class="content">
    <div class="container">
      <div class="Search__container">
        <input
          @keyup.enter="requestData"
          class="Search__input"
          placeholder="npm package name"
          type="”search”"
          v-model="inputPackage"
        />
        <button @click="requestData" class="Search__button">
          <span class="iconfont icon-xingtaiduICON_sousuo--"></span>
        </button>
        <span @click.prevent="toggleSettings" class="Search__icon">
          <span class="iconfont icon-rili"></span>
        </span>
      </div>

      <div class="Search__settings" v-if="showSettings">
        <datepicker
          input-class="Search__input"
          name="start-date"
          placeholder="Start Date"
          v-model="periodStart"
        ></datepicker>
        <span class="iconfont icon-hengxian"></span>
        <datepicker
          input-class="Search__input"
          name="end-date"
          placeholder="End Date"
          v-model="periodEnd"
        ></datepicker>
      </div>

      <div class="error-message" v-if="showError">{{ errorMessage }}</div>
      <hr />
      <div class="loading" v-if="loading">
        🔧 Generating Charts ...
        <div class="sk-cube-grid">
          <div class="sk-cube sk-cube1"></div>
          <div class="sk-cube sk-cube2"></div>
          <div class="sk-cube sk-cube3"></div>
          <div class="sk-cube sk-cube4"></div>
          <div class="sk-cube sk-cube5"></div>
          <div class="sk-cube sk-cube6"></div>
          <div class="sk-cube sk-cube7"></div>
          <div class="sk-cube sk-cube8"></div>
          <div class="sk-cube sk-cube9"></div>
        </div>
      </div>

      <div class="package-wrapper">
        <package-info
          :package-name="packageName"
          :period="formatShowPeriod"
          :total-downloads="totalDownloads"
          v-if="loaded"
        />
      </div>

      <!-- downloads per day -->
      <div class="Chart__container" v-if="loaded">
        <div class="Chart__title">
          <h2>
            Downloads per Day
            <span>{{ formatShowPeriod }}</span>
          </h2>
        </div>
        <hr />
        <div class="Chart__content">
          <line-chart :chart-data="downloads" :chart-labels="labels" v-if="loaded"></line-chart>
        </div>
      </div>

      <!-- downloads per week -->
      <div class="Chart__container" v-if="loaded">
        <div class="Chart__title">
          <h2>
            Downloads per Week
            <span>{{ formatShowPeriod }}</span>
          </h2>
        </div>
        <hr />
        <div class="Chart__content">
          <line-chart :chart-data="downloadsWeek" :chart-labels="labelsWeek" v-if="loaded"></line-chart>
        </div>
      </div>

      <!-- downloads per month -->
      <div class="Chart__container" v-if="loaded">
        <div class="Chart__title">
          <h2>
            Downloads per Month
            <span>{{ formatShowPeriod }}</span>
          </h2>
        </div>
        <hr />
        <div class="Chart__content">
          <line-chart :chart-data="downloadsMonth" :chart-labels="labelsMonth" v-if="loaded"></line-chart>
        </div>
      </div>

      <!-- downloads per year -->
      <div class="Chart__container" v-if="loaded">
        <div class="Chart__title">
          <h2>
            Downloads per Year
            <span>{{ formatShowPeriod }}</span>
          </h2>
        </div>
        <hr />
        <div class="Chart__content">
          <bar-chart :chart-data="downloadsYear" :chart-labels="labelsYear" v-if="loaded"></bar-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PackageInfo from '_c/PackageInfo'
import Datepicker from 'vuejs-datepicker'
import LineChart from '_c/LineChart'
import BarChart from '_c/BarChart'
import { api } from '@/api/data'
import { dateFormat } from '@/util'
import { groupData, ArrNoDuplicate } from '@/util/downloadFormat'
export default {
  data() {
    return {
      inputPackage: null,
      packageName: '',
      // period: 'last-month',
      loaded: false,
      loading: false,
      rawData: '',
      downloads: [],
      downloadsWeek: [],
      downloadsMonth: [],
      downloadsYear: [],
      labels: [],
      labelsWeek: [],
      labelsMonth: [],
      labelsYear: [],
      showError: false,
      errorMessage: 'Please enter a package name',
      periodStart: '',
      periodEnd: new Date(),
      showSettings: false
    }
  },
  computed: {
    _startDate() {
      return dateFormat(this.periodStart)
    },
    _endDate() {
      return dateFormat(this.periodEnd)
    },
    period() {
      return this.periodStart
        ? `${this._startDate}:${this._endDate}`
        : 'last-month'
    },
    formatShowPeriod() {
      return this.periodStart
        ? `${dateFormat(this.periodStart, 'Do MMMM YYYY')} - ${dateFormat(
            this.periodEnd, // eslint-disable-line
            'Do MMMM YYYY' // eslint-disable-line
          )}` // eslint-disable-line
        : 'last-month'
    },
    totalDownloads() {
      return this.downloads.reduce((ttl, download) => ttl + download, 0)
    }
  },
  components: {
    LineChart,
    Datepicker,
    BarChart,
    PackageInfo
  },
  mounted() {
    if (this.$route.params.package) {
      this.inputPackage = this.$route.params.package
      this.requestData()
    }
  },
  watch: {
    periodStart() {
      this.requestData()
    },
    periodEnd() {
      this.requestData()
    }
  },

  methods: {
    resetState() {
      this.loaded = false
      this.showError = false
    },
    async requestData() {
      if (
        this.inputPackage === null ||
        this.inputPackage === '' ||
        this.inputPackage === 'undefined'
      ) {
        this.showError = true
        this.loading = false
        return
      }
      this.resetState()
      this.loading = true
      try {
        const res = await api.fetchData(this.period, this.inputPackage)
        this.downloads = res.downloads.map(item => item.downloads)
        this.labels = res.downloads.map(item => item.day)
        this.rawData = res.downloads
        this.packageName = res.package

        this.formatDataByDate()
        this.loaded = true
        this.loading = false
      } catch (err) {
        this.errorMessage = err.response.data.error
        this.showError = true
        this.loading = false
      }
    },

    formatDataByDate() {
      this.formatWeek()
      this.formatMonth()
      this.formatYear()
    },
    formatWeek() {
      this.downloadsWeek = groupData(this.rawData, 'GGGG-[W]WW')
      this.labelsWeek = ArrNoDuplicate(
        this.rawData.map(item => dateFormat(item.day, 'GGGG-[W]WW'))
      )
    },
    formatMonth() {
      this.downloadsMonth = groupData(this.rawData, 'MMM YYYY')
      this.labelsMonth = ArrNoDuplicate(
        this.rawData.map(item => dateFormat(item.day, 'MMM YYYY'))
      )
    },
    formatYear() {
      this.labelsYear = ArrNoDuplicate(
        this.rawData.map(item => dateFormat(item.day, 'YYYY'))
      )
      this.downloadsYear = groupData(this.rawData, 'YYYY')
    },
    toggleSettings() {
      this.showSettings = !this.showSettings
    }
  }
}
</script>

<style lang="scss">
hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid color(solitude);
  margin: 1em 0;
  padding: 0;
}
.content {
  background: color(ghost-white);
  min-height: calc(100vh - 207px);
}
.title {
  text-align: center;
  color: color(fjord);
}
.container {
  @include container();
}
.loading {
  text-align: center;
  color: color(fjord);
  font-size: rem(18);
}
.error-message {
  text-align: center;
  color: color(err-red);
}
.Search {
  @include has(container) {
    max-width: rem(640);
    padding: rem(10) 0 rem(20) 0;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    @include media($sm-up) {
      flex-direction: row;
    }
  }
  @include has(input) {
    padding: rem(20);
    background-color: #fff;
    border: 1px solid color(solitude);
    font-size: rem(16);
    flex: 1;
  }
  @include has(button) {
    appearance: none;
    padding: rem(18) rem(45);
    margin-left: rem(20);
    border: 0;
    border-radius: 0;
    cursor: pointer;
    text-align: center;
    .iconfont {
      font-size: rem(21);
    }
    font-weight: 600;
    color: #fff;
    background: color(robin-egg-blue);
    @include hover-active-states {
      background: darken(color(robin-egg-blue), 10%);
    }
  }
  @include has(icon) {
    .iconfont {
      font-size: rem(20);
    }
    width: rem(40);
    height: rem(40);
    line-height: rem(40);
    margin-left: rem(15);
    cursor: pointer;
    color: color(fjord);
    @include hover-active-states {
      color: color(robin-egg-blue);
    }
  }
  @include has(settings) {
    max-width: rem(640);
    margin: 0 auto;
    padding: rem(20) 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    // justify-content: center;
    .vdp-datepicker + .vdp-datepicker {
      margin-left: 1.25rem;
      flex: 1;
    }
  }
}
.Chart__container {
  border-radius: $base-border-radius;
  background-color: #fff;
  box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.11),
    0 5px 15px 0 rgba(0, 0, 0, 0.08);
  padding: rem(20) rem(40);
  margin: rem(50) 0;
}
.Chart__title {
  display: flex;
  flex-direction: row;
  margin-bottom: rem(20);
  justify-content: space-between;
  h2 {
    display: flex;
    align-items: center;
    color: color(fjord);
    margin: 0;
    font-weight: 600;
    font-size: rem(16);
    > span {
      font-style: italic;
      font-weight: 400;
      color: color(robin-egg-blue);
      font-size: rem(16);
      margin-left: rem(25);
    }
  }
}
.sk-cube-grid {
  width: 40px;
  height: 40px;
  margin: 100px auto;
}
.sk-cube-grid .sk-cube {
  width: 33%;
  height: 33%;
  background-color: color(robin-egg-blue);
  float: left;
  -webkit-animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
  animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
}
.sk-cube-grid .sk-cube1 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
.sk-cube-grid .sk-cube2 {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}
.sk-cube-grid .sk-cube3 {
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}
.sk-cube-grid .sk-cube4 {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}
.sk-cube-grid .sk-cube5 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
.sk-cube-grid .sk-cube6 {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}
.sk-cube-grid .sk-cube7 {
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
}
.sk-cube-grid .sk-cube8 {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}
.sk-cube-grid .sk-cube9 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
@-webkit-keyframes sk-cubeGridScaleDelay {
  0%,
  70%,
  100% {
    -webkit-transform: scale3D(1, 1, 1);
    transform: scale3D(1, 1, 1);
  }
  35% {
    -webkit-transform: scale3D(0, 0, 1);
    transform: scale3D(0, 0, 1);
  }
}
@keyframes sk-cubeGridScaleDelay {
  0%,
  70%,
  100% {
    -webkit-transform: scale3D(1, 1, 1);
    transform: scale3D(1, 1, 1);
  }
  35% {
    -webkit-transform: scale3D(0, 0, 1);
    transform: scale3D(0, 0, 1);
  }
}
</style>
