<template>
  <el-dialog :title="title" v-model="dialogVisible" size="small" custom-class="address-setting normal" :close-on-click-modal="false">
    <el-form :model="address">
      <el-form-item label="省/直辖市">
        <el-dropdown menu-align="start">
            <el-button>{{ selectedProvince.name }}<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
            <el-dropdown-menu class="addr-dropdown-menu" slot="dropdown">
               <el-dropdown-item v-for="(province, index) in Areas" :key="index" @click.native="selectProvince(province);">{{ province.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
      </el-form-item>
      <el-form-item label="城市">
        <el-dropdown menu-align="start">
            <el-button>{{ selectedCity.name }}<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
            <el-dropdown-menu class="addr-dropdown-menu" slot="dropdown">
               <el-dropdown-item v-for="(city, index) in selectedProvince.sub" :key="index" @click.native="selectCity(city);">{{ city.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
      </el-form-item>
      <el-form-item label="行政区">
        <el-dropdown menu-align="start">
            <el-button>{{ selectedCountry.name }}<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
            <el-dropdown-menu class="addr-dropdown-menu" slot="dropdown">
               <el-dropdown-item v-for="(country, index) in selectedCity.sub" :key="index" @click.native="selectCountry(country);">{{ country.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
      </el-form-item>
      <el-form-item label="地址">
        <el-input type="textarea" v-model="street" :rows="2" placeholder="地址，门牌号，楼层"></el-input>
      </el-form-item>
      <el-form-item><el-checkbox v-model="address.is_default">设置为默认</el-checkbox></el-form-item>
      <el-form-item class="no-bordered buttons">
       <el-button type="primary" @click="onSave" class="stretched" :disabled="saving">确定</el-button>
       <el-button @click="close" class="stretched" :disabled="saving">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
  import _array from 'lodash/array';
  import { mapGetters } from 'vuex';
  import MessageBox from '../utils/messagebox';
  import { ADDRESS_SEPERATOR } from '../utils/constants';
  import Api from '../api';

  function propCheck(obj) {
    return obj && obj['name'] && obj['name'] !== '' && obj['name'] !== '请选择';
  }

  function countyPropCheck(obj) {
    return !obj['name'] || propCheck(obj);
  }

  function contains(arr, val) {
    return _array.findIndex(arr, v => v.name === val);
  }

  export default {
    data() {
      return {
        dialogVisible: false,
        saving: false,
        selectedProvince: {},
        selectedCity: {},
        selectedCountry: {},
        street: '',
        empty: {
          location: '',
          is_default: false,
        },
        address: {},
        origin: null,
      };
    },
    computed: {
      ...mapGetters({
        company: 'currentCompany',
        Areas: 'areas',
      }),

      title() {
        return `${this.address.id ? '编辑' : '设置'}办公地点`;
      },

      defaultProvince() {
        return this.Areas[0];
      },

      defaultCity() {
        return this.Areas[0].sub[0];
      },

      defaultCountry() {
        return { sub: [] };
      },
    },
    methods: {
      initDialog(address) {
        if (address && address.id) {
          this.origin = address;
          this.address = Object.assign({}, address);
          this.destructLocation();
        } else {
          this.address = Object.assign({}, this.empty);
          this.clearLocation();
        }
      },
      show(address) {
        this.dialogVisible = true;
        if (this.Areas.length === 0) {
          this.$store.dispatch('fetchAreas', this.initDialog.bind(this, address));
        } else {
          this.initDialog(address);
        }
      },
      destructLocation() {
        const location = this.address.location;
        if (location && location !== '') {
          const areas = location.split(ADDRESS_SEPERATOR);
          let pIndex;
          if (areas[0]) {
            pIndex = contains(this.Areas, areas[0]);
            if (pIndex >= 0) {
              this.selectedProvince = this.Areas[pIndex];
            } else {
              this.selectedProvince = this.defaultProvince;
              this.street = areas[0];
              return;
            }
          } else {
            this.selectedProvince = this.defaultProvince;
            return;
          }

          let cIndex;
          if (areas[1]) {
            cIndex = contains(this.selectedProvince.sub, areas[1]);
            if (cIndex >= 0) {
              this.selectedCity = this.selectedProvince.sub[cIndex];
            } else {
              this.selectedCity = this.defaultCity;
              this.street = areas[1];
              return;
            }
          } else {
            this.selectedCity = this.defaultCity;
            return;
          }

          let cyIndex;
          if (areas[2]) {
            cyIndex = contains(this.selectedCity.sub, areas[2]);
            if (cyIndex >= 0) {
              this.selectedCountry = this.selectedCity.sub[cyIndex];
            } else {
              this.selectedCountry = this.defaultCountry;
              this.street = areas[2];
              return;
            }
          } else {
            this.selectedCountry = this.defaultCountry;
            return;
          }

          if (areas[3]) {
            this.street = areas[3];
          }
        }
      },
      clearLocation() {
        this.selectedProvince = this.defaultProvince;
        this.selectedCity = this.defaultCity;
        this.selectedCountry = this.defaultCountry;
        this.street = '';
      },
      selectProvince(province) {
        this.selectedProvince = province;
        this.selectedCity = 
          province.sub && province.sub.length > 0 ? province.sub[0] : this.defaultCity;
      },
      selectCity(city) {
        this.selectedCity = city;
        this.selectedCountry = 
          city.sub && city.sub.length > 0 ? city.sub[0] : this.defaultCountry;
      },
      selectCountry(country) {
        this.selectedCountry = country;
      },
      onSave() {
        if (propCheck(this.selectedProvince) &&
            propCheck(this.selectedCity) &&
            countyPropCheck(this.selectedCountry)) {
          this.address.location = `${this.selectedProvince.name}${ADDRESS_SEPERATOR}${this.selectedCity.name}${this.selectedCountry.name ? `${ADDRESS_SEPERATOR}${this.selectedCountry.name}` : ''}`;
          if (this.street !== '') {
            this.address.location = `${this.address.location}${ADDRESS_SEPERATOR}${this.street}`;
          }
          this.saving = true;
          if (this.address.id) {
            Api.updateAddress(this.company.id, this.address).then((response) => {
              this.saving = false;
              this.origin = Object.assign(this.origin, response.body.address);
              this.$emit('address-edited', response.body.address);
              this.close();
            }, () => {
              this.saving = false;
              MessageBox.tip('修改办公地点失败');
            });
          } else {
            Api.createAddress(this.company.id, this.address).then((response) => {
              this.saving = false;
              this.$emit('address-added', response.body.address);
              this.close();
            }, () => {
              this.saving = false;
              MessageBox.tip('添加办公地点失败');
            });
          }
        } else {
          MessageBox.tip('请选择省、市和区');
        }
      },
      close() {
        this.origin = null;
        this.dialogVisible = false;
      },
    },
  };
</script>
<style lang="scss">
  .address-setting {
    font-size: 14px;

    &.el-dialog {
      width: 400px;
    }

    .el-form-item {
      margin-bottom: 10px;
    }

    .el-form-item__label {
      width: 75px;
      text-align: right;
    }

    .el-form-item__content {
      padding-left: 75px;
    }

    .el-dropdown,
    .el-dropdown .el-button {
      text-align: left;
      width: 100%;
    }

    .el-dropdown .el-button i {
      float: right;
    }
  }

  .addr-dropdown-menu {
    width: 285px;
    font-size: 14px;
    max-height: 300px;
    overflow: auto;
  }
</style>
