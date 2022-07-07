import lodash from 'lodash'
import jsonFormatter from 'json-string-formatter'

export class JsonUtils {
    static stringToJson(jsonString) {
        return JSON.parse(jsonString)
    }

    static overrideJsonObject(targetObject, object) {
        for (const key of Object.keys(targetObject)) {
            if (object.hasOwnProperty(key)) {
                if (targetObject[key] instanceof Array) {
                    targetObject[key] = object[key]
                } else if (targetObject[key] instanceof Object) {
                    targetObject[key] = this.overrideJsonObject(targetObject[key], object[key])
                } else {
                    targetObject[key] = object[key]
                }
            }
        }
        return targetObject
    }

    static convertObjectKeysToCamelCase(object) {
        lodash.mixin({
            deeply: function(map) {
                return function(obj, fn) {
                    return map(lodash.mapValues(obj, function(v) {
                        return lodash.isPlainObject(v) ? lodash.deeply(map)(v, fn) : v
                    }), fn)
                }
            }
        })

        return lodash.deeply(lodash.mapKeys)(object, (val, key) => lodash.camelCase(`${key}`))
    }

    static stringifyAndFormat(jsonObject) {
        return `${jsonFormatter.format(JSON.stringify(jsonObject))}`
    }
}
