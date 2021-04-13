import { Component, OnInit } from '@angular/core';
import { FileService } from '@service/file.service';
import { tap } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-operation-guide',
  templateUrl: './operation-guide.component.html',
  styleUrls: ['./operation-guide.component.scss']
})
export class OperationGuideComponent implements OnInit {

  constructor(
    private fileService: FileService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
  }

  handleUploadFile($event, type) {
    // $event.target.files[0]
    this.fileService.postIMQMFile($event.target.files[0], type).subscribe(
      () => {
        $event.target.value = '';
        this.message.info('上傳成功');
      }, () => {
        $event.target.value = '';
        this.message.info('上傳失敗');
      }
    );
  }

}
