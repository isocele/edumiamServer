module.exports = {

    countLine: function (str) {
        var ret = 0;

        for (let i = 0; i < str.length; i++) {
            if (str[i] === '\n')
                ret++;
        }

        return (ret);
    },


    strToArray: function (str, lines) {
        var ret = [];
        var jbis = 0;

        for (let i = 0; i <= lines; i++, jbis++) {
            var tmp = jbis;
            for (; str[jbis] !== '\n' && jbis < str.length; jbis++);
            ret.push(str.substr(tmp, jbis));
        }

        return(ret)
    }
}