export class Utils {
    static groupBy(data, key) {
        return data.reduce(function(total, current) {
          (total[current[key]] = total[current[key]] || []).push(current);
          return total;
        }, {});
    };
}