
let dictionaries = {},
    currentLocale = 'en-US';

let nls = {

    setLocale (locale) {
        currentLocale = locale;
    },

    getLocale () {
        return currentLocale;
    },

    /**
     * Add translation hash map to dictionary
     * @param {string} locale
     * @param {object} dictionary
     */
    extendDictionary (locale, dictionary) {
        dictionaries[locale] = dictionaries[locale] || {};
        return Object.assign(dictionaries[locale], dictionary);
    },

    /**
     * Get string translation, if absent return string itself
     * @param {string} str
     * @param {object} substitutions
     */
    translate (str, substitutions = {}) {
        let dic = dictionaries[currentLocale] || {};
        let defaultDic = dictionaries['en-US'] || {};
        let translation = dic[str] || defaultDic[str] || str;

        if(substitutions){
            Object.keys(substitutions).forEach(key => {
                translation = translation.replace(new RegExp('\{\{\s*'+key+'\s*\}\}', 'g'), ''+substitutions[key])
            });
        }

        return translation;
    },

    /**
     * Alias to translate()
     * @param {string} str
     * @param {object} substitutions
     */
    _ (str, substitutions = {}){
        return nls.translate(str, substitutions);
    }
};

export default nls;