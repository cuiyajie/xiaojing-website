import { MessageBox } from 'element-ui';

MessageBox.tip = message => MessageBox({ // eslint-disable-line
  message,
  customClass: 'messagebox-tip header-hidden',
  confirmButtonText: '知道了',
  confirmButtonClass: 'el-button--small',
  showConfirmButton: true,
});

MessageBox.lConfirm = (message, options) => MessageBox.confirm(message, '', Object.assign({
  showCancelButton: true,
  cancelButtonClass: 'el-button--small',
  confirmButtonClass: 'el-button--small',
  customClass: 'messagebox-confirm header-hidden',
}, options));

export default MessageBox;
