import { MessageBox } from 'element-ui';
import _object from 'lodash/fp/object';

MessageBox.tip = message => MessageBox({ // eslint-disable-line
  message,
  customClass: 'messagebox-tip header-hidden',
  confirmButtonText: '知道了',
  confirmButtonClass: 'el-button--small',
  showConfirmButton: true,
});

MessageBox.lConfirm = (message, options) => MessageBox.confirm(message, '', _object.assign({
  showCancelButton: true,
  cancelButtonClass: 'el-button--small',
  confirmButtonClass: 'el-button--small',
  customClass: 'messagebox-confirm header-hidden',
}, options));

export default MessageBox;
