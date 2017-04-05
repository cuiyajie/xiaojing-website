import { VueHttp } from './global';
import urls from './api-list';

export function fetchAddresses(companyId, lastAddressId, perpage) {
  const count = perpage || 10;
  return VueHttp.get(urls.URL_FETCH_ADDRESSES, {
    params: {
      company_id: companyId,
      last_address_id: lastAddressId || 0,
      count,
    },
  });
}

export function createAddress(companyId, address) {
  return VueHttp.post(urls.URL_ADDRESS_CREATE, {
    company_id: companyId,
    address: JSON.stringify(address),
  });
}

export function updateAddress(companyId, address) {
  return VueHttp.post(urls.URL_ADDRESS_UPDATE, {
    company_id: companyId,
    address: JSON.stringify(address),
  });
}

export function deleteAddress(companyId, addressId) {
  return VueHttp.post(urls.URL_ADDRESS_DELETE, {
    company_id: companyId,
    address_id: addressId,
  });
}

export function fetchAreas() {
  return VueHttp.get(urls.URL_FETCH_AREAS);
}

export default fetchAddresses;
