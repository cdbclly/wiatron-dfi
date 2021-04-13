import { Injectable } from '@angular/core';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { Paho } from 'ng2-mqtt/mqttws31';

export class TopicDefinition {
    name: string;
    option: any;
}

// @Injectable({
//   providedIn: 'root'
// })
export class MqttConnServiceService {

  // private mqttService = new MqttService({ // new MqttServie对象时会自动连接mqtt
  //   hostname: localStorage.getItem('mqtt_host'),
  //   port: parseInt(localStorage.getItem('mqtt_port'), 0),
  //   path: '/mqtt'
  // });
  private client: Paho.MQTT.Client;
    private topics: string[];
    private payload: ReplaySubject<Paho.MQTT.Message>;

    constructor() {
        this.topics = [];
        this.payload = new ReplaySubject<Paho.MQTT.Message>(1);
    }

    /**
     * @method public 初始化MQTT的連線資訊
     * @param host     主機位置
     * @param port     MQTT埠
     * @param clientID 連線的ID
     * @return 回傳一個Promise，讓呼叫者可以初始化MQTT的連線
     */
    public initMqttClient(host: string, port: number, clientID): Promise<boolean> {
      // debugger;
        this.client = new Paho.MQTT.Client(host, port, '', clientID);

        return new Promise((resolve, reject) => {
            // 建立連線
            this.client.connect({
                cleanSession: false,
                onSuccess: () => {
                    console.log(
                        '%c ☑️ MQTT Connection Success: ' + host,
                        'background: #000; color: #5FBA7D; line-height: 26px;'
                    );
                    resolve(true);
                }
            });

            // 無法連線或斷線
            this.client.onConnectionLost = (responseObject: Object) => {
                console.log(
                    '%c ❌ MQTT Connection Lost ',
                    'background: #000; color: ##E43935; line-height: 26px;'
                );
                console.log(responseObject);
                reject(false);
            };

            // 當接收到訂閱訊息
            this.client.onMessageArrived = this.onMessageArrived.bind(this);
        });
    }

    public DisConn() {
      // debugger;
      console.log('%c ❌ MQTT Connection Disconnect ',
      'background: #000; color: ##E43935; line-height: 26px;');
      if (this.client && this.client.isConnected()) {
        this.client.disconnect();
      }
    }

    /**
     * @method public 訂閱MQTT的Topic
     * @param topic 訂閱的Topics
     */
    public subscribeTopic(topics: TopicDefinition[]): void {
      // debugger;
      console.log(this.client);
        console.log(
            '%c ☑️ Subscribe MQTT Topics ',
            'background: #000; color: #5FBA7D; line-height: 26px;'
        );

        if (this.topics.length === 0) {
            this.topics = [];
        }

        topics.forEach(topic => {
            this.topics.push(topic.name);
            this.client.subscribe(topic.name, topic.option);
        });
    }

    /**
     * @method public 取消訂閱所有的Topics
     */
    public unsubscribeAllTopics(): void {
        console.log(
            '%c ☑️ Unsubscribe MQTT All Topics ',
            'background: #000; color: #5FBA7D; line-height: 26px;'
        );

        if (this.topics) {
            this.topics.forEach(topic => {
                this.client.unsubscribe(topic, null);
            });

            this.topics = [];
        }
    }

    /**
     * @method public 取消訂閱MQTT的特定Topic
     * @param topic MQTT的特定Topic
     */
    public unsubscribeTopic(topic: string): void {
        console.log(
            `%c ☑️ Unsubscribe MQTT Topics: ${topic}`,
            'background: #000; color: #5FBA7D; line-height: 26px;'
        );

        const topicIndex = this.topics.indexOf(topic);
        this.topics.splice(topicIndex, 1);
        this.client.unsubscribe(topic, null);
    }

    /**
     * @method private 當收到MQTT訂閱的訊息
     * @param payload 訂閱的訊息
     */
    private onMessageArrived(payload: Paho.MQTT.Message): void {
        // console.log(
        //     '%c ☑️ MQTT Message Arrvived ',
        //     'background: #000; color: #5FBA7D; line-height: 26px;'
        // );

        // console.log(payload);

        const payloads: Paho.MQTT.Message = {
            destinationName: payload.destinationName,
            payloadBytes: payload.payloadBytes,
            // payloadString: payload.payloadBytes.toString(),
            payloadString: this.decodePayloads(payload.payloadBytes),
            duplicate: payload.duplicate,
            retained: payload.retained,
            qos: payload.qos,
        };

        this.payload.next(payloads);
    }

    /**
     * @method public 監聽MQTT訂閱的訊息
     * @return 回傳一個Observable，讓呼叫者可以訂閱MQTT的訊息
     */
    public listenMessage(): Observable<Paho.MQTT.Message> {
        return this.payload.asObservable();
    }

    /**
     * @method public publish消息至MQTT
     * @param topic    推送至的Topic
     * @param content  推送的內容
     * @param retained 內容是否保留
     */
    public sendMessage(topic, content, retained): void {
      const message = new Paho.MQTT.Message(content);
      message.destinationName = topic;
      message.retained = retained;
      this.client.send(message);
    }

    /**
     * @method private 將MQTT Payload Bytes轉成String
     * @param bytes MQTT Payload的Bytes
     * @return 回傳轉換後的Payload
     */
    private decodePayloads(bytes) {
        // const result = new TextDecoder('utf-8').decode(bytes); 需高一點的nodeJS才可
        const result = this.byteToString(bytes); // 無nodeJS 版本需求
        return result;
    }

    private byteToString(arr) {
      if (typeof arr === 'string') {
          return arr;
      }
      let str = '';
          const _arr = arr;
      for (let i = 0; i < _arr.length; i++) {
          const one = _arr[i].toString(2),
              v = one.match(/^1+?(?=0)/);
          if (v && one.length === 8) {
              const bytesLength = v[0].length;
              let store = _arr[i].toString(2).slice(7 - bytesLength);
              for (let st = 1; st < bytesLength; st++) {
                  store += _arr[st + i].toString(2).slice(2);
              }
              str += String.fromCharCode(parseInt(store, 2));
              i += bytesLength - 1;
          } else {
              str += String.fromCharCode(_arr[i]);
          }
      }
      return str;
  }

    /**
     * @method public 產生UUID
     * @return 回傳UUID
     */
    public generateUUID(): string {
        return this.generateS4() + this.generateS4() + '-' + this.generateS4() +
          '-' + this.generateS4() + '-' + this.generateS4() + '-' +
          this.generateS4() + this.generateS4() + this.generateS4();
    }

    /**
     * @method private 產生16進位隨機碼
     * @return 回傳隨機碼
     */
    private generateS4(): string {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

}
