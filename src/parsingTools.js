/*
Ce fichier à des petites fonctions pour permettre un parsing plus performants pour le reste du projet
 */

module.exports = {

    // Verifie grossièrement si la string ressemble à un email
    isitMail: function (mail) {
        if (mail.search('@') !== -1)
            if (mail.search('@') < mail.search('.'))
                return true
        return false
    },

    isitDate: function (birth) {
        // filtre les formats de date + les dates invalides
        return ((birth[0] >= 0 && birth[0] < 3) || (birth[0] == 3 && (birth[1] == 0 || birth[1] == 1))) &&
            birth[1] >= 0 && birth[2] === '.' &&
            birth[3] >= 0 && birth[3] <= 1 && birth[4] >= 0 && birth[4] <= 2 && birth[5] === '.' &&
            birth[6] == 2 && birth[7] == 0 && birth[8] >= 1 && birth[9] >= 0 &&
            (birth[0] >= 1 || birth[1] >= 1) && (birth[3] >= 1 || birth[4] >= 1);
    },

    // Prends une string et renvoie son nombre de ligne
    countLine: function (str) {
        var ret = 1;
        for (let i = 0; i < str.length; i++)
            if (str[i] === '\n')
                ret++;

        return (ret);
    },

    // Prends une string et la renvoie sous forme de tableau découpé à chaque saut de ligne
    strToArray: function (str) {
        var ret = [];
        var jbis = 0;
        var tmp = 0;
        var max = 0;

        for (let i = 0; i < str.length; i++)
            if (str[i] === '\n')
                max++;
        for (let i = 0; i <= max; i++, jbis++) {
            tmp = jbis;
            for (; str[jbis] !== '\n' && jbis < str.length; jbis++);
            ret.push(str.substring(tmp, jbis));
        }

        return(ret)
    }
};