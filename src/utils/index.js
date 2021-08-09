
/**
 * 防抖
 * @param {*} fn 
 * @param {*} awit 
 */
export function debaunce(fn, awit = 500) {
    let timer = null;
    return function () {
        timer && clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(arguments)
        }, awit)
    }
}