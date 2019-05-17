module.exports = {

findAge: function(birth) {
    // filtre les formats de date + les dates invalides
    if (birth[0] >= 0 && birth[1] >= 0 && birth[2] === '.' &&
        birth[3] >= 0 && birth[4] >= 0 && birth[5] === '.' &&
        birth[6] == 2 && birth[7] == 0 && birth[8] >= 1 && birth[9] >= 0)
    {
        // Sépare la chaine de caratère de la date de naissance sous différentes variables
        var day = birth[0] + birth[1];
        var month = birth[3] + birth[4];
        var century = birth[6] + birth[7];
        var decade = birth[8] + birth[9];
        var year = century + decade;

        // Créer une variable à la date du jour
        var date = new Date();
        // Calcul le nombre de jour exact séparant la date d'aujourd'hui à la date de naissance
        var ageDay = (date.getUTCFullYear() - year) * 365 + ( ( - parseInt(month, 10) + date.getUTCMonth() + 1) * 30.5) + (date.getUTCDate() - day)
        return (parseInt(ageDay, 10))
    }
    return -1;
}
};
