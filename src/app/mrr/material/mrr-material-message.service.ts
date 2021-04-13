import { Injectable } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';

export class MessageParam {
  readonly msg?: string;
  readonly type?: string;
  nzTitle?: string;
  data?: any;

  constructor(_type: string, _param: any) {
    if (_type === 'msg') {
      this.msg = _param.msg;
      this.type = _param.type;
    } else {
      this.nzTitle = _param.nzTitle;
    }
  }

  nzOnOk() { }

  nzOnCancel() { }
}

export class MessageType {
  readonly type: string;
  param: MessageParam;
  constructor(_type: string, _param: any) {
    this.type = _type;
    this.param = new MessageParam(_type, _param);
  }
}

/**
 *
 *
 * @export
 * @class MrrMaterialMessageService
 */
@Injectable({
  providedIn: 'root'
})
export class MrrMaterialMessageService {
  /**
   *
   *
   * @memberof MrrMaterialMessageService
   */
  MessageCode = {
    saveSuccess: new MessageType('msg', { msg: '保存成功！', type: 'success' }),
    saveError: new MessageType('msg', { msg: '保存失敗！', type: 'error' }),

    uploadSuccess: new MessageType('msg', {
      msg: '上傳成功！',
      type: 'success'
    }),
    uploadError: new MessageType('msg', { msg: '上傳失敗！', type: 'error' }),

    submitSuccess: new MessageType('msg', {
      msg: '送出成功！',
      type: 'success'
    }),
    submitError: new MessageType('msg', { msg: '送出失敗！', type: 'error' }),
    submitConfirm: new MessageType('confirm', {
      nzTitle: '確認送出填寫信息？'
    }),

    emailSuccess: new MessageType('msg', {
      msg: '發送email成功！',
      type: 'success'
    }),
    emailError: new MessageType('msg', {
      msg: '發送email失敗！',
      type: 'error'
    }),
    emailConfirm: new MessageType('confirm', { nzTitle: '確認發送email？' }),

    modalSuccess: new MessageType('modalSuccess', { nzTitle: '' }),
    modalError: new MessageType('modalError', { nzTitle: '' }),

    queryError: new MessageType('modalError', { nzTitle: '查詢失敗!' }),

    saveProjectSuccess: new MessageType('msg', {
      msg: '保存成功！',
      type: 'success'
    }),
    saveProjectError: new MessageType('msg', { msg: '保存失敗！', type: 'error' }),
    saveProjectConfirm: new MessageType('confirm', {
      nzTitle: ''
    }),
    isFullConfirm: new MessageType('confirm', {
      nzTitle: ''
    }),
    fullConfirmSuccess: new MessageType('msg', {
      msg: '保存成功！',
      type: 'success'
    }),
    fullConfirmError: new MessageType('msg', { msg: '保存失敗！', type: 'error' }),
  };

  constructor(
    private modalService: NzModalService,
    private message: NzMessageService
  ) { }

  /**
   *
   *
   * @param {MessageType} data
   * @memberof MrrMaterialMessageService
   */
  showMessage(data: MessageType) {
    this[data.type](data.param);
  }

  private modalSuccess(param: MessageParam): void {
    const modal = this.modalService.success({
      nzTitle: param.nzTitle,
      nzContent: '將在 10 秒後 自動確認',
      nzOnOk: param.nzOnOk
    });
    setTimeout(() => modal.destroy(), 10000);
  }

  private modalError(param: MessageParam): void {
    const modal = this.modalService.error({
      nzTitle: param.nzTitle,
      nzContent: '將在 10 秒後 自動確認',
      nzOnOk: () => {
        if (param.nzTitle.indexOf('SQMs') > 0) {
          param.nzOnOk();
        }
        if (param.nzTitle.indexOf('PLM') > 0) {
          param.nzOnCancel();
        }
      },
      nzOnCancel: () => {
        param.nzOnCancel();
      }
    });
    setTimeout(() => modal.destroy(), 10000);
  }

  private confirm(param: MessageParam): void {
    this.modalService.confirm({
      nzTitle: param.nzTitle,
      nzOkText: '確認',
      nzCancelText: '取消',
      nzOnOk: () => {
        param.nzOnOk();
      },
      nzOnCancel: () => {
        param.nzOnCancel();
      }
    });
  }

  private msg(param: MessageParam) {
    this.message.create(param.type, param.msg);
  }
}
