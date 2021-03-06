module.exports = {

    findAge: function (birth) {

        // Filtre les formats de date + les dates invalides (c'est brouillon... refaire en int ?)
        try {
            if (((birth[0] >= 0 && birth[0] < 3) || (birth[0] == 3 && (birth[1] == 0 || birth[1] == 1))) &&
                birth[1] >= 0 && (birth[2] === '.' || birth[2] === '/') &&
                (birth[3] == 0 || (birth[3] == 1 && birth[4] <= 2)) && birth[4] >= 0 && (birth[5] === '.' || birth[5] === '/') &&
                birth[6] == 2 && birth[7] == 0 && birth[8] >= 1 && birth[9] >= 0 &&
                (birth[0] >= 1 || birth[1] >= 1) && (birth[3] >= 1 || birth[4] >= 1) && birth.length < 11) {

                // Sépare la chaine de caratère de la date de naissance sous différentes variables
                var day = birth[0] + birth[1];
                var month = birth[3] + birth[4];
                var century = birth[6] + birth[7];
                var decade = birth[8] + birth[9];
                var year = century + decade;

                // Créer une variable à la date du jour
                var date = new Date();

                // Calcul le nombre de jour exact séparant la date d'aujourd'hui à la date de naissance
                var ageDay = (date.getUTCFullYear() - year) * 365 + ((-parseInt(month, 10) + date.getUTCMonth() + 1) * 30.5) + (date.getUTCDate() - day)
                ageDay = parseInt(ageDay, 10) + 1;

                // Age de la dernière notification disponible
                return (ageDay)
            }
        }
        catch (error) {
            console.log(error);
            return "error";
        }
        return "error";
    },

    returnMonth: function (req, response) {

        var ageDays = this.findAge(req.query.babybirth);
        console.log(ageDays);
        var ageWeek = parseInt(ageDays / 7, 10);
        var ageMonth = Math.round(ageDays / 30.5);

        // Cas de futur accouchement
        if (ageDays !== "error" && ageDays < 0) {
            var time = (-ageMonth) + " mois";
            if (ageMonth >= -2)
                time = parseInt(ageDays / -7, 10) + " semaine(s)";
            response.json({
                status: 201,
                "set_attributes": {
                    "enceinte": true,
                    "timebeforebirth": time
                }
            });
        } else if (ageDays !== "error") // Cas classique
            response.json({
                status: 200,
                "set_attributes": {
                    "enceinte": false,
                    "babyMonth": ageMonth,
                    "babyWeek": ageWeek,
                }
            });
    }
};
