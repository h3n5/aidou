import crun from '../common/crun'
import { merge, serialize } from './util'
import { corsAnywhereUrl } from '@/common/config.js'
const CONFIG = {
  SOGOU: {
    API: 'https://pic.sogou.com/napi/wap/emoji/searchlist',
    PARAMS: {
      keyword: '',
      spver: '',
      rcer: '',
      tag: 0,
      routeName: 'emosearch',
    },
  },
}

function log(e) {
  crun.$emit('err', 'Emmmm... 查询服务好像出现了一点问题...', e)
}

export default {
  // 搜狗表情服务
  sogou({ query, page, size }) {
    const api = CONFIG.SOGOU.API
    const defParams = CONFIG.SOGOU.PARAMS
    const params = merge(defParams, {
      keyword: `${query}`,
      start: (page - 1) * size,
      xml_len: size,
    })
    return fetch(corsAnywhereUrl + api + '?' + serialize(params))
      .then((e) => e.json())
      .then(({ data = {} }) => {
        return {
          data: (data.emotions || []).map((it) => ({
            link: it.thumbSrc,
          })),
          total: data.emotions.length || 0,
        }
      })
      .catch(log)
  },
}
