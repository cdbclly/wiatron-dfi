import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spcRule'
})
export class SpcRulePipe implements PipeTransform {

  transform(value: string, lang: any): any {
    const ruleArr = value.split(';');
    const ruleRes = [];
    ruleArr.forEach(rule => {
      if (lang === 'en') {
        if (rule.includes('(a)')) {
          ruleRes.push(rule.replace('(a)', 'Point over the control line or just on the control line'));
        } else if (rule.includes('(b)')) {
          ruleRes.push(rule.replace('(b)', '2 of the 3 points are between 2-3 times the standard deviation'));
        } else if (rule.includes('(c1)')) {
          ruleRes.push(rule.replace('(c1)', '9 continous points over the Centerline'));
        } else if (rule.includes('(c2)')) {
          ruleRes.push(rule.replace('(c2)', '9 continous points below the Centerline'));
        } else if (rule.includes('(d1)')) {
          ruleRes.push(rule.replace('(d1)', '7continous points are upward trend'));
        } else if (rule.includes('(d2)')) {
          ruleRes.push(rule.replace('(d2)', '7continous points are decline trend'));
        }
      }
      if (lang === 'zh') {
        if (rule.includes('(a)')) {
          ruleRes.push(rule.replace('(a)', '點在控制界限外或恰在控制界限上(1點即Fail)'));
        } else if (rule.includes('(b)')) {
          ruleRes.push(rule.replace('(b)', '3點中有 2 點在 2 倍標準差至 3 倍標準差之間'));
        } else if (rule.includes('(c1)')) {
          ruleRes.push(rule.replace('(c1)', '同側鏈：中心線上側出現9長鏈'));
        } else if (rule.includes('(c2)')) {
          ruleRes.push(rule.replace('(c2)', '同側鏈：中心線下側出現9長鏈'));
        } else if (rule.includes('(d1)')) {
          ruleRes.push(rule.replace('(d1)', '單調鏈：連續7點同為上升傾向'));
        } else if (rule.includes('(d2)')) {
          ruleRes.push(rule.replace('(d2)', '單調鏈：連續7點同為下降傾向'));
        }
      }
    });
    return ruleRes.join(';');
  }

}
